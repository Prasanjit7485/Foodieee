import { Star, MapPin } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  rating: number;
  description: string;
  address: string;
  imagePath?: string; // from backend (optional)
}

const RestaurantCard = ({
  name,
  rating,
  description,
  address,
  imagePath,
}: RestaurantCardProps) => {

  const imageUrl = imagePath
    ? `http://localhost:8080/uploads/${imagePath}`
    : "https://via.placeholder.com/400x250"; // fallback image

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--card-shadow)] transition-transform hover:scale-[1.02] cursor-pointer">
      <div className="relative h-36 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-3">
        <h3 className="text-sm font-extrabold text-card-foreground truncate">
          {name}
        </h3>

        {/* Description instead of cuisine */}
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            <span className="text-xs font-bold text-card-foreground">
              {rating}
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
