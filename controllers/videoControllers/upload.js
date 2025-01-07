import Video from "../../models/adsModel.js";
import Rpi from "../../models/rpiModel.js";
import { cloudinary } from "../../config/cloudinary.js";
import axios from "axios";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

// UPLOAD video
export const uploadVideo = async (req, res) => {
  const { filename, description, brand, expiryDate } = req.body;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

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

    console.log("Cloudinary result: "+ JSON.stringify(result))

    const fileSizeMB = req.file.size / (1024 * 1024);
    if (fileSizeMB > 350) {
      await cloudinary.uploader.destroy(result.public_id, {
        resource_type: "video",
      });
      return res
        .status(400)
        .json({ success: false, message: "Video size exceeds 350MB limit." });
    }

    const newVideo = await Video.create({
      filename: filename || req.file.originalname,
      description,
      brand,
      expiryDate,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileSize: result.bytes,
      status: "active",
    });

    // Notify Raspberry Pi servers
    const rpServers = await Rpi.find();
    const errors = [];
    await Promise.all(
      rpServers.map(async (server) => {
        try {
          await axios.post(`${server.rpi_serverUrl}/download-video`, {
            filename: newVideo.filename,
            fileUrl: newVideo.fileUrl,
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
        message: "Video uploaded with partial server notifications",
        video: newVideo,
        // notificationErrors: errors,
      });
    }

    res.json({
      success: true,
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload video", error });
  }
};









