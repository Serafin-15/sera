const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const SCORES = {
  INTEREST_MATCH: 100,
  AVAILABILITY_PERFECT: 50,
  AVAILABILITY_PARTIAL: 25,
  DISTANCE_CLOSE: 30,
  DISTANCE_MEDIUM: 20,
  DISTANCE_FAR: 10,
  DISTANCE_VERY_FAR: 5,
};

function isAvailableForEvent(event, availabilityBlock) {
  if (!availabilityBlock || availabilityBlock.length === 0) {
    return 0;
  }

  const eventStart = new Date(event.start_date);
  const eventEnd = new Date(event.end_date);
  let maxScore = 0;

  for (const block of availabilityBlock) {
    const blockStart = new Date(block.start_date);
    const blockEnd = new Date(block.end_date);

    if (eventStart >= blockStart && eventEnd <= blockEnd) {
      return SCORES.AVAILABILITY_PERFECT;
    }
    if (eventStart < blockEnd && eventEnd > blockStart) {
      const overlapStart = new Date(
        Math.max(eventStart.getTime(), blockStart.getTime())
      );
      const overlapEnd = new Date(
        Math.min(eventEnd.getTime(), blockEnd.getTime())
      );
      const overlapDuration = overlapEnd.getTime() - overlapStart.getTime();
      const eventDuration = eventEnd.getTime() - eventStart.getTime();

      const overlapPercentage = overlapDuration / eventDuration;
      if (overlapPercentage >= 0.5) {
        maxScore = Math.max(maxScore, SCORES.AVAILABILITY_PARTIAL);
      } else if (overlapPercentage > 0) {
        maxScore = Math.max(
          maxScore,
          Math.floor(SCORES.AVAILABILITY_PARTIAL * overlapPercentage)
        );
      }
    }
  }
  return maxScore;
}

function isDistant(userLat, userLong, eventLat, eventLong) {
  if (!userLat || !userLong || !eventLat || !eventLong) {
    return 0;
  }

  const distance = calculateDistance(userLat, userLong, eventLat, eventLong);

  if (distance <= 5) {
    return SCORES.DISTANCE_CLOSE;
  } else if (distance <= 15) {
    return SCORES.DISTANCE_MEDIUM;
  } else if (distance <= 30) {
    return SCORES.DISTANCE_FAR;
  } else {
    return SCORES.DISTANCE_VERY_FAR;
  }
}

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

function isInterested(event, studentInterest) {
  if (!event.category || !studentInterest) {
    return 0;
  }

  const eventCategory = event.category.toLowerCase();
  const studentCategory = studentInterest.toLowerCase();

  if (eventCategory === studentCategory) {
    return SCORES.INTEREST_MATCH;
  }
  return 0;
}

function calculateTotalScore(availabilityScore, distanceScore, interestScore) {
  return availabilityScore + distanceScore + interestScore;
}
async function getRecommendedEvents(studentId, parentId = null) {
  try {
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });
    const studentAvailability = await prisma.availability.findMany({
      where: { user_id: studentId },
    });

    let parentAvailability = [];
    if (parentId) {
      parentAvailability = await prisma.availability.findMany({
        where: { user_id: parentId },
      });
    }

    const allEvents = await prisma.event.findMany({
      where: {
        start_date: {
          gte: new Date(),
        },
      },
    });

    const scoredEvents = [];

    for (const event of allEvents) {
      let parentConflict = false;
      if (parentId && parentAvailability.length > 0) {
        parentConflict = !isParentAvailable(event, parentAvailability);
      }

      if (parentConflict) {
        continue;
      }

      const availabilityScore = isAvailableForEvent(event, studentAvailability);

      const distanceScore = isDistant(
        student.latitude,
        student.longitude,
        event.latitude,
        event.longitude
      );

      const interestScore = isInterested(event, student.interest);

      const totalScore = calculateTotalScore(
        availabilityScore,
        distanceScore,
        interestScore
      );
      if (availabilityScore > 0) {
        scoredEvents.push({
          ...event,
          scores: {
            availability: availabilityScore,
            distance: distanceScore,
            interest: interestScore,
            total: totalScore,
          },
        });
      }
    }

    scoredEvents.sort((a, b) => {
      b.scores.total - a.scores.total;
    });

    const filteredEvents = [];
    for (const event of scoredEvents) {
      const eventStart = new Date(event.start_date);
      const eventEnd = new Date(event.end_date);

      let hasOverlap = false;
      for (const selectedEvent of filteredEvents) {
        const selectedStart = new Date(selectedEvent.start_date);
        const selectedEnd = new Date(selectedEvent.end_date);

        if (eventStart < selectedEnd && eventEnd > selectedStart) {
          hasOverlap = true;
          break;
        }
      }
      if (!hasOverlap) {
        filteredEvents.push(event);
      }
    }
    return filteredEvents;
  } catch (error) {
    console.error("Error getting recommended events: ", error);
  }
}

function isParentAvailable(event, availabilityBlock) {
  if (!availabilityBlock || availabilityBlock.length === 0) {
    return false;
  }

  const eventStart = new Date(event.start_date);
  const eventEnd = new Date(event.end_date);

  for (const block of availabilityBlock) {
    const blockStart = new Date(block.start_date);
    const blockEnd = new Date(block.end_date);

    if (eventStart >= blockStart && eventEnd <= blockEnd) {
      return true;
    }
    if (eventStart < blockEnd && eventEnd > blockStart) {
      return false;
    }
  }
  return false;
}
module.exports = {
  isAvailableForEvent,
  isInterested,
  isDistant,
  calculateTotalScore,
  getRecommendedEvents,
  isParentAvailable,
  SCORES,
};
