const jwt = require("jsonwebtoken");
const Leave = require("./../Models/leaveModel");
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.JWT_KEY, (err, user) => {
//       if (err) res.status(403).json("Token is invalid");
//       req.user = user;
//       next();
//     });
//   } else {
//     return res.status(401).json("You are not authorized!");
//   }
// };

// const verifyTokenAndAuthorization = (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (req.user.role === "employee" || req.user.role === "admin") {
//       next();
//     } else {
//       res.status(403).json("You are not allowed to do that!");
//     }
//   });
// };

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) res.status(403).json("Token is invalid");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authorized!");
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const isAdmin = req.user.role === "admin"; // Assuming role is stored in req.user
      const isEmployee = req.user.role === "employee"; // Assuming role is stored in req.user

      if (!isAdmin && !isEmployee) {
        return res.status(403).json("You are not allowed to do that!");
      }

      const userId = req.params.userId || req.body.userId || req.user.id;

      if (isEmployee && req.user.id !== userId) {
        return res.status(403).json("You are not allowed to do that!");
      }

      next();
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  });
};

const verifyUpdateLeaveAuthorization = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const isAdmin = req.user.role === "admin";

      const leaveId = req.params.leaveid;
      const leave = await Leave.findById(leaveId);
      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }

      if (isAdmin || req.user.id === leave.userId.toString()) {
        req.leave = leave;
        next();
      } else {
        return res.status(403).json({ message: "Unauthorized" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const validateUserId = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const loggedInUserId = req.user.id;
      const requestedUserId = req.params.userId;
      const isAdmin = req.user.role === "admin";

      if (requestedUserId === loggedInUserId || isAdmin) {
        next();
      } else {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};
const verifyTokenAndEmployee = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "employee") {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyTokenAndEmployee,
  verifyUpdateLeaveAuthorization,
  validateUserId,
};
