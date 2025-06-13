import jwt from "jsonwebtoken";

// Generate a JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Verify a JWT
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
