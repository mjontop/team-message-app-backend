var mongoose = require("mongoose");

var channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);
