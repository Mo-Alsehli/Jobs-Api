const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "please provide a position"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
