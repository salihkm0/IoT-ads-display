import Video from "../../models/adsModel.js";

// Fetch videos from MongoDB
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json({ message: "Retrieved videos", success: true ,videos : videos});
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Failed to retrieve videos", success: false });
  }
};

export const getVideosByFilename = async (req, res) => {
  try {
    const { filename } = req.params;

    const videos = await Video.find({ filename: new RegExp(filename, "i") });

    if (videos.length === 0) {
      return res
        .status(404)
        .json({ message: "No videos found with that filename" ,success: false});
    }

    res.json({ message: "Videos founded with that filename" ,success: true,videos: videos });
  } catch (error) {
    console.error("Error fetching videos by filename:", error);
    res.status(500).json({ message: "Failed to retrieve videos", error : error, success: false });
  }
};
