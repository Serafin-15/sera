const { PrismaClient } = require("../generated/prisma");
const { createOrGetCoordinates } = require("../utils/rankingUtils");

const prisma = new PrismaClient();

async function main() {
  await prisma.eventHistory.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coordinates.deleteMany();

  const coords1 = await createOrGetCoordinates(37.7749, -122.4194);
  const coords2 = await createOrGetCoordinates(37.7849, -122.4094);
  const coords3 = await createOrGetCoordinates(37.7649, -122.4294);
  const coords4 = await createOrGetCoordinates(37.7549, -122.4394);
  const coords5 = await createOrGetCoordinates(37.7949, -122.3994);
  const coords6 = await createOrGetCoordinates(37.7699, -122.4194);

  const driver1 = await prisma.user.create({
    data: {
      username: "driver1",
      role: "parent",
      password: "password",
      coordinatesId: coords1.id,
    },
  });

  const driver2 = await prisma.user.create({
    data: {
      username: "driver2",
      role: "parent",
      password: "password",
      coordinatesId: coords2.id,
    },
  });

  const passenger1 = await prisma.user.create({
    data: {
      username: "passenger1",
      role: "student",
      password: "password",
      coordinatesId: coords3.id,
    },
  });

  const passenger2 = await prisma.user.create({
    data: {
      username: "passenger2",
      role: "student",
      password: "password",
      coordinatesId: coords4.id,
    },
  });

  const passenger3 = await prisma.user.create({
    data: {
      username: "passenger3",
      role: "student",
      password: "password",
      coordinatesId: coords5.id,
    },
  });

  const carpoolEvent1 = await prisma.event.create({
    data: {
      title: "Carpool 1",
      description: "Test event 1",
      category: "Music",
      start_date: new Date("2026-01-20T10:00:00Z"),
      end_date: new Date("2026-01-20T11:30:00Z"),
      location: "Concert Hall",
      coordinatesId: coords6.id,
      capacity: 100,
      num_attending: 50,
    },
  });

  const carpoolEvent2 = await prisma.event.create({
    data: {
      title: "Carpool 2",
      description: "Test event 2",
      category: "Tech",
      start_date: new Date("2026-01-20T10:00:00Z"),
      end_date: new Date("2026-01-20T11:30:00Z"),
      location: "Tech Hall",
      coordinatesId: coords6.id,
      capacity: 100,
      num_attending: 50,
    },
  });

  const eventHistory = await prisma.eventHistory.createMany({
    data: [
      {
        user_id: driver1.id,
        event_id: carpoolEvent1.id,
        attended: true,
      },
      {
        user_id: driver2.id,
        event_id: carpoolEvent1.id,
        attended: true,
      },
      {
        user_id: passenger1.id,
        event_id: carpoolEvent1.id,
        attended: true,
      },
      {
        user_id: passenger2.id,
        event_id: carpoolEvent1.id,
        attended: true,
      },
      {
        user_id: passenger3.id,
        event_id: carpoolEvent1.id,
        attended: true,
      },
      {
        user_id: driver1.id,
        event_id: carpoolEvent2.id,
        attended: true,
      },
      {
        user_id: passenger1.id,
        event_id: carpoolEvent2.id,
        attended: true,
      },
      {
        user_id: passenger2.id,
        event_id: carpoolEvent2.id,
        attended: true,
      },
      {
        user_id: passenger3.id,
        event_id: carpoolEvent2.id,
        attended: true,
      },
    ],
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
