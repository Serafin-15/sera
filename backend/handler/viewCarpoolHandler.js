const ActionHandler = require("./actionHandler");
const PrivacyResponse = require("./privacyResponse");
const { PrismaClient } = require("../generated/prisma");
const CarpoolService = require("../service/carpoolService");

const prisma = new PrismaClient();
const privacyService = new PrivacyService();

class viewAttendeesHandler extends ActionHandler {
  constructor() {
    super("view_carpool");
  }

  async processUserLevels(request) {
    return null;
  }
}

module.exports = viewAttendeesHandler;
