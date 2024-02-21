const express = require("express");
const router = express.Router();
const leaveController = require("./../Controllers/leaveController");
const {
  verifyTokenAndAuthorization,
  verifyUpdateLeaveAuthorization,
  validateUserId,
  verifyToken,
} = require("./verifyToken");

// Define the route for posting leaves
router.post(
  "/:userId",
  verifyTokenAndAuthorization,
  (req, res, next) => {
    // Set the userId to the logged-in user's ID
    req.params.userId = req.user.id;
    next();
  },
  leaveController.postLeaves
);

router.get(
  "/leave-report/:userId",
  verifyToken,
  validateUserId,
  leaveController.getLeaveReport
);

// Define other routes for getting and updating leaves
// router.get("/", verifyTokenAndAuthorization, leaveController.getLeaves);
// router.get("/:id", verifyTokenAndAuthorization, leaveController.getLeave);
router.patch(
  "/:userid/:leaveid",
  verifyTokenAndAuthorization,
  verifyUpdateLeaveAuthorization,
  leaveController.updateLeave
);

module.exports = router;
