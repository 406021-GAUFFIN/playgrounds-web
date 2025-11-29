import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Circle,
} from "react-leaflet";
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
  showMarker?: boolean;
  interactive?: boolean;
  searchRadius?: number | null;
}

const LocationMarker = ({
  onLocationSelect,
  showMarker = true,
  interactive = true,
  searchRadius,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  showMarker?: boolean;
  interactive?: boolean;
  searchRadius?: number;
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const map = useMapEvents({
    click(e) {
      if (interactive) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  useEffect(() => {
    if (map) {
      const center = map.getCenter();
      setPosition([center.lat, center.lng]);
    }
  }, [map]);

  return (
    <>
      {position && showMarker && (
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
      )}
      {position && searchRadius && showMarker && (
        <Circle
          center={position}
          radius={searchRadius}
          pathOptions={{
            color: "#4F46E5",
            fillColor: "#4F46E5",
            fillOpacity: 0.1,
            weight: 2,
          }}
        />
      )}
    </>
  );
};

const MapComponentClient = ({
  initialLat,
  initialLng,
  onLocationSelect,
  height = "300px",
  showMarker = true,
  interactive = true,
  searchRadius,
}: MapComponentProps) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      // Actualizar las opciones de interacción
      const map = mapRef.current;
      if (interactive) {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
      } else {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
      }

      // Forzar una actualización del mapa
      map.invalidateSize();
    }
  }, [interactive]);

  const { theme } = useTheme();

  return (
    <div style={{ height, width: "100%" }} className="border-1 border-round">
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={13}
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
        zoomControl={true}
        boxZoom={interactive}
        keyboard={interactive}
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
        <LocationMarker
          onLocationSelect={onLocationSelect}
          showMarker={showMarker}
          interactive={interactive}
          searchRadius={searchRadius ?? undefined}
        />
      </MapContainer>
    </div>
  );
};

export default MapComponentClient;
