const jwt = require("jsonwebtoken");

module.exports = {
  signAccessToken: (userId, userRole) => {
    return new Promise((resolve, reject) => {
      const payload = {
        id: userId,
        role: userRole,
      };
      const secret = process.env.JWT_KEY;
      const options = {
        expiresIn: "10d",
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      });
    });
  },
};
