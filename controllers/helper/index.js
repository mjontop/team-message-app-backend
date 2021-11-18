const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.getHashedPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(password, salt);
    return {
      error: false,
      hashed,
    };
  } catch (ex) {
    console.log("Error in generating Password", ex);
    return {
      error: true,
      hashed: null,
    };
  }
};

// async function run() {
//   
// }

// run()