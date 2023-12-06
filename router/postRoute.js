const router = require("express").Router();
const postController = require("../controller/postController.js");

router.get("/", postController.getAllPost);
router.post("/", postController.posted);

module.exports = router;