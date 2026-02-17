import { Star, Clock } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  time: string;
  image: string;
  offer?: string;
}

const RestaurantCard = ({ name, cuisine, rating, time, image, offer }: RestaurantCardProps) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--card-shadow)] transition-transform hover:scale-[1.02] cursor-pointer">
      <div className="relative h-36 overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        {offer && (
          <div className="absolute bottom-2 left-2 rounded-lg bg-primary px-2 py-0.5">
            <span className="text-xs font-bold text-primary-foreground">{offer}</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-extrabold text-card-foreground truncate">{name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{cuisine}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            <span className="text-xs font-bold text-card-foreground">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
