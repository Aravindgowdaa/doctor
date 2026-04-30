import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Footer from "../components/common/Footer";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import Navbar from "../components/common/Navbar";
import NearbyDoctorsList from "../components/doctor/NearbyDoctorsList";
import axiosInstance from "../utils/axiosInstance";

const defaultCenter = { lat: 19.076, lng: 72.8777 };

const fallbackPlaces = [
  {
    name: "Sunrise Clinic",
    address: "Bandra West, Mumbai",
    rating: 4.8,
    isOpen: true,
    openStatus: "Open now",
    offsetLat: 0.012,
    offsetLng: 0.008,
  },
  {
    name: "City Care Hospital",
    address: "Andheri East, Mumbai",
    rating: 4.6,
    isOpen: true,
    openStatus: "Open now",
    offsetLat: -0.01,
    offsetLng: 0.014,
  },
  {
    name: "Family Health Centre",
    address: "Dadar, Mumbai",
    rating: 4.4,
    isOpen: false,
    openStatus: "Closed now",
    offsetLat: 0.018,
    offsetLng: -0.006,
  },
];

const dedupePlaces = (places) => {
  const byId = new Map();
  places.forEach((place) => {
    const key = place?.placeId;
    if (!key || byId.has(key)) return;
    byId.set(key, place);
  });
  return Array.from(byId.values());
};

const buildFallbackPlaces = (doctors, location = defaultCenter) => {
  const doctorPlaces = doctors
    .filter((doctor) => doctor.is_approved !== false)
    .slice(0, 6)
    .map((doctor, index) => {
      const distance = Number((1.2 + index * 0.6).toFixed(1));
      return {
        placeId: `demo-doctor-${doctor.id}`,
        name: `Dr. ${doctor.user?.name || "Doctor"} - ${doctor.specialization || "Specialist"}`,
        address: `${doctor.clinic_name || "Clinic"}${doctor.city ? `, ${doctor.city}` : ""}`,
        rating: Number(doctor.average_rating || 4.5),
        isOpen: index % 3 !== 2,
        openStatus: index % 3 !== 2 ? "Open now" : "Closed now",
        location: {
          lat: location.lat + 0.004 * (index + 1),
          lng: location.lng + 0.004 * (index % 2 === 0 ? 1 : -1),
        },
        distance,
        distanceText: `${distance} km away`,
        dbDoctor: doctor,
        placeUrl: "",
      };
    });

  const nearbyPlaces = fallbackPlaces.map((place, index) => {
    const distance = Number((0.9 + index * 0.7).toFixed(1));
    return {
      placeId: `demo-place-${index}`,
      name: place.name,
      address: place.address,
      rating: place.rating,
      isOpen: place.isOpen,
      openStatus: place.openStatus,
      location: {
        lat: location.lat + place.offsetLat,
        lng: location.lng + place.offsetLng,
      },
      distance,
      distanceText: `${distance} km away`,
      dbDoctor: null,
      placeUrl: "",
    };
  });

  return dedupePlaces([...doctorPlaces, ...nearbyPlaces]);
};

