const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

async function main() {
  const student = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      username: "student1",
      role: "student",
      password: "password",
      interest: "Music",
    },
  });

  const parent = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      username: "parent1",
      role: "parent",
      password: "password",
    },
  });

  const studentAvailability = await prisma.availability.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      description: "Student free time",
      start_date: new Date("2026-01-15T14:00:00Z"),
      end_date: new Date("2026-01-15T16:00:00Z"),
      user_id: 1,
    },
  });

  const parentAvailability = await prisma.availability.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      description: "Parent free time",
      start_date: new Date("2026-01-15T15:00:00Z"),
      end_date: new Date("2026-01-15T17:00:00Z"),
      user_id: 2,
    },
  });

  const event1 = await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Music Concert",
      description: "Live music event",
      category: "Music",
      start_date: new Date("2026-01-15T14:30:00Z"),
      end_date: new Date("2026-01-15T15:30:00Z"),
      location: "Concert Hall",
      capacity: 100,
      num_attending: 50
    },
  });
    const event2 = await prisma.event.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "Art Workshop",
      description: "Come make art",
      category: "Art",
      start_date: new Date("2026-01-15T16:00:00Z"),
      end_date: new Date("2026-01-15T17:00:00Z"),
      location: "Art Studio",
      capacity: 20,
      num_attending: 10
    },
  });
    const event3 = await prisma.event.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: "Orchestra",
      description: "Come watch the orchestra",
      category: "Music",
      start_date: new Date("2026-01-15T15:00:00Z"),
      end_date: new Date("2026-01-15T15:30:00Z"),
      location: "Concert Hall",
      capacity: 35,
      num_attending: 20
    },
  });
}

  main().catch((e)=>{
    console.error(e);
    process.exit(1);
  }).finally(async () =>{
    await prisma.$disconnect();
  });

