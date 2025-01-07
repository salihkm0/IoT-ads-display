import Video from "../../models/adsModel.js";
import Rpi from "../../models/rpiModel.js";
import { cloudinary } from "../../config/cloudinary.js";
import axios from "axios";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

// EDIT video details
export const editVideo = async (req, res) => {
    console.log("Edit video")
    const { videoId } = req.params;
    const { filename, description, brand, expiryDate } = req.body;
  
    try {
      // Find the video by ID
      const video = await Video.findById(videoId);
  
      if (!video) {
        return res
          .status(404)
          .json({ success: false, message: "Video not found" });
      }
  
      // Update video details
      video.filename = filename || video.filename;
      video.description = description || video.description;
      video.brand = brand || video.brand;
      video.expiryDate = expiryDate || video.expiryDate;
  
      // If a new video file is uploaded, replace the existing video in Cloudinary
      if (req.file) {
        // Delete the old video from Cloudinary
        if (video.cloudinaryId) {
          await cloudinary.uploader.destroy(video.cloudinaryId, {
            resource_type: "video",
          });
        }
  
        // Upload the new video
        const bufferStream = streamifier.createReadStream(req.file.buffer);
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "video", folder: "ads_videos" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          bufferStream.pipe(uploadStream);
        });
  
        console.log("Updated Cloudinary result: " + JSON.stringify(result));
  
        // Check file size limit (350MB)
        const fileSizeMB = req.file.size / (1024 * 1024);
        if (fileSizeMB > 350) {
          await cloudinary.uploader.destroy(result.public_id, {
            resource_type: "video",
          });
          return res
            .status(400)
            .json({ success: false, message: "Video size exceeds 350MB limit." });
        }
  
        // Update video details with the new file
        video.fileUrl = result.secure_url;
        video.cloudinaryId = result.public_id;
        video.fileSize = result.bytes;
      }
  
      // Save the updated video details
      await video.save();
  
      // Notify Raspberry Pi servers of the updated video details
      const rpServers = await Rpi.find();
      const errors = [];
      await Promise.all(
        rpServers.map(async (server) => {
          try {
            await axios.post(`${server.rpi_serverUrl}/update-video`, {
              filename: video.filename,
              fileUrl: video.fileUrl,
              description: video.description,
              brand: video.brand,
              expiryDate: video.expiryDate,
            });
          } catch (error) {
            errors.push({
              serverUrl: server.rpi_serverUrl,
              message: error.message,
            });
          }
        })
      );
  
      if (errors.length > 0) {
        return res.status(206).json({
          success: true,
          message: "Video updated with partial server notifications",
          video,
          notificationErrors: errors,
        });
      }
  
      res.json({
        success: true,
        message: "Video updated successfully",
        video,
      });
    } catch (error) {
      console.error("Error updating video:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update video", error });
    }
  };
  