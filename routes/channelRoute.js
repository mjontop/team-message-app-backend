const express = require("express");
const { createChannel } = require("../controllers/channel");
const router = express.Router();
const authenticate = require("../middleware/authenticate");

router.post("/createChannel/", authenticate, createChannel);

module.exports = router;
