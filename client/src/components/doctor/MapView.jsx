import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { FiMapPin } from "react-icons/fi";

import Loader from "../common/Loader";
import MapMarker from "./MapMarker";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const MapView = ({
  apiKey,
  center,
  doctors,
  selectedDoctorId,
  onSelectDoctor,
  onMapLoad,
  onBookDoctor,
  onViewProfile,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!apiKey) {
    return (
      <div className="flex h-full min-h-[480px] flex-col rounded-[2rem] border border-white/10 bg-[#0b1220]/95 p-6 text-sm text-white/65 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="mb-5">
          <h3 className="text-2xl font-bold text-white">Nearby Doctors & Clinics</h3>
          <p className="mt-2 max-w-xl text-white/60">
            Google Maps is not configured, so this panel shows a local preview of nearby doctors and clinics instead.
          </p>
        </div>
        <div className="space-y-3 overflow-auto pr-1">
          {doctors.length ? (
            doctors.slice(0, 6).map((doctor) => (
              <button
                key={doctor.placeId}
                type="button"
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white transition hover:bg-white/10"
                onClick={() => onSelectDoctor(doctor.placeId)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white">{doctor.name}</p>
                    <p className="mt-1 text-xs leading-5 text-white/55">{doctor.address}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Rating</p>
                    <p className="text-sm font-bold text-amber-300">{doctor.rating || "N/A"}</p>
                  </div>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">Status</p>
                    <p className={`mt-1 text-sm font-semibold ${doctor.isOpen ? "text-emerald-300" : "text-rose-300"}`}>{doctor.openStatus}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">Distance</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-white">
                      <FiMapPin className="text-brand-300" />
                      {doctor.distanceText}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">Type</p>
                    <p className="mt-1 text-sm font-semibold text-white/80">{doctor.dbDoctor ? "Portal doctor" : "Local place"}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-white/45">
                  {doctor.dbDoctor
                    ? `Matched doctor in portal: ${doctor.dbDoctor.specialization || "Specialist"} at ${doctor.dbDoctor.clinic_name || "their clinic"}`
                    : "Local clinic or hospital preview"}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/55">
              No nearby data to preview yet.
            </div>
          )}
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/50">
          Add `VITE_GOOGLE_MAPS_API_KEY` in `client/.env` to load the live interactive map.
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center rounded-[2rem] border border-rose-500/20 bg-[#0b1220]/95 p-8 text-center text-sm text-rose-200 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        Unable to load Google Maps right now. Please verify the API key and enabled APIs.
      </div>
    );
  }

  if (!isLoaded || !center) {
    return <Loader text="Loading map..." />;
  }

  return (
    <div className="h-[480px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1220]/95 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:h-[calc(100vh-10rem)]">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <MapMarker
          doctor={{
            placeId: "user-location",
            location: center,
            name: "Your Location",
            address: "Current location",
            rating: null,
            openStatus: "Live location",
            distanceText: "You are here",
          }}
          isSelected={false}
          onSelect={() => {}}
          onClose={() => {}}
          onBook={() => {}}
          onViewProfile={() => {}}
        />
        {doctors.map((doctor) => (
          <MapMarker
            key={doctor.placeId}
            doctor={doctor}
            isSelected={selectedDoctorId === doctor.placeId}
            onSelect={onSelectDoctor}
            onClose={() => onSelectDoctor(null)}
            onBook={onBookDoctor}
            onViewProfile={onViewProfile}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapView;
