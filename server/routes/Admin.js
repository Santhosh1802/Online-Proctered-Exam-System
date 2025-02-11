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
} = require("../controllers/AdminController");

router.get("/adminprofile", getAdminProfile);
router.post("/adminupdateprofile", updateAdminProfile);
router.get("/getallteacher", getAllTeacher);
router.get("/getallstudent", getAllStudent);
router.get("/getstudent", getOneStudent);
router.get("/getteacher", getOneTeacher);
router.delete("/deletestudent", deleteStudent);
router.delete("/deleteteacher", deleteTeacher);
module.exports = router;
