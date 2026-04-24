export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "-";

export const getDashboardPath = (role) => {
  if (role === "doctor") return "/doctor/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/patient/dashboard";
};

export const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/\b(dr|doctor|clinic|hospital)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const haversineDistance = (from, to) => {
  if (!from || !to) return null;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad((to.lat || 0) - (from.lat || 0));
  const dLng = toRad((to.lng || 0) - (from.lng || 0));
  const lat1 = toRad(from.lat || 0);
  const lat2 = toRad(to.lat || 0);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(1));
};

export const getGoogleMapsApiKey = () =>
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
