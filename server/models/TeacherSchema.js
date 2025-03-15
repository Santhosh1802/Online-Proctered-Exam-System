const mongoose = require("mongoose");
const data = require("../utils/profileString");
const TeacherSchema = new mongoose.Schema({
  profile: {
    type: String,
    default: data.profileString,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
    match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
    unique: [true, "Mobile number must be unique"],
  },
  department: {
    type: String,
    require: true,
  },
  tests: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
  },
});

const Teacher = mongoose.model("Teacher", TeacherSchema);
module.exports = Teacher;
