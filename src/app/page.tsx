"use client";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import { Space } from "./_types";
import { spaceService } from "./services/spaceService";
import MapComponent from "./components/MapComponentLoader";

export default function Home() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
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
    } catch (error) {
      console.error("Error:", error);
      setSpaces([]);
    } finally {
      setLoadingSpaces(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, [bounds]);

  return (
    <main className="flex min-h-screen flex-col">
      <div className="h-screen w-full relative">
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
