const Leave = require("../Models/leaveModel");

exports.postLeaves = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, leaveType, leaveDayType, reason } = req.body;

    // Extract userId from the request parameters
    const userId = req.params.userId;

    // Create a new leave document
    const newLeave = new Leave({
      dateFrom,
      dateTo,
      leaveType,
      leaveDayType,
      reason,
      userId, // Assign userId to the leave schema
    });

    // Save the leave document to the database
    const savedLeave = await newLeave.save();

    // Return a success response
    res.status(201).json({
      message: "Leave posted successfully",
      data: savedLeave,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// exports.postLeaves = async (req, res, next) => {
//   try {
//     const { dateFrom, dateTo, leaveType, leaveDayType, reason } = req.body;

//     const { userId } = req.params.userId;

//     // Create a new leave document
//     const newLeave = new Leave({
//       dateFrom,
//       dateTo,
//       leaveType,
//       leaveDayType,
//       reason,
//       userId,
//     });

//     // Save the leave document to the database
//     const savedLeave = await newLeave.save();
//     // Return a success response
//     res.status(201).json({
//       message: "Leave posted successfully",
//       data: savedLeave,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.getLeaves = async (req, res, next) => {
//   try {
//     const usersLeaves = await Leave.find().populate("userId", "name");
//     res.status(200).json({
//       TotalLeaves: usersLeaves.length,
//       usersLeaves,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.getLeave = async (req, res, next) => {
//   try {
//     const userLeave = await Leave.findById(req.params.id).populate("userId");
//     res.status(200).json({
//       userLeave,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

exports.getLeaveReport = async (req, res) => {
  try {
    const userid = req.params;
    console.log(userid);
    const leaveReport = await Leave.find(userid).populate("_id");
    res.status(200).json({
      leaveReport: leaveReport,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateLeave = async (req, res, next) => {
  try {
    const { status, ...details } = req.body;
    const leaveId = req.params.leaveid;
    const isAdmin = req.user.role === "admin";
    const isEmployee = req.user.role === "employee";
    let access = {};

    if (isAdmin) {
      access = { status };
    } else if (isEmployee) {
      access = details;
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedLeave = await Leave.findByIdAndUpdate(leaveId, access, {
      new: true,
      runValidators: true,
    });

    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.status(200).json({
      message: "Leave updated successfully",
      data: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
