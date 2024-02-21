const mongoose = require("mongoose");

const punchTimeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  punchIn: {
    type: Date,
    default: Date.now(),
  },
  breakIn: {
    type: Date,
    default: Date.now(),
  },
  breakOut: {
    type: Date,
    default: Date.now(),
  },
  punchOut: {
    type: Date,
    default: Date.now(),
  },
  action: {
    type: String,
    enum: ["breakIn", "breakOut", "punchOut"], // Specify allowed values if needed
  },
  breakDurationMinutes: {
    type: Number,
    default: null,
  },
  totalWorkingHours: {
    type: Number,
    default: null,
  },
});

punchTimeSchema.pre("save", function (next) {
  if (this.breakIn && this.breakOut && this.punchIn && this.punchOut) {
    const punchInTime = new Date(this.punchIn);
    const punchOutTime = new Date(this.punchOut);
    const breakInTime = new Date(this.breakIn);
    const breakOutTime = new Date(this.breakOut);
    const breakTimeDuration = breakOutTime - breakInTime;
    this.breakDurationMinutes = breakTimeDuration / (1000 * 60);

    const workingDurationWOBreak = punchOutTime - punchInTime;
    const workingDuration = workingDurationWOBreak - breakTimeDuration;

    this.totalWorkingHours = workingDuration / (1000 * 60 * 60);
  }
  next();
});

const PunchTime = mongoose.model("PunchTime", punchTimeSchema);

module.exports = PunchTime;
