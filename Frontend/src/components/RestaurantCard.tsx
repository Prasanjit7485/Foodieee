import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RestaurantCardProps {
  id:string;
  name: string;
  rating: number;
  description: string;
  address: string;
  imageFilePath?: string; // from backend (optional)
}

const RestaurantCard = ({
  id,
  name,
  rating,
  description,
  address,
  imageFilePath,
}: RestaurantCardProps) => {
  const navigate=useNavigate();
  const imageUrl = imageFilePath
    ? `http://localhost:8080/uploads/${imageFilePath}`
    : "https://via.placeholder.com/400x250"; // fallback image

  return (
  <div
    onClick={() => navigate(`/restaurant/${id}`)}
    className="group overflow-hidden rounded-2xl bg-card border border-border shadow-[var(--card-shadow)] transition-all duration-300 hover:shadow-xl hover:scale-[1.03] cursor-pointer"
  >
    <div className="relative h-36 overflow-hidden">
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            "https://via.placeholder.com/400x250";
        }}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <div className="p-3">
      <h3 className="text-sm font-extrabold text-card-foreground truncate">
        {name}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
        {description}
      </p>

      <div className="mt-2 flex items-center justify-between">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star
            className={`h-3.5 w-3.5 ${
              rating >= 4.5
                ? "fill-green-500 text-green-500"
                : rating >= 3.5
                ? "fill-yellow-500 text-yellow-500"
                : "fill-red-500 text-red-500"
            }`}
          />
          <span className="text-xs font-bold text-card-foreground">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="text-xs font-medium truncate max-w-[90px]">
            {address}
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default RestaurantCard;
