const express = require("express");
const {
  createChannel,
  getChannelDetails,
  joinChannel,
} = require("../controllers/channel");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.post("/createChannel/", authenticate, createChannel);
router.post("/joinChannel/:channelId", authenticate, joinChannel);
router.get("/getChannel/:channelId", getChannelDetails);

module.exports = router;
