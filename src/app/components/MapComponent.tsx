import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Space } from "../spaces/_types";

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

interface MapComponentProps {
  initialLat: number;
  initialLng: number;
  markers?: Space[];
  onBoundsChange?: (bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => void;
  onMarkerClick?: (space: Space) => void;
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

export default function MapComponent({
  initialLat,
  initialLng,
  markers = [],
  onBoundsChange,
  onMarkerClick,
}: MapComponentProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  return (
    <MapContainer
      center={[initialLat, initialLng]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onBoundsChange={onBoundsChange} />
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
