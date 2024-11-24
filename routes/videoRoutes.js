import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadVideo } from "../controllers/videoControllers/upload.js";
import { getVideos, getVideosByFilename } from "../controllers/videoControllers/fetch.js";
import { deleteVideo } from "../controllers/videoControllers/delete.js";
import { protect } from "../middleware/authMiddleware.js";

// Initialize router
const uploadRoutes = express.Router();

// Route to upload a single video
uploadRoutes.post("/upload",protect, upload.single("file"), uploadVideo);

// Route to fetch all videos
uploadRoutes.get("/videos",protect, getVideos);

// Route to fetch video by name
uploadRoutes.get("/video/:filename",protect, getVideosByFilename);

// Route to delete videos
uploadRoutes.delete("/delete-video/:id",protect, deleteVideo);

// Export the routes
export default uploadRoutes;


