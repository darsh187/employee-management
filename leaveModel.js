const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    dateFrom: {
      type: Date,
      default: Date.now(),
    },
    dateTo: {
      type: Date,
      default: Date.now(),
    },
    leaveType: {
      // if true means paid and false means unpaid
      type: Boolean,
      required: [true, "Provide leave type"],
    },
    leaveDayType: {
      // if true means full day and false means half day
      type: Boolean,
      required: [true, "Provide leave day type"],
    },
    reason: {
      type: String,
      required: [true, "A leave must have a reason"],
      minlength: [10, "Reason must have more than 10 charecters"],
      maxlength: [150, "Reason must have less than 150 charecters"],
    },
    leaveDuration: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

leaveSchema.pre("save", function (next) {
  // Calculate leave duration before saving the document
  const diffTime = Math.abs(this.dateTo - this.dateFrom);
  console.log("difftime: ", diffTime);
  let leaveDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Basic calculation
  console.log("leaveduration: ", leaveDuration);

  // Adjust leave duration for weekends
  const dayFrom = this.dateFrom.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  console.log("dayfrom: ", dayFrom);
  const dayTo = this.dateTo.getDay();
  console.log("dayTo: ", dayTo);

  let daysInBetween = 0; // Total days between dateFrom and dateTo
  if (dayFrom === 1 || dayTo === 5) {
    daysInBetween = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    daysInBetween += 1;
    this.leaveDuration = leaveDuration + daysInBetween;
  } else {
    this.leaveDuration = leaveDuration + 1;
  }
  next();
});

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
