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
        type: [String], // Store multiple options for MCQ questions
        default: [],
    },
    correctAnswers: {
        type: [String], // Store correct answers (supports multiple answers for multi-select)
        required: true,
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
        type: Number, // Duration in minutes
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "ongoing", "completed"],
        default: "pending",
    },
    proctor_settings: {
        type: [String], // Example: ["face-detection", "tab-switching", etc.]
        default: [],
    },
    questions: {
        type: [QuestionSchema], // Embed questions inside the test schema
        required: true,
    },
    report: {
        type: [mongoose.Schema.Types.ObjectId], // Store references to report documents
        ref: "Report",
        default: [],
    },
});

const Test = mongoose.model("Test", TestSchema);
module.exports = Test;
