import { useState, useRef } from "react";
import apiFetch from "../utils/apiFetch";

export default function ImageUploader({ values, onChange, label = "Property Image", min = 3, max = 10 }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const inputRef = useRef(null);

  const handleSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = Array.from(files).filter(
      (f) => allowed.includes(f.type)
    );

    if (validFiles.length === 0 && files.length > 0) {
      setError("Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    if (validFiles.some((f) => f.size > 10 * 1024 * 1024)) {
      setError("Image must be smaller than 10 MB");
      return;
    }

    if (values.length >= max) {
      setError(`Maximum ${max} images reached`);
      return;
    }

    const filesToUpload = validFiles.slice(0, max - values.length);

    setError("");
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map((file) => {
        const formData = new FormData();
        formData.append("images", file);
        return apiFetch("/api/v1/upload/image", {
          method: "POST",
          body: formData,
        }).then((res) => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        });
      });

      const results = await Promise.all(uploadPromises);

      const newUrls = values.concat(results.map((r) => r.url));
      onChange(newUrls);
      setPreview(newUrls[newUrls.length - 1]);

      if (newUrls.length >= max) {
        setError(`Maximum ${max} images reached`);
      }
    } catch (err) {
      setError(err.message);
      setPreview(values[values.length - 1] || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <>
      <div className="form-group">
        <label>{label}</label>

        <div className="image-preview-grid">
          {values.map((url, index) => (
            <div key={index} className="image-preview-item">
              <img
                src={url}
                alt="Preview"
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                }}
              />
              <span
                onClick={() => handleRemove(index)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "2px 6px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                }}
              >
                ✕
              </span>
            </div>
          ))}
        </div>

        {values.length < max && (
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleSelect}
            disabled={uploading}
          />
        )}

        {uploading && <p className="text-sm mt-2">Uploading...</p>}
        {error && (
          <p className="text-sm" style={{ color: "#dc2626", marginTop: "0.35rem" }}>
            {error}
          </p>
        )}

        {values.length < max && (
          <p className="text-sm mt-1">
            {max - values.length} more image{'s'.repeat(max - values.length > 1 ? 1 : 0)} can be added
          </p>
        )}

        {values.length < min && (
          <p className="text-sm mt-1" style={{ color: "#dc2626" }}>
            Please add at least {min} images
          </p>
        )}

        <p className="text-sm mt-1">
          Minimum {min}, maximum {max} images
        </p>
      </div>
    </>
  );
}