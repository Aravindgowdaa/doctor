import { InfoWindow, MarkerF } from "@react-google-maps/api";

import InfoWindowCard from "./InfoWindowCard";

const MapMarker = ({ doctor, isSelected, onSelect, onClose, onBook, onViewProfile }) => (
  <>
    <MarkerF
      position={doctor.location}
      onClick={() => onSelect(doctor.placeId)}
      icon={{
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: isSelected ? "#17b26a" : doctor.dbDoctor ? "#1165d6" : "#f59e0b",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        scale: isSelected ? 10 : 8,
      }}
    />
    {isSelected && (
      <InfoWindow position={doctor.location} onCloseClick={onClose}>
        <InfoWindowCard doctor={doctor} onBook={onBook} onViewProfile={onViewProfile} />
      </InfoWindow>
    )}
  </>
);

export default MapMarker;
