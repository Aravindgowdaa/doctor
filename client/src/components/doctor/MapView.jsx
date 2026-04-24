import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

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
      <div className="flex h-full min-h-[480px] items-center justify-center rounded-[2rem] bg-slate-100 p-8 text-center text-sm text-slate-500">
        Google Maps API key is missing. Add `VITE_GOOGLE_MAPS_API_KEY` or `REACT_APP_GOOGLE_MAPS_API_KEY` to `client/.env`.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center rounded-[2rem] bg-rose-50 p-8 text-center text-sm text-rose-600">
        Unable to load Google Maps right now. Please verify the API key and enabled APIs.
      </div>
    );
  }

  if (!isLoaded || !center) {
    return <Loader text="Loading map..." />;
  }

  return (
    <div className="h-[480px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:h-[calc(100vh-10rem)]">
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
