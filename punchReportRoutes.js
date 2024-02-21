const express = require("express");
const punchReportController = require("../Controllers/punchReportController");
const router = express.Router();
const { verifyToken, validateUserId } = require("./verifyToken");

// router.get(
//   "/:userId",
//   verifyToken,
//   validateUserId,
//   punchReportController.getPunchTimeReport
// );

module.exports = router;
