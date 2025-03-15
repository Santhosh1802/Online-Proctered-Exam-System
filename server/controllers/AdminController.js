const bcrypt = require("bcrypt");
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
    if (name==="" || email==="" || phone==="" || !name || !email || !phone) {
      response.error = "missing details";
      return res.status(200).send(response);
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
    const teachers = await Teacher.find();
    if (!teachers || teachers.length === 0) {
      response.message = "No data found";
      return res.status(200).json(response);
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
    const students = await Student.find();
    if (!students || students.length === 0) {
      response.message = "No data found";
      return res.status(200).json(response);
    }
    response.data = students;
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    response.error = error.message;
    return res.status(500).json(response);
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
    if (!teacher || teacher == null) {
      response.message = "No data found";
      return res.status(200).json(response);
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
    if (!student || student == null) {
      response.message = "No data found";
      return res.status(200).json(response);
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
    const loginTeacher = await Login.findOneAndDelete({
      email_id: req.query.email,
    });
    if (!loginTeacher || loginTeacher == null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    const teacher = await Teacher.findOneAndDelete({ email: req.query.email });
    if (!teacher || teacher == null) {
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
    const loginStudent = await Login.findOneAndDelete({
      email_id: req.query.email,
    });
    if (!loginStudent || loginStudent == null) {
      response.message = "No data found";
      return res.status(404).json(response);
    }
    const student = await Student.findOneAndDelete({ email: req.query.email });
    if (!student || student == null) {
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
    const { name, email, phone, department, profile, password } = req.body;

    if (name==="" || email==="" || phone==="" || department==="" || password==="") {
      response.error = "Missing details";
      return res.status(400).json(response);
    }

    
    const existingUser = await Login.findOne({ email_id: email });
    if (existingUser) {
      response.error = "Teacher Email already exists";
      return res.status(200).json(response);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const login = new Login({
      email_id: email,
      password: hashedPassword,
      user_name: name,
      role: "teacher",
    });
    await login.save();

    const teacher = new Teacher({
      name,
      email,
      phone,
      department,
      profile,
    });
    await teacher.save();

    response.message = "Teacher created successfully";
    return res.status(201).json(response);
  } catch (error) {
    if (error.code === 11000) {
      response.error = "Teacher Email already exists";
      return res.status(200).json(response);
    }

    response.error = error.message;
    console.error("Error creating teacher:", error);
    return res.status(500).json(response);
  }
};


const createStudent = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };

  try {
    const {
      name,
      email,
      phone,
      department,
      profile,
      registerNumber,
      batch,
      section,
      password,
    } = req.body;

    if (!name || !email || !phone || !department || !registerNumber || !batch || !section || !password) {
      response.error = "Missing details";
      return res.status(400).json(response);
    }

    const existingUser = await Login.findOne({ email_id: email });
    if (existingUser) {
      response.error = "Student Email already exists";
      return res.status(200).json(response);
    }

    const existingStudent = await Student.findOne({ registerNumber });
    if (existingStudent) {
      response.error = "Student Register number already exists";
      return res.status(200).json(response);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

   
    const login = new Login({
      email_id: email,
      password: hashedPassword,
      user_name: name,
      role: "student",
    });
    await login.save();

  
    const student = new Student({
      name,
      email,
      phone,
      department,
      profile,
      registerNumber,
      batch,
      section,
    });
    await student.save();

    response.message = "Student created successfully";
    return res.status(201).json(response);
  } catch (error) {
    
    if (error.code === 11000) {
      response.error = "Student already exists";
      return res.status(200).json(response);
    }

    
    response.error = error.message;
    console.error("Error creating student:", error);
    return res.status(500).json(response);
  }
};


const BulkUploadStudents = async (req, res) => {
  const response = {
    message: "",
    error: [],
    data: {},
  };

  try {
    const students = req.body.students;
    if (!students || students.length === 0) {
      return res.status(400).json({ error: "No data found in the request." });
    }

    let validationErrors = [];

    // Validate input data
    students.forEach((student, index) => {
      const row = index + 2;

      if (!student.name || typeof student.name !== "string") {
        validationErrors.push(
          `Row ${row}, Column 'name': Invalid or missing value`
        );
      }
      if (!student.email || !/^\S+@\S+\.\S+$/.test(student.email)) {
        validationErrors.push(
          `Row ${row}, Column 'email': Invalid email format`
        );
      }
      if (!student.phone || !/^\d{10}$/.test(student.phone)) {
        validationErrors.push(
          `Row ${row}, Column 'phone': Must be a 10-digit number`
        );
      }
      if (!student.department || typeof student.department !== "string") {
        validationErrors.push(
          `Row ${row}, Column 'department': Invalid or missing value`
        );
      }
      if (!student.registerNumber || typeof student.registerNumber !== "string") {
        validationErrors.push(
          `Row ${row}, Column 'registerNumber': Invalid or missing value`
        );
      }
      if (!student.batch) {
        validationErrors.push(
          `Row ${row}, Column 'batch': Invalid or missing value`
        );
      }
      if (!student.section || typeof student.section !== "string") {
        validationErrors.push(
          `Row ${row}, Column 'section': Invalid or missing value`
        );
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: validationErrors });
    }

    // Check for duplicate emails and register numbers before inserting
    const emails = students.map((s) => s.email);
    const registerNumbers = students.map((s) => s.registerNumber);

    const existingStudents = await Student.find({
      $or: [{ email: { $in: emails } }, { registerNumber: { $in: registerNumbers } }],
    });

    if (existingStudents.length > 0) {
      const duplicateErrors = existingStudents.map((s) => {
        return `Duplicate entry: Email '${s.email}' or Register Number '${s.registerNumber}' already exists.`;
      });
      return res.status(400).json({ error: duplicateErrors });
    }

    // Hash default password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("Student@123", saltRounds);

    // Prepare documents
    const studentDocs = students.map((student) => ({
      ...student,
    }));

    const loginDocs = students.map((student) => ({
      user_name: student.name,
      email_id: student.email,
      password: hashedPassword,
      role: "student",
    }));

    // Insert documents
    await Promise.all([
      Student.insertMany(studentDocs),
      Login.insertMany(loginDocs),
    ]);

    response.message = "Students and login records created successfully";
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);

    // Handle MongoDB duplicate key error (E11000)
    if (error.code === 11000) {
      let duplicateKey = Object.keys(error.keyValue)[0];
      let duplicateValue = error.keyValue[duplicateKey];
      return res.status(400).json({
        error: `Duplicate key error: ${duplicateKey} '${duplicateValue}' already exists.`,
      });
    }

    return res.status(500).json({ error: error.message });
  }
};


const getStats = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const totalTeachers = await Teacher.countDocuments();
    const totalStudents = await Student.countDocuments();
    const activeUsers = await Login.countDocuments();
    const ongoingQuizzesAggregation = await Student.aggregate([
      { $unwind: "$ongoingTests" },
      { $group: { _id: "$ongoingTests.testId" } },
      { $count: "uniqueOngoingQuizzes" },
    ]);

    const ongoingQuizzes =
      ongoingQuizzesAggregation.length > 0
        ? ongoingQuizzesAggregation[0].uniqueOngoingQuizzes
        : 0;
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
};

const getAllTestsForAdmin = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: [],
  };

  try {
    const tests = await Test.find();

    response.message = "All tests retrieved successfully";
    response.data = tests;
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while fetching tests";
    return res.status(500).send(response);
  }
};

const getLoginTrends = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const loginTrends = await Login.aggregate([
      {
        $match: {
          last_login: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$last_login" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dayMapping = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    const formattedTrends = loginTrends.map((entry) => ({
      day: dayMapping[entry._id],
      count: entry.count,
    }));

    res.status(200).json({
      message: "Login trends retrieved successfully",
      data: formattedTrends,
    });
  } catch (error) {
    console.error("Error fetching login trends:", error);
    res.status(500).json({
      error: "An error occurred while retrieving login trends",
    });
  }
};

const getTestReports = async (req, res) => {
  try {
    const { test_id } = req.query;

    console.log("Fetching reports for test ID:", test_id);

    const reports = await Report.find({ test_id }).populate(
      "student_id",
      "name department section batch"
    );

    if (!reports.length) {
      return res
        .status(404)
        .json({ message: "No reports found for this test." });
    }

    console.log("Reports fetched successfully:", reports);

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching test reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
  getStats,
  getAllTestsForAdmin,
  getLoginTrends,
  getTestReports,
};
