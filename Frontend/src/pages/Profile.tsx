import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut, ArrowLeft, Save, ChevronRight,
  User, MapPin, ClipboardList, Settings, Shield,
  Loader2, ShoppingBag, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

// ── DTOs ─────────────────────────────────────────────────────────────────────

interface ProfileDto {
  id: number;
  name: string;
  age: number;
  phoneNumber: string;
  address: string;
  userAuthId: number;
}

interface OrderItemDetailsDto {
  id: number;
  orderId: number;
  foodId: number;
  price: number;
}

interface OrderDetailsDto {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  orderTime: string;
  OrderItemDetailsDto: OrderItemDetailsDto[];
}

interface FoodDto {
  id: number;
  name: string;
  price: number;
  rating: number | null;
  imageFilePath: string | null;
  description: string | null;
  isVeg: boolean | null;
  bestseller: boolean | null;
  menuId: number;
  restaurantId: number;
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; color: string }> = {
    DELIVERED:  { label: "Delivered",  color: "bg-emerald-100 text-emerald-700" },
    PENDING:    { label: "Pending",    color: "bg-amber-100 text-amber-700" },
    CANCELLED:  { label: "Cancelled",  color: "bg-red-100 text-red-600" },
    PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-700" },
  };
  const s = map[status?.toUpperCase()] ?? { label: status, color: "bg-muted text-muted-foreground" };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
      {s.label}
    </span>
  );
};

// ── OrderCard ─────────────────────────────────────────────────────────────────

