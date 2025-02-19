const Teacher = require("../models/TeacherSchema");
const Test = require("../models/TestSchema");
const Student=require("../models/StudentSchema");

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
    response.data.id=teacher._id;
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
      duration,
      status: status || "pending",
      proctor_settings,
      questions: validatedQuestions, // Include questions with marks & negativeMarks
    });

    // Save test to DB
    const savedTest = await newTest.save();

    // Add test reference to teacher
    teacher.tests.push(savedTest._id);
    await teacher.save();

    return res.status(201).json({ message: "Test created successfully", test: savedTest });

  } catch (error) {
    console.error("Error creating test:", error.message);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getAllTest = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: [],
  };
  try {
    const {teacher_id} = req.query;
    const tests = await Test.find({ teacher_id: teacher_id });
    response.message = "Tests Found";
    response.data = tests;
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while fetching tests";
    return res.status(500).send(response);
  }  
}

const getOneTest=async (req,res) => {
  const response ={
    message:"",
    error:"",
    data:{},
  }
  try {
    const {id}=req.query;
    const test=await Test.findOne({_id:id});
    response.message = "Tests Found";
    response.data = test;
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while fetching tests";
    return res.status(500).send(response);
  }
}

const assignTestToStudents = async (req, res) => {
  try {
    const { department, batch, section, testId } = req.body;

    if (!department || !batch || !section || !testId) {
      return res.status(400).json({
        error: "Missing required parameters: department, batch, section, or testId",
      });
    }

    const students = await Student.find({ department, batch, section });

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found for the given filters" });
    }
    const updates = students.map(async (student) => {
      const alreadyAssigned = student.ongoingTests.some(
        (test) => test.testId.toString() === testId
      );

      if (!alreadyAssigned) {
        student.ongoingTests.push({ testId, startedAt: new Date() });
        await student.save();
      }
    });

    await Promise.all(updates);

    return res.status(200).json({ message: "Test assigned successfully to students." });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};


module.exports = { getTecherProfile, updateTeacherProfile,createTest,getAllTest,getOneTest,assignTestToStudents };
