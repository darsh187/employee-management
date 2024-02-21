const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../Models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("./../utils/email");
const { signAccessToken } = require("./../jwt_helper");

exports.signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    birthDate,
    role,
    address,
    gender,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json("Password do not matched");
  }

  const newUser = new User({
    name,
    email,
    password,
    confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    birthDate,
    role,
    address,
    gender,
  });

  const savedUser = await newUser.save();
  const accessToken = await signAccessToken(savedUser.id);
  res.status(201).json({
    token: accessToken,
    data: savedUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide valid email or password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("The user does not exist", 401));
  }
  const isMatch = await user.isValidPassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid Email or password", 401));
  }
  const accessToken = await signAccessToken(user.id, user.role); // Pass user's role
  res.status(200).json({
    token: accessToken,
    data: user,
  });
});