const OrderCard = ({ order, token }: { order: OrderDetailsDto; token: string | null }) => {
  const [expanded, setExpanded] = useState(false);
  const [foodDetails, setFoodDetails] = useState<Record<number, FoodDto>>({});
  const [foodLoading, setFoodLoading] = useState(true);

  const formattedDate = new Date(order.orderTime).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // Fetch all food details eagerly on mount
  useEffect(() => {
    if (!order.OrderItemDetailsDto?.length) { setFoodLoading(false); return; }

    const fetchFoodDetails = async () => {
      setFoodLoading(true);
      try {
        const results = await Promise.all(
          order.OrderItemDetailsDto.map(item =>
            fetch(`http://localhost:8080/restaurants/foods/${item.foodId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(r => r.ok ? r.json() as Promise<FoodDto> : null)
          )
        );
        const map: Record<number, FoodDto> = {};
        results.forEach(food => { if (food) map[food.id] = food; });
        setFoodDetails(map);
      } catch {
        // fall back to foodId display
      } finally {
        setFoodLoading(false);
      }
    };

    fetchFoodDetails();
  }, []);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-card-foreground leading-tight">
              Order #{order.id}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mx-4 border-t border-dashed border-border my-2" />

      {/* Body */}
      <div className="px-4 pb-3">

        {/* Food name pills — always visible */}
        <div className="mb-2">
          {foodLoading ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Loading items…</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {order.OrderItemDetailsDto?.map(item => {
                const food = foodDetails[item.foodId];
                return (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground"
                  >
                    {food?.isVeg != null && (
                      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${food.isVeg ? "bg-emerald-500" : "bg-red-500"}`} />
                    )}
                    {food?.name ?? `Food #${item.foodId}`}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Expanded breakdown */}
        {expanded && !foodLoading && (
          <div className="space-y-3 mt-3 pt-3 border-t border-dashed border-border">
            {order.OrderItemDetailsDto?.map((item) => {
              const food = foodDetails[item.foodId];
              return (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {food?.imageFilePath ? (
                      <img
                        src={`http://localhost:8080${food.imageFilePath}`}
                        alt={food.name}
                        className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {food?.name ?? `Food #${item.foodId}`}
                        </p>
                        {food?.isVeg != null && (
                          <span className={`h-2 w-2 rounded-full flex-shrink-0 ${food.isVeg ? "bg-emerald-500" : "bg-red-500"}`} />
                        )}
                        {food?.bestseller && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            ★ Best
                          </span>
                        )}
                      </div>
                      {food?.description && (
                        <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                          {food.description}
                        </p>
                      )}
                      {food?.rating != null && (
                        <p className="text-[10px] text-muted-foreground">⭐ {food.rating.toFixed(1)}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-foreground flex-shrink-0">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>
              );
            })}

            {/* Order total */}
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-xs font-bold text-foreground">Order Total</span>
              <span className="text-sm font-extrabold text-primary">
                ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          {!expanded && (
            <p className="text-sm font-extrabold text-primary">₹{order.totalAmount.toFixed(2)}</p>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded
              ? <><ChevronUp className="h-3.5 w-3.5" /> Less</>
              : <><ChevronDown className="h-3.5 w-3.5" /> Details</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Profile ───────────────────────────────────────────────────────────────────

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token  = localStorage.getItem("token");

  const [profile, setProfile]               = useState<ProfileDto | null>(null);
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [orders, setOrders]                 = useState<OrderDetailsDto[]>([]);
  const [ordersLoading, setOrdersLoading]   = useState(false);
  const [activeSection, setActiveSection]   = useState<"menu" | "edit" | "orders" | "settings">("menu");

  const [name, setName]       = useState("");
  const [age, setAge]         = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");

  // ── Fetch profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) { navigate("/auth"); return; }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) { navigate("/auth"); return; }
        if (!res.ok) throw new Error();
        const data: ProfileDto = await res.json();
        setProfile(data);
        setName(data.name || "");
        setAge(data.age?.toString() || "");
        setPhone(data.phoneNumber || "");
        setAddress(data.address || "");
      } catch {
        toast({ title: "Error", description: "Could not load profile.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  // ── Fetch orders when section opens ──────────────────────────────────────
  useEffect(() => {
    if (activeSection !== "orders" || !userId) return;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/orders/details/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data: OrderDetailsDto[] = await res.json();
        setOrders(data);
      } catch {
        toast({ title: "Error", description: "Could not load orders.", variant: "destructive" });
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [activeSection, userId]);

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const payload: ProfileDto = {
      ...profile,
      name,
      age: parseInt(age) || profile.age,
      phoneNumber: phone,
      address,
    };
    try {
      const res = await fetch(`http://localhost:8080/profile/update/${userId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated: ProfileDto = await res.json();
      setProfile(updated);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
      setActiveSection("menu");
    } catch {
      toast({ title: "Error", description: "Could not save profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const displayName = profile?.name || "User";
  const initials    = displayName.slice(0, 2).toUpperCase();

  const menuItems = [
    { id: "edit"     as const, label: "Edit Profile",    icon: User,          desc: "Name, phone, address" },
    { id: "orders"   as const, label: "Previous Orders", icon: ClipboardList, desc: `${orders.length} orders` },
    { id: "settings" as const, label: "Settings",        icon: Settings,      desc: "Preferences" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-24">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => activeSection === "menu" ? navigate("/") : setActiveSection("menu")}
            className="text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">
            {activeSection === "menu"    ? "Profile"
            : activeSection === "edit"   ? "Edit Profile"
            : activeSection === "orders" ? "Previous Orders"
            :                              "Settings"}
          </h1>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">

        {/* ── MENU ── */}
        {activeSection === "menu" && (
          <div className="space-y-6">
            {/* Avatar card */}
            <div className="flex flex-col items-center gap-2 py-6 rounded-2xl bg-card border border-border shadow-sm">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-base font-extrabold text-foreground">{displayName}</p>
              {profile.phoneNumber && (
                <p className="text-xs text-muted-foreground">{profile.phoneNumber}</p>
              )}
              {profile.age > 0 && (
                <p className="text-xs text-muted-foreground">Age {profile.age}</p>
              )}
              {profile.address && (
                <div className="flex items-center gap-1 px-4">
                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <p className="text-xs text-muted-foreground truncate max-w-[220px]">{profile.address}</p>
                </div>
              )}
            </div>

            {/* Menu items */}
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 border border-border shadow-sm transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold text-card-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full h-12 text-base font-bold rounded-xl gap-2"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        )}

        {/* ── EDIT ── */}
        {activeSection === "edit" && (
          <div className="space-y-4">
            {[
              { label: "Name",    value: name,    set: setName,    placeholder: "Your name" },
              { label: "Age",     value: age,     set: setAge,     placeholder: "Your age",          type: "number" },
              { label: "Phone",   value: phone,   set: setPhone,   placeholder: "Phone number" },
              { label: "Address", value: address, set: setAddress, placeholder: "Delivery address" },
            ].map(({ label, value, set, placeholder, type }) => (
              <div key={label}>
                <label className="text-sm font-semibold text-foreground mb-1 block">{label}</label>
                <Input
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  type={type ?? "text"}
                />
              </div>
            ))}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 text-base font-bold rounded-xl gap-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeSection === "orders" && (
          <div className="space-y-3">
            {ordersLoading ? (
              <div className="flex flex-col items-center gap-3 pt-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading orders…</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 pt-16">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-bold text-foreground">No orders yet</p>
                <p className="text-xs text-muted-foreground text-center">
                  Your order history will appear here
                </p>
                <Button onClick={() => navigate("/")} className="mt-2 rounded-xl gap-2" size="sm">
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground font-semibold pb-1">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} token={token} />
                ))}
              </>
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeSection === "settings" && (
          <div className="space-y-3">
            {[
              { icon: Shield, label: "Account Security", desc: "Password & login settings" },
              { icon: MapPin, label: "Saved Addresses",  desc: "Manage delivery locations" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-2xl bg-card p-4 border border-border shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;