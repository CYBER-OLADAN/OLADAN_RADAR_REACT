import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({
  image,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  linkToDetail = false,
  ...props
}) => {
  return (
    <Link to={linkToDetail ? `/properties/${Math.random().toString(36).substring(2, 7)}` : "#"} className="property-card-link">
      <div className="property-card">
        <img
          src={image}
          alt={title}
          className="property-image"
        />
        <div className="property-info">
          <h3 className="property-title">{title}</h3>
          <p className="property-price">${price}</p>
          <p className="property-location">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.54.94l2.83 2.83a5 5 0 0 1-7.07 7.07L10 25" />
            </svg>
            {location}
          </p>
          <p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 6.25c.11 0 .23.05.34.08l1.47 1.1c.44.35.76.83.89 1.32.13.47.16 1.03.16 1.55v6.75c0 .52-.13 1.07-.36 1.5l-1.46 1.12c-.31.24-.67.46-.98.6l-.85.35a4.01 4.01 0 0 0-1.66.26l-.3 1.38c-.15.66-.15 1.41 0 2.06l.3 1.41c.15.66.3 1.33.45 2 .15.67.3 1.33.45 2l.3 1.41c.15.66.3 1.33.45 2 .15.67.3 1.33.45 2l.3 1.41c.15.66.3 1.33.45 2l.3 1.41c.15.66.3 1.33.45 2l.3 1.41c.15.66.3 1.33.45 2l.3 1.41c.15.66.3 1.33.45 1.99l.3-1.41c.15-.66.3-1.33.45-2l.3-1.41c.15-.66.3-1.33.45-1.99l.3-1.41c.15-.66.3-1.32.45-1.99l-.3-1.38a4.01 4.01 0 0 0-1.66-.26l-.85-.35c-.31-.24-.67-.46-.98-.6l-.3-1.38c-.15-.66-.15-1.41 0-2.06l1.46-1.1c-.44-.35-.76-.83-.89-1.32a2.07 2.07 0 0 0-.16-1.55l-1.47-1.1c-.11 0-.23-.05-.34-.08L12 6.25z" />
            </svg>
            {bedrooms} bed${bedrooms !== 1 ? "s" : ""}
          </p>
          <p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2s-.45-.16-1.08-.16L4 8.13l6.88 5.45a.5.5 0 0 0 .52-.35l4.5-2.5a.5.5 0 0 0-.12-.65L12 3.25z" />
            </svg>
            {bathrooms} bath${bathrooms !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

PropertyCard.defaultProps = {
  linkToDetail: true,
};

export default PropertyCard;