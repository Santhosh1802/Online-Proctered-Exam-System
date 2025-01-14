const express=require("express");
const router=express.Router();
const {getAdminProfile,updateAdminProfile, getTeacher}=require("../controllers/AdminController");


router.get('/adminprofile',getAdminProfile);
router.post("/adminupdateprofile",updateAdminProfile);
router.get("/getteacher",getTeacher);

module.exports=router;