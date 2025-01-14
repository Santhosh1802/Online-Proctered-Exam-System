const express=require("express");
const router=express.Router();
const {handleUserLogin, handleStudentRegister, handleForgotPassword, handleResetPassword}=require("../controllers/UserController")

router.post("/login",handleUserLogin)
router.post("/register",handleStudentRegister);
router.post("/forgotpassword",handleForgotPassword)
router.post("/resetpassword",handleResetPassword)


module.exports=router
