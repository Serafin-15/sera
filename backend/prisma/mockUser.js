const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");
const {
  createOrGetCoordinates,
  initializeUserInterests,
} = require("../utils/rankingUtils");

const prisma = new PrismaClient();

async function main() {
  const coords1 = await createOrGetCoordinates(40.7128, -74.006);
  const coords2 = await createOrGetCoordinates(40.7589, -73.9851);
  const coords3 = await createOrGetCoordinates(40.72, -74.0);
  const coords4 = await createOrGetCoordinates(40.73, -73.99);
  const coords5 = await createOrGetCoordinates(40.7829, -73.9654);

  let jeffery = await prisma.user.findUnique({
    where: { username: "Jeffery" },
  });

  if (!jeffery) {
    const hashedPassword = await bcrypt.hash("1234", 10);
    jeffery = await prisma.user.create({
      data: {
        username: "Jeffery",
        role: "student",
        password: hashedPassword,
        coordinatesId: coords1.id,
      },
    });
  }

  await initializeUserInterests(jeffery.id);

  const jefferyAvailability = await prisma.availability.createMany({
    data: [
      {
        description: "Weekday Afternoons",
        start_date: new Date("2025-08-01T14:00:00Z"),
        end_date: new Date("2025-08-01T18:00:00Z"),
        user_id: jeffery.id,
      },
      {
        description: "Weekend Mornings",
        start_date: new Date("2025-08-02T09:00:00Z"),
        end_date: new Date("2025-08-02T12:00:00Z"),
        user_id: jeffery.id,
      },
      {
        description: "Weekend Afternoons",
        start_date: new Date("2025-08-02T14:00:00Z"),
        end_date: new Date("2025-08-02T18:00:00Z"),
        user_id: jeffery.id,
      },
      {
        description: "Weekday Evenings",
        start_date: new Date("2025-08-01T18:00:00Z"),
        end_date: new Date("2025-08-01T21:00:00Z"),
        user_id: jeffery.id,
      },
    ],
  });

  await prisma.userInterest.updateMany({
    where: { user_id: jeffery.id },
    data: { ranking: 3 },
  });

  await prisma.userInterest.update({
    where: {
      user_id_category: {
        user_id: jeffery.id,
        category: "Sports/Fitness",
      },
    },
    data: { ranking: 5 },
  });

  await prisma.userInterest.update({
    where: {
      user_id_category: {
        user_id: jeffery.id,
        category: "Tech",
      },
    },
    data: { ranking: 4 },
  });

  await prisma.userInterest.update({
    where: {
      user_id_category: {
        user_id: jeffery.id,
        category: "Music",
      },
    },
    data: { ranking: 4 },
  });


  const mockEvents = [
    {
      title: "Campus Study Group",
      description: "Join us for a collaborative study session in the library. All subjects welcome!",
      category: "Education",
      start_date: new Date("2025-08-01T14:00:00Z"),
      end_date: new Date("2025-08-01T16:00:00Z"),
      location: "Main Library, Study Room A",
      coordinatesId: coords1.id,
      capacity: 20,
      num_attending: 8,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Basketball Tournament",
      description: "Annual school basketball tournament. Teams of 5 players. Sign up now!",
      category: "Sports/Fitness",
      start_date: new Date("2025-08-02T15:00:00Z"),
      end_date: new Date("2025-08-02T18:00:00Z"),
      location: "School Gymnasium",
      coordinatesId: coords2.id,
      capacity: 50,
      num_attending: 32,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Art Workshop",
      description: "Learn painting techniques from local artist. All skill levels welcome!",
      category: "Art",
      start_date: new Date("2025-08-03T10:00:00Z"),
      end_date: new Date("2025-08-03T12:00:00Z"),
      location: "Art Studio, Room 205",
      coordinatesId: coords3.id,
      capacity: 15,
      num_attending: 12,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Coding Club Meeting",
      description: "Weekly coding club meeting. This week: Web Development Basics",
      category: "Tech",
      start_date: new Date("2025-08-04T16:00:00Z"),
      end_date: new Date("2025-08-04T17:30:00Z"),
      location: "Computer Lab, Room 101",
      coordinatesId: coords4.id,
      capacity: 25,
      num_attending: 18,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Music Jam Session",
      description: "Bring your instruments and join our music jam session!",
      category: "Music",
      start_date: new Date("2025-08-05T18:00:00Z"),
      end_date: new Date("2025-08-05T20:00:00Z"),
      location: "Music Room, Building B",
      coordinatesId: coords5.id,
      capacity: 30,
      num_attending: 22,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Science Fair",
      description: "Annual science fair showcasing student projects and experiments",
      category: "Education",
      start_date: new Date("2025-08-06T13:00:00Z"),
      end_date: new Date("2025-08-06T16:00:00Z"),
      location: "Science Building, Main Hall",
      coordinatesId: coords1.id,
      capacity: 100,
      num_attending: 75,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Yoga Class",
      description: "Relaxing yoga session for all skill levels. Mats provided!",
      category: "Sports/Fitness",
      start_date: new Date("2025-08-07T17:00:00Z"),
      end_date: new Date("2025-08-07T18:00:00Z"),
      location: "Fitness Center, Studio 1",
      coordinatesId: coords2.id,
      capacity: 20,
      num_attending: 15,
      creatorId: jeffery.id,
      isPublic: true,
    },
    {
      title: "Book Club Discussion",
      description: "Monthly book club meeting. This month: 'The Great Gatsby'",
      category: "Literature",
      start_date: new Date("2025-08-08T19:00:00Z"),
      end_date: new Date("2025-08-08T20:30:00Z"),
      location: "Library Conference Room",
      coordinatesId: coords3.id,
      capacity: 15,
      num_attending: 8,
      creatorId: jeffery.id,
      isPublic: true,
    }
  ];

  for (const eventData of mockEvents) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        title: eventData.title,
        creatorId: jeffery.id,
      },
    });

    if (!existingEvent) {
      const event = await prisma.event.create({
        data: eventData,
      });
    }
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 