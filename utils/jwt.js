import jwt from "jsonwebtoken";
// Verify a JWT
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
