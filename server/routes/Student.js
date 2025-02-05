const express=require("express");
const { getStudentProfile, updateStudentProfile } = require("../controllers/StudentController");
const router=express.Router();

router.get("/studentprofile",getStudentProfile);
router.post("/updatestudentprofile",updateStudentProfile);


module.exports=router;