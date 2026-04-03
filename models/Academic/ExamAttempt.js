const mongoose = require("mongoose");

function legacyLetterToSelectedOption(letter) {
  const L = String(letter || "").toUpperCase();
  const m = { A: "optionA", B: "optionB", C: "optionC", D: "optionD" };
  return m[L] || null;
}

/**
 * One document per (student, exam). Tracks in-progress or completed attempts.
 */
const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    /** @deprecated stored letter A–D — migrated to selectedOption on save */
    selectedOptionId: {
      type: String,
      uppercase: true,
      enum: ["A", "B", "C", "D"],
    },
    /** Which option the student chose — matches Question `optionA`…`optionD` fields */
    selectedOption: {
      type: String,
      required: true,
      enum: ["optionA", "optionB", "optionC", "optionD"],
    },
  },
  { _id: false }
);

answerSchema.pre("validate", function (next) {
  if (this.selectedOptionId && !this.selectedOption) {
    this.selectedOption = legacyLetterToSelectedOption(this.selectedOptionId);
  }
  next();
});

const examAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    startedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    submittedAt: { type: Date },

    answers: {
      type: [answerSchema],
      default: [],
    },

    totalQuestions: { type: Number, default: 0 },
    correctCount: { type: Number },
    incorrectCount: { type: Number },
    /** Percentage 0–100 */
    percentage: { type: Number },
    /** Raw score: sum of marks earned (or count of correct if unweighted) */
    score: { type: Number },
    passed: { type: Boolean },
    passMarkSnapshot: { type: Number },
  },
  { timestamps: true }
);

examAttemptSchema.index({ student: 1, exam: 1 }, { unique: true });

const ExamAttempt = mongoose.model("ExamAttempt", examAttemptSchema);

module.exports = ExamAttempt;
