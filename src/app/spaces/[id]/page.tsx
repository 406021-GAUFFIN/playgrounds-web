"use client";
import { useEffect, useState, useRef } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Space } from "../_types";
import { spaceService } from "../../services/spaceService";
import { eventService, Event } from "../../services/eventService";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";
import CreateEventModal from "./_components/CreateEventModal";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { EventsView } from "../../_components/EventsView";
import SpaceDetailCard from "./_components/SpaceDetailCard";
import SpaceRatings from "./_components/SpaceRatings";

const SpaceMap = dynamic(() => import("./_components/SpaceMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse" />,
});

export default function SpaceDetail({ params }: { params: { id: string } }) {
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [totalEvents, setTotalEvents] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const toast = useRef<Toast>(null);

  const loadSpace = async () => {
    try {
      const data = await spaceService.getSpaceById(params.id);
      setSpace(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await eventService.getEvents({
        page,
        pageSize,
        spaceId: parseInt(params.id),
        status: ["available", "confirmed"],
        futureOnly: true,
      });
      setEvents(data.data);
      setTotalEvents(data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadSpace();
  }, [params.id]);

  useEffect(() => {
    loadEvents();
  }, [params.id, page, pageSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl">Espacio no encontrado</h1>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-4">
      <Toast ref={toast} />
      <ConfirmDialog />
      <h1 className="text-3xl font-bold">{space.name}</h1>
      <div className="grid nested-grid">
        <div className="col-12 md:col-6">
          <div className="grid">
            <div className="col-12">
              <SpaceDetailCard space={space} />
            </div>
            <div className="col-12">
              <Card className="p-0">
                <div>
                  <h2 className="text-xl font-semibold mt-0 ">Ubicación</h2>
                  <SpaceMap space={space} />
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6">
          <Card className="p-0 md:p-3">
            <div className="flex justify-content-between align-items-center mb-3">
              <h2 className="text-xl font-semibold m-0">Próximos eventos</h2>
              <Button
                label="Nuevo evento"
                icon="pi pi-plus"
                size="small"
                onClick={() => setShowCreateEventModal(true)}
              />
            </div>
            <EventsView
              events={events}
              loading={loadingEvents}
              totalRecords={totalEvents}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              loadEvents={loadEvents}
            />
          </Card>
        </div>
      </div>

      <div className="col-12 p-0">
        <SpaceRatings
          ratings={space.ratings}
          spaceId={params.id}
          onRatingCreated={() => {
            loadSpace();
          }}
        />
      </div>

      <CreateEventModal
        visible={showCreateEventModal}
        onHide={() => setShowCreateEventModal(false)}
        space={space}
        onSuccess={() => {
          loadEvents();
          setShowCreateEventModal(false);
        }}
      />
    </main>
  );
}
