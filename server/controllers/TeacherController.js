const Login = require("../models/LoginSchema");
const Teacher = require("../models/TeacherSchema");

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
    return res.status(200).send(response);
  }
};

const updateTeacherProfile = async (req, res) => {
  const response = {
    message: "",
    error: "",
  };
  try {
    const { name, email, phone, department ,profile} = req.body;
    const teacher = await Teacher.findOneAndUpdate(
      { email: email },
      { name: name, email: email, phone: phone, department: department ,profile:profile},
      { new: true, upsert: true, runValidators: true }
    );
    response.message = teacher
      ? "Teacher updated successfully"
      : "Teacher profile created successfully";
    return res.status(200).send(response);
  } catch (error) {
    response.error = "An error occurred while updating profile";
    return res.status(200).send(response);
  }
};

module.exports={getTecherProfile,updateTeacherProfile};