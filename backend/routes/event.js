const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

router.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        coordinates: true,
        creator: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    const transformedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date.toISOString().split('T')[0],
      time: event.start_date.toTimeString().split(' ')[0].substring(0, 5),
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      num_attending: event.num_attending,
      start_date: event.start_date,
      end_date: event.end_date,
      creator: event.creator,
      coordinates: event.coordinates,
    }));

    res.json({
      data: transformedEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      error: "Failed to fetch events",
      message: error.message,
    });
  }
});

router.get("/events/paginated", async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const offset = (page - 1) * limit;

    const events = await prisma.event.findMany({
      include: {
        coordinates: true,
        creator: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        start_date: 'asc',
      },
      skip: parseInt(offset),
      take: parseInt(limit),
    });

    const totalEvents = await prisma.event.count();

    const transformedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date.toISOString().split('T')[0],
      time: event.start_date.toTimeString().split(' ')[0].substring(0, 5),
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      num_attending: event.num_attending,
      start_date: event.start_date,
      end_date: event.end_date,
      creator: event.creator,
      coordinates: event.coordinates,
    }));

    res.json({
      data: transformedEvents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEvents / limit),
        totalEvents,
        hasMore: offset + events.length < totalEvents,
      },
    });
  } catch (error) {
    console.error("Error fetching paginated events:", error);
    res.status(500).json({
      error: "Failed to fetch events",
      message: error.message,
    });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        coordinates: true,
        creator: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        error: "Event not found",
      });
    }

    const transformedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date.toISOString().split('T')[0],
      time: event.start_date.toTimeString().split(' ')[0].substring(0, 5),
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      num_attending: event.num_attending,
      start_date: event.start_date,
      end_date: event.end_date,
      creator: event.creator,
      coordinates: event.coordinates,
    };

    res.json({
      data: transformedEvent,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      error: "Failed to fetch event",
      message: error.message,
    });
  }
});

module.exports = router; 