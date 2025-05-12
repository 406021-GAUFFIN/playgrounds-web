"use client";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { eventService, Event } from "../services/eventService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../../context/AuthContext";
import { EventStatusTemplate } from "../_components/EventStatusTemplate";
import { EventsView } from "../_components/EventsView";

const EVENT_STATUS = [
  { label: "Disponible", value: "available" },
  { label: "Confirmado", value: "confirmed" },
  { label: "Cancelado", value: "cancelled" },
  { label: "Finalizado", value: "finished" },
  { label: "Suspendido", value: "suspended" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadEvents();
  }, [page, pageSize, selectedStatus, user?.id]);

  const loadEvents = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await eventService.getEvents({
        page,
        pageSize,
        participantId: user.id,
        status: selectedStatus.length > 0 ? selectedStatus : undefined,
      });
      setEvents(data.data);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card>
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4">Mis Eventos</h1>
          <MultiSelect
            value={selectedStatus}
            options={EVENT_STATUS}
            onChange={(e) => setSelectedStatus(e.value)}
            placeholder="Filtrar por estado"
            className="w-full md:w-20rem"
          />
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
    </main>
  );
}
