const express=require("express");
const { getStudentProfile, updateStudentProfile, getStudentTests } = require("../controllers/StudentController");
const router=express.Router();

router.get("/studentprofile",getStudentProfile);
router.post("/updatestudentprofile",updateStudentProfile);
router.get("/get-test-student",getStudentTests);

module.exports=router;