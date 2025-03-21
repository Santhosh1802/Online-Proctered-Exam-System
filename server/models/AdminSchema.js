const mongoose = require("mongoose");
const data = require("../utils/profileString");
const AdminSchema = new mongoose.Schema({
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
    unique: [true, "Email id already exists"],
  },
  phone: {
    type: Number,
    require: true,
    unique: [true, "Mobile number must be unique"],
    match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
  },
});
const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
