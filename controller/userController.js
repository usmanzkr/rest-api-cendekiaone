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
    const { id } = req.params;
    const data = await user.findOne({ where: { id: id } });
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
    const { account_owner, followed_user } = req.body;
    if (!account_owner || !followed_user) {
      return responseMessage(res, 404, "user cannot empty");
    }
    const isAlreadyFollow = await following.findOne({
      where: [
        { following_user: followed_user },
        { account_owner: account_owner },
      ],
    });

    if (isAlreadyFollow) {
      return responseMessage(res, 400, "already follow this user");
    }

    await following.create(
      {
        following_user: followed_user,
        account_owner: account_owner,
      },
      { transaction: t }
    );
    await follower.create(
      {
        followers: account_owner,
        account_owner: followed_user,
      },
      { transaction: t }
    );
    await t.commit();
    return responseMessage(res, 200, "successfully followed this user");
  } catch (error) {
    return responseMessage(res, 500, error);
  }
}

async function getFollowing(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return responseMessage(res, 400, "user cannot empty", true);
    }

    const followingList = await following.findAll({
      attributes: ["following_user", "account_owner"],
      include: [
        {
          model: user,
          as: "followingsDetails",
          attributes: ["id", "name", "username"],
        },
        {
          model: user,
          as: "accountOwner",
          attributes: ["name", "username"],
        },
      ],
      where: {
        account_owner: id,
      },
    });
    const data = followingList.map((item) => ({
      id_user: item.account_owner,
      following_id: item.following_user,
      following_name: item.followingsDetails.name,
      following_username: item.followingsDetails.username,
      account_owner_name: item.accountOwner.name,
      account_owner_username: item.accountOwner.username,
    }));

    return responseData(res, 200, data, "Success");
  } catch (error) {
    console.error(error);
    return responseMessage(res, 500, "Internal server error");
  }
}

async function getFollowers(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return responseMessage(res, 400, "user cannot empty", true);
    }
    const followersList = await follower.findAll({
      attributes: ["followers", "account_owner"],
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
        account_owner: id,
      },
    });
    const data = followersList.map((item) => ({
      id_user: item.account_owner,
      following_id: item.followers,
      follower_name: item.followerDetails.name,
      follower_username: item.followerDetails.username,
      account_owner_name: item.accountOwner.name,
      account_owner_username: item.accountOwner.username,
    }));
    return responseData(res, 200, data, "Success");
  } catch (error) {
    console.error(error);
    return responseMessage(res, 500, "Internal server error");
  }
}

const { Op } = require("sequelize");

async function searchUser(req, res) {
  try {
    const { username } = req.query;

    const usersResult = await user.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
      },
    });

    if (usersResult.length > 0) {
      return responseData(res, 200, usersResult, "Success");
    } else {
      return responseMessage(res, 404, "User not found");
    }
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
  getFollowing,
  searchUser,
};
