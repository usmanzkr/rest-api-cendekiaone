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

async function getAllPost(req, res) {
  try {
      const postingans = await post.findAll({
          include: [{
              model: user,
              attributes: ['name', 'username', 'profile_picture'],
              as: 'createdByUser'
          }],
          attributes: {
              exclude: ['user_id'] 
          }
      });

      const formattedPostings = postingans.map(postingan => {
          return {
              idPost: postingan.id,
              createBy: postingan.createdByUser.name,
              postPicture: postingan.image_url,
              description: postingan.body,
              category: postingan.categories,
              subCatergory: postingan.sub_categories,
              likes: postingan.likes,
              following: postingan.following === 'true',
              saved: postingan.saved === 'true',
              summary: postingan.summary === 'true',
              createdAt: postingan.created_at
          };
      });

      responseData(res, 200, formattedPostings, 'Success');
  } catch (error) {
      responseMessage(res, 500, 'Internal server error');
  }
}

module.exports = {
    posted,
    getAllPost
};
