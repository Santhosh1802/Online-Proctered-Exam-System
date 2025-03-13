const express=require("express");
const { getTecherProfile, updateTeacherProfile, createTest,getAllTest,getOneTest, assignTestToStudents, updateOneTest, getUniqueDepartments, getUniqueBatches, getUniqueSections, deassignTestFromStudents, getTeacherDashboardData, getTestReports } = require("../controllers/TeacherController");
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
router.post("/deassign-test",deassignTestFromStudents);
router.get("/getTeacherDashboardData",getTeacherDashboardData);
router.get("/get-report-by-test_id",getTestReports);

module.exports=router;