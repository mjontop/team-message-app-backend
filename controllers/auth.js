const User = require("../models/User");
const { validationResult, check } = require("express-validator");
const { getHashedPassword } = require("./helper");
const bcrypt = require("bcrypt");
async function checkEmailExist(email) {
  try {
    const user = await User.findOne({ email });
    if (user) return { error: true, user };
    return { error: false, user };
  } catch (ex) {}
}

async function checkUsernameExist(username) {
  try {
    const user = await User.findOne({ username });
    if (!!user) return { error: true, user };
    return { error: false, user: null };
  } catch (ex) {}
}

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: true,
      message: errors.array()[0].msg,
    });
  }
  const { error: emailExists } = await checkEmailExist(req.body.email);

  if (emailExists) {
    return res.status(400).json({
      error: true,
      message: "Email already exists",
    });
  }

  const { error: usernameExists } = await checkUsernameExist(req.body.username);

  if (usernameExists) {
    return res.status(400).json({
      error: true,
      message: "Username already taken",
    });
  }

  const encry_password = await getHashedPassword(req.body.password);
  if (encry_password.error) {
    return res.status(500).json({
      error: true,
      message: "Error in ency password",
    });
  }
  const user = new User({ ...req.body, encry_password: encry_password.hashed });
  const newUser = await user.save();
  const token = user.generateAuthToken();
  return res.status(200).json({ error: false, token });
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({
    $or: [{ email: email }, { username: email }],
  });
  if (!user) {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
  const isValidPassWord = await bcrypt.compare(password, user.encry_password);

  if (isValidPassWord) {
    return res.status(200).json({
      error: false,
      token: user.generateAuthToken(),
    });
  }
  return res.status(400).json({
    error: true,
    message: "Invalid Credentials",
  });
};

exports.updateProfile = async (req, res) => {
  const user = await User.findOne({
    email: req.user.email,
  });

  const RB = req.body;
  if (req.user.username !== RB.username) {
    const { error: usernameExists } = await checkUsernameExist(RB.username);

    if (usernameExists) {
      return res.status(400).json({
        error: true,
        message: "Username already taken",
      });
    }
  }

  user.name = RB.name || user.name;
  user.bio = RB.bio || user.bio;
  user.username = RB.username || user.username;
  user.imageBase64 = RB.imageBase64 || user.imageBase64;

  const updatedUser = await user.save();

  return res.status(200).json({
    error: false,
    message: "Profile Updated",
    token: updatedUser.generateAuthToken(),
  });
};

exports.searchUser = async (req, res) => {
  try {
    let users = await User.find(
      {
        $or: [
          { email: req.params.searchKey },
          { username: { $regex: req.params.searchKey } },
        ],
      },
      { _id: 0, username: 1 }
    );

    users = users.map((user) => user.username);

    return res.status(200).json({
      error: false,
      users,
    });
  } catch (ex) {
    return res.status(500).json({
      error: true,
      message: ex,
      users: [],
    });
  }
};

exports.getUserFromUsername = async (req, res) => {
  const { user, error } = await checkUsernameExist(req.params.username);
  if (!!error) {
    return res.json({
      email: user.email,
      bio: user.bio,
      name: user.name,
      imageBase64: user.imageBase64,
      username: user.username,
      error: false,
    });
  }
  return res.json({
    email: null,
    error: true,
  });
};

exports.getUserFromEmail = async (req, res) => {
  const { user, error } = await checkEmailExist(req.params.email);
  if (!!error) {
    return res.json({
      email: user.email,
      bio: user.bio,
      name: user.name,
      imageBase64: user.imageBase64,
      username: user.username,
      error: false,
    });
  }
  return res.json({
    email: null,
    error: true,
  });
};
