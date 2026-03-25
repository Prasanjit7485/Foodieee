import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut, ArrowLeft, Save, ChevronRight,
  User, MapPin, ClipboardList, Settings, Shield,
  Loader2, ShoppingBag, Clock, ChevronDown, ChevronUp,
  Utensils, Star, Package
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

interface OrderItemDetailsFromApi {
  id: number;
  orderId: number;
  foodId: number;
  price: number;
}

// ── Grouped item ──────────────────────────────────────────────────────────────

interface GroupedItem {
  foodId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  rawItems: OrderItemDetailsFromApi[];
}

function groupByFood(items: OrderItemDetailsFromApi[]): GroupedItem[] {
  const map = new Map<number, GroupedItem>();
  for (const item of items) {
    const existing = map.get(item.foodId);
    if (existing) {
      existing.quantity   += 1;
      existing.totalPrice += item.price;
      existing.rawItems.push(item);
    } else {
      map.set(item.foodId, {
        foodId:     item.foodId,
        quantity:   1,
        unitPrice:  item.price,
        totalPrice: item.price,
        rawItems:   [item],
      });
    }
  }
  return [...map.values()];
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

// ── VegIcon ───────────────────────────────────────────────────────────────────

const VegIcon = ({ isVeg }: { isVeg: boolean }) => (
  <span
    className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border-2 flex-shrink-0 ${
      isVeg ? "border-emerald-600" : "border-red-600"
    }`}
  >
    <span className={`h-2 w-2 rounded-full ${isVeg ? "bg-emerald-600" : "bg-red-600"}`} />
  </span>
);

// ── OrderCard ─────────────────────────────────────────────────────────────────

const OrderCard = ({ order, token }: { order: OrderDetailsDto; token: string | null }) => {
  const [expanded, setExpanded]               = useState(false);
  const [orderItems, setOrderItems]           = useState<OrderItemDetailsFromApi[] | null>(null);
  const [foodMap, setFoodMap]                 = useState<Record<number, FoodDto>>({});
  const [detailsLoading, setDetailsLoading]   = useState(true);
  const [detailsError, setDetailsError]       = useState(false);

  const grouped: GroupedItem[] = orderItems ? groupByFood(orderItems) : [];

  const formattedDate = new Date(order.orderTime).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // Build the correct image URL — handles both relative (/uploads/x.jpg)
  // and already-absolute paths returned by the backend
  const imageUrl = (filePath: string | null): string | null => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `http://localhost:8080${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const loadDetails = async () => {
    setDetailsLoading(true);
    setDetailsError(false);
    try {
      const res = await fetch(`http://localhost:8080/orders/orderDetails/${order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const items: OrderItemDetailsFromApi[] = await res.json();

      const uniqueFoodIds = [...new Set(items.map((i) => i.foodId))];
      const foodResults = await Promise.all(
        uniqueFoodIds.map((foodId) =>
          fetch(`http://localhost:8080/restaurants/foods/${foodId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then((r) => {
            if (!r.ok) return null;
            return r.json() as Promise<FoodDto>;
          }).catch(() => null)
        )
      );

      const map: Record<number, FoodDto> = {};
      foodResults.forEach((food) => { if (food) map[food.id] = food; });

      setOrderItems(items);
      setFoodMap(map);
    } catch (err) {
      console.error(`[OrderDetails #${order.id}] failed:`, err);
      setDetailsError(true);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => { loadDetails(); }, [order.id]);

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

        {/* Food pills — always visible once loaded */}
        <div className="mb-2">
          {detailsLoading ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Loading items…</span>
            </div>
          ) : detailsError ? (
            <span className="text-[11px] text-destructive font-semibold">Failed to load items</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {grouped.map((g) => {
                const food = foodMap[g.foodId];
                return (
                  <div
                    key={g.foodId}
                    className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2 py-1"
                  >
                    {imageUrl(food?.imageFilePath ?? null) ? (
                      <img
                        src={imageUrl(food!.imageFilePath)!}
                        alt={food!.name}
                        className="h-6 w-6 rounded-md object-cover flex-shrink-0 border border-border"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-3 w-3 text-primary/60" />
                      </div>
                    )}
                    {food?.isVeg != null && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                          food.isVeg ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                    )}
                    <span className="text-[11px] font-semibold text-foreground">
                      {food?.name ?? `Food #${g.foodId}`}
                    </span>
                    {g.quantity > 1 && (
                      <span className="text-[10px] font-bold bg-primary/15 text-primary rounded-full px-1.5 py-0.5 leading-none">
                        ×{g.quantity}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expanded breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-dashed border-border space-y-1">

            {detailsLoading && (
              <div className="flex items-center justify-center gap-2 py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading order details…</span>
              </div>
            )}

            {detailsError && !detailsLoading && (
              <div className="flex flex-col items-center gap-2 py-4">
                <p className="text-xs text-destructive font-semibold">Failed to load details</p>
                <button onClick={loadDetails} className="text-xs text-primary underline">
                  Retry
                </button>
              </div>
            )}

            {grouped.length > 0 && !detailsLoading && (
              <>
                {/* Section heading */}
                <div className="flex items-center gap-1.5 mb-3">
                  <Utensils className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                    {grouped.length} Item{grouped.length !== 1 ? "s" : ""} Ordered
                  </p>
                </div>

                {/* Item rows */}
                <div className="space-y-3">
                  {grouped.map((g) => {
                    const food = foodMap[g.foodId];
                    return (
                      <div key={g.foodId} className="flex items-start gap-3">
                        {/* Large thumbnail */}
                        {imageUrl(food?.imageFilePath ?? null) ? (
                          <img
                            src={imageUrl(food!.imageFilePath)!}
                            alt={food!.name}
                            className="h-14 w-14 rounded-xl object-cover flex-shrink-0 border border-border"
                            onError={(e) => {
                              const el = e.currentTarget as HTMLImageElement;
                              el.style.display = "none";
                              el.nextElementSibling?.removeAttribute("hidden");
                            }}
                          />
                        ) : null}
                        <div
                          hidden={!!imageUrl(food?.imageFilePath ?? null)}
                          className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-border"
                        >
                          <Package className="h-5 w-5 text-primary/60" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {food?.isVeg != null && <VegIcon isVeg={food.isVeg} />}
                            <p className="text-sm font-bold text-foreground leading-tight">
                              {food?.name ?? `Food #${g.foodId}`}
                            </p>
                            {food?.bestseller && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 leading-tight">
                                ★ Bestseller
                              </span>
                            )}
                          </div>

                          {food?.description && (
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                              {food.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-1.5">
                            {food?.rating != null && (
                              <div className="flex items-center gap-0.5">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="text-[11px] font-semibold text-muted-foreground">
                                  {food.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              {g.quantity > 1 && (
                                <span className="text-[11px] text-muted-foreground">
                                  ₹{g.unitPrice.toFixed(2)} × {g.quantity}
                                </span>
                              )}
                              <span className="text-xs font-extrabold text-primary">
                                ₹{g.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity pill */}
                        <span className="text-[11px] font-bold text-muted-foreground bg-muted rounded-lg px-2 py-1 leading-none flex-shrink-0">
                          ×{g.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Price breakdown */}
                <div className="mt-4 pt-3 border-t border-border rounded-xl bg-muted/40 px-3 py-2.5 space-y-1.5">
                  {grouped.map((g) => (
                    <div key={g.foodId} className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground truncate max-w-[60%]">
                        {foodMap[g.foodId]?.name ?? `Food #${g.foodId}`}
                        {g.quantity > 1 && (
                          <span className="ml-1 text-muted-foreground/60">×{g.quantity}</span>
                        )}
                      </span>
                      <span className="text-[11px] font-semibold text-foreground">
                        ₹{g.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-dashed border-border my-1" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">Total Paid</span>
                    <span className="text-base font-extrabold text-primary">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          {!expanded && (
            <p className="text-sm font-extrabold text-primary">₹{order.totalAmount.toFixed(2)}</p>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            disabled={detailsLoading}
            className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {detailsLoading
              ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…</>
              : expanded
              ? <><ChevronUp className="h-3.5 w-3.5" /> Hide Details</>
              : <><ChevronDown className="h-3.5 w-3.5" /> View Details</>}
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

  const [profile, setProfile]             = useState<ProfileDto | null>(null);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [orders, setOrders]               = useState<OrderDetailsDto[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"menu" | "edit" | "orders" | "settings">("menu");

  const [name, setName]       = useState("");
  const [age, setAge]         = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");

  // Fetch profile
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

  // Fetch orders when section opens
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

  // Save profile
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
      const res = await fetch(`http://localhost:8080/profile/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Backend may return the updated profile as JSON, or just a 200/204 with no body
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const updated: ProfileDto = await res.json();
        setProfile(updated);
      } else {
        // No JSON body — update local state directly from what we sent
        setProfile(payload);
      }

      toast({ title: "Profile updated", description: "Your changes have been saved." });
      setActiveSection("menu");
    } catch (err) {
      console.error("[handleSave] failed:", err);
      toast({ title: "Error", description: "Could not save profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Logout
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

        {/* MENU */}
        {activeSection === "menu" && (
          <div className="space-y-6">
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

        {/* EDIT */}
        {activeSection === "edit" && (
          <div className="space-y-4">
            {[
              { label: "Name",    value: name,    set: setName,    placeholder: "Your name" },
              { label: "Age",     value: age,     set: setAge,     placeholder: "Your age",         type: "number" },
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

        {/* ORDERS */}
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

        {/* SETTINGS */}
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