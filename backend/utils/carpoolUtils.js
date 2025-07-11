const { PrismaClient } = require("../generated/prisma");
const axios = require("axios");
const prisma = new PrismaClient();

const MAX_CAPACITY = 3;
const MAPBOX_API_BASE = "https://api.mapbox.com/directions/v5/mapbox/driving";

function calculateDistance(lat1, long1, lat2, long2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLong = ((long2 - long1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDistance(destination, source) {
  if (!destination.coordinates || !source.coordinates) {
    return Infinity;
  }

  return calculateDistance(
    destination.coordinates.latitude,
    destination.coordinates.longitude,
    source.coordinates.latitude,
    source.coordinates.longitude
  );
}

async function routeDistance(driver, passengers, event) {
  if (!driver.coordinates || !event.coordinates) {
    return { distance: Infinity, duration: Infinity, route: [] };
  }

  try {
    const waypoints = [driver.coordinates];

    passengers.forEach((passenger) => {
      if (passenger.coordinates) {
        waypoints.push(passenger.coordinates);
      }
    });

    waypoints.push(event.coordinates);
    const coordinates = waypoints
      .map((wp) => `${wp.longitude}, ${wp.latitude}`)
      .join(";");

    const token = process.env.MAPBOX_ACCESS_TOKEN;
    const url = `${MAPBOX_API_BASE}/${coordinates}`;
    const response = await axios.get(url, {
      params: {
        access_token: token,
        geometries: "geojson",
        overview: "full",
        steps: true,
      },
    });

    const route = response.data.routes[0];
    return {
      distance: Math.round(route.distance / 1000),
      duration: Math.round(route.duration / 60),
      route: route.legs.map((leg) => ({
        distance: Math.round(leg.distance / 1000),
        duration: Math.round(leg.duration / 60),
        steps: leg.steps.map((step) => ({
          instruction: step.maneuver.instruction,
          distance: Math.round(step.distance),
          duration: Math.round(step.duration),
        })),
      })),
    };
  } catch (error) {
    console.error("Error when calculating distance: ", error);
    return { distance: Infinity, duration: Infinity, route: [] };
  }
}

async function generateDriverCombinations(users, eventId) {
  const combinations = [];

  const eventAttendees = await prisma.eventHistory.findMany({
    where: { event_id: eventId, attended: true },
    include: {
      user: {
        include: { coordinates: true },
      },
    },
  });

  const attendeeIds = eventAttendees.map((attendee) => attendee.user_id);

  const attendingUsers = users.filter((user) => attendeeIds.includes(user.id));

  for (let i = 1; i <= Math.min(MAX_CAPACITY, attendingUsers.length); i++) {
    const driverCombos = generateDriverGroups(attendingUsers, i);
    combinations.push(...driverCombos);
  }

  return combinations;
}

function generateDriverGroups(arr, size) {
  if (size === 1) return arr.map((item) => [item]);

  const combinations = [];
  for (let i = 0; i <= arr.length - size; i++) {
    const head = arr[i];
    const tailCombos = generateDriverGroups(arr.slice(i + 1), size - 1);
    tailCombos.forEach((combo) => {
      combinations.push([head, ...combo]);
    });
  }
  return combinations;
}

async function carpoolAssignment(eventId, requestingUserId) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { coordinates: true },
    });
    if (!event) {
      throw new Error("Event not Found!");
    }
    const requestingUser = await prisma.user.findUnique({
      where: { id: requestingUserId },
      include: { coordinates: true },
    });

    if (!requestingUser) {
      throw new Error("User not Found!");
    }

    const allUsers = await prisma.user.findMany({
      include: { coordinates: true },
    });

    const driverCombinations = await generateDriverCombinations(
      allUsers,
      eventId
    );

    const routes = [];

    for (const drivers of driverCombinations) {
      const eventAttendees = await prisma.eventHistory.findMany({
        where: { event_id: eventId, attended: true },
        include: {
          user: {
            include: { coordinates: true },
          },
        },
      });

      const driverIds = drivers.map((driver) => driver.id);
      const passengers = eventAttendees
        .map((attendee) => attendee.user)
        .filter(
          (user) => !driverIds.includes(user.id) && user.id !== requestingUserId
        );
      const assignments = assignPassengersToDrivers(drivers, passengers);

      for (const assignment of assignments) {
        const routeInfo = await routeDistance(
          assignment.driver,
          assignment.passengers,
          event
        );
        const requestingUserIsPassenger = assignment.passengers.some(
          (p) => p.id === requestingUserId
        );
        const hasSpaceForRequestingUser =
          assignment.passengers.length < MAX_CAPACITY - 1;

        if (
          (requestingUserIsPassenger || hasSpaceForRequestingUser) &&
          assignment.passengers.length > 0
        ) {
          routes.push({
            driver: {
              id: assignment.driver.id,
              username: assignment.driver.username,
              coordinates: assignment.driver.coordinates,
            },
            passengers: assignment.passengers.map((p) => ({
              id: p.id,
              username: p.username,
              coordinates: p.coordinates,
            })),
            event: {
              id: event.id,
              title: event.title,
              coordinates: event.coordinates,
            },
            route: routeInfo,
          });
        }
      }
    }

    routes.sort((a, b) => a.route.distance - b.route.distance);
    return routes;
  } catch (error) {
    console.error("Error in carpool assignment", error);
    return [];
  }
}

function assignPassengersToDrivers(drivers, passengers) {
  const assignments = drivers.map((driver) => ({
    driver,
    passengers: [],
  }));

  const passengerAssignments = passengers.map((passenger) => {
    let closestDriver = null;
    let minDistance = Infinity;

    for (const assignment of assignments) {
      const distance = getDistance(passenger, assignment.driver);
      if (distance < minDistance) {
        minDistance = distance;
        closestDriver = assignment;
      }
    }

    return { passenger, closestDriver };
  });

  passengerAssignments.sort((a, b) => {
    const distanceA = getDistance(a.passenger, a.closestDriver.driver);
    const distanceB = getDistance(b.passenger, b.closestDriver.driver);
    return distanceA - distanceB;
  });

  for (const { passenger, closestDriver } of passengerAssignments) {
    if (closestDriver.passengers.length < MAX_CAPACITY - 1) {
      closestDriver.passengers.push(passenger);
    }
  }

  return assignments;
}

async function getCarpoolRoutes(eventId, userId) {
  try {
    const eventAttendance = await prisma.eventHistory.findFirst({
      where: {
        event_id: eventId,
        user_id: userId,
        attended: true,
      },
    });
    if (!eventAttendance) {
      return [];
    }

    const routes = await carpoolAssignment(eventId, userId);

    return routes;
  } catch (error) {
    console.error("Error getting carpool routes: ", error);
    return [];
  }
}

module.exports = {
  calculateDistance,
  getDistance,
  routeDistance,
  carpoolAssignment,
  getCarpoolRoutes,
  generateDriverCombinations,
  assignPassengersToDrivers,
};
