import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";
import { useTheme } from "@/context/ThemeContext";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (lat: number, lng: number) => void;
  height?: string;
}

const LocationMarker = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (map) {
      const center = map.getCenter();
      setPosition([center.lat, center.lng]);
    }
  }, [map]);

  return position ? (
    <Marker
      position={position}
      icon={
        new Icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
      }
    />
  ) : null;
};

const MapComponentClient = ({
  initialLat,
  initialLng,
  onLocationSelect,
  height = "300px",
}: MapComponentProps) => {
  const mapRef = useRef<L.Map>(null);
  const { theme } = useTheme();

  return (
    <div style={{ height, width: "100%" }} className="border-1 border-round">
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={13}
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution={
            theme === "dark"
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
          url={
            theme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapComponentClient;
