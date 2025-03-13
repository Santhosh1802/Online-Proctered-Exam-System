const express=require("express");
const { getStudentProfile, updateStudentProfile, getStudentTests, getOneTest, submitTest, getStudentReports } = require("../controllers/StudentController");
const router=express.Router();

router.get("/studentprofile",getStudentProfile);
router.post("/updatestudentprofile",updateStudentProfile);
router.get("/get-test-student",getStudentTests);
router.get("/getOne-test-student",getOneTest);
router.post("/submit-test",submitTest);
router.get("/get-report-student",getStudentReports);

module.exports=router;