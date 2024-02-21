const Holiday = require("./../Models/holidayModel");
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  try {
    // Find holidays where dateTo has passed
    const expiredHolidays = await Holiday.find({ dateTo: { $lt: new Date() } });

    // Delete expired holidays
    for (const holiday of expiredHolidays) {
      await Holiday.findByIdAndDelete(holiday._id);
    }

    console.log(`${expiredHolidays.length} expired holidays deleted`);
  } catch (error) {
    console.error("Error deleting expired holidays:", error);
  }
});

exports.postHolidays = async (req, res, next) => {
  try {
    const { dateFrom, dateTo, holidayName } = req.body;
    const newHoliday = new Holiday({
      dateFrom,
      dateTo,
      holidayName,
    });
    const savedHoliday = await newHoliday.save();
    // Return a success response
    res.status(201).json({
      message: "Holiday posted successfully",
      data: savedHoliday,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json({
      TotalHolidays: holidays.length,
      holidays,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getHoliday = async (req, res, next) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) {
      return res.status(404).json("Holiday not found");
    }
    res.status(200).json({
      holiday,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateHoliday = async (req, res, next) => {
  try {
    const updatedHoliday = await Holiday.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedHoliday) {
      return res.status(404).json("Holiday not found");
    }
    res.status(200).json({
      message: "Holiday updated successfully",
      holiday: updatedHoliday,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteHoliday = async (req, res, next) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.status(200).json("Holiday deleted successfully");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
