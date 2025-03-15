const express = require("express");
const router = express.Router();
const {
  handleUserLogin,
  handleStudentRegister,
  handleForgotPassword,
  handleResetPassword,
  handleLogout,
  resetPassword,
} = require("../controllers/UserController");

router.post("/login", handleUserLogin);
router.post("/register", handleStudentRegister);
router.post("/forgotpassword", handleForgotPassword);
router.post("/resetpassword", handleResetPassword);
router.post("/logout", handleLogout);
router.post("/reset-password", resetPassword);

module.exports = router;
