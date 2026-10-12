import React, { useEffect, useState } from "react";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/v1/properties", {
      headers: token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading properties...</div>;

  return (
    <div className="property-list">
      <h2>Properties</h2>
      <div className="property-grid">
        {properties.map((prop) => (
          <div key={prop._id} className="property-card">
            <img
              src={prop.images[0]}
              alt={prop.title}
              className="property-image"
            />
            <div className="property-info">
              <h3>{prop.title}</h3>
              <p>{prop.description.substring(0, 100)}...</p>
              <p>Type: {prop.type} | Price: ${prop.price}</p>
              <p>Landlord: {prop.landlord.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;