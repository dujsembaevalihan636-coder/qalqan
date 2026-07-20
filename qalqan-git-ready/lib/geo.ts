import { nearestCity, type KzCity } from "./kz";

export type GeoResult =
  | { ok: true; city: KzCity; km: number; lat: number; lng: number }
  | { ok: false; reason: "unsupported" | "denied" | "error" };

// Определить ближайший город по геолокации браузера.
// Вызывать ТОЛЬКО по клику пользователя (иначе браузер сам не спросит разрешение).
export function detectCity(): Promise<GeoResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, reason: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const { city, km } = nearestCity(latitude, longitude);
        resolve({ ok: true, city, km, lat: latitude, lng: longitude });
      },
      (err) => {
        resolve({
          ok: false,
          reason: err.code === err.PERMISSION_DENIED ? "denied" : "error",
        });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  });
}
