const Teacher = require("../models/TeacherSchema");
const Test = require("../models/TestSchema");

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
    response.data.profile = teacher.profile;
    response.data.name = teacher.name;
    response.data.phone = teacher.phone;
    response.data.email = teacher.email;
    response.data.department = teacher.department;
    return res.status(200).send(response);
  } else {
    response.error = "Fill Details to continue";
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
  const response={
    message:"",
    error:"",
  }
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
      questions,
    } = req.body;
    const teacher = await Teacher.findOne({ email: email });
    if(!teacher){
      response.message="Teacher not found";
      return res.status(200).send({message:"Teacher not found"});
    }
    const newTest = new Test({
      testname,
      description,
      teacher_id: teacher._id,
      start_date,
      end_date,
      duration,
      proctor_settings,
      questions,
  });
  const savedTest = await newTest.save();
  teacher.tests.push(savedTest._id);
  await teacher.save();
  response.message="Test created successfully";
  return res.status(201).json({ response, test: savedTest });
  } catch (error) {
    console.error("Error creating test:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { getTecherProfile, updateTeacherProfile,createTest };
