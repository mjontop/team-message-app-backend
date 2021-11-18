const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const { jwtPvtKey } = require("../config/configEnv");

var userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    region: {
      type: String,
      trim: true,
      default: "",
    },
    username: {
      type: String,
      trim: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { username: this.username, email: this.email, id: this._id },
    jwtPvtKey
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
