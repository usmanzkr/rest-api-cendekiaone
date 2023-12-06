const router = require("express").Router();
const auth = require("../controller/authController.js");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/change-password", auth.changePassword);
router.delete("/delete-account", auth.deleteAkun);

module.exports = router;