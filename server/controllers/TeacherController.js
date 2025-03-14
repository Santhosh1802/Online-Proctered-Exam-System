const Teacher = require("../models/TeacherSchema");
const Test = require("../models/TestSchema");
const Student = require("../models/StudentSchema");
const Report = require("../models/ReportSchema");
const nodemailer = require("nodemailer");
const getTecherProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  const email = req.query.email;
  if (!email) {
    console.log("No Email");
  }
  const teacher = await Teacher.findOne({ email: email });
  if (teacher) {
    response.message = "Teacher Found";
    response.data.id = teacher._id;
    response.data.profile = teacher.profile;
    response.data.name = teacher.name;
    response.data.phone = teacher.phone;
    response.data.email = teacher.email;
    response.data.department = teacher.department;
    return res.status(200).send(response);
  } else {
    response.error = "Teacher not found";
    return res.status(404).send(response);
  }
};

const updateTeacherProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    const { name, email, phone, department, profile } = req.body;
    const teacher = await Teacher.findOneAndUpdate(
      { email: email },
      {
        name: name,
        email: email,
        phone: phone,
        department: department,
        profile: profile,
      },
      { new: true, upsert: true, runValidators: true }
    );
    response.message = teacher
      ? "Teacher updated successfully"
      : "Teacher profile created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while updating profile";
    return res.status(404).send(response);
  }
};

const createTest = async (req, res) => {
  try {
    const {
      email,
      testname,
      description,
      start_date,
      end_date,
      duration,
      status,
      proctor_settings,
      questions, // Must include marks & negativeMarks
    } = req.body;

    // Find teacher by email
    const teacher = await Teacher.findOne({ email: email });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Validate each question to ensure marks and negativeMarks are present
    const validatedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      type: q.type,
      options: q.options || [],
      correctAnswers: q.correctAnswers,
      marks: q.marks, // Ensure marks are included
      negativeMarks: q.negativeMarks ?? 0, // Default to 0 if not provided
    }));

    // Create new test
    const newTest = new Test({
      testname,
      description,
      teacher_id: teacher._id,
      start_date,
      end_date,
      duration: parseInt(duration, 10),
      status: status || "pending",
      proctor_settings,
      questions: validatedQuestions, // Include questions with marks & negativeMarks
    });

    // Save test to DB
    const savedTest = await newTest.save();

    // Add test reference to teacher
    teacher.tests.push(savedTest._id);
    await teacher.save();

    return res
      .status(201)
      .json({ message: "Test created successfully", test: savedTest });
  } catch (error) {
    console.error("Error creating test:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllTest = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: [],
  };
  try {
    const { teacher_id } = req.query;
    const tests = await Test.find({ teacher_id: teacher_id });
    response.message = "Tests Found";
    response.data = tests;
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while fetching tests";
    return res.status(500).send(response);
  }
};

const getOneTest = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  try {
    const { id } = req.query;
    const test = await Test.findOne({ _id: id });
    response.message = "Tests Found";
    response.data = test;
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while fetching tests";
    return res.status(500).send(response);
  }
};

const assignTestToStudents = async (req, res) => {
  try {
    const { department, batch, section, testId } = req.body;

    if (!department || !batch || !section || !testId) {
      return res.status(400).json({
        error: "Missing required parameters: department, batch, section, or testId",
      });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const students = await Student.find({ department, batch, section });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for the given filters" });
    }

    // ✅ Create transporter only once
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PASS,
      },
    });

    // ✅ Process students one by one using `for...of`
    for (const student of students) {
      const alreadyAssigned = student.ongoingTests.some(
        (ongoingTest) => ongoingTest.testId.toString() === testId
      );

      const alreadyCompleted = student.completedTests.some(
        (completedTest) => completedTest.testId.toString() === testId
      );

      if (!alreadyAssigned && !alreadyCompleted) {
        student.ongoingTests.push({
          testId,
          startedAt: new Date(),
          startDate: test.start_date,
          endDate: test.end_date,
          duration: test.duration,
        });
        await student.save(); // ✅ Wait for DB update before sending email

        const mailOptions = {
          from: process.env.GMAIL_USER,
          to: student.email,
          subject: `📢 New Test Assigned: ${test.testname}`,
          html: `
            <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
              <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
                <h2>📢 New Test Assigned</h2>
              </div>
              <div style="padding: 20px; background-color: white;">
                <p style="font-size: 18px;">Hello <strong>${student.name}</strong>,</p>
                <p style="color: #333;">You have been assigned a new test. Please review the details below:</p>
        
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr>
                    <td style="padding: 10px; font-weight: bold; background-color: #f2f2f2;">📌 Test Title:</td>
                    <td style="padding: 10px;">${test.testname}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; background-color: #f2f2f2;">📅 Start Date:</td>
                    <td style="padding: 10px;">${test.start_date}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; background-color: #f2f2f2;">⏳ Duration:</td>
                    <td style="padding: 10px;">${test.duration} minutes</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; font-weight: bold; background-color: #f2f2f2;">🕒 End Date:</td>
                    <td style="padding: 10px;">${test.end_date}</td>
                  </tr>
                </table>
        
                <p style="margin-top: 20px; text-align: center;">
                  <a href="${process.env.FRONTEND_URL}/login" target="_blank"
                    style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                    Take Test Now
                  </a>
                </p>
        
                <p style="color: #555; margin-top: 20px; text-align: center;">
                  If you have any questions, feel free to contact your instructor.
                </p>
              </div>
              <div style="background-color: #007bff; color: white; padding: 10px; text-align: center; border-radius: 0 0 10px 10px;">
                <p style="margin: 0;">Best Regards, <br> Your Exam Team</p>
              </div>
            </div>
          `,
        };

        // ✅ Send email only after student data is updated
        await transporter.sendMail(mailOptions);
      }
    }

    return res.status(200).json({ message: "Test assigned and emails sent successfully." });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


const deassignTestFromStudents = async (req, res) => {
  try {
    const { department, batch, section, testId } = req.body;

    if (!department || !batch || !section || !testId) {
      return res.status(400).json({
        error:
          "Missing required parameters: department, batch, section, or testId",
      });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    const students = await Student.find({ department, batch, section });

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for the given filters" });
    }

    const updates = students.map(async (student) => {
      student.ongoingTests = student.ongoingTests.filter(
        (ongoingTest) => ongoingTest.testId.toString() !== testId
      );
      await student.save();
    });

    await Promise.all(updates);

    return res
      .status(200)
      .json({ message: "Test deassigned successfully from students." });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const updateOneTest = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    const { id } = req.query;
    const {
      testname,
      description,
      start_date,
      end_date,
      duration,
      status,
      proctor_settings,
      questions,
    } = req.body;
    console.log(id);

    if (!id) {
      return res.status(400).json({ error: "Missing required parameter: id" });
    }

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      {
        testname,
        description,
        start_date,
        end_date,
        duration: parseInt(duration, 10),
        status,
        proctor_settings,
        questions,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ error: "Test not found" });
    }

    response.message = "Test updated successfully";
    response.data = updatedTest;
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while updating the test";
    return res.status(500).send(response);
  }
};

const getUniqueDepartments = async (req, res) => {
  try {
    const departments = await Student.distinct("department");
    return res.status(200).json({ departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getUniqueBatches = async (req, res) => {
  try {
    const { department } = req.query;
    const batches = await Student.distinct("batch", { department });
    return res.status(200).json({ batches });
  } catch (error) {
    console.error("Error fetching batches:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getUniqueSections = async (req, res) => {
  try {
    const { department, batch } = req.query;
    const sections = await Student.distinct("section", { department, batch });
    return res.status(200).json({ sections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getTeacherDashboardData = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const testCount = await Test.countDocuments({ teacher_id: teacher._id });
    const tests = await Test.find({ teacher_id: teacher._id });
    const studentCount = await Student.countDocuments({
      "ongoingTests.testId": { $in: tests.map((test) => test._id) },
    });
    const completedTestCount = await Student.countDocuments({
      "completedTests.testId": { $in: tests.map((test) => test._id) },
    });

    return res.status(200).json({
      message: "Teacher data fetched successfully",
      data: {
        name: teacher.name,
        email: teacher.email,
        testCount,
        studentCount,
        completedTestCount,
      },
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard data:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get reports for a test by test_id
const getTestReports = async (req, res) => {
  try {
    const { test_id } = req.query;

    console.log("Fetching reports for test ID:", test_id);

    // Fetch reports with student details populated
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
  getTecherProfile,
  updateTeacherProfile,
  createTest,
  getAllTest,
  getOneTest,
  assignTestToStudents,
  deassignTestFromStudents,
  updateOneTest,
  getUniqueDepartments,
  getUniqueBatches,
  getUniqueSections,
  getTeacherDashboardData,
  getTestReports,
};
