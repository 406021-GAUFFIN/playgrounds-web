"use client";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Space } from "./_types";
import { spaceService } from "./services/spaceService";
import MapComponent from "./components/MapComponentLoader";
import { Button } from "primereact/button";
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
  }>({
    minLat: -31.4327,
    maxLat: -31.3927,
    minLng: -64.2077,
    maxLng: -64.1677,
  });

  const loadSpaces = async () => {
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

  return (
    <main className="flex min-h-screen">
      {/* <div className="p-2 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Espacios cerca tuyo
        </h1>
        {spaces.length > 0 ? (
          <p className="text-gray-600">
            Mostrando {spaces.length} espacios de {Math.min(totalSpaces, 30)}
          </p>
        ) : (
          <p className="text-gray-600">No hay espacios</p>
        )}
      </div> */}

      <div className="flex-1 relative border-1 border-round m-3">
        <MapComponent
          initialLat={-31.4127}
          initialLng={-64.1877}
          onBoundsChange={setBounds}
          markers={spaces}
          onMarkerClick={setSelectedSpace}
        />
      </div>

      <Dialog
        visible={!!selectedSpace}
        onHide={() => setSelectedSpace(null)}
        header={selectedSpace?.name}
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
                  <div
                    key={sport.id}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <div
                      className="w-6 h-6"
                      dangerouslySetInnerHTML={{ __html: sport.pictogram }}
                    />
                    <span>{sport.name}</span>
                  </div>
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

      {loadingSpaces && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
          <ProgressSpinner />
        </div>
      )}
    </main>
  );
}
