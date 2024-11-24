import { cloudinary } from "../../config/cloudinary.js";
import Video from "../../models/adsModel.js";
import Rpi from "../../models/rpiModel.js"; // Import the Rpi model
import axios from "axios"; // Import axios

// export const deleteVideo = async (req, res) => {
//   try {
//     const videoId = req.params.id;
//     const video = await Video.findById(videoId);

//     if (!video) {
//       return res.status(404).json({ message: "Video not found", success: false});
//     }

//     // Delete video from Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.destroy(
//       video.cloudinaryId,
//       { resource_type: "video" }
//     );

//     if (cloudinaryResponse.result !== "ok") {
//       return res.status(500).json({ message: "Failed to delete video from Cloudinary", success: false });
//     }
//     await Video.findByIdAndDelete(videoId);
//     const rpServers = await Rpi.find().select("rpi_serverUrl");
//     await Promise.all(
//       rpServers.map(async (server) => {
//         try {
//           await axios.post(`${server.rpi_serverUrl}/delete-video`, {
//             filename: video.filename,
//           });
//         } catch (error) {
//           console.error(`Failed to notify server at ${server.rpi_serverUrl}`,);
//         }
//       })
//     );

//     res.json({ message: "Video deleted successfully", success: true });
//     console.log("Video deleted and all Pi servers notified");
//   } catch (error) {
//     console.error("Error deleting video:", error);
//     res.status(500).json({ message: "Failed to delete video", error, success: false  });
//   }
// };

// DELETE video
export const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Delete from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(
      video.cloudinaryId,
      { resource_type: "video" }
    );
    if (cloudinaryResponse.result !== "ok") {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to delete video from Cloudinary",
        });
    }

    await Video.findByIdAndDelete(videoId);

    // Notify Raspberry Pi servers
    const rpServers = await Rpi.find().select("rpi_serverUrl");
    await Promise.all(
      rpServers.map(async (server) => {
        try {
          await axios.post(`${server.rpi_serverUrl}/delete-video`, {
            filename: video.filename,
          });
        } catch (error) {
          console.error(
            `Failed to notify server ${server.rpi_serverUrl}`,
            error
          );
        }
      })
    );

    res.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete video", error });
  }
};
