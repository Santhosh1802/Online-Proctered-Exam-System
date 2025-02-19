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





module.exports={getStudentProfile,updateStudentProfile,getStudentTests};