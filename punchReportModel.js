const mongoose = require("mongoose");

const punchReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  punchTimeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PunchTime",
    required: true,
  },
});
const PunchReport = mongoose.model("PunchReport", punchReportSchema);

module.exports = PunchReport;
