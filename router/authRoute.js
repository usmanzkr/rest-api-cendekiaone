const router = require("express").Router();
const auth = require("../controller/authController.js");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.put("/change-password/:id", auth.changePassword);
router.delete("delete-account/:id", auth.deleteAkun);

module.exports = router;