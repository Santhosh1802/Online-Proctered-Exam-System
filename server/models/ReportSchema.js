const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  testname: {
    type: String,
    required: true,
  },
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  proctoring_report: {
    noise_score: { type: Number, default: 0 },
    face_score: { type: Number, default: 0 },
    mobile_score: { type: Number, default: 0 },
    tab_score: { type: Number, default: 0 },
  },
  duration_taken: {
    type: String,
    required: true,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
  flags: {
    type: [String],
    default: [],
  },
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
