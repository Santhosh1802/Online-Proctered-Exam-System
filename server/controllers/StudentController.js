const Student = require("../models/StudentSchema");
const Test = require("../models/TestSchema");
const Report = require("../models/ReportSchema");

const getStudentProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  const email = req.query.email;
  if (!email) {
    console.log("No Email");
    response.error = "No Email";
    return res.status(400).send(response);
  }
  const student = await Student.findOne({ email: email });
  if (student) {
    response.message = "Student Found";
    response.data.id = student._id;
    response.data.profile = student.profile;
    response.data.name = student.name;
    response.data.phone = student.phone;
    response.data.email = student.email;
    response.data.department = student.department;
    response.data.registerNumber = student.registerNumber;
    response.data.batch = student.batch;
    response.data.section = student.section;
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
    const {
      profile,
      name,
      email,
      phone,
      department,
      registerNumber,
      batch,
      section,
    } = req.body;
    const student = await Student.findOneAndUpdate(
      { email: email },
      {
        profile: profile,
        name: name,
        email: email,
        phone: phone,
        department: department,
        registerNumber: registerNumber,
        batch: batch,
        section: section,
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
    if (!studentId) {
      response.error = "Student ID is required";
      return res.status(400).json(response);
    }

    const student = await Student.findById(studentId).select(
      "ongoingTests completedTests"
    );

    if (!student) {
      response.error = "Student not found";
      return res.status(404).json(response);
    }

    const ongoingTests = await Promise.all(
      student.ongoingTests.map(async (test) => {
        const testDetails = await Test.findById(test.testId).select(
          "testname description duration start_date end_date"
        );
        console.log(testDetails);

        return {
          testId: test.testId,
          testname: testDetails?.testname || "Unknown",
          description: testDetails?.description || "No description",
          duration: testDetails?.duration || 0,
          start_date: testDetails.start_date,
          end_date: testDetails.end_date,
        };
      })
    );

    const completedTests = await Promise.all(
      student.completedTests.map(async (test) => {
        const testDetails = await Test.findById(test.testId).select(
          "testname description duration"
        );
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
    const { testId, student_id, answers, proctor_scores, test_duration } =
      req.body;
    console.log("Received request body:", req.body);

    const test = await Test.findById(testId);
    if (!test) {
      console.log("Test not found:", testId);
      return res.status(404).json({ message: "Test not found" });
    }

    console.log("Fetched test:", test.testname);

    let totalMarks = 0;
    let studentScore = 0;

    test.questions.forEach((question) => {
      const questionId = question._id.toString();
      const studentAnswer = answers[questionId];
      const correctAnswers = question.correctAnswers.map((ans) =>
        ans.toLowerCase().trim()
      );

      console.log(`\nProcessing Question: ${question.questionText}`);
      console.log("Question ID:", questionId);
      console.log("Expected Correct Answers:", correctAnswers);
      console.log("Student Answer:", studentAnswer);

      if (studentAnswer) {
        const answerString = studentAnswer.toString().trim().toLowerCase();
        let isCorrect = false;

        if (question.type === "choose-multiple") {
          const studentAnswersArray = answerString
            .split(",")
            .map((ans) => ans.trim().toLowerCase());
          console.log(
            "Processed Student Answers (array):",
            studentAnswersArray
          );

          isCorrect = arraysEqualIgnoreOrder(
            studentAnswersArray,
            correctAnswers
          );
        } else {
          isCorrect = correctAnswers.includes(answerString);
        }

        console.log("Is Answer Correct:", isCorrect);

        if (isCorrect) {
          studentScore += question.marks;
          console.log(`Correct! Added ${question.marks} points.`);
        } else {
          studentScore -= question.negativeMarks;
          console.log(`Incorrect! Deducted ${question.negativeMarks} points.`);
        }
      }

      totalMarks += question.marks;
    });

    studentScore = Math.max(0, studentScore);
    console.log("Total Score Before Proctoring:", studentScore);

    const proctorPenalty = calculateProctorPenalty(proctor_scores);
    console.log("Proctoring Penalty:", proctorPenalty);

    const finalScore = Math.max(0, studentScore - proctorPenalty);
    console.log("Final Score After Proctoring:", finalScore);

    const report = new Report({
      testname: test.testname,
      test_id: testId,
      student_id,
      answers,
      score: finalScore,
      proctoring_report: proctor_scores,
      duration_taken: formatDuration(test_duration),
      submitted_at: new Date(),
      flags: proctor_scores.flags,
    });

    await report.save();
    console.log("Report saved with ID:", report._id);

    if (!test.report) {
      test.report = [];
    }
    test.report.push(report._id);
    await test.save();
    console.log("Report linked to test.");

    const student = await Student.findById(student_id);
    if (!student.completedTests) {
      student.completedTests = [];
    }
    student.completedTests.push({
      testId,
      completedAt: new Date(),
      score: finalScore,
      start_date: test.start_date,
      end_date: test.end_date,
      duration_taken: formatDuration(test_duration),
    });

    student.ongoingTests = student.ongoingTests.filter(
      (test) => test.testId.toString() !== testId
    );

    await student.save();
    console.log("Student record updated successfully.");

    res.status(200).json({
      message: "Test submitted successfully",
      report_id: report._id,
      final_score: finalScore,
    });
  } catch (err) {
    console.error("Error in submitTest:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const arraysEqualIgnoreOrder = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.sort().join(",") === arr2.sort().join(",");
};

const calculateProctorPenalty = (scores) => {
  const { noise_score, face_score, mobile_score, tab_score } = scores;

  let penalty = 0;
  if (noise_score > 5) penalty += 1;
  if (face_score > 5) penalty += 2;
  if (mobile_score > 3) penalty += 2;
  if (tab_score > 2) penalty += 2;

  return penalty;
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const getStudentReports = async (req, res) => {
  try {
    const { student_id } = req.query;

    console.log("Fetching reports for student ID:", student_id);

    const reports = await Report.find({ student_id });

    if (!reports.length) {
      return res
        .status(200)
        .json({ message: "No reports found for this student." });
    }

    console.log("Reports fetched successfully:", reports);

    res.status(200).json({ reports });
  } catch (error) {
    console.error("Error fetching student reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
  getStudentTests,
  getOneTest,
  submitTest,
  getStudentReports,
};
