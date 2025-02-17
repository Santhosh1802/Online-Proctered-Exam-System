const Login = require("../models/LoginSchema");
const Admin = require("../models/AdminSchema");
const Student = require("../models/StudentSchema");
const Teacher = require("../models/TeacherSchema");
const Test = require("../models/TestSchema");
const getAdminProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  const email = req.query.email;
  if (!email) {
    console.log("No Email");
  }
  try {
    const admin = await Admin.findOne({ email: email });
    if (admin) {
      response.message = "Admin Found";
      response.data.profile = admin.profile;
      response.data.name = admin.name;
      response.data.phone = admin.phone;
      response.data.email = admin.email;
      console.log(req.cookies.token);

      return res.status(200).send(response);
    } else {
      response.error = "Fill Details to continue";
      return res.status(400).send(response);
    }
  } catch (error) {
    response.error = error.message;
    return res.status(500).send(response);
  }
};

const updateAdminProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    const { name, email, phone, profile } = req.body;
    if (!req.body) {
      response.error = "missing details";
      return res.status(400).send(response);
    }
    const admin = await Admin.findOneAndUpdate(
      { email: email },
      { name: name, email: email, phone: phone, profile: profile },
      { new: true, upsert: true, runValidators: true }
    );
    response.message = admin
      ? "Admin updated successfully"
      : "Admin profile created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while updating profile";
    return res.status(500).send(response);
  }
};

const getAllTeacher = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const teachers = await Login.find({ role: "teacher" });
    if (!teachers || teachers==null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    response.data = teachers;
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    response.error = error.message;
    return res.status(500).json(response);
  }
};

const getAllStudent = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const students = await Login.find({ role: "student" });
    if (!students || students==null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    response.data = students;
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    response.error = error.message;
    return  res.status(500).json(response);
  }
};

const getOneTeacher = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  
  try {
    const teacher = await Teacher.findOne({ email: req.query.email });
    if (!teacher || teacher==null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    response.data = teacher;
    response.message = "Teacher found";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
};

const getOneStudent = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const student = await Student.findOne({ email: req.query.email });
    if (!student || student==null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    response.data = student;
    response.message = "Student found";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
};

const deleteTeacher = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const loginTeacher=await Login.findOneAndDelete({email_id:req.query.email});
    if(!loginTeacher || loginTeacher==null){
      response.message="No data found";
      return res.status(404).json(response);
    }
    const teacher = await Teacher.findOneAndDelete({ email: req.query.email });
    if (!teacher || teacher==null) {
      response.message = "No data found";
      response.error = "Teacher only found in login";
      return res.status(200).json(response);
    }
    response.message = "Teacher deleted";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
};

const deleteStudent = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const loginStudent=await Login.findOneAndDelete({email_id:req.query.email});
    if(!loginStudent || loginStudent==null){
      response.message="No data found";
      return res.status(404).json(response);
    }
    const student = await Student.findOneAndDelete({ email: req.query.email });
    if (!student || student==null) {
      response.message = "No data found";
      response.error = "Student only found in login";
      return res.status(200).json(response);
    }
    response.message = "Student deleted";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
};
const createTeacher = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const { name, email, phone, department, profile } = req.body;
    const teacher = new Teacher({
      name: name,
      email: email,
      phone: phone,
      department: department,
      profile: profile,
    });
    await teacher.save();
    response.message = "Teacher created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
};
const createStudent = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const { name, email, phone, department, profile } = req.body;
    const student = new Student({
      name: name,
      email: email,
      phone: phone,
      department: department,
      profile: profile,
    });
    await student.save();
    response.message = "Student created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
};

const BulkUploadStudents=async (req,res)=>{
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const students = req.body.students;
    if (!students || students==null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    students.forEach(async (student) => {
      const newStudent = new Student(student);
      await newStudent.save();
    });
    response.message = "Students created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
}

const getStats=async (req,res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const totalTeachers = await Teacher.countDocuments();
    const totalStudents = await Student.countDocuments();
    const activeUsers = await Login.countDocuments();
    const ongoingQuizzes = await Test.countDocuments({ status: "ongoing" });
    response.data.totalTeachers = totalTeachers;
    response.data.totalStudents = totalStudents;
    response.data.activeUsers = activeUsers;
    response.data.ongoingQuizzes = ongoingQuizzes;
    response.message = "Data found";
    return res.status(200).send(response);
  } catch (error) {
    response.error = error.message;
    console.log(error.message);
    return res.status(500).send(response);
  }
}
module.exports = {
  getAdminProfile,
  updateAdminProfile,
  getAllTeacher,
  getAllStudent,
  getOneTeacher,
  getOneStudent,
  deleteTeacher,
  deleteStudent,
  createTeacher,
  createStudent,
  BulkUploadStudents,
  getStats
};
