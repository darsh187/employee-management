const express = require("express");
const punchController = require("../Controllers/punchController");
const router = express.Router();
const { verifyToken, validateUserId } = require("./verifyToken");

// Define routes for punch time actions
router.post("/:userId", verifyToken, validateUserId, punchController.postTime);
router.get(
  "/punchTime-report/:userId",
  verifyToken,
  validateUserId,
  punchController.getPunchTimeReport
);
router.patch(
  "/:userId",
  verifyToken,
  validateUserId,
  punchController.updateTime
);

module.exports = router;
