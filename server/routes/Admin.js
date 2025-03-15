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
  getAllTestsForAdmin,
  getLoginTrends,
  getTestReports,
} = require("../controllers/AdminController");
const { isAdminAuthenticated } = require("../middlewares/authentication");

router.get("/adminprofile", isAdminAuthenticated, getAdminProfile);
router.post("/adminupdateprofile", isAdminAuthenticated, updateAdminProfile);
router.get("/getallteacher", isAdminAuthenticated, getAllTeacher);
router.get("/getallstudent", isAdminAuthenticated, getAllStudent);
router.get("/getstudent", isAdminAuthenticated, getOneStudent);
router.get("/getteacher", isAdminAuthenticated, getOneTeacher);
router.delete("/deletestudent", isAdminAuthenticated, deleteStudent);
router.delete("/deleteteacher", isAdminAuthenticated, deleteTeacher);
router.post("/createteacher", isAdminAuthenticated, createTeacher);
router.post("/createstudent", isAdminAuthenticated, createStudent);
router.post("/bulkuploadstudents", isAdminAuthenticated, BulkUploadStudents);
router.get("/getstats", isAdminAuthenticated, getStats);
router.get("/getalltestadmin", isAdminAuthenticated, getAllTestsForAdmin);
router.get("/getlogintrends", isAdminAuthenticated, getLoginTrends);
router.get("/get-test-by-test-id-admin",isAdminAuthenticated,getTestReports);
module.exports = router;
