const { user } = require("../models");
const { auth } = require("../models");
const { responseMessage, responseData } = require("../utils/responseHandle");
function login(req, res) {}

async function register(req, res) {
  try {
    const { name, username, email, password } = req.body;
    console.log(name,username,email,password);
    const newUser = await user.create({ name: name, username: username });
    const newAccount = await auth.create({
      email: email,
      password: password,
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

function login(req, res) {}
function updateAkun(req, res) {}

function deleteAkun(req, res) {}

module.exports = {
  login,
  register,
};
