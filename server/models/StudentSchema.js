const mongoose = require("mongoose");
const data=require("../utils/profileString");
const StudentSchema = new mongoose.Schema({
  profile: {
    type: String,
    default:data.profileString,
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
    type: Number,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  registerNumber: {
    type: String,
    required: true,
    unique: true,
  },
  batch: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  ongoingTests: {
    type:[{
      testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
      AssignedOn: { type: Date, default: Date.now },
      start_date: { type: Date },
      end_date: { type: Date },
      duration: { type: Number },
    },
    ],
    default:[],
  },
  completedTests: {
    type:[{
      testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
      completedAt: { type: Date, default: Date.now },
      score: { type: Number },
      start_date: { type: Date },
      end_date: { type: Date },
      duration_taken: { type: String },
    },],
    default:[],
  },
});
const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
