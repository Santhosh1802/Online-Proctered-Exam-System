const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["fill-in-the-blanks", "choose-one", "choose-multiple", "true-false"],
    required: true,
  },
  options: {
    type: [String],
    default: [],
  },
  correctAnswers: {
    type: [String],
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  negativeMarks: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
});

const TestSchema = new mongoose.Schema({
  testname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  proctor_settings: {
    type: [String],
    default: [],
  },
  questions: {
    type: [QuestionSchema],
    required: true,
  },
  report: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Report",
    default: [],
  },
});

const Test = mongoose.model("Test", TestSchema);
module.exports = Test;
