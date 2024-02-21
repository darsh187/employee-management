const mongoose = require("mongoose");

// Function to convert numerical day value to its corresponding name
const getDayName = (dayId) => {
  switch (dayId) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Invalid Day";
  }
};

const holidaySchema = new mongoose.Schema({
  dateFrom: {
    type: Date,
    default: Date.now(),
  },
  dateTo: {
    type: Date,
    default: Date.now(),
  },
  holidayName: {
    type: String,
    required: [true, "Provide name of the holiday"],
  },
  holidayDuration: {
    type: Number,
  },
  day: {
    type: String,
  },
});

holidaySchema.pre("save", function (next) {
  // Get the start and end dates
  const startDate = new Date(this.dateFrom);
  const endDate = new Date(this.dateTo);

  this.day = getDayName(startDate.getDay());

  // Calculate the difference in milliseconds
  const diffTime = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Set the holiday duration
  this.holidayDuration = diffDays + 1; // Including the start date
  next();
});

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;
