require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer dùng memoryStorage (không lưu file tạm)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// API upload video
app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload trực tiếp từ buffer
    // Không dùng được Async await nên phải trả kết quả bên trong
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        console.log(result.secure_url)
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
    // console.log(result.secure_url)

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
