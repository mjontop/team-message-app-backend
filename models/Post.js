var mongoose = require("mongoose");

var postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    channelId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
