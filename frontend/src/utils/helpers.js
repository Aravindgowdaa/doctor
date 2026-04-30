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

const maleFallbackPhotos = [
  "https://cdn.pixabay.com/photo/2023/12/21/06/23/doctor-8461303_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/11/08/05/29/operation-1807543_640.jpg",
  "https://cdn.pixabay.com/photo/2016/09/11/18/02/surgery-1662204_640.jpg",
];

const femaleFallbackPhotos = [
  "https://cdn.pixabay.com/photo/2020/06/20/15/30/woman-doctor-5321351_640.jpg",
  "https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg",
  "https://cdn.pixabay.com/photo/2025/05/29/08/25/doctor-9628974_1280.jpg",
];

const professionPhotos = {
  cardiologist: {
    male: "https://cdn.pixabay.com/photo/2023/12/21/06/23/doctor-8461303_1280.jpg",
    female: "https://cdn.pixabay.com/photo/2020/06/20/15/30/woman-doctor-5321351_640.jpg",
  },
  dermatologist: {
    male: "https://cdn.pixabay.com/photo/2023/12/21/06/23/doctor-8461303_1280.jpg",
    female: "https://cdn.pixabay.com/photo/2017/03/14/03/20/woman-2141808_1280.jpg",
  },
  pediatrician: {
    male: "https://cdn.pixabay.com/photo/2021/07/27/17/43/doctor-6497498_640.jpg",
    female: "https://cdn.pixabay.com/photo/2021/07/27/17/43/doctor-6497498_640.jpg",
  },
  "orthopedic surgeon": {
    male: "https://cdn.pixabay.com/photo/2016/11/08/05/29/operation-1807543_640.jpg",
    female: "https://cdn.pixabay.com/photo/2025/05/29/08/25/doctor-9628974_1280.jpg",
  },
  gynecologist: {
    male: "https://cdn.pixabay.com/photo/2015/02/26/15/40/doctor-650534_1280.jpg",
    female: "https://cdn.pixabay.com/photo/2025/05/29/08/25/doctor-9628974_1280.jpg",
  },
  "general physician": {
    male: "https://cdn.pixabay.com/photo/2015/02/26/15/40/doctor-650534_1280.jpg",
    female: "https://cdn.pixabay.com/photo/2020/06/20/15/30/woman-doctor-5321351_640.jpg",
  },
  dentist: {
    male: "https://cdn.pixabay.com/photo/2019/07/30/15/57/dentist-4373290_640.jpg",
    female: "https://cdn.pixabay.com/photo/2019/07/30/15/57/dentist-4373290_640.jpg",
  },
};

const hashText = (value = "") =>
  value.split("").reduce((hash, char) => {
    const next = (hash * 31 + char.charCodeAt(0)) % 9973;
    return next;
  }, 0);

export const getDoctorAvatarUrl = (doctor) => {
  const explicitPhoto = doctor?.profile_photo || doctor?.user?.avatar;
  if (explicitPhoto) return explicitPhoto;

  const gender = doctor?.user?.gender || doctor?.gender;
  const specialization = normalizeText(doctor?.specialization || doctor?.user?.specialization || "");
  const seed = doctor?.user?.name || doctor?.name || doctor?.email || doctor?.id || "doctor";
  const index = hashText(String(seed)) % maleFallbackPhotos.length;

  const professionPhoto = professionPhotos[specialization];
  if (professionPhoto) {
    if (gender === "female" && professionPhoto.female) {
      return professionPhoto.female;
    }
    if (gender === "male" && professionPhoto.male) {
      return professionPhoto.male;
    }
    return professionPhoto.female || professionPhoto.male;
  }

  if (gender === "female") {
    return femaleFallbackPhotos[index];
  }

  if (gender === "male") {
    return maleFallbackPhotos[index];
  }

  return maleFallbackPhotos[index];
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

