const router = require("express").Router();
const postController = require("../controller/postController.js");

router.post("/", postController.post);

module.exports = router;