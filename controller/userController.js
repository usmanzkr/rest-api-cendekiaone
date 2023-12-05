const { user } = require("../models");
const { responseMessage, responseData } = require("../utils/responseHandle");
function createUser(req, res) {
  
}

async function getUser(req, res) {
  try {
    const data = await user.findAll();
    responseData(res, 200, data, "success");
    
  } catch (error) {
    responseMessage(res, 404, `failed get user ${error}`);
  }
}

function updateUser(req, res) {}

function deleteUser(req, res) {}

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
