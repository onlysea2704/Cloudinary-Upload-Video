import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import file CSS

function App() {
  const [video, setVideo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  // Xử lý khi chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideo(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tạo URL tạm để xem trước video
    }
  };

  // Xử lý upload
  const handleUpload = async () => {
    if (!video) {
      alert("Vui lòng chọn video!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("video", video);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideoUrl(response.data.url);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="upload-box">
        <h2>🎬 Upload Video lên Cloudinary</h2>

        {/* Hiển thị video preview nếu có */}
        {previewUrl && (
          <div className="preview-container">
            <h3>🔍 Xem trước:</h3>
            <video src={previewUrl} controls width="100%" />
          </div>
        )}

        <label className="file-input">
          <input type="file" accept="video/*" onChange={handleFileChange} />
          📂 Chọn Video
        </label>

        <button className="upload-btn" onClick={handleUpload} disabled={uploading}>
          {uploading ? "⏳ Đang tải lên..." : "🚀 Upload Video"}
        </button>

        {/* Hiển thị video đã upload thành công */}
        {videoUrl && (
          <div className="video-preview">
            <h3>📹 Video đã tải lên:</h3>
            <video src={videoUrl} controls width="100%" />
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">🔗 Xem trên Cloudinary</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
