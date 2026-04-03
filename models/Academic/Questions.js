const mongoose = require("mongoose");

// Question Schema
const questionSchema = new mongoose.Schema(
  {
    // Question Details
    question: {
      type: String,
      required: [true, "Question is required."],
      trim: true,
    },
    optionA: {
      type: String,
      required: [true, "Option A is required."],
      trim: true,
    },
    optionB: {
      type: String,
      required: [true, "Option B is required."],
      trim: true,
    },
    optionC: {
      type: String,
      required: [true, "Option C is required."],
      trim: true,
    },
    optionD: {
      type: String,
      required: [true, "Option D is required."],
      trim: true,
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required."],
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },

    // Relationships
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Created by teacher is required."],
    },
  },
  {
    timestamps: true,
  }
);

// Model
const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
