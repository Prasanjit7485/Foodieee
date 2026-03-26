import {
  ArrowLeft,
  Star,
  Clock,
  ShoppingCart,
  Plus,
  Minus,
  Leaf,
  Flame,
  Trophy,
  ChevronUp,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { getFoodsByRestaurantId, getRestaurantById } from "@/api/restaurantApi";
import { buildImageUrl } from "@/utils/image";
import { useState, useRef, useEffect } from "react";

// ===== DTO Types =====
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

// ===== Veg / Non-veg dot icons =====
const VegDot = () => (
  <span className="rd-veg-dot rd-veg">
    <span />
  </span>
);
const NonVegDot = () => (
  <span className="rd-veg-dot rd-nonveg">
    <span />
  </span>
);

// ===== Food Card =====
const FoodCard = ({
  item,
  restaurantName,
  index,
}: {
  item: FoodItem;
  restaurantName: string;
  index: number;
}) => {
  const { items, addItem, updateQty } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const cartItem = items.find((i) => i.foodId === item.id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    addItem({
      foodId: item.id,
      name: item.name,
      restaurant: restaurantName,
      price: item.price,
      image: item.imageFilePath,
    });
  };

  return (
    <div className="rd-food-card" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Text side */}
      <div className="rd-food-info">
        <div className="rd-food-meta">
          {item.isVeg ? <VegDot /> : <NonVegDot />}
          {item.bestseller && (
            <span className="rd-bestseller">
              <Trophy size={9} /> Bestseller
            </span>
          )}
        </div>

        <h3 className="rd-food-name">{item.name}</h3>

        <div className="rd-food-rating">
          <Star size={11} className="rd-star-icon" />
          <span>{item.rating.toFixed(1)}</span>
        </div>

        <p className="rd-food-desc">{item.description}</p>

        <p className="rd-food-price">₹{item.price}</p>
      </div>

      {/* Image + Add button */}
      <div className="rd-food-img-wrap">
        <img
          src={buildImageUrl(item.imageFilePath)}
          alt={item.name}
          className="rd-food-img"
          loading="lazy"
        />

        <div className="rd-add-wrap">
          {qty === 0 ? (
            <button className="rd-add-btn" onClick={handleAdd}>
              <Plus size={13} />
              <span>ADD</span>
            </button>
          ) : (
            <div className="rd-qty-ctrl">
              <button onClick={() => cartItem && updateQty(cartItem.id!, qty - 1, cartItem)}>
                <Minus size={12} />
              </button>
              <span>{qty}</span>
              <button onClick={() => cartItem && updateQty(cartItem.id!, qty + 1, cartItem)}>
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Category Tab =====
const CategoryTab = ({
  label,
  icon,
  active,
  onClick,
  colorClass = "",
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  colorClass?: string;
}) => (
  <button
    onClick={onClick}
    className={`rd-cat-tab ${colorClass} ${active ? "rd-cat-tab--active" : ""}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

// ===== Main Component =====
const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { totalCount, totalPrice } = useCart();
  const [activeTab, setActiveTab] = useState<"all" | "veg" | "nonveg">("all");
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 180);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data: restaurant, isLoading: rLoading, isError: rError } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => (await getRestaurantById(id!)).data as Restaurant,
    enabled: !!id,
  });

  const { data: foods, isLoading: fLoading, isError: fError } = useQuery({
    queryKey: ["foods", id],
    queryFn: async () => (await getFoodsByRestaurantId(id!)).data as FoodItem[],
    enabled: !!id,
  });

  if (rLoading || fLoading) {
    return (
      <div className="rd-loader">
        <div className="rd-spinner" />
        <p>Loading menu…</p>
      </div>
    );
  }

  if (rError || fError || !restaurant) {
    return (
      <div className="rd-error">
        <p>Restaurant not found</p>
        <Button onClick={() => navigate("/")}>Go Home</Button>
      </div>
    );
  }

  const vegItems = foods?.filter((i) => i.isVeg) ?? [];
  const nonVegItems = foods?.filter((i) => !i.isVeg) ?? [];
  const visibleItems =
    activeTab === "veg" ? vegItems :
    activeTab === "nonveg" ? nonVegItems :
    foods ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Outfit:wght@400;500;600;700&display=swap');

        .rd-root {
          min-height: 100vh;
          background: var(--background);
          padding-bottom: 7rem;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Hero ── */
        .rd-hero {
          position: relative;
          height: 240px;
          overflow: hidden;
        }
        .rd-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rd-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0.72) 100%
          );
        }
        .rd-back-btn {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s;
        }
        .rd-back-btn:hover { background: rgba(255,255,255,0.3); }

        .rd-offer-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--primary);
          color: var(--primary-foreground);
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .rd-hero-info {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
        }
        .rd-hero-cuisine {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.65);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .rd-hero-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          margin: 0 0 10px;
        }
        .rd-hero-chips {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rd-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 11.5px;
          font-weight: 600;
          color: #fff;
        }
        .rd-chip-star { color: #fbbf24; fill: #fbbf24; }

        /* ── Sticky mini-header ── */
        .rd-sticky-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: var(--background);
          border-bottom: 1px solid var(--border);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transform: translateY(-100%);
          transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        .rd-sticky-header.rd-sticky-visible {
          transform: translateY(0);
        }
        .rd-sticky-back {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--card);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: var(--foreground);
        }
        .rd-sticky-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Category tabs ── */
        .rd-tabs {
          display: flex;
          gap: 8px;
          padding: 14px 16px 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .rd-tabs::-webkit-scrollbar { display: none; }

        .rd-cat-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 20px;
          font-size: 12.5px;
          font-weight: 600;
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--muted-foreground);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .rd-cat-tab--active {
          background: var(--foreground);
          color: var(--background);
          border-color: var(--foreground);
        }
        .rd-cat-tab--veg.rd-cat-tab--active {
          background: #16a34a;
          color: #fff;
          border-color: #16a34a;
        }
        .rd-cat-tab--nonveg.rd-cat-tab--active {
          background: #dc2626;
          color: #fff;
          border-color: #dc2626;
        }

        /* ── Section label ── */
        .rd-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 18px 16px 10px;
        }
        .rd-section-line {
          flex: 1;
          height: 1px;
          background: var(--border);
        }
        .rd-section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-foreground);
        }

        /* ── Food Card ── */
        .rd-food-list {
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .rd-food-card {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
          animation: rdFadeUp 0.35s both ease-out;
        }
        .rd-food-card:last-child { border-bottom: none; }

        @keyframes rdFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .rd-food-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .rd-food-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .rd-veg-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .rd-veg-dot span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .rd-veg { border: 2px solid #16a34a; }
        .rd-veg span { background: #16a34a; }
        .rd-nonveg { border: 2px solid #dc2626; }
        .rd-nonveg span { background: #dc2626; }

        .rd-bestseller {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 700;
          color: #b45309;
          background: #fef3c7;
          padding: 2px 7px;
          border-radius: 20px;
        }

        .rd-food-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 700;
          color: var(--foreground);
          line-height: 1.3;
          margin: 0;
        }

        .rd-food-rating {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--muted-foreground);
        }
        .rd-star-icon { fill: #fbbf24; color: #fbbf24; }

        .rd-food-desc {
          font-size: 11.5px;
          color: var(--muted-foreground);
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
        }

        .rd-food-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--foreground);
          margin-top: 2px;
        }

        /* ── Food image + add button ── */
        .rd-food-img-wrap {
          position: relative;
          width: 110px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .rd-add-wrap {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .rd-food-img {
          width: 110px;
          height: 108px;
          object-fit: cover;
          border-radius: 14px;
          display: block;
          margin-bottom: 10px;
        }



        .rd-add-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--background);
          color: var(--primary);
          border: 1.5px solid var(--primary);
          border-radius: 8px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          font-family: 'Outfit', sans-serif;
        }
        .rd-add-btn:active {
          background: var(--primary);
          color: var(--primary-foreground);
        }

        .rd-qty-ctrl {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--primary);
          border-radius: 8px;
          padding: 5px 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .rd-qty-ctrl button {
          color: var(--primary-foreground);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .rd-qty-ctrl span {
          min-width: 16px;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--primary-foreground);
        }

        /* ── Cart bar ── */
        .rd-cart-bar {
          position: fixed;
          bottom: 72px;
          left: 16px;
          right: 16px;
          z-index: 40;
          background: var(--foreground);
          color: var(--background);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 32px rgba(0,0,0,0.22);
          cursor: pointer;
          animation: rdSlideUp 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        @keyframes rdSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .rd-cart-left {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .rd-cart-count {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.65;
        }
        .rd-cart-label {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
        }
        .rd-cart-right {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        /* ── Loader / Error ── */
        .rd-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 12px;
          color: var(--muted-foreground);
          font-family: 'Outfit', sans-serif;
        }
        .rd-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: rdSpin 0.7s linear infinite;
        }
        @keyframes rdSpin { to { transform: rotate(360deg); } }

        .rd-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 16px;
          font-family: 'Outfit', sans-serif;
        }
      `}</style>

      {/* Sticky mini-header (appears on scroll) */}
      <div className={`rd-sticky-header ${scrolled ? "rd-sticky-visible" : ""}`}>
        <button className="rd-sticky-back" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
        </button>
        <span className="rd-sticky-name">{restaurant.name}</span>
      </div>

      <div className="rd-root">
        {/* Hero */}
        <div className="rd-hero">
          <img
            src={buildImageUrl(restaurant.imageFilePath)}
            alt={restaurant.name}
            className="rd-hero-img"
          />
          <div className="rd-hero-overlay" />

          <button className="rd-back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
          </button>

          {restaurant.offer && (
            <div className="rd-offer-badge">{restaurant.offer}</div>
          )}

          <div className="rd-hero-info">
            <p className="rd-hero-cuisine">{restaurant.cuisine}</p>
            <h1 className="rd-hero-name">{restaurant.name}</h1>
            <div className="rd-hero-chips">
              <div className="rd-chip">
                <Star size={12} className="rd-chip-star" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              <div className="rd-chip">
                <Clock size={12} />
                <span>{restaurant.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="rd-tabs">
          <CategoryTab
            label="All"
            icon={null}
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
          />
          {vegItems.length > 0 && (
            <CategoryTab
              label={`Veg (${vegItems.length})`}
              icon={<Leaf size={12} />}
              active={activeTab === "veg"}
              onClick={() => setActiveTab("veg")}
              colorClass="rd-cat-tab--veg"
            />
          )}
          {nonVegItems.length > 0 && (
            <CategoryTab
              label={`Non-Veg (${nonVegItems.length})`}
              icon={<Flame size={12} />}
              active={activeTab === "nonveg"}
              onClick={() => setActiveTab("nonveg")}
              colorClass="rd-cat-tab--nonveg"
            />
          )}
        </div>

        {/* Section divider */}
        <div className="rd-section-label">
          <div className="rd-section-line" />
          <span className="rd-section-title">
            {activeTab === "veg" ? "Veg Items" : activeTab === "nonveg" ? "Non-Veg Items" : "Full Menu"}
          </span>
          <div className="rd-section-line" />
        </div>

        {/* Food list */}
        <div className="rd-food-list">
          {visibleItems.map((item, i) => (
            <FoodCard
              key={item.id}
              item={item}
              restaurantName={restaurant.name}
              index={i}
            />
          ))}
          {visibleItems.length === 0 && (
            <p style={{ textAlign: "center", padding: "32px 0", color: "var(--muted-foreground)", fontSize: 14 }}>
              No items in this category.
            </p>
          )}
        </div>
      </div>

      {/* Cart bar */}
      {totalCount > 0 && (
        <div className="rd-cart-bar" onClick={() => navigate("/cart")}>
          <div className="rd-cart-left">
            <span className="rd-cart-count">{totalCount} item{totalCount > 1 ? "s" : ""} added</span>
            <span className="rd-cart-label">View Cart</span>
          </div>
          <div className="rd-cart-right">
            <span>₹{totalPrice ?? ""}</span>
            <ShoppingCart size={18} />
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
};

export default RestaurantDetail;