const express = require("express");
const {
  getTecherProfile,
  updateTeacherProfile,
  createTest,
  getAllTest,
  getOneTest,
  assignTestToStudents,
  updateOneTest,
  getUniqueDepartments,
  getUniqueBatches,
  getUniqueSections,
  deassignTestFromStudents,
  getTeacherDashboardData,
  getTestReports,
} = require("../controllers/TeacherController");
const { isTeacherAuthenticated } = require("../middlewares/authentication");
const router = express.Router();

router.get("/teacherprofile", isTeacherAuthenticated, getTecherProfile);
router.post(
  "/updateteacherprofile",
  isTeacherAuthenticated,
  updateTeacherProfile
);
router.post("/create-test", isTeacherAuthenticated, createTest);
router.get("/getAlltest-teacher", isTeacherAuthenticated, getAllTest);
router.get("/getOnetest-teacher", isTeacherAuthenticated, getOneTest);
router.post("/assign-test", isTeacherAuthenticated, assignTestToStudents);
router.put("/updateOnetest-teacher", isTeacherAuthenticated, updateOneTest);
router.get("/getuniquedepts", isTeacherAuthenticated, getUniqueDepartments);
router.get("/getuniquebatch", isTeacherAuthenticated, getUniqueBatches);
router.get("/getuniquesections", isTeacherAuthenticated, getUniqueSections);
router.post("/deassign-test", isTeacherAuthenticated, deassignTestFromStudents);
router.get(
  "/getTeacherDashboardData",
  isTeacherAuthenticated,
  getTeacherDashboardData
);
router.get("/get-report-by-test_id", isTeacherAuthenticated, getTestReports);

module.exports = router;
