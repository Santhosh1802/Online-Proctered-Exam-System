const express=require("express");
const router=express.Router();
const {handleUserLogin, handleStudentRegister, handleForgotPassword, handleResetPassword,handleLogout}=require("../controllers/UserController")

router.post("/login",handleUserLogin);
router.post("/register",handleStudentRegister);
router.post("/forgotpassword",handleForgotPassword);
router.post("/resetpassword",handleResetPassword);
router.post("/logout",handleLogout);

module.exports=router
