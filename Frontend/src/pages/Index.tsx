import { useState } from "react";
import { MapPin, Locate } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FoodCategories from "@/components/FoodCategories";
import RestaurantList from "@/components/RestaurantList";
import BottomNav from "@/components/BottomNav";
import { useGeolocation } from "@/hooks/useGeolocation";

const Index = () => {
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("userId") || "null");
    } catch {
      localStorage.removeItem("userId");
      return null;
    }
  })();

  const initials =
    currentUser && typeof currentUser === "object"
      ? (currentUser.displayName || currentUser.username || "?")
          .slice(0, 1)
          .toUpperCase()
      : "?";

  const { address, loading, fetchLocation } = useGeolocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAvatarClick = () => {
    if (currentUser) {
      navigate("/profile");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={fetchLocation} className="flex items-center gap-2 text-left">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-semibold">Deliver to</p>
              <p className="text-sm font-extrabold text-foreground truncate max-w-[200px]">
                {loading ? (
                  <span className="flex items-center gap-1">
                    <Locate className="h-3 w-3 animate-spin" /> Locating…
                  </span>
                ) : (
                  address || "Tap to set location"
                )}
              </p>
            </div>
          </button>
          <button
            onClick={handleAvatarClick}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary flex-shrink-0"
          >
            <span className="text-sm font-bold text-primary-foreground">{initials}</span>
          </button>
        </div>
        <SearchBar />
      </header>

      <main>
        <FoodCategories
          selected={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat === selectedCategory ? null : cat)}
        />
        <RestaurantList categoryFilter={selectedCategory} />
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;