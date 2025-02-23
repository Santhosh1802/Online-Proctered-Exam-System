const express=require("express");
const { getTecherProfile, updateTeacherProfile, createTest,getAllTest,getOneTest, assignTestToStudents, updateOneTest, getUniqueDepartments, getUniqueBatches, getUniqueSections } = require("../controllers/TeacherController");
const router=express.Router();

router.get("/teacherprofile",getTecherProfile);
router.post("/updateteacherprofile",updateTeacherProfile);
router.post("/create-test",createTest);
router.get("/getAlltest-teacher",getAllTest);
router.get("/getOnetest-teacher",getOneTest);
router.post("/assign-test",assignTestToStudents);
router.put("/updateOnetest-teacher",updateOneTest);
router.get("/getuniquedepts",getUniqueDepartments);
router.get("/getuniquebatch",getUniqueBatches);
router.get("/getuniquesections",getUniqueSections);

module.exports=router;