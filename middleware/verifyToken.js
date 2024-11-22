const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Middleware to check if the JWT is valid
const verifyToken = (req, res, next) => {
  // Get token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
