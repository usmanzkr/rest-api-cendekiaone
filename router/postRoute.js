const router = require("express").Router();
const postController = require("../controller/postController.js");

router.get("/posts", postController.getAllPost);
router.get("/post/:detail", postController.getPostById);
router.post("/post", postController.posted);
router.post("/like", postController.likePost);

module.exports = router;