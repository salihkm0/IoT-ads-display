import Video from "../../models/adsModel.js";
import Rpi from "../../models/rpiModel.js";
import { cloudinary } from "../../config/cloudinary.js";
import axios from "axios";
import dotenv from "dotenv"; // Import dotenv
import streamifier from "streamifier"; // Import streamifier

dotenv.config(); // Initialize dotenv

// Upload Video Controller
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a readable stream from the buffer
    const bufferStream = streamifier.createReadStream(req.file.buffer);

    // Upload video directly from memory (req.file.buffer)
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "ads_videos",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      bufferStream.pipe(uploadStream);
    });

    const uploadedFileSizeMB = req.file.size / (1024 * 1024);
    const videoDuration = result.duration;

    const maxSizeMB = 350;

    if (uploadedFileSizeMB > maxSizeMB) {
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

    // Get all Raspberry Pi server URLs from the database
    const rpServers = await Rpi.find();  // Query all Raspberry Pi entries

    // Notify all Pi servers
    await Promise.all(
      rpServers.map(async (server) => {
        try {
          await axios.post(`${server.rpi_serverUrl}/download-video`, {
            filename: newVideo.filename,
            fileUrl: newVideo.fileUrl,
          });
        } catch (error) {
          console.error(`Failed to notify server at ${server.rpi_serverUrl}`, error);
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
