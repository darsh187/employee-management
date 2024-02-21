const express = require("express");
const holidayController = require("./../Controllers/holidayController");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

const router = express.Router();

router.post("/", verifyTokenAndAdmin, holidayController.postHolidays);
router.get("/", verifyTokenAndAuthorization, holidayController.getHolidays);
router.patch("/:id", verifyTokenAndAdmin, holidayController.updateHoliday);
router.get("/:id", verifyTokenAndAuthorization, holidayController.getHoliday);
router.delete("/:id", verifyTokenAndAdmin, holidayController.deleteHoliday);
module.exports = router;
