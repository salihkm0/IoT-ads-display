import { verifyToken } from "../utils/jwt";
const express = require("express");

const jwtRoutes = express.Router();

// A route to check if the token is valid
jwtRoutes.get("/check-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

export default jwtRoutes;
