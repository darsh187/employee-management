const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

// name, email, photo, password, confirmpassword
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      trim: true,
      type: String,
      unique: [true, "This email already exist"],
      lowercase: true,
      validate: [validator.isEmail, "Please fill a valid email address"],
      required: [true, "Email address is required"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      maxlength: 12,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password; // abc === abc
        },
        message: "password is not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    birthDate: {
      type: Date,
      required: [true, "User must have a birthdate"],
    },
    role: {
      type: String,
      enum: ["employee", "admin", "trainee"],
      default: "employee",
    },
    address: {
      type: String,
      required: [true, "User must have an address"],
    },
    gender: {
      type: String,
      required: [true, "User must have a gender"],
      enum: ["male", "female"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    resizeBy.status(500).json({ error });
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
