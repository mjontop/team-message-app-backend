const Channel = require("../models/Channel");
const User = require("../models/User");
exports.createChannel = async (req, res) => {
  try {
    if (req.body.name.length < 3) {
      return res.status(400).json({
        error: true,
        message: "Channel Name Too short",
      });
    }

    if (req.body.description && req.body.description === "") {
      return res.status(400).json({
        error: true,
        message: "Description is Mandatory",
      });
    }

    console.log({
      createdBy: req.user.id,
      ...req.body,
    });
    const channel = new Channel({
      createdBy: req.user.username,
      ...req.body,
    });

    await channel.save();

    return res.status(200).json({
      error: false,
      channel,
    });
  } catch (ex) {
    return res.status(500).json({
      error: true,
      message: "Error in Creating Channels " + ex,
    });
  }
};

exports.getChannelDetails = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);
    if (channel) {
      return res.status(200).json({
        error: false,
        channel,
      });
    }
    return res.status(404).json({
      error: true,
      channel: null,
    });
  } catch (ex) {
    return res.status(500).json({
      error: true,
      message: "Error in getting Channel " + ex,
    });
  }
};

exports.joinChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);
  if (channel) {
    channel.members = [...channel.members, req.user.username];
    await channel.save();
    return res.status(200).json({
      error: false,
      channel,
    });
  }
};
