const express = require("express");
const leaveReportController = require("../Controllers/leaveReportController");
const router = express.Router();
const { verifyToken, validateUserId } = require("./verifyToken");

router.get(
  "/:userId",
  verifyToken,
  validateUserId,
  leaveReportController.getLeaveReport
);

module.exports = router;
