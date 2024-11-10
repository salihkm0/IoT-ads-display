const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadVideo,
  getVideos,
  deleteVideo,
} = require("../controllers/uploadController");

const uploadRoutes = express.Router();

// Route to upload a single video
uploadRoutes.post("/upload", upload.single("file"), uploadVideo);

// Route to fetch all videos
uploadRoutes.get("/videos", getVideos);
uploadRoutes.delete("/delete-video/:id", deleteVideo);

// route for check online
uploadRoutes.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is online" });
});

module.exports = uploadRoutes;
