const Student = require("../models/StudentSchema");

const getStudentProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
    data: {},
  };
  const email = req.query.email;
  if (!email) {
    console.log("No Email");
  }
  const student = await Student.findOne({ email: email });
  if (student) {
    response.message = "Student Found";
    response.data.profile = student.profile;
    response.data.name = student.name;
    response.data.phone = student.phone;
    response.data.email = student.email;
    response.data.department = student.department;
    return res.status(200).send(response);
  } else {
    response.error = "Fill Details to continue";
    return res.status(200).send(response);
  }
};

const updateStudentProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    const { profile, name, email, phone, department } = req.body;
    const student = await Student.findOneAndUpdate(
      { email: email },
      {
        profile: profile,
        name: name,
        email: email,
        phone: phone,
        department: department,
      },
      { new: true, upsert: true, runValidators: true }
    );
    response.message = student
      ? "Student updated successfully"
      : "Student profile created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while updating profile";
    return res.status(200).send(response);
  }
};

module.exports={getStudentProfile,updateStudentProfile};