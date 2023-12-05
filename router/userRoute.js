const router = require("express").Router();
const userController = require("../controller/userController.js");

router.post("/", userController.createUser);
router.get("/", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;