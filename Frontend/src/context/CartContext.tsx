import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
const BASE_URL = "http://localhost:8080";

// ─── DTOs (mirror your Spring Boot DTOs) ────────────────────────────────────

interface CartItemDetailsDto {
  id?: number;
  cartId?: number;
  foodId: number;
  quantity: number;
  price: number;
}

interface CartDetailsDto {
  id?: number;
  userId: number;
  items: CartItemDetailsDto[];
  totalPrice?: number;
}

// ─── Frontend-enriched item (adds display fields on top of DTO) ──────────────

export interface CartItem extends CartItemDetailsDto {
  name: string;
  restaurant: string;
  image: string;
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface CartContextType {
  items: CartItem[];
  cartId: number | null;
  totalCount: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
  initCart: (userId: number) => Promise<void>;
  addItem: (item: Omit<CartItem, "id" | "cartId" | "quantity">) => Promise<void>;
  updateQty: (cartItemId: number, newQty: number, currentItem: CartItem) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// ─── Context + hook ───────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

// ─── Display metadata cache (keyed by foodId) ─────────────────────────────────

type DisplayMeta = { name: string; restaurant: string; image: string };
const metaCache = new Map<number, DisplayMeta>();

// ─── Provider ────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(() => {
    const stored = sessionStorage.getItem("cartId");
    return stored ? Number(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────────

  const request = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...options,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) return res.json() as Promise<T>;
      return res.text() as unknown as T;
    },
    []
  );

  /** Merge display metadata back onto raw DTOs from the backend */
  const enrichItems = (dtos: CartItemDetailsDto[]): CartItem[] =>
    dtos.map((dto) => {
      const meta = metaCache.get(dto.foodId) ?? {
        name: `Food #${dto.foodId}`,
        restaurant: "—",
        image: "",
      };
      return { ...dto, ...meta };
    });

  // ── fetch latest cart items from backend ──────────────────────────────────

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dtos = await request<CartItemDetailsDto[]>("/cart/all");
      setItems(enrichItems(dtos));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  // ── ensure cart exists and return cartId ──────────────────────────────────
  // 1. Try GET /cart/user/{userId} to see if a cart already exists
  // 2. If not (404 / empty), POST /cart/addCart to create one
  // 3. GET /cart/user/{userId} again to get the real CartDetailsDto with id

  const ensureCart = useCallback(
    async (userId: number): Promise<number> => {
      // Step 1: try to fetch existing cart
      try {
        const cartDetails = await request<CartDetailsDto>(`/cart/user/${userId}`);
        if (cartDetails?.id) {
          setCartId(cartDetails.id);
          sessionStorage.setItem("cartId", String(cartDetails.id));
          setItems(enrichItems(cartDetails.items ?? []));
          return cartDetails.id;
        }
      } catch {
        // Cart doesn't exist yet — fall through to create it
      }

      // Step 2: create the cart
      const payload: CartDetailsDto = { userId, items: [] };
      await request<string>("/cart/addCart", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Step 3: fetch again to get the real cartId
      const newCartDetails = await request<CartDetailsDto>(`/cart/user/${userId}`);
      const resolvedCartId = newCartDetails.id!;
      setCartId(resolvedCartId);
      sessionStorage.setItem("cartId", String(resolvedCartId));
      setItems(enrichItems(newCartDetails.items ?? []));
      return resolvedCartId;
    },
    [request]
  );

  // ── initCart (public API — kept for backwards compat) ─────────────────────

  const initCart = useCallback(
    async (userId: number) => {
      setLoading(true);
      setError(null);
      try {
        await ensureCart(userId);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [ensureCart]
  );

  // ── add item ───────────────────────────────────────────────────────────────

  const addItem = useCallback(
    async (item: Omit<CartItem, "id" | "cartId" | "quantity">) => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        window.location.href = "/auth";
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Resolve (or create) the cart — always get the real cartId
        let currentCartId = cartId;
        if (!currentCartId) {
          currentCartId = await ensureCart(Number(userId));
        }

        // Cache display metadata
        metaCache.set(item.foodId, {
          name: item.name,
          restaurant: item.restaurant,
          image: item.image,
        });

        const existing = items.find((i) => i.foodId === item.foodId);

        if (existing && existing.id != null) {
          // Item already in cart — increment quantity
          await request<string>(`/cart/updateItems/${existing.id}`, {
            method: "PUT",
            body: JSON.stringify({
              cartId: currentCartId,
              foodId: item.foodId,
              quantity: existing.quantity + 1,
              price: item.price,
            }),
          });
        } else {
          // New item — add to cart
          await request<string>("/cart/addItems", {
            method: "POST",
            body: JSON.stringify({
              cartId: currentCartId,
              foodId: item.foodId,
              quantity: 1,
              price: item.price,
            }),
          });
        }

        await refreshCart();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [cartId, items, request, refreshCart, ensureCart]
  );

  // ── update quantity ────────────────────────────────────────────────────────

  const updateQty = useCallback(
    async (cartItemId: number, newQty: number, currentItem: CartItem) => {
      if (newQty <= 0) {
        return removeItem(cartItemId);
      }
      setLoading(true);
      setError(null);
      try {
        await request<string>(`/cart/updateItems/${cartItemId}`, {
          method: "PUT",
          body: JSON.stringify({
            cartId: currentItem.cartId,
            foodId: currentItem.foodId,
            quantity: newQty,
            price: currentItem.price,
          } satisfies CartItemDetailsDto),
        });
        await refreshCart();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [request, refreshCart]
  );

  // ── remove single item ─────────────────────────────────────────────────────

  const removeItem = useCallback(
    async (cartItemId: number) => {
      setLoading(true);
      setError(null);
      try {
        await request<string>(`/cart/deleteItems/${cartItemId}`, {
          method: "DELETE",
        });
        await refreshCart();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [request, refreshCart]
  );

  // ── clear entire cart ──────────────────────────────────────────────────────

  const clearCart = useCallback(async () => {
    if (cartId === null) return;
    setLoading(true);
    setError(null);
    try {
      await request<string>(`/cart/clear/${cartId}`, { method: "DELETE" });
      setItems([]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [cartId, request]);

  // ── hydrate on mount if we already have a cartId in session ───────────────

  useEffect(() => {
    if (cartId !== null) refreshCart();
  }, []); // intentionally run once

  // ── derived values ─────────────────────────────────────────────────────────

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartId,
        totalCount,
        totalPrice,
        loading,
        error,
        initCart,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};