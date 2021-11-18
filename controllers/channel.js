const Channel = require("../models/Channel");

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
      createdBy: req.user.id,
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
