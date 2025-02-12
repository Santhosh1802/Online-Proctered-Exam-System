const express=require("express");
const { getTecherProfile, updateTeacherProfile, createTest } = require("../controllers/TeacherController");
const router=express.Router();

router.get("/teacherprofile",getTecherProfile);
router.post("/updateteacherprofile",updateTeacherProfile);
router.post("/create-test",createTest)

module.exports=router;