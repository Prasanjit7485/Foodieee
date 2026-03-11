import {
  ArrowLeft,
  Star,
  Clock,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { getFoodsByRestaurantId, getRestaurantById } from "@/api/restaurantApi";
import { buildImageUrl } from "@/utils/image";

// ===== DTO Types (from Spring Boot) =====
type FoodItem = {
  id: number;
  name: string;
  price: number;
  imageFilePath: string;
  rating: number;
  description: string;
  isVeg: boolean;
  bestseller?: boolean;
};

type Restaurant = {
  id: number;
  name: string;
  imageFilePath: string;
  cuisine: string;
  rating: number;
  time: string;
  offer?: string;
};

// ===== Icons =====
const VegIcon = () => (
  <span className="flex h-4 w-4 items-center justify-center rounded-sm border-2 border-green-600">
    <span className="h-2 w-2 rounded-full bg-green-600" />
  </span>
);

const NonVegIcon = () => (
  <span className="flex h-4 w-4 items-center justify-center rounded-sm border-2 border-red-600">
    <span className="h-2 w-2 rounded-full bg-red-600" />
  </span>
);

// ===== Food Card Component =====
const FoodCard = ({
  item,
  restaurantName,
}: {
  item: FoodItem;
  restaurantName: string;
}) => {
  const { items, addItem, updateQty } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // 👈 check token
  const cartItem = items.find((i) => i.foodId === item.id); // ✅ match by foodId
  const qty = cartItem?.quantity ?? 0;

  // 👇 Auth-guarded handler
  const handleAddItem = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    addItem({
      foodId: item.id, // ✅ correct field name CartContext expects
      name: item.name,
      restaurant: restaurantName,
      price: item.price,
      image: item.imageFilePath,
    });
  };

  console.log(buildImageUrl(item.imageFilePath));

  return (
    <div className="flex gap-3 rounded-2xl bg-card p-3 shadow-[var(--card-shadow)]">
      {/* Image */}
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
        <img
          src={buildImageUrl(item.imageFilePath)}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          {qty === 0 ? (
            <button
              onClick={handleAddItem} // 👈 use guarded handler
              className="flex items-center gap-1 rounded-xl bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-md"
            >
              <Plus className="h-3 w-3" /> ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-primary px-2 py-1 shadow-md">
              <button onClick={() => cartItem && updateQty(cartItem.id!, qty - 1, cartItem)}>
                <Minus className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
              <span className="min-w-[14px] text-center text-xs font-bold text-primary-foreground">
                {qty}
              </span>
              <button onClick={() => cartItem && updateQty(cartItem.id!, qty + 1, cartItem)}>
                <Plus className="h-3.5 w-3.5 text-primary-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-1.5">
          {item.isVeg ? <VegIcon /> : <NonVegIcon />}
          {item.bestseller && (
            <span className="rounded bg-secondary/20 px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
              🏆 Bestseller
            </span>
          )}
        </div>

        <h3 className="text-sm font-extrabold leading-snug text-card-foreground">
          {item.name}
        </h3>

        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
          <span className="text-xs font-bold text-card-foreground">
            {item.rating}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {item.description}
        </p>

        <p className="mt-auto text-sm font-extrabold text-primary">
          ₹{item.price}
        </p>
      </div>
    </div>
  );
};

// ===== Main Component =====
const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { totalCount } = useCart();

  // 🔥 Fetch Restaurant Details
  const {
    data: restaurant,
    isLoading: restaurantLoading,
    isError: restaurantError,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const res = await getRestaurantById(id!);
      return res.data as Restaurant;
    },
    enabled: !!id,
  });

  // 🔥 Fetch Foods (FoodDetailsDto[])
  const {
    data: foods,
    isLoading: foodsLoading,
    isError: foodsError,
  } = useQuery({
    queryKey: ["foods", id],
    queryFn: async () => {
      const res = await getFoodsByRestaurantId(id!);
      return res.data as FoodItem[];
    },
    enabled: !!id,
  });

  // ===== Loading State =====
  if (restaurantLoading || foodsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-bold">Loading restaurant...</p>
      </div>
    );
  }

  // ===== Error State =====
  if (restaurantError || foodsError || !restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-lg font-bold text-foreground">
          Restaurant not found
        </p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  // ===== Dynamic Menu from Backend =====
  const vegItems = foods?.filter((i) => i.isVeg) || [];
  const nonVegItems = foods?.filter((i) => !i.isVeg) || [];

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Hero */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={buildImageUrl(restaurant.imageFilePath)}
          alt={restaurant.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        {restaurant.offer && (
          <div className="absolute right-4 top-4 rounded-lg bg-primary px-2 py-1">
            <span className="text-xs font-bold text-primary-foreground">
              {restaurant.offer}
            </span>
          </div>
        )}

        <div className="absolute bottom-4 left-4">
          <h1 className="text-xl font-extrabold text-white">
            {restaurant.name}
          </h1>
          <p className="text-xs text-white/80">{restaurant.cuisine}</p>

          <div className="mt-1 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <span className="text-xs font-bold text-white">
                {restaurant.rating}
              </span>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                {restaurant.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <main className="px-4 pt-4 space-y-6">
        {nonVegItems.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <NonVegIcon />
              <h2 className="text-base font-extrabold text-foreground">
                Non-Veg
              </h2>
            </div>
            <div className="space-y-3">
              {nonVegItems.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </section>
        )}

        {vegItems.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <VegIcon />
              <h2 className="text-base font-extrabold text-foreground">
                Veg
              </h2>
            </div>
            <div className="space-y-3">
              {vegItems.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Cart CTA */}
      {totalCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex w-full max-w-md items-center justify-between rounded-2xl bg-primary px-5 py-3 shadow-lg"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-bold text-primary-foreground">
              {totalCount}
            </span>
            <span className="text-sm font-extrabold text-primary-foreground">
              View Cart
            </span>
            <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default RestaurantDetail;