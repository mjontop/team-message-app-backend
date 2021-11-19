const Post = require("../models/Post");
const Channel = require("../models/Channel");

exports.createPost = async (req, res) => {
  if (req.body.message === "") {
    return res.status(400).json({
      error: true,
      message: "Message Cannot be blank",
    });
  }

  const channel = await Channel.findById(req.body.channelId);
  console.log(channel, req.body.channelId);
  if (!channel) {
    return res.status(400).json({
      error: true,
      message: "Invalid ChannedID",
    });
  }
  try {
    const post = new Post({
      postedBy: req.user.username,
      ...req.body,
    });

    await post.save();

    return res.status(200).json({
      error: false,
      post
    });
  } catch (ex) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error" + ex,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.find({
      channelId: req.params.channelId,
    });
    if (!post) {
      return res.status(500).json({
        error: true,
        message: "Post Not Found",
      });
    }
    return res.status(200).json({
      error: false,
      post,
    });
  } catch (ex) {
    return res.status(500).json({
      error: true,
      message: "Post Not Found",
    });
  }
};
