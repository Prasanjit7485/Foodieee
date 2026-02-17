import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import pizzaImg from "@/assets/pizza.jpg";
import burgerImg from "@/assets/burger.jpg";
import biryaniImg from "@/assets/biryani.jpg";

interface CartItem {
  id: number;
  name: string;
  restaurant: string;
  price: number;
  quantity: number;
  image: string;
}

const initialItems: CartItem[] = [
  { id: 1, name: "Margherita Pizza", restaurant: "Pizza Palace", price: 299, quantity: 1, image: pizzaImg },
  { id: 2, name: "Classic Burger", restaurant: "Burger Hub", price: 199, quantity: 2, image: burgerImg },
  { id: 3, name: "Chicken Biryani", restaurant: "Paradise Biryani", price: 349, quantity: 1, image: biryaniImg },
];

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">Your Cart</h1>
          <ShoppingCart className="ml-auto h-5 w-5 text-primary" />
        </div>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 pt-24 px-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <p className="text-lg font-bold text-foreground">Your cart is empty</p>
          <p className="text-sm text-muted-foreground text-center">
            Looks like you haven't added anything yet.
          </p>
          <Button onClick={() => navigate("/")} className="mt-2">
            Browse Restaurants
          </Button>
        </div>
      ) : (
        <main className="px-4 pt-4">
          {/* Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-2xl bg-card p-3 shadow-[var(--card-shadow)]"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-card-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.restaurant}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">₹{item.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold text-card-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-1 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-2xl bg-card p-4 shadow-[var(--card-shadow)]">
            <h3 className="text-sm font-extrabold text-card-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-extrabold text-card-foreground">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <Button className="mt-4 w-full h-12 text-base font-bold rounded-2xl">
            Proceed to Checkout • ₹{total}
          </Button>
        </main>
      )}

      <BottomNav />
    </div>
  );
};

export default Cart;
