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

  async getPrivacySettings(userId){
    try{
        const settings = await this.prisma.userPrivacySettings.findUnique({
            where: { userId }
        });

        return settings;
    } catch (error) {
        console.error("Error getting settings", error);
    }
  }

  async updatePrivacySettings(userId, settings){
    try{
        const updatedSettings = await this.prisma.userPrivacySettings.update({
            where: { userId },
            data: settings
        });
        return updatedSettings
    } catch (error) {
        console.error("Error updating privacy settings ", error)
    }
  }
}

module.exports = PrivacyService;
