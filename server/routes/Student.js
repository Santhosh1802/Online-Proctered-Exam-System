const express = require("express");
const {
  getStudentProfile,
  updateStudentProfile,
  getStudentTests,
  getOneTest,
  submitTest,
  getStudentReports,
} = require("../controllers/StudentController");
const { isStudentAuthenticated } = require("../middlewares/authentication");
const router = express.Router();

router.get("/studentprofile", isStudentAuthenticated, getStudentProfile);
router.post(
  "/updatestudentprofile",
  isStudentAuthenticated,
  updateStudentProfile
);
router.get("/get-test-student", isStudentAuthenticated, getStudentTests);
router.get("/getOne-test-student", isStudentAuthenticated, getOneTest);
router.post("/submit-test", isStudentAuthenticated, submitTest);
router.get("/get-report-student", isStudentAuthenticated, getStudentReports);

module.exports = router;
