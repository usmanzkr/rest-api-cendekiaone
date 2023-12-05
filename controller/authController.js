const { user } = require("../models");
const { auth } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { responseMessage, responseData } = require("../utils/responseHandle");
function login(req, res) {}

async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const existingEmail = await Auth.findOne({ where: { email: email } });
    if (existingEmail) {
      return responseMessage(res, 400, 'Email already exists', 'false');
    }
    
    const existingUsername = await User.findOne({ where: { username: username } });
    if (existingUsername) {
      return responseMessage(res, 400, 'Username already exists', 'false');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await user.create({ name: name, username: username });
    await auth.create({
      email: email,
      password: passwordHash,
      id_user: newUser.id,
    });

    responseMessage(res, 201, `register success`, "false");
  } catch (error) {
    responseMessage(res, 404, `failed get user ${error}`, "false");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await auth.findOne({ where: { email } });

    if (!user) {
      return responseMessage(res, 401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return responseMessage(res, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id },
      "a40a47053167cb92bcb9b46ceff99ae2b734f758fbd565b1d70fb73ca2c16458",
      { expiresIn: "1h" }
    );

    await auth.update({ token }, { where: { id: user.id } });

    responseData(res, 200, { token }, "Login successful");
  } catch (error) {
    console.error(error);
    responseMessage(res, 500, "Internal server error");
  }
}

function updateAkun(req, res) {}

function deleteAkun(req, res) {}

module.exports = {
  login,
  register,
};
