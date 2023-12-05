const router = require("express").Router();
const auth = require("../controller/authController.js");

router.post("/login", auth.login);
router.post("/register", auth.register);
// router.put("/:id", auth.updateUser);
// router.delete("/:id", auth.deleteUser);

module.exports = router;