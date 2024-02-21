const PunchTime = require("./../Models/punchTimeModel");

// Controller method to handle posting punch time
exports.postTime = async (req, res) => {
  try {
    const { userId } = req.params;

    // Create a new punch time entry
    const punchTime = new PunchTime({ userId });

    // Update punch in time
    punchTime.punchIn = new Date();

    // Save the punch time entry
    await punchTime.save();

    res.status(201).json({
      message: "Punch in recorded successfully",
      punchTimeId: punchTime._id,
    });
  } catch (error) {
    console.error("Error posting punch time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPunchTimeReport = async (req, res) => {
  try {
    const userid = req.params;
    const punchReport = await PunchTime.find(userid).populate("_id");
    res.status(200).json({
      punchReport: punchReport,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Controller method to handle updating punch time for breaks and punch out
exports.updateTime = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    // Fetch punch time for the user
    let punchTime = await PunchTime.findOne({ userId });

    if (!punchTime) {
      return res.status(404).json({ error: "Punch time not found" });
    }

    // Update punch time based on the action
    switch (action) {
      case "breakIn":
        punchTime.breakIn = new Date();
        break;
      case "breakOut":
        punchTime.breakOut = new Date();
        break;
      case "punchOut":
        punchTime.punchOut = new Date();
        break;
      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    // Save/update the punch time
    await punchTime.save();

    res.status(200).json({
      message: `Punch time updated for ${action}`,
      punchTimeId: punchTime._id,
    });
  } catch (error) {
    console.error("Error updating punch time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// exports.postTime = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Record punch-in time
//     await PunchTime.create({ userId, punchType: "punch-in" });
//     res.status(200).json({ message: "Punch-in recorded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateTime = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Record punch-in time
//     await PunchTime.create({ userId, punchType: "punch-in" });
//     res.status(200).json({ message: "Punch-in recorded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.breakIn = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Record punch-in time
//     await PunchTime.create({ userId, punchType: "punch-break-in" });
//     res.status(200).json({ message: "Punch-break-in recorded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// exports.breakOut = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Record punch-in time
//     await PunchTime.create({ userId, punchType: "punch-break-out" });
//     res.status(200).json({ message: "Punch-break-out recorded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// exports.punchOut = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     // Record punch-in time
//     await PunchTime.create({ userId, punchType: "punch-out" });
//     res.status(200).json({ message: "Punch-out recorded successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
