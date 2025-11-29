import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Space } from "../spaces/_types";
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

// Custom icon for user location
const userLocationIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface MapComponentProps {
  initialLat: number;
  initialLng: number;
  markers?: Space[];
  userLocation?: { lat: number; lng: number } | null;
  onBoundsChange?: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
  onMarkerClick?: (space: Space) => void;
  onLocationUpdate?: () => Promise<{ lat: number; lng: number } | null>;
}

function MapEvents({
  onBoundsChange,
}: {
  onBoundsChange?: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
}) {
  const map = useMap();
  const hasInitialized = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleBoundsChange = () => {
      const bounds = map.getBounds();
      onBoundsChange?.({
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      });
    };

    const debouncedBoundsChange = () => {
      // Cancelar el timeout anterior si existe
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Establecer un nuevo timeout de 500ms
      debounceTimeoutRef.current = setTimeout(() => {
        handleBoundsChange();
      }, 500);
    };

    // Disparar cuando el mapa se mueve (solo después de la inicialización)
    const handleMoveEnd = () => {
      if (hasInitialized.current) {
        debouncedBoundsChange();
      }
    };

    // Disparar cuando el mapa hace zoom (solo después de la inicialización)
    const handleZoomEnd = () => {
      if (hasInitialized.current) {
        debouncedBoundsChange();
      }
    };

    map.on("moveend", handleMoveEnd);
    map.on("zoomend", handleZoomEnd);

    // Disparar solo una vez al inicializar
    const initialTimeout = setTimeout(() => {
      handleBoundsChange();
      hasInitialized.current = true;
    }, 300);

    return () => {
      map.off("moveend", handleMoveEnd);
      map.off("zoomend", handleZoomEnd);
      clearTimeout(initialTimeout);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [map, onBoundsChange]);

  return null;
}

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!hasCentered.current) {
      map.setView(center, map.getZoom());
      hasCentered.current = true;
    }
  }, [center, map]);

  return null;
}

function RecenterButton({
  userLocation,
  onLocationUpdate,
}: {
  userLocation?: { lat: number; lng: number } | null;
  onLocationUpdate?: () => Promise<{ lat: number; lng: number } | null>;
}) {
  const map = useMap();
  const { theme } = useTheme();

  const handleRecenter = async () => {
    // Trigger location update to refresh user position
    const newLocation = await onLocationUpdate?.();

    // Center on the new location if available, otherwise use current location
    const locationToCenter = newLocation || userLocation;
    if (locationToCenter) {
      map.setView([locationToCenter.lat, locationToCenter.lng], 13);
    }
  };

  if (!userLocation) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleRecenter}
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme === "dark" ? "var(--surface-card)" : "#fff",
          color: theme === "dark" ? "var(--text-color)" : "#000",
          border:
            theme === "dark"
              ? "2px solid var(--surface-border)"
              : "2px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: "0 1px 5px rgba(0,0,0,0.65)",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            theme === "dark" ? "var(--surface-hover)" : "#f4f4f4";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            theme === "dark" ? "var(--surface-card)" : "#fff";
        }}
        title="Centrar en mi ubicación"
      >
        <i className="pi pi-map-marker text-xl text-blue-500"></i>
      </button>
    </div>
  );
}

export default function MapComponent({
  initialLat,
  initialLng,
  markers = [],
  userLocation,
  onBoundsChange,
  onMarkerClick,
  onLocationUpdate,
}: MapComponentProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  const { theme } = useTheme();

  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [initialLat, initialLng];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
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
      <MapEvents onBoundsChange={onBoundsChange} />
      <MapCenter center={center} />
      <RecenterButton
        userLocation={userLocation}
        onLocationUpdate={onLocationUpdate}
      />

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userLocationIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">Tu ubicación</h3>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Space markers */}
      {markers.map((space) => (
        <Marker
          key={space.id}
          position={[space.latitude, space.longitude]}
          eventHandlers={{
            click: () => onMarkerClick?.(space),
          }}
        >
          {/* <Popup>
            <div>
              <h3 className="font-bold">{space.name}</h3>
              <p>{space.address}</p>
            </div>
          </Popup> */}
        </Marker>
      ))}
    </MapContainer>
  );
}