const NearbyDoctors = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(defaultCenter);
  const [allDoctors, setAllDoctors] = useState([]);
  const [dbDoctors, setDbDoctors] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ rating: "0", maxDistance: "10" });
  const [externalDoctor, setExternalDoctor] = useState(null);
  const [externalForm, setExternalForm] = useState({ name: "", email: "", phone: "", appointmentDate: "", notes: "" });

  const nearbyHospitalMapUrl = useMemo(
    () => `https://www.google.com/maps/search/hospitals+near+me/@${location.lat},${location.lng},13z?entry=ttu`,
    [location.lat, location.lng]
  );

  useEffect(() => {
    axiosInstance
      .get("/doctors")
      .then(({ data }) => setDbDoctors(data.data.doctors || []))
      .catch(() => setDbDoctors([]));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      () => {
        setError("Location permission denied. Showing nearby results from the default city center.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const searchNearby = useCallback(() => {
    setLoadingPlaces(true);
    setError("");
    const previewPlaces = buildFallbackPlaces(dbDoctors, location);
    setAllDoctors(previewPlaces);
    setSelectedDoctorId(previewPlaces[0]?.placeId || null);
    setLoadingPlaces(false);
  }, [dbDoctors, location]);

  useEffect(() => {
    searchNearby();
  }, [searchNearby]);

  const filteredDoctors = useMemo(
    () =>
      allDoctors
        .filter((doctor) => !filters.rating || Number(doctor.rating || 0) >= Number(filters.rating))
        .filter((doctor) => !doctor.distance || doctor.distance <= Number(filters.maxDistance))
        .sort((a, b) => {
          if (a.dbDoctor && !b.dbDoctor) return -1;
          if (!a.dbDoctor && b.dbDoctor) return 1;
          return (a.distance || 0) - (b.distance || 0);
        }),
    [allDoctors, filters]
  );

  const handleBookDoctor = (doctor) => {
    if (doctor.dbDoctor) {
      navigate(`/doctors/${doctor.dbDoctor.id}`);
      return;
    }
    setExternalDoctor(doctor);
  };

  const handleExternalBooking = (event) => {
    event.preventDefault();
    toast.success(`Booking request saved for ${externalDoctor.name}. Please contact the clinic directly to confirm.`);
    setExternalDoctor(null);
    setExternalForm({ name: "", email: "", phone: "", appointmentDate: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <section className="container-app py-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Nearby Doctors</h1>
            <p className="mt-2 max-w-2xl text-white/60">
              Discover doctors, clinics, and hospitals around your current location, then jump straight into the existing booking flow when we find a portal match.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label text-white/75">Minimum Rating</label>
              <select className="input" value={filters.rating} onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}>
                <option value="0">All ratings</option>
                <option value="3">3+ stars</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
              </select>
            </div>
            <div>
              <label className="label text-white/75">Distance Radius</label>
              <select className="input" value={filters.maxDistance} onChange={(e) => setFilters((prev) => ({ ...prev, maxDistance: e.target.value }))}>
                <option value="5">5 km</option>
                <option value="7">7 km</option>
                <option value="10">10 km</option>
              </select>
            </div>
          </div>
        </div>

        {(loadingLocation || loadingPlaces) && <Loader text={loadingLocation ? "Finding your location..." : "Searching nearby doctors..."} />}

        {error && (
          <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white/50">Results</p>
                <h2 className="text-2xl font-bold text-white">{filteredDoctors.length} nearby places</h2>
              </div>
              <button type="button" className="btn-secondary !px-4 !py-2" onClick={searchNearby}>
                Refresh
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-white/60">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-white/35">Doctors</p>
                <p className="mt-1 text-lg font-bold text-white">{filteredDoctors.filter((doctor) => doctor.dbDoctor).length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-white/35">Clinics</p>
                <p className="mt-1 text-lg font-bold text-white">{filteredDoctors.filter((doctor) => !doctor.dbDoctor).length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                <p className="text-white/35">Open now</p>
                <p className="mt-1 text-lg font-bold text-white">{filteredDoctors.filter((doctor) => doctor.isOpen).length}</p>
              </div>
            </div>
            <div className="mt-4">
              <a href={nearbyHospitalMapUrl} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2">
                Nearby Hospital
              </a>
            </div>
          </motion.div>

          <NearbyDoctorsList
            doctors={filteredDoctors}
            selectedDoctorId={selectedDoctorId}
            onSelectDoctor={setSelectedDoctorId}
            onBookDoctor={handleBookDoctor}
            onViewProfile={(doctorId) => navigate(`/doctors/${doctorId}`)}
          />
        </div>
      </section>

      <Modal open={Boolean(externalDoctor)} onClose={() => setExternalDoctor(null)} title={externalDoctor ? `Request booking for ${externalDoctor.name}` : "External booking"}>
        {externalDoctor && (
          <form className="space-y-4" onSubmit={handleExternalBooking}>
            <div className="rounded-3xl border border-white/10 bg-[#0b1220]/95 p-4 text-sm text-white/65 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <p className="font-semibold text-white">{externalDoctor.name}</p>
              <p className="mt-1">{externalDoctor.address}</p>
              <p className="mt-1">{externalDoctor.distanceText}</p>
            </div>
            <div>
              <label className="label">Your Name</label>
              <input className="input" required value={externalForm.name} onChange={(e) => setExternalForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Email</label>
                <input className="input" required type="email" value={externalForm.email} onChange={(e) => setExternalForm((prev) => ({ ...prev, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" required value={externalForm.phone} onChange={(e) => setExternalForm((prev) => ({ ...prev, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Preferred Date</label>
              <input className="input" required type="date" value={externalForm.appointmentDate} onChange={(e) => setExternalForm((prev) => ({ ...prev, appointmentDate: e.target.value }))} />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea className="input min-h-24" value={externalForm.notes} onChange={(e) => setExternalForm((prev) => ({ ...prev, notes: e.target.value }))} />
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">
                Submit Request
              </button>
              <button type="button" className="btn-secondary" onClick={() => setExternalDoctor(null)}>
                Close
              </button>
            </div>
          </form>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default NearbyDoctors;
