const express = require("express");
const router = express.Router();
const {
  getAdminProfile,
  updateAdminProfile,
  getAllTeacher,
  getAllStudent,
  getOneStudent,
  getOneTeacher,
  deleteStudent,
  deleteTeacher,
  createTeacher,
  createStudent,
  BulkUploadStudents,
  getStats,
  getAllTestsForAdmin
} = require("../controllers/AdminController");

router.get("/adminprofile", getAdminProfile);
router.post("/adminupdateprofile", updateAdminProfile);
router.get("/getallteacher", getAllTeacher);
router.get("/getallstudent", getAllStudent);
router.get("/getstudent", getOneStudent);
router.get("/getteacher", getOneTeacher);
router.delete("/deletestudent", deleteStudent);
router.delete("/deleteteacher", deleteTeacher);
router.post("/createteacher", createTeacher);
router.post("/createstudent", createStudent);
router.post("/bulkuploadstudents", BulkUploadStudents);
router.get("/getstats", getStats);
router.get("/getalltestadmin",getAllTestsForAdmin);
module.exports = router;
