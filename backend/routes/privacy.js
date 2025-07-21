const express = require("express");
const { PrismaClient } = require("../generated/prisma");
const PrivacyService = require("../service/privacyService");

const privacyService = new PrivacyService;

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
   let settings = await privacyService.getPrivacySettings(request.session.userId);

   if(!settings){
    settings = await privacyService.createPrivacySettings(request.session.userId);
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
    const settings = await privacyService.updatePrivacySettings(request.session.userId, {
      profileVisibility,
      friendVisibility,
      eventVisibility,
      isAnon,
      anonUsername,
    })
    response.json({ settings, message: "Settings were updated" });
  } catch (error) {
    console.error("Error updating privacy settings", error);
    response.status(501).json({
      message: "Error updating privacy settings",
    });
  }
});

router.post("/block/:userId", requireAuth, async (request, response) => {
  try {
    const userToBlockId = parseInt(request.params.userId);

    if (userToBlockId === request.session.userId) {
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
      message: "User sucessfully blocked",
    });
  } catch (error) {
    console.error("Error blocking user", error);
    response.status(500).json({
      message: "Error blocking user!",
    });
  }
});

module.exports = router;
