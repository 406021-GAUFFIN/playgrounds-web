"use client";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Space } from "./_types";
import { spaceService } from "./services/spaceService";
import MapComponent from "./components/MapComponentLoader";
import { Button } from "primereact/button";
import { SportBadge } from "@/components/common/SportBadge";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [totalSpaces, setTotalSpaces] = useState(0);
  const [bounds, setBounds] = useState<{
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  } | null>(null);

  // Ref para el timeout del debounce
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [bounds]);

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

  return (
    <main className="flex flex-column flex-1 h-full overflow-hidden">
      <div className="flex-1 relative border-1 border-round m-3">
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
          onBoundsChange={handleBoundsChange}
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
              <p>{selectedSpace.isAccessible ? "Accesible" : "No accesible"}</p>
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
