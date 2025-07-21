const { PrismaClient } = require("../generated/prisma");

class PrivacyService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createPrivacySettings(userId, settings = {}) {
    try {
      const defaultSettings = {
        profileVisibility: "friends_only",
        friendVisibility: "friend_only",
        eventVisibility: "friend_only",
        isAnon: false,
        anonUsername: null,
        ...settings,
      };

      const privacySettings = await this.prisma.userPrivacySettings.create({
        data: {
          userId,
          ...defaultSettings,
        },
      });

      return privacySettings;
    } catch (error) {
      console.error("Error creating settings:", error);
    }
  }

  async getPrivacySettings(userId) {
    try {
      const settings = await this.prisma.userPrivacySettings.findUnique({
        where: { userId },
      });

      return settings;
    } catch (error) {
      console.error("Error getting settings", error);
    }
  }

  async updatePrivacySettings(userId, settings) {
    try {
      const updatedSettings = await this.prisma.userPrivacySettings.update({
        where: { userId },
        data: settings,
      });
      return updatedSettings;
    } catch (error) {
      console.error("Error updating privacy settings ", error);
    }
  }
  async blockUser(userId, userToBlockId) {
    try {
      const isBlocked = await this.isUserBlocked(userId, userToBlockId);

      if (isBlocked) {
        throw new Error("User already blocked");
      }

      const blockedUser = await this.prisma.blockedUser.create({
        data: {
          userId,
          blockedUserId: userToBlockId,
        },
      });

      await this.prisma.friend.deleteMany({
        where: {
          OR: [
            {
              user_id: userId,
              friend_id: userToBlockId,
            },
            {
              user_id: userToBlockId,
              friend_id: userId,
            },
          ],
        },
      });

      return {
        message: "User Blocked successfully",
        blockedUser,
      };
    } catch (error) {
      console.error("Error blocking user: ", error);
    }
  }

  async unblockUser(userId, userToUnblockId) {
    try {
      const isBlocked = await this.isUserBlocked(userId, userToUnblockId);

      if (!isBlocked) {
        throw new Error("User is not blocked");
      }

      await this.prisma.blockedUser.delete({
        where: {
          userId_blockedUserId: {
            userId,
            blockedUserId: userToUnblockId,
          },
        },
      });

      return {
        message: "User unblocked successfully",
      };
    } catch (error) {
      console.log("Error when trying to unblock user ", error);
    }
  }
  async getBlockedUsers(userId) {
    try {
      const blockedUsers = await this.prisma.blockedUser.findMany({
        where: { userId },
        include: {
          blockedUser: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
      });
      return blockedUsers.map((block) => block.blockedUser);
    } catch (error) {
      console.error("Error getting blocked users:", error);
    }
  }
  async isUserBlocked(userId, userToCheckId) {
    try {
      const blockedUser = await this.prisma.blockedUser.findUnique({
        where: {
          userId_blockedUserId: {
            userId,
            blockedUserId: userToCheckId,
          },
        },
      });
      return !!blockedUser;
    } catch (error) {
      console.error("Error checking user is blocked", error);
      return false;
    }
  }
}

module.exports = PrivacyService;
