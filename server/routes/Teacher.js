const express=require("express");
const { getTecherProfile, updateTeacherProfile, createTest,getAllTest,getOneTest, assignTestToStudents } = require("../controllers/TeacherController");
const router=express.Router();

router.get("/teacherprofile",getTecherProfile);
router.post("/updateteacherprofile",updateTeacherProfile);
router.post("/create-test",createTest);
router.get("/getAlltest-teacher",getAllTest);
router.get("/getOnetest-teacher",getOneTest);
router.post("/assign-test",assignTestToStudents);

module.exports=router;