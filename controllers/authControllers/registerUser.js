import bcrypt from "bcrypt";
import User from "../../models/userModel.js";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };