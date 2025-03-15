const mongoose = require("mongoose");
const LoginSchema = new mongoose.Schema({
  user_name: { type: String, require: true },
  email_id: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
    default: "student",
  },
  last_login: { type: Date, default: null },
});

const Login = mongoose.model("login", LoginSchema);
module.exports = Login;
