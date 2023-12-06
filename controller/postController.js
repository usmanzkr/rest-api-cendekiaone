const { post, sequelize } = require('../models');
const { responseMessage, responseData } = require('../utils/responseHandle');

async function posted(req,res) {
  try {
    const { post_title, post_description, id_user, image_url, categories } = req.body;

    await post.create({
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

async function getAllPost(req,res){
    try {
      const postingans = await post.findAll();
      responseData(res, 200, postingans, 'Success');
    } catch (error) {
      responseMessage(res, 500, 'Internal server error');
    }
}

module.exports = {
    posted,
    getAllPost
};
