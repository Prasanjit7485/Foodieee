import { Star, MapPin, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RestaurantCardProps {
  id: string;
  name: string;
  rating: number;
  description: string;
  address: string;
  imageFilePath?: string;
  cuisineTag?: string; // optional cuisine label
  deliveryTime?: string; // e.g. "20–30 min"
}

const getRatingConfig = (rating: number) => {
  if (rating >= 4.5) return { color: "#16a34a", bg: "#dcfce7", label: "Excellent" };
  if (rating >= 3.5) return { color: "#d97706", bg: "#fef3c7", label: "Good" };
  return { color: "#dc2626", bg: "#fee2e2", label: "Fair" };
};

const RestaurantCard = ({
  id,
  name,
  rating,
  description,
  address,
  imageFilePath,
  cuisineTag,
  deliveryTime = "25–35 min",
}: RestaurantCardProps) => {
  const navigate = useNavigate();
  const imageUrl = imageFilePath
    ? `http://localhost:8080/uploads/${imageFilePath}`
    : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80";

  const ratingConfig = getRatingConfig(rating);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');

        .rc-card {
          font-family: 'DM Sans', sans-serif;
          position: relative;
          background: var(--card, #fff);
          border: 1px solid var(--border, #e5e7eb);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.28s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          width: 100%;
        }

        .rc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.13);
        }

        .rc-card:hover .rc-image img {
          transform: scale(1.08);
        }

        .rc-card:hover .rc-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .rc-image {
          position: relative;
          height: 130px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .rc-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: block;
        }

        /* gradient overlay */
        .rc-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 45%,
            rgba(0,0,0,0.55) 100%
          );
        }

        .rc-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 8px;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #374151;
          text-transform: uppercase;
        }

        .rc-rating-pill {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 50px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .rc-body {
          padding: 10px 12px 12px;
        }

        .rc-name {
          font-family: 'Fraunces', serif;
          font-size: 14px;
          font-weight: 700;
          color: var(--card-foreground, #111827);
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.25;
        }

        .rc-desc {
          font-size: 12px;
          color: var(--muted-foreground, #6b7280);
          margin: 0 0 12px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.5;
        }

        .rc-divider {
          height: 1px;
          background: var(--border, #f3f4f6);
          margin: 0 0 12px;
        }

        .rc-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .rc-meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--muted-foreground, #6b7280);
          font-size: 11.5px;
          font-weight: 500;
        }

        .rc-meta-item svg {
          flex-shrink: 0;
        }

        .rc-meta-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .rc-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--card-foreground, #111827);
          color: var(--card, #fff);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }

        .rc-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--border, #d1d5db);
          flex-shrink: 0;
        }
      `}</style>

      <div
        className="rc-card"
        onClick={() => navigate(`/restaurant/${id}`)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(`/restaurant/${id}`)}
        aria-label={`View ${name}`}
      >
        {/* Image */}
        <div className="rc-image">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80";
            }}
          />

          {cuisineTag && <div className="rc-badge">{cuisineTag}</div>}

          {/* Rating pill over image */}
          <div
            className="rc-rating-pill"
            style={{
              background: ratingConfig.bg + "dd",
              color: ratingConfig.color,
            }}
          >
            <Star
              style={{ fill: ratingConfig.color, color: ratingConfig.color }}
              size={11}
            />
            <span>{rating.toFixed(1)}</span>
            <span style={{ fontWeight: 400, fontSize: 10, opacity: 0.75 }}>
              {ratingConfig.label}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="rc-body">
          <h3 className="rc-name">{name}</h3>
          <p className="rc-desc">{description}</p>

          <div className="rc-divider" />

          <div className="rc-meta">
            <div className="rc-meta-item">
              <MapPin size={13} />
              <span className="rc-meta-text">{address}</span>
            </div>

            <div className="rc-dot" />

            <div className="rc-meta-item">
              <Clock size={13} />
              <span>{deliveryTime}</span>
            </div>

            <div className="rc-arrow">
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantCard;