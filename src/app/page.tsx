"use client";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Space, Sport, Accessibility } from "./_types";
import { spaceService } from "./services/spaceService";
import { sportService } from "./services/sportService";
import { accessibilityService } from "./services/accessibilityService";
import MapComponent from "./components/MapComponentLoader";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { SportBadge } from "@/components/common/SportBadge";
import { useRouter } from "next/navigation";
import { Chip } from "primereact/chip";
import { InputSwitch } from "primereact/inputswitch";

export default function Home() {
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [totalSpaces, setTotalSpaces] = useState(0);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [bounds, setBounds] = useState<{
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSports, setSelectedSports] = useState<number[]>([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const [accessibilities, setAccessibilities] = useState<Accessibility[]>([]);
  const [selectedAccessibilities, setSelectedAccessibilities] = useState<
    number[]
  >([]);
  const [hasFutureEvents, setHasFutureEvents] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loadingAccessibilities, setLoadingAccessibilities] = useState(false);

  // Ref para el timeout del debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadSports();
    loadAccessibilities();
  }, []);

  const loadSports = async () => {
    setLoadingSports(true);
    try {
      const data = await sportService.getSports();
      setSports(data);
    } catch (error) {
      console.error("Error loading sports:", error);
    } finally {
      setLoadingSports(false);
    }
  };

  const loadAccessibilities = async () => {
    setLoadingAccessibilities(true);
    try {
      const data = await accessibilityService.getAccessibilities();
      setAccessibilities(data);
    } catch (error) {
      console.error("Error loading accessibilities:", error);
    } finally {
      setLoadingAccessibilities(false);
    }
  };

  // Request user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // If user denies or error occurs, we keep the default Córdoba center
        }
      );
    }
  }, []);

  const loadSpaces = async () => {
    if (!bounds) return; // No cargar si no hay bounds

    setLoadingSpaces(true);
    try {
      const data = await spaceService.getSpaces({
        pageSize: 30,
        isActive: true,
        minLat: bounds.minLat,
        maxLat: bounds.maxLat,
        minLng: bounds.minLng,
        maxLng: bounds.maxLng,
        hasFutureEvents,
        sportIds: selectedSports.length > 0 ? selectedSports : undefined,
        accessibilityIds:
          selectedAccessibilities.length > 0
            ? selectedAccessibilities
            : undefined,
        minRating: minRating > 0 ? minRating : undefined,
      });
      setSpaces(data.data || []);
      setTotalSpaces(data.total || 0);
    } catch (error) {
      console.error("Error:", error);
      setSpaces([]);
      setTotalSpaces(0);
    } finally {
      setLoadingSpaces(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, [
    bounds,
    selectedSports,
    selectedAccessibilities,
    hasFutureEvents,
    minRating,
  ]);

  // Función para comparar bounds
  const areBoundsEqual = (a: typeof bounds, b: typeof bounds) => {
    if (!a || !b) return false;
    return (
      a.minLat === b.minLat &&
      a.maxLat === b.maxLat &&
      a.minLng === b.minLng &&
      a.maxLng === b.maxLng
    );
  };

  const handleBoundsChange = (newBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setBounds((prev) => {
        if (areBoundsEqual(prev, newBounds)) {
          return prev; // No actualizar si no cambió
        }
        return newBounds;
      });
    }, 200);
  };

  const handleLocationUpdate = (): Promise<{
    lat: number;
    lng: number;
  } | null> => {
    return new Promise((resolve) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(newLocation);
            resolve(newLocation);
          },
          (error) => {
            console.log("Geolocation error:", error.message);
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
  };

  const sportTemplate = (option: Sport | number) => {
    const sport =
      typeof option === "number" ? sports.find((s) => s.id === option) : option;

    if (!sport) return null;

    return (
      <div className="flex align-items-center gap-2">
        {sport.pictogram && (
          <div
            className="w-6 h-6"
            dangerouslySetInnerHTML={{ __html: sport.pictogram }}
          />
        )}
        <span>{sport.name || "Sin nombre"}</span>
      </div>
    );
  };

  const accessibilityTemplate = (option: Accessibility | number) => {
    const accessibility =
      typeof option === "number"
        ? accessibilities.find((a) => a.id === option)
        : option;

    if (!accessibility) return null;

    return (
      <div className="flex align-items-center gap-2">
        <span>{accessibility.name || "Sin nombre"}</span>
      </div>
    );
  };

  return (
    <main className="flex flex-column flex-1 h-full overflow-hidden relative">
      <div
        className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${
          showFilters
            ? "max-h-20rem p-3 border-bottom-1 surface-border"
            : "max-h-0"
        } surface-card`}
      >
        <div className="flex flex-wrap gap-3 align-items-center">
          <MultiSelect
            value={selectedSports}
            options={sports}
            onChange={(e) => setSelectedSports(e.value)}
            optionLabel="name"
            optionValue="id"
            itemTemplate={sportTemplate}
            placeholder="Filtrar por deporte"
            className="w-full md:w-auto md:flex-1"
            disabled={loadingSports}
            display="chip"
          />
          <MultiSelect
            value={selectedAccessibilities}
            options={accessibilities}
            onChange={(e) => setSelectedAccessibilities(e.value)}
            optionLabel="name"
            optionValue="id"
            itemTemplate={accessibilityTemplate}
            placeholder="Filtrar por accesibilidad"
            className="w-full md:w-auto md:flex-1"
            disabled={loadingAccessibilities}
            display="chip"
          />

          <div className="flex align-items-center gap-2">
            <InputSwitch
              checked={hasFutureEvents}
              onChange={(e) => setHasFutureEvents(e.value)}
            />
            <label
              className="cursor-pointer"
              onClick={() => setHasFutureEvents(!hasFutureEvents)}
            >
              Eventos futuros
            </label>
          </div>

          <div className="flex align-items-center gap-2">
            <span className="font-semibold">Calificación:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`pi ${
                    star <= (hoveredRating || minRating)
                      ? "pi-star-fill"
                      : "pi-star"
                  } text-xl cursor-pointer transition-colors ${
                    star <= (hoveredRating || minRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() =>
                    setMinRating((prev) => (prev === star ? 0 : star))
                  }
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                ></i>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative border-1 border-round m-3 overflow-hidden">
        <Button
          icon="pi pi-filter"
          rounded
          className="absolute top-0 right-0 m-3 shadow-2"
          style={{ zIndex: 1000 }}
          onClick={() => setShowFilters(!showFilters)}
          tooltip="Filtros"
          tooltipOptions={{ position: "left" }}
        />

        <div
          className="absolute top-0 left-50 p-3 surface-card shadow-3 border-round flex flex-column gap-1 mt-3"
          style={{ transform: "translateX(-50%)", zIndex: 1000 }}
        >
          <h3 className="font-bold text-color m-0 text-base text-center">
            Espacios cerca tuyo
          </h3>
          {spaces.length > 0 ? (
            <p className="text-sm text-color-secondary m-0 text-center">
              Mostrando {spaces.length} espacios de {Math.min(totalSpaces, 30)}
            </p>
          ) : (
            <p className="text-sm text-color-secondary m-0 text-center">
              No hay espacios
            </p>
          )}
        </div>

        <MapComponent
          initialLat={-31.4127}
          initialLng={-64.1877}
          userLocation={userLocation}
          onBoundsChange={handleBoundsChange}
          onLocationUpdate={handleLocationUpdate}
          markers={spaces}
          onMarkerClick={setSelectedSpace}
        />
      </div>

      <Dialog
        visible={!!selectedSpace}
        onHide={() => setSelectedSpace(null)}
        header={selectedSpace?.name}
        modal
        appendTo={document.body}
        keepInViewport={true}
        baseZIndex={2147483647}
        draggable={false}
        resizable={false}
        footer={
          <div className="flex justify-content-center align-items-center">
            <Button
              icon="pi pi-external-link"
              label="Ver detalles y agendar"
              onClick={() => router.push(`/spaces/${selectedSpace?.id}`)}
              tooltip="Ver detalles"
            />
          </div>
        }
        style={{ width: "90vw", maxWidth: "500px" }}
      >
        {selectedSpace && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Dirección</h3>
              <p>{selectedSpace.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Deportes</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSpace.sports.map((sport) => (
                  <SportBadge key={sport.id} sport={sport} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Accesibilidad</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSpace.accessibilities.length > 0
                  ? selectedSpace.accessibilities.map((accessibility) => (
                      <Chip key={accessibility.id} label={accessibility.name} />
                    ))
                  : "Sin accesibilidad"}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Calificación promedio</h3>
              {selectedSpace.averageRating ? (
                <p className="flex items-center gap-1">
                  {selectedSpace.averageRating.toFixed(1)}
                  <i className="pi pi-star-fill text-yellow-500"></i>
                </p>
              ) : (
                <p>Sin calificaciones</p>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </main>
  );
}
