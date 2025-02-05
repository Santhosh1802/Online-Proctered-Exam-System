const express=require("express");
const { getTecherProfile, updateTeacherProfile } = require("../controllers/TeacherController");
const router=express.Router();

router.get("/teacherprofile",getTecherProfile);
router.post("/updateteacherprofile",updateTeacherProfile);


module.exports=router;