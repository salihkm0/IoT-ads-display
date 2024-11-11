const Video = require("../models/adsModel");
const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");
const axios = require("axios");
require("dotenv").config();

const piServers = [
  // "http://localhost:3001"
  "https://f762-2409-40f3-2c-f104-51e2-7df9-567d-d2a.ngrok-free.app",
  // Add more Pi server URLs as needed
];


//for upload files
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "ads_videos",
    });

    const uploadedFileSizeMB = req.file.size / (1024 * 1024);
    const videoDuration = result.duration;

    const maxDuration = 30;
    const maxSizeMB = 38;

    if (videoDuration > maxDuration || uploadedFileSizeMB > maxSizeMB) {
      await cloudinary.uploader.destroy(result.public_id, {
        resource_type: "video",
      });
      return res.status(400).json({
        message: `Video duration or size exceeds the limit.`,
      });
    }

    const newVideo = new Video({
      filename: req.body.filename ? req.body.filename : req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });
    await newVideo.save();

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Notify all Pi servers
    await Promise.all(
      piServers.map(async (serverUrl) => {
        try {
          await axios.post(`${serverUrl}/download-video`, {
            filename: newVideo.filename,
            fileUrl: newVideo.fileUrl,
          });
        } catch (error) {
          console.error(`Failed to notify server at ${serverUrl}`, error);
        }
      })
    );

    res.json({ message: "Video uploaded successfully!", video: newVideo });
    console.log("Video uploaded and all Pi servers notified");
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Failed to upload video", error });
  }
};

// Fetch videos from MongoDB
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Failed to retrieve videos" });
  }
};


//for deleting
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) return res.status(404).json({ message: "Video not found" });

    const cloudinaryResponse = await cloudinary.uploader.destroy(
      video.cloudinaryId,
      { resource_type: "video" }
    );

    if (cloudinaryResponse.result !== "ok") {
      return res
        .status(500)
        .json({ message: "Failed to delete video from Cloudinary" });
    }

    await Video.findByIdAndDelete(videoId);

    // Notify all Pi servers about video deletion
    await Promise.all(
      piServers.map(async (serverUrl) => {
        try {
          await axios.post(`${serverUrl}/delete-video`, {
            filename: video.filename,
          });
        } catch (error) {
          console.error(`Failed to notify server at ${serverUrl}`, error);
        }
      })
    );

    res.json({ message: "Video deleted successfully" });
    console.log("Video deleted and all Pi servers notified");
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Failed to delete video", error });
  }
};
