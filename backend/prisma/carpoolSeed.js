const { PrismaClient } = require("../generated/prisma");
const {
  initializeUserInterests,
  createOrGetCoordinates,
} = require("../utils/rankingUtils");
const bcrypt = require("bcrypt");


const prisma = new PrismaClient();

async function main() {
  
  await prisma.eventHistory.deleteMany();
  await prisma.userInterest.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventAttendance.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coordinates.deleteMany();

  
  const event1Coords = await createOrGetCoordinates(40.7829, -73.9654);
  const user1Coords = await createOrGetCoordinates(40.7128, -74.0060); 
  const user2Coords = await createOrGetCoordinates(40.7589, -73.9851); 
  const user3Coords = await createOrGetCoordinates(40.7505, -73.9934); 
  const user4Coords = await createOrGetCoordinates(40.7549, -73.9840); 
  const user5Coords = await createOrGetCoordinates(40.7484, -73.9857); 
  const user6Coords = await createOrGetCoordinates(40.7614, -73.9776); 
  const user7Coords = await createOrGetCoordinates(40.7562, -73.9869); 
  const user8Coords = await createOrGetCoordinates(40.7527, -73.9772); 
  const user9Coords = await createOrGetCoordinates(40.7489, -73.9850); 

  const event2Coords = await createOrGetCoordinates(34.1016, -118.3267); 
  const user10Coords = await createOrGetCoordinates(34.0522, -118.2437); 
  const user11Coords = await createOrGetCoordinates(34.0736, -118.2400); 
  const user12Coords = await createOrGetCoordinates(34.0625, -118.2380); 
  const user13Coords = await createOrGetCoordinates(34.0928, -118.3287); 

  const hashedPassword = await bcrypt.hash("1234", 10);

  const user1 = await prisma.user.create({
    data: {
      username: "user1",
      role: "student",
      password: hashedPassword,
      coordinatesId: user1Coords.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "user2",
      role: "student",
      password: hashedPassword,
      coordinatesId: user2Coords.id,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "user3",
      role: "student",
      password: hashedPassword,
      coordinatesId: user3Coords.id,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      username: "user4",
      role: "student",
      password: hashedPassword,
      coordinatesId: user4Coords.id,
    },
  });

  const user5 = await prisma.user.create({
    data: {
      username: "user5",
      role: "student",
      password: hashedPassword,
      coordinatesId: user5Coords.id,
    },
  });

  const user6 = await prisma.user.create({
    data: {
      username: "user6",
      role: "student",
      password: hashedPassword,
      coordinatesId: user6Coords.id,
    },
  });

  const user7 = await prisma.user.create({
    data: {
      username: "user7",
      role: "student",
      password: hashedPassword,
      coordinatesId: user7Coords.id,
    },
  });

  const user8 = await prisma.user.create({
    data: {
      username: "user8",
      role: "student",
      password: hashedPassword,
      coordinatesId: user8Coords.id,
    },
  });

  const user9 = await prisma.user.create({
    data: {
      username: "user9",
      role: "student",
      password: hashedPassword,
      coordinatesId: user9Coords.id,
    },
  });

  const user10 = await prisma.user.create({
    data: {
      username: "user10",
      role: "student",
      password: hashedPassword,
      coordinatesId: user10Coords.id,
    },
  });

  const user11 = await prisma.user.create({
    data: {
      username: "user11",
      role: "student",
      password: hashedPassword,
      coordinatesId: user11Coords.id,
    },
  });

  const user12 = await prisma.user.create({
    data: {
      username: "user12",
      role: "student",
      password: hashedPassword,
      coordinatesId: user12Coords.id,
    },
  });

  const user13 = await prisma.user.create({
    data: {
      username: "user13",
      role: "student",
      password: hashedPassword,
      coordinatesId: user13Coords.id,
    },
  });



  const allUsers = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12, user13];
  
  for (const user of allUsers) {
    await initializeUserInterests(user.id);
  }

  await prisma.userInterest.updateMany({
    where: { 
      user_id: { in: [user1.id, user2.id, user3.id, user4.id, user5.id, user6.id, user7.id, user8.id, user9.id] },
      category: "Music"
    },
    data: { ranking: 5 },
  });

  await prisma.userInterest.updateMany({
    where: { 
      user_id: { in: [user10.id, user11.id, user12.id, user13.id] },
      category: "Art"
    },
    data: { ranking: 5 },
  });



  const event1 = await prisma.event.create({
    data: {
      title: "Summer Music Festival",
      description: "Join us for a fun-filled evening of music, food, and drinks at our annual Summer Music Festival.",
      category: "Music",
      start_date: new Date("2025-08-15T18:00:00Z"),
              end_date: new Date("2025-08-15T22:00:00Z"),
      location: "City Park, New York",
      capacity: 500,
      num_attending: 9,
      coordinatesId: event1Coords.id,
      creatorId: user1.id,
      isPublic: true,
      hideAttendees: false,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Art Exhibition",
      description: "Explore the latest works from local artists at our Art Exhibition.",
      category: "Art",
      start_date: new Date("2025-09-05T10:00:00Z"),
              end_date: new Date("2025-09-05T18:00:00Z"),
      location: "Art Gallery, Los Angeles",
      capacity: 100,
      num_attending: 4,
      coordinatesId: event2Coords.id,
      creatorId: user10.id,
      isPublic: true,
      hideAttendees: false,
    },
  });



  const event1Attendances = await prisma.eventAttendance.createMany({
    data: [
      { userId: user1.id, eventId: event1.id },
      { userId: user2.id, eventId: event1.id },
      { userId: user3.id, eventId: event1.id },
      { userId: user4.id, eventId: event1.id },
      { userId: user5.id, eventId: event1.id },
      { userId: user6.id, eventId: event1.id },
      { userId: user7.id, eventId: event1.id },
      { userId: user8.id, eventId: event1.id },
      { userId: user9.id, eventId: event1.id },
    ],
  });

  const event2Attendances = await prisma.eventAttendance.createMany({
    data: [
      { userId: user10.id, eventId: event2.id },
      { userId: user11.id, eventId: event2.id },
      { userId: user12.id, eventId: event2.id },
      { userId: user13.id, eventId: event2.id },
    ],
  });



  const availabilities = await prisma.availability.createMany({
    data: [
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user1.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user2.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user3.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user4.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user5.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user6.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user7.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user8.id,
      },
      {
        description: "Available for Summer Music Festival",
        start_date: new Date("2025-08-15T16:00:00Z"),
        end_date: new Date("2025-08-15T23:00:00Z"),
        user_id: user9.id,
      },
      {
        description: "Available for Art Exhibition",
        start_date: new Date("2025-09-05T08:00:00Z"),
        end_date: new Date("2025-09-05T20:00:00Z"),
        user_id: user10.id,
      },
      {
        description: "Available for Art Exhibition",
        start_date: new Date("2025-09-05T08:00:00Z"),
        end_date: new Date("2025-09-05T20:00:00Z"),
        user_id: user11.id,
      },
      {
        description: "Available for Art Exhibition",
        start_date: new Date("2025-09-05T08:00:00Z"),
        end_date: new Date("2025-09-05T20:00:00Z"),
        user_id: user12.id,
      },
      {
        description: "Available for Art Exhibition",
        start_date: new Date("2025-09-05T08:00:00Z"),
        end_date: new Date("2025-09-05T20:00:00Z"),
        user_id: user13.id,
      },
    ],
  });



  const eventHistory = await prisma.eventHistory.createMany({
    data: [
      { user_id: user1.id, event_id: event1.id, attended: true },
      { user_id: user2.id, event_id: event1.id, attended: true },
      { user_id: user3.id, event_id: event1.id, attended: true },
      { user_id: user4.id, event_id: event1.id, attended: true },
      { user_id: user5.id, event_id: event1.id, attended: true },
      { user_id: user6.id, event_id: event1.id, attended: true },
      { user_id: user7.id, event_id: event1.id, attended: true },
      { user_id: user8.id, event_id: event1.id, attended: true },
      { user_id: user9.id, event_id: event1.id, attended: true },
      { user_id: user10.id, event_id: event2.id, attended: true },
      { user_id: user11.id, event_id: event2.id, attended: true },
      { user_id: user12.id, event_id: event2.id, attended: true },
      { user_id: user13.id, event_id: event2.id, attended: true },
    ],
  });



  const privacySettings = await prisma.userPrivacySettings.createMany({
    data: [
      {
        userId: user1.id,
        isAnon: false,
        anonUsername: null,
      },
      {
        userId: user2.id,
        isAnon: true,
        anonUsername: "MusicLover1",
      },
      {
        userId: user3.id,
        isAnon: false,
        anonUsername: null,
      },
      {
        userId: user4.id,
        isAnon: true,
        anonUsername: "DriverDave",
      },
      {
        userId: user5.id,
        isAnon: false,
        anonUsername: null,
      },
      {
        userId: user6.id,
        isAnon: true,
        anonUsername: "CarpoolKing",
      },
      {
        userId: user7.id,
        isAnon: false,
        anonUsername: null,
      },
      {
        userId: user8.id,
        isAnon: true,
        anonUsername: "TomTheDriver",
      },
      {
        userId: user9.id,
        isAnon: false,
        anonUsername: null,
      },
      {
        userId: user10.id,
        isAnon: true,
        anonUsername: "ArtEnthusiast",
      },
      {
        userId: user11.id,
        isAnon: true,
        anonUsername: "CreativeJames",
      },
      {
        userId: user12.id,
        isAnon: true,
        anonUsername: "AmandaArtist",
      },
      {
        userId: user13.id,
        isAnon: true,
        anonUsername: "DanDesigner",
      },
    ],
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: { in: [user2.id, user4.id, user6.id, user8.id] } },
    data: { isAnon: true },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: { in: [user10.id, user11.id, user12.id, user13.id] } },
    data: { isAnon: true },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user2.id },
    data: { anonUsername: "MusicLover1" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user4.id },
    data: { anonUsername: "DriverDave" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user6.id },
    data: { anonUsername: "CarpoolKing" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user8.id },
    data: { anonUsername: "TomTheDriver" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user10.id },
    data: { anonUsername: "ArtEnthusiast" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user11.id },
    data: { anonUsername: "CreativeJames" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user12.id },
    data: { anonUsername: "AmandaArtist" },
  });

  await prisma.eventAttendance.updateMany({
    where: { userId: user13.id },
    data: { anonUsername: "DanDesigner" },
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