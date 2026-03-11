import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import { useCart } from "@/context/CartContext";
import { buildImageUrl } from "@/utils/image";

const BASE_URL = "http://localhost:8080";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    cartId,
    totalPrice,
    loading,
    error,
    initCart,
    updateQty,
    removeItem,
    clearCart,
    refreshCart,
  } = useCart();

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    // ✅ Auth check inside useEffect — safe to call navigate here
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/auth");
      return;
    }

    // ✅ Init cart only if not already loaded
    if (cartId === null) {
      initCart(Number(userId));
    }
  }, []);

  const placeOrder = async () => {
    const token = localStorage.getItem("token");       // ✅ always read fresh
    const userId = localStorage.getItem("userId");     // ✅ always read fresh

    if (!token || !userId) {
      navigate("/auth");
      return;
    }

    setOrderLoading(true);
    setOrderError(null);
    setOrderSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/orders/place/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
      }

      setOrderSuccess(true);
      await refreshCart();
      setTimeout(() => setOrderSuccess(false), 3000);
    } catch (e) {
      setOrderError((e as Error).message);
    } finally {
      setOrderLoading(false);
    }
  };

  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = totalPrice + deliveryFee;
  const isBusy = loading || orderLoading;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate("/")} className="text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">Your Cart</h1>

          {isBusy ? (
            <Loader2 className="ml-auto h-4 w-4 animate-spin text-primary" />
          ) : (
            <button
              onClick={refreshCart}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
              title="Refresh cart"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Cart error banner */}
        {error && (
          <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1 truncate">{error}</span>
            <button onClick={refreshCart} className="font-semibold underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {/* Order error banner */}
        {orderError && (
          <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1 truncate">Order failed: {orderError}</span>
            <button
              onClick={() => setOrderError(null)}
              className="font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Order success banner */}
        {orderSuccess && (
          <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 text-xs text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1">Order placed successfully! 🎉</span>
            <button
              onClick={() => navigate("/orders")}
              className="font-semibold underline underline-offset-2"
            >
              View Orders
            </button>
          </div>
        )}
      </header>

      {/* Empty state */}
      {!isBusy && items.length === 0 && !orderSuccess ? (
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
                className="flex gap-3 rounded-2xl bg-card p-3 shadow-[var(--card-shadow)] transition-opacity duration-200"
                style={{ opacity: isBusy ? 0.6 : 1 }}
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  {item.image ? (
                    <img src={buildImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
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
                        disabled={isBusy}
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.id!)
                            : updateQty(item.id!, item.quantity - 1, item)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-5 text-center text-sm font-bold text-card-foreground">
                        {item.quantity}
                      </span>

                      <button
                        disabled={isBusy}
                        onClick={() => updateQty(item.id!, item.quantity + 1, item)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>

                      <button
                        disabled={isBusy}
                        onClick={() => removeItem(item.id!)}
                        className="ml-1 text-destructive disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 rounded-2xl bg-card p-4 shadow-[var(--card-shadow)]">
            <h3 className="text-sm font-extrabold text-card-foreground mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between font-extrabold text-card-foreground">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Clear cart */}
          <button
            disabled={isBusy}
            onClick={clearCart}
            className="mt-3 w-full text-xs text-destructive/70 hover:text-destructive transition-colors disabled:opacity-40"
          >
            Clear entire cart
          </button>

          {/* Checkout button */}
          <Button
            disabled={isBusy || items.length === 0}
            onClick={placeOrder}
            className="mt-3 w-full h-12 text-base font-bold rounded-2xl disabled:opacity-50"
          >
            {orderLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing Order…
              </span>
            ) : loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating…
              </span>
            ) : (
              `Proceed to Checkout • ₹${total.toFixed(2)}`
            )}
          </Button>
        </main>
      )}

      <BottomNav />
    </div>
  );
};

export default Cart;