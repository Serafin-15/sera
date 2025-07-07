const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

function isAvailableForEvent(event, availabilityBlock) {
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

function isInterested(event, studentInterest) {
  if (!event.category || !studentInterest) {
    return false;
  }

  const eventCategory = event.category.toLowerCase();
  const studentCategory = studentInterest.toLowerCase();

  if (eventCategory === studentCategory) {
    return true;
  }
  return false;
}

async function getRecommendedEvents(studentId, parentId = null) {
  try {
    const studentAvailability = await prisma.availability.findMany({
      where: { user_id: studentId },
    });

    let parentAvailability = [];
    if (parentId) {
      parentAvailability = await prisma.availability.findMany({
        where: { user_id: parentId },
      });
    }
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });
    const studentInterest = student?.interest || "Music";

    const allEvents = await prisma.event.findMany({
      where: {
        start_date: {
          gte: new Date(),
        },
      },
    });

    const recommendedEvents = [];
    for (const event of allEvents) {
      const studentConflict = !isAvailableForEvent(event, studentAvailability);

      let parentConflict = false;
      if (parentId && parentAvailability.length > 0) {
        parentConflict = !isAvailableForEvent(event, parentAvailability);
      }

      const interestMatch = isInterested(event, studentInterest);

      if (!studentConflict && !parentConflict && interestMatch) {
        recommendedEvents.push({
          ...event,
        });
      }
    }

    recommendedEvents.sort((a, b) => {
      return new Date(a.start_date) - new Date(b.start_date);
    });

    return recommendedEvents;
  } catch (error) {
    console.error("Error getting recommended events: ", error);
  }
}

module.exports = {
  isAvailableForEvent,
  isInterested,
  getRecommendedEvents,
};
