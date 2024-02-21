const mongoose = require("mongoose");

const leaveReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leaveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leave",
    required: true,
  },
});
const LeaveReport = mongoose.model("LeaveReport", leaveReportSchema);

module.exports = LeaveReport;
