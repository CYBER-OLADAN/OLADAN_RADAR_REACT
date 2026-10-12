import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Card } from "../ui/Card";

const PropertyForm = ({
  onSubmit,
  isLoading = false,
  initialValues = {},
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    type: initialValues.type || "rent",
    price: initialValues.price || "",
    location: initialValues.location || "",
    bedrooms: initialValues.bedrooms || "",
    bathrooms: initialValues.bathrooms || "",
    amenities: initialValues.amenities || "",
    images: initialValues.images || [],
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        ...formData,
        files,
      });
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card>
      <h3>Property Form</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <Input
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <Select
            options={[
              { label: "Rent", value: "rent" },
              { label: "Sale", value: "sale" },
            ]}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bedrooms</label>
          <Input
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bathrooms</label>
          <Input
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Amenities</label>
          <Input
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Images (min 3)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
          <p>Selected: {files.length} image(s)</p>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Submit Property"}
        </Button>

        {onClose && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        )}
      </form>
    </Card>
  );
};

export default PropertyForm;