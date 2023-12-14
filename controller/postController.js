const { post, user } = require('../models');
const { responseMessage, responseData } = require('../utils/responseHandle');

async function posted(req,res) {
  try {
    const { post_title, post_body, id_user, image_url, categories,sub_categories } = req.body;
    if (!id_user) {
      return responseMessage(res, 201, 'cannot created post before login', true);
    }
    await post.create({
      post_title,
      post_body,
      id_user,
      image_url,
      categories,
      sub_categories,
    });

    responseMessage(res, 201, 'Post created successfully', false);
  } catch (error) {
    console.error(error);
    responseMessage(res, 500, 'Internal server error');
  }
}

async function getAllPost(req, res) {
    const page = req.query.page || 1; // Mendapatkan nomor halaman dari query parameter
    const pageSize = 10; // Jumlah postingan per halaman
    try {

        const { count, rows: postingans } = await post.findAndCountAll({
            include: [{
                model: user,
                attributes: ['name', 'username', 'profile_picture'],
                as: 'createdByUser'
            }],
            attributes: {
                exclude: ['id_user']
            },
            limit: pageSize,
            offset: (page - 1) * pageSize
        });

        const totalPages = Math.ceil(count / pageSize);

        const formattedPostings = postingans.map(postingan => {
          console.log(postingan);
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

        const paginationInfo = {
            currentPage: page,
            totalPages: totalPages,
            totalPosts: count
        };

        responseData(res, 200, { posts: formattedPostings, pagination: paginationInfo }, 'Success');
    } catch (error) {
        responseMessage(res, 500, `Internal server error${error}`);
    }
}

module.exports = {
    posted,
    getAllPost
};
