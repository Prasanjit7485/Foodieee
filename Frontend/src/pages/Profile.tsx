import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut, ArrowLeft, Save, ChevronRight,
  User, MapPin, Phone, ClipboardList, Settings, Shield, Loader2
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

// DTO shape returned by backend
interface ProfileDto {
  id: number;
  name: string;
  age: number;
  phoneNumber: string;
  address: string;
  userAuthId: number;
}

const Profile = () => {
  const navigate = useNavigate();

  // Pull userId that was stored at login (e.g. localStorage.setItem("userId", id))
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [activeSection, setActiveSection] = useState<"menu" | "edit" | "orders" | "settings">("menu");

  // Edit-form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ── Fetch profile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:8080/profile/${userId}`);
        if (res.status === 401 || res.status === 403) {
          navigate("/auth");
          return;
        }
        if (!res.ok) throw new Error("Failed to load profile");

        const data: ProfileDto = await res.json();
        setProfile(data);

        // Seed edit fields
        setName(data.name || "");
        setAge(data.age?.toString() || "");
        setPhone(data.phoneNumber || "");
        setAddress(data.address || "");
      } catch (err) {
        toast({ title: "Error", description: "Could not load profile.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  // ── Save profile ────────────────────────────────────────────────────────────
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

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

  // ── Logout ──────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser"); // clean up if still present
    navigate("/auth");
  };

  // ── Orders (still local – wire to backend when ready) ──────────────────────
  const orders = JSON.parse(localStorage.getItem(`orders_${userId}`) || "[]");

  // ── Derived display values ──────────────────────────────────────────────────
  const displayName = profile?.name || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const menuItems = [
    { id: "edit" as const,     label: "Edit Profile",     icon: User,          desc: "Name, phone, address" },
    { id: "orders" as const,   label: "Previous Orders",  icon: ClipboardList, desc: `${orders.length} orders` },
    { id: "settings" as const, label: "Settings",         icon: Settings,      desc: "Preferences" },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
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
            {activeSection === "menu"     ? "Profile"
            : activeSection === "edit"    ? "Edit Profile"
            : activeSection === "orders"  ? "Previous Orders"
            :                               "Settings"}
          </h1>
        </div>
      </header>

      <main className="px-4 pt-6 max-w-md mx-auto">

        {/* ── MENU ── */}
        {activeSection === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-base font-extrabold text-foreground">{displayName}</p>
              {profile.age && (
                <p className="text-sm text-muted-foreground">Age {profile.age}</p>
              )}
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 shadow-[var(--card-shadow)] transition-colors hover:bg-accent/50"
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
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Age</label>
              <Input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
                type="number"
                min={0}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1 block">Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Delivery address" />
            </div>
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
            {orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 pt-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm font-bold text-foreground">No orders yet</p>
                <p className="text-xs text-muted-foreground text-center">Your order history will appear here</p>
              </div>
            ) : (
              orders.map((order: any, idx: number) => (
                <div key={idx} className="rounded-2xl bg-card p-4 shadow-[var(--card-shadow)]">
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                  <p className="text-sm font-bold text-card-foreground mt-1">{order.restaurant}</p>
                  <p className="text-xs text-muted-foreground">{order.items?.join(", ")}</p>
                  <p className="text-sm font-extrabold text-primary mt-1">₹{order.total}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeSection === "settings" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-card p-4 shadow-[var(--card-shadow)]">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold text-card-foreground">Account Security</p>
                  <p className="text-xs text-muted-foreground">Password & login settings</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-card p-4 shadow-[var(--card-shadow)]">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold text-card-foreground">Saved Addresses</p>
                  <p className="text-xs text-muted-foreground">Manage delivery locations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;