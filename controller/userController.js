const { user, following, follower, sequelize } = require("../models");
const { responseMessage, responseData } = require("../utils/responseHandle");
const { Storage } = require("@google-cloud/storage");

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: "your-project-id",
  keyFilename: "path/to/your/keyfile.json",
});

// Create a bucket reference
const bucket = storage.bucket("your-bucket-name");

async function getUser(req, res) {
  try {
    const data = await user.findAll();
    responseData(res, 200, data, "success");
  } catch (error) {
    responseMessage(res, 404, `failed get user ${error}`);
  }
}

async function getUserById(req, res) {
  try {
    const { id_user } = req.body;
    console.log(id_user);
    const data = await user.findOne({ where: { id: id_user } });
    if (!data) {
      return responseMessage(res, 404, `user not found`);
    }
    responseData(res, 200, data, "success");
  } catch (error) {
    responseMessage(res, 404, `failed get user ${error}`);
  }
}

async function updateUser(req, res) {
  try {
    const { id_user, name, username, bio } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
      await user.update({ name, username, bio }, { where: { id: id_user } });
      responseMessage(res, 200, "User updated successfully", false);
    } else {
      // File uploaded
      const file = req.file;
      const fileName = `${Date.now()}_${file.originalname}`;

      // Create a writable stream to upload the file to Google Cloud Storage
      const fileStream = bucket.file(fileName).createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      fileStream.on("error", (err) => {
        console.error(err);
        responseMessage(res, 500, "Failed to upload profile image", true);
      });

      fileStream.on("finish", async () => {
        const profil_url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        // Update user with the new profile URL
        await user.update(
          { name, username, bio, profil_url },
          { where: { id: id_user } }
        );

        responseMessage(res, 200, "User updated successfully", false);
      });

      // Pipe the file buffer into the stream
      fileStream.end(file.buffer);
    }
  } catch (error) {
    console.error(error);
    responseMessage(res, 500, "Internal server error", true);
  }
}

async function follow(req, res) {
  try {
    const t = await sequelize.transaction();
    const { current_user_id, another_user_id } = req.body;
    if (!current_user_id || !another_user_id) {
      return responseMessage(res, 404, "user cannot empty");
    }
    const isAlreadyFollow = await following.findOne({
      where: [{ following: another_user_id }, { id_user: current_user_id }],
    });
    console.log(isAlreadyFollow);
    if (isAlreadyFollow) {
      return responseMessage(res, 400, "already follow this user");
    }

    await following.create(
      {
        following: another_user_id,
        id_user: current_user_id,
      },
      { transaction: t }
    );
    await follower.create(
      {
        followers: current_user_id,
        id_user: another_user_id,
      },
      { transaction: t }
    );
    await t.commit();
    return responseMessage(res, 200, "successfully followed this user");
  } catch (error) {}
}

async function getFollowers(req, res) {
  try {
    const userId = req.body.userId; 
    if (!userId) {
      return responseMessage(res,400,"user cannot empty",true)
    }

    const followerList = await follower.findAll({
      attributes: ["followers", "id_user"],
      include: [
        {
          model: user,
          as: "followerDetails",
          attributes: ["id", "name", "username"],
        },
        {
          model: user,
          as: "accountOwner",
          attributes: ["name", "username"],
        },
      ],
      where: {
        id_user: userId,
      },
    });

    return responseData(res, 200, followerList, "Success");
  } catch (error) {
    console.error(error);
    return responseMessage(res, 500, "Internal server error");
  }
}

module.exports = {
  getUser,
  updateUser,
  getUserById,
  follow,
  getFollowers,
};
