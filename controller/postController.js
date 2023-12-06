const { postingan, sequelize } = require('../models');
const { responseMessage, responseData } = require('../utils/responseHandle');

async function post(res,req) {
  try {
    const { post_title, post_description, id_user, image_url, categories } = req.body;

    // Create a new postingan
    await postingan.create({
      post_title,
      post_description,
      id_user,
      image_url,
      categories,
    });

    responseMessage(res, 201, 'Post created successfully', false);
  } catch (error) {
    console.error(error);
    responseMessage(res, 500, 'Internal server error');
  }
}

module.exports = {
    post
};
