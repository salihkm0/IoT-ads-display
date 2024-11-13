import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadVideo } from "../controllers/videoControllers/upload.js";
import { getVideos, getVideosByFilename } from "../controllers/videoControllers/fetch.js";
import { deleteVideo } from "../controllers/videoControllers/delete.js";

// Initialize router
const uploadRoutes = express.Router();

// Route to upload a single video
uploadRoutes.post("/upload", upload.single("file"), uploadVideo);

// Route to fetch all videos
uploadRoutes.get("/videos", getVideos);

// Route to fetch video by name
uploadRoutes.get("/video/:filename", getVideosByFilename);

// Route to delete videos
uploadRoutes.delete("/delete-video/:id", deleteVideo);

// Export the routes
export default uploadRoutes;


