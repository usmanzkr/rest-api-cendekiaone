const router = require("express").Router();
const postController = require("../controller/postController.js");

router.get("/", postController.getAllPost);
router.get("/:detail", postController.getPostById);
router.post("/", postController.posted);

module.exports = router;