const express = require("express");
const User = require("../Models/userModel");

exports.setUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.params.userId;
  next();
};

exports.dashboard = async (req, res, next) => {
  try {
    const users = await User.find();
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    const upcomingBirthdays = users.filter((user) => {
      const userBirthdate = user.birthDate;
      const birthMonth = userBirthdate.getMonth();
      const birthDay = userBirthdate.getDate();

      if (birthMonth === todayMonth) {
        return birthDay >= todayDay;
      }
      return birthMonth > todayMonth;
    });

    res.status(200).json({
      employees: users.length,
      TotalUpcomingBirthdays: upcomingBirthdays.length,
      upcomingBirthdays: upcomingBirthdays,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      TotalEmployees: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      employee: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Employee deleted successfully");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    // Check if the password field is provided in the request body
    if (req.body.password || req.body.role) {
      return res.status(400).json({
        error: "You cannot update the password using this endpoint",
      });
    }

    // Destructure the password field and exclude it from the rest of the fields
    const { password, role, ...rest } = req.body;

    // Update the user document excluding the password field
    const updatedUser = await User.findByIdAndUpdate(req.params.id, rest, {
      new: true, // Return the updated document
      runValidators: true, // Run validators to ensure the updated fields meet the schema requirements
    });

    // Send the updated user information in the response
    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedUser,
    });
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(500).json({
      error: error.message,
    });
  }
};
