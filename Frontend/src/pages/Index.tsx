import { MapPin } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import FoodCategories from "@/components/FoodCategories";
import RestaurantList from "@/components/RestaurantList";
import BottomNav from "@/components/BottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Deliver to</p>
              <p className="text-sm font-extrabold text-foreground">Home • 123 Main St</p>
            </div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
            <span className="text-sm font-bold text-accent-foreground">A</span>
          </div>
        </div>
        <SearchBar />
      </header>

      {/* Content */}
      <main>
        <FoodCategories />
        <RestaurantList />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Index;
