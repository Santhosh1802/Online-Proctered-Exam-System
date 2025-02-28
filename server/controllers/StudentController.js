const Student = require("../models/StudentSchema");
const Test=require("../models/TestSchema");

const getStudentProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  const email = req.query.email;
  if (!email) {
    console.log("No Email");
    response.error="No Email";
    return res.status(400).send(response);
  }
  const student = await Student.findOne({ email: email });
  if (student) {
    response.message = "Student Found";
    response.data.id=student._id;
    response.data.profile = student.profile;
    response.data.name = student.name;
    response.data.phone = student.phone;
    response.data.email = student.email;
    response.data.department = student.department;
    response.data.registerNumber=student.registerNumber;
    response.data.batch=student.batch;
    response.data.section=student.section;
    return res.status(200).send(response);
  } else {
    response.error = "Fill Details to continue";
    return res.status(400).send(response);
  }
};

const updateStudentProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    const { profile, name, email, phone, department,registerNumber,batch,section } = req.body;
    const student = await Student.findOneAndUpdate(
      { email: email },
      {
        profile: profile,
        name: name,
        email: email,
        phone: phone,
        department: department,
        registerNumber:registerNumber,
        batch:batch,
        section:section,
      },
      { new: true, upsert: true, runValidators: true }
    );
    response.message = student
      ? "Student updated successfully"
      : "Student profile created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while updating profile";
    return res.status(500).send(response);
  }
};


const getStudentTests = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };

  try {
    const { studentId } = req.query; 
    console.log(req.query);
    
    if (!studentId) {
      response.error = "Student ID is required";
      return res.status(400).json(response);
    }

    const student = await Student.findById(studentId).select("ongoingTests completedTests");

    if (!student) {
      response.error = "Student not found";
      return res.status(404).json(response);
    }

    const ongoingTests = await Promise.all(
      student.ongoingTests.map(async (test) => {
        const testDetails = await Test.findById(test.testId).select("testname description duration");
        return {
          testId: test.testId,
          testname: testDetails?.testname || "Unknown",
          description: testDetails?.description || "No description",
          duration: testDetails?.duration || 0,
          startedAt: test.startedAt, 
        };
      })
    );

    const completedTests = await Promise.all(
      student.completedTests.map(async (test) => {
        const testDetails = await Test.findById(test.testId).select("testname description duration");
        return {
          testId: test.testId,
          testname: testDetails?.testname || "Unknown",
          description: testDetails?.description || "No description",
          duration: testDetails?.duration || 0,
          completedAt: test.completedAt,
          score: test.score, 
        };
      })
    );

    response.message = "Student tests fetched successfully";
    response.data = {
      ongoingTests,
      completedTests,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching student tests:", error.message);
    response.error = error.message;
    return res.status(500).json(response);
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


const submitTest = async (req, res) => {
  try {
    const { test_id, student_id, answers, proctor_scores, test_duration } = req.body;

    // Fetch test data
    const test = await Test.findById(test_id);
    if (!test) return res.status(404).json({ message: "Test not found" });

    let totalMarks = 0;
    let studentScore = 0;

    // Process each question
    test.questions.forEach((question) => {
      const studentAnswer = answers[question._id.toString()];
      const correctAnswers = question.correctAnswers;

      if (studentAnswer) {
        // Check based on question type
        const isCorrect =
          (question.type === "choose-multiple" && Array.isArray(studentAnswer)
            ? arraysEqualIgnoreOrder(studentAnswer, correctAnswers)
            : studentAnswer.toString().trim() === correctAnswers[0]);

        if (isCorrect) {
          studentScore += question.marks;
        } else {
          studentScore -= question.negativeMarks;
        }
      }

      totalMarks += question.marks;
    });

    // Ensure score isn't negative
    studentScore = Math.max(0, studentScore);

    // Calculate final score considering proctoring
    const proctorPenalty = calculateProctorPenalty(proctor_scores);
    const finalScore = Math.max(0, studentScore - proctorPenalty);

    // Create report
    const report = new Report({
      test_id,
      student_id,
      total_marks: totalMarks,
      obtained_marks: finalScore,
      answers,
      proctor_scores,
      test_duration,
      submitted_at: new Date(),
    });

    await report.save();

    // Link report to test
    test.report.push(report._id);
    await test.save();

    res.status(200).json({
      message: "Test submitted successfully",
      report_id: report._id,
      final_score: finalScore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to compare arrays regardless of order
const arraysEqualIgnoreOrder = (a, b) => {
  if (a.length !== b.length) return false;
  return a.sort().every((val, index) => val === b.sort()[index]);
};

// Calculate proctoring penalty (customize as needed)
const calculateProctorPenalty = (scores) => {
  const { noise_score, face_score, mobile_score, tab_score } = scores;

  // Example: Deduct 1 mark for each proctor violation over a threshold
  let penalty = 0;
  if (noise_score > 5) penalty += 1;
  if (face_score < 70) penalty += 2; // e.g., face not detected enough
  if (mobile_score > 3) penalty += 2;
  if (tab_score > 2) penalty += 2;

  return penalty;
};

module.exports = { submitTest };


module.exports={getStudentProfile,updateStudentProfile,getStudentTests,getOneTest,submitTest};