"use client";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import { InputSwitch } from "primereact/inputswitch";
import { eventService, Event } from "../services/eventService";
import { useAuth } from "../../context/AuthContext";
import { EventsView } from "../_components/EventsView";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { sportService } from "../services/sportService";
import { Sport } from "../_types";

const EVENT_STATUS = [
  { label: "Disponible", value: "available" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Finalizado", value: "finished" },
  { label: "Suspendido", value: "suspended" },
];

interface EventsListProps {
  mode: "my-events" | "discover";
}

const EventsList = ({ mode }: EventsListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSports, setSelectedSports] = useState<number[]>([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (mode === "discover") {
      loadSports();
    }
  }, [mode]);

  useEffect(() => {
    loadEvents();
  }, [page, pageSize, selectedStatus, selectedSports, nearMe, user?.id, mode]);

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

  const handleNearMeToggle = (checked: boolean) => {
    if (checked) {
      // Request location permission
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setNearMe(true);
          },
          (error) => {
            console.log("Geolocation error:", error.message);
            confirmDialog({
              message:
                "Para usar esta función necesitas habilitar el acceso a tu ubicación.",
              header: "Ubicación requerida",
              icon: "pi pi-map-marker",
              acceptLabel: "Entendido",
              rejectClassName: "hidden",
            });
          }
        );
      } else {
        confirmDialog({
          message: "Tu navegador no soporta geolocalización.",
          header: "Función no disponible",
          icon: "pi pi-exclamation-triangle",
          acceptLabel: "Entendido",
          rejectClassName: "hidden",
        });
      }
    } else {
      setNearMe(false);
    }
  };

  const loadEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize,
      };

      if (mode === "my-events") {
        params.participantId = user.id;
        params.status = selectedStatus.length > 0 ? selectedStatus : undefined;
      } else {
        // discover mode
        params.status = ["available", "confirmed"];
        params.participantToExcludeId = user.id;
        if (selectedSports.length > 0) {
          params.sportIds = selectedSports;
        }
        if (nearMe && userLocation) {
          params.latitude = userLocation.lat;
          params.longitude = userLocation.lng;
          params.sortByDistance = "ASC";
        }
      }

      const data = await eventService.getEvents(params);
      setEvents(data.data);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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

  return (
    <Card className="w-full min-h-[60vh]">
      <div className="mb-4 flex flex-column gap-3">
        {mode === "my-events" ? (
          <MultiSelect
            value={selectedStatus}
            options={EVENT_STATUS}
            onChange={(e) => setSelectedStatus(e.value)}
            placeholder="Filtrar por estado"
            className="w-full md:w-20rem"
          />
        ) : (
          <>
            <MultiSelect
              value={selectedSports}
              options={sports}
              onChange={(e) => setSelectedSports(e.value)}
              optionLabel="name"
              optionValue="id"
              itemTemplate={sportTemplate}
              selectedItemTemplate={sportTemplate}
              placeholder="Filtrar por deporte"
              className="w-full md:w-20rem"
              disabled={loadingSports}
            />
            <div className="flex align-items-center gap-2">
              <InputSwitch
                checked={nearMe}
                onChange={(e) => handleNearMeToggle(e.value)}
              />
              <label
                className="cursor-pointer"
                onClick={() => handleNearMeToggle(!nearMe)}
              >
                Cerca mío
              </label>
            </div>
          </>
        )}
      </div>

      <EventsView
        events={events}
        loading={loading}
        totalRecords={totalRecords}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        loadEvents={loadEvents}
      />
    </Card>
  );
};

export default function EventsPage() {
  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-column align-items-center">
      <ConfirmDialog />
      <div className="w-full flex justify-content-center">
        <div className="w-full" style={{ maxWidth: "900px" }}>
          <TabView className="full-width-tabs">
            <TabPanel header="Mis Eventos">
              <EventsList mode="my-events" />
            </TabPanel>
            <TabPanel header="Descubrir Eventos">
              <EventsList mode="discover" />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </main>
    // <main className="container mx-auto p-4 space-y-4">
    //   <ConfirmDialog />

    //   <div className="grid nested-grid">
    //     <TabView className="full-width-tabs">
    //       <TabPanel header="Mis Eventos">
    //         <EventsList mode="my-events" />
    //       </TabPanel>
    //       <TabPanel header="Descubrir Eventos">
    //         <EventsList mode="discover" />
    //       </TabPanel>
    //     </TabView>
    //   </div>
    // </main>
  );
}
