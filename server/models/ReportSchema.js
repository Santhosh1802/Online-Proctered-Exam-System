const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
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
        type: Map, // Using Map for key-value question_id -> answer
        of: mongoose.Schema.Types.Mixed, // Can handle strings, arrays, booleans
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
        type: String, // e.g., "00:45:23"
        required: true,
    },
    submitted_at: {
        type: Date,
        default: Date.now,
    },
    flags: {
        type: [String], // e.g., ["High noise", "Multiple faces detected"]
        default: [],
    },
});

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
