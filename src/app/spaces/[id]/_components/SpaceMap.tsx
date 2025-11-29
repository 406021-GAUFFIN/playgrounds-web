"use client";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Space } from "../../_types";
import { useTheme } from "@/context/ThemeContext";

// Fix para los íconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface SpaceMapProps {
  space: Space;
}

function MapEvents() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export default function SpaceMap({ space }: SpaceMapProps) {
  const { theme } = useTheme();

  return (
    <div style={{ height: "200px", width: "100%", position: "relative" }}>
      <MapContainer
        center={[space.latitude, space.longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        zoomControl={false}
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
        <MapEvents />
        <Marker position={[space.latitude, space.longitude]}>
          <Popup>
            <div>
              <h3 className="font-bold">{space.name}</h3>
              <p>{space.address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
