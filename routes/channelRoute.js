const express = require("express");
const { createChannel, getChannelDetails } = require("../controllers/channel");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.post("/createChannel/", authenticate, createChannel);
router.get("/getChannel/:channelId", getChannelDetails);

module.exports = router;
