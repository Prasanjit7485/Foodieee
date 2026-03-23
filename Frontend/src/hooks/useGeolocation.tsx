import { useState, useCallback } from "react";

interface GeoState {
  address: string | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    address: localStorage.getItem("userAddress"),
    loading: false,
    error: null,
  });

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocation not supported" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address;
          const short = [
            addr.road || addr.neighbourhood || addr.suburb,
            addr.city || addr.town || addr.village || addr.state_district,
          ]
            .filter(Boolean)
            .join(", ");

          const finalAddress = short || data.display_name?.split(",").slice(0, 2).join(",") || "Current Location";
          localStorage.setItem("userAddress", finalAddress);
          setState({ address: finalAddress, loading: false, error: null });
        } catch {
          setState({ address: null, loading: false, error: "Could not fetch address" });
        }
      },
      (err) => {
        setState({ address: null, loading: false, error: err.message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { ...state, fetchLocation };
}