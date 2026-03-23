import { Home, User, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "cart", label: "Cart", icon: ShoppingCart, path: "/cart" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = tabs.find((t) => t.path === location.pathname)?.id || "home";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bottom-nav border-t border-border">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? "text-bottom-nav-active" : "text-bottom-nav-inactive"
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-semibold">{tab.label}</span>
              {isActive && (
                <div className="mt-0.5 h-1 w-1 rounded-full bg-bottom-nav-active" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
