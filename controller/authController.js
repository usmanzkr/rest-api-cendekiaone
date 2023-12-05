const { user } = require("../models");
const { auth } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { responseMessage, responseData } = require("../utils/responseHandle");
function login(req, res) {}

async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;
    const passwordHash =  await bcrypt.hash(password, 10)
    console.log(name,username,email, await bcrypt.hash(password, 10));
    const newUser = await user.create({ name: name, username: username });
    const newAccount = await auth.create({
      email: email,
      password: passwordHash,
      id_user: newUser.id,
    });
    responseData(
      res,
      201,
      {
        name: newUser.name,
        username: newUser.username,
        email: newAccount.email,
        password: newAccount.password,
      },
      "success"
    );
  } catch (error) {
    responseMessage(res, 404, `failed get user ${error}`);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await auth.findOne({ where: { email } });

    if (!user) {
      return responseMessage(res, 401, "Invalid credentials");
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return responseMessage(res, 401, "Invalid credentials");
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user.id }, 'a40a47053167cb92bcb9b46ceff99ae2b734f758fbd565b1d70fb73ca2c16458', { expiresIn: '1h' });

    // Update the token in the database
    await auth.update({ token }, { where: { id: user.id } });

    // Respond with the token or any other relevant information
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
