const express = require("express");
const employeeController = require("./../Controllers/employeeCotroller");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

const router = express.Router();

router.get(
  "/dashboard",
  verifyTokenAndAuthorization,
  employeeController.dashboard
);

router.get("/employees", verifyTokenAndAdmin, employeeController.getEmployees);

router.get(
  "/employees/:id",
  verifyTokenAndAdmin,
  employeeController.getEmployee
);
router.patch(
  "/employees/:id",
  verifyTokenAndAuthorization,
  employeeController.updateEmployee
);
router.delete(
  "/employees/:id",
  verifyTokenAndAdmin,
  employeeController.deleteEmployee
);
module.exports = router;
