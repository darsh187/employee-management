const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const authRouter = require("./Routes/authRoutes");
const employeeRouter = require("./Routes/employeeRoutes");
const holidayRouter = require("./Routes/holidayRoutes");
const leaveRouter = require("./Routes/leaveRoutes");
const punchTimeRouter = require("./Routes/punchTimeRoutes");
// const punchReportRouter = require("./Routes/punchReportRoutes");
// const leaveReportRouter = require("./Routes/leaveReportRoutes");
const port = process.env.PORT || 3000;
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
// const mongo = mongoose
//   .connect(
//     process.env.DATABASE
//   )
//   .then(() => {
//     console.log("connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api/users", authRouter);
app.use("/api/users/", employeeRouter);
app.use("/api/holiday/", holidayRouter);
app.use("/api/leaves/", leaveRouter);
app.use("/api/punchTime/", punchTimeRouter);
// app.use("/api/punch-report/", punchReportRouter);
// app.use("/api/leave-report/", leaveReportRouter);

app.listen(port, () => {
  console.log("Server is listening");
});
