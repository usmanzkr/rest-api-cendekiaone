const router = require("express").Router();
const userController = require("../controller/userController.js");
const multer = require('multer');
const multerUpload = multer({ storage: multerStorage });
router.post("/", userController.createUser);
router.get("/", userController.getUser);
router.put("/update-profile", multerUpload.single('profileImage'), userController.updateUser);
router.delete("/", userController.deleteUser);

module.exports = router;