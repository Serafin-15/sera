const express = require("express");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
const router = express.Router();

const requireAuth = (request, response, next) => {
  if (!request.session.userId) {
    return response.status(401).json({
      message: "Authentication required",
    });
  }
  next();
};

router.get("/settings", requireAuth, async (request, response) => {
  try {
    const settings = await prisma.userPrivacySettings.findUnique({
      where: { userId: request.session.userId },
    });

    if (!settings) {
      const defaultSettings = await prisma.userPrivacySettings.create({
        data: {
          userId: request.session.userId,
          profileVisibility: "friends_only",
          friendVisibility: "friend_only",
          eventVisibility: "friend_only",
          isAnon: false,
        },
      });
      return response.json({
        settings: defaultSettings,
      });
    }
    return response.json({ settings });
  } catch (error) {
    console.error("Error getting privacy settings", error);
    response.status(501).json({
      message: "Error getting privacy settings",
    });
  }
});

router.put("/settings", requireAuth, async (request, response) => {
  try {
    const {
      profileVisibility,
      friendVisibility,
      eventVisibility,
      isAnon,
      anonUsername,
    } = request.body;
    const settings = await prisma.userPrivacySettings.upsert({
      where: { userId: request.session.userId },
      update: {
        profileVisibility,
        friendVisibility,
        eventVisibility,
        isAnon,
        anonUsername,
      },
      create: {
        userId: request.session.userId,
        profileVisibility: profileVisibility || "friends_only",
        friendVisibility: friendVisibility || "friends_only",
        eventVisibility: eventVisibility || "friends_only",
        isAnon: isAnon || false,
        anonUsername,
      },
    });
    response.json({ settings, message: "Settings were updated" });
  } catch (error) {
    console.error("Error updating privacy settings", error);
    response.status(501).json({
      message: "Error updating privacy settings",
    });
  }
});

router.post("block/:userId", requireAuth, async (request, response) => {
  try {
    const userToBlockId = parseInt(request.params.userId);

    if (userToBlock === request.session.userId) {
      return response.status(400).json({
        message: "Can't block yourself",
      });
    }

    const existingBlock = await prisma.blockedUser.findFirst({
      where: {
        userId: request.session.userId,
        blockedUserId: userToBlockId,
      },
    });

    if (existingBlock) {
      return response.status(400).json({
        message: "Can't block someon that is already blocked",
      });
    }

    await prisma.friend.deleteMany({
      where: {
        OR: [
          {
            user_id: request.session.userId,
            friend_id: userToBlockId,
          },
          {
            user_id: userToBlockId,
            friend_id: request.session.userId,
          },
        ],
      },
    });

    response.json({
      sucess: true,
      message: "",
    });
  } catch (error) {
    console.error("Error blocking user", error);
    response.status(500).json({
      message: "Error blocking user!",
    });
  }
});

module.exports = router;
