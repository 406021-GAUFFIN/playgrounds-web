import { DataView } from "primereact/dataview";
import { Event } from "../services/eventService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventStatusTemplate } from "./EventStatusTemplate";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { EventDetailModal } from "./EventDetailModal";
import { EventActions } from "./EventActions";
import { useState } from "react";
import { SportBadge } from "../../components/common/SportBadge";

interface EventsViewProps {
  events: Event[];
  loading: boolean;
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loadEvents: () => void;
}

export const EventsView = ({
  events,
  loading,
  totalRecords,
  page,
  pageSize,
  onPageChange,
  loadEvents,
}: EventsViewProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yy HH:mm", { locale: es });
  };

  const getEventActions = (event: Event) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text p-button-sm"
          tooltip="Ver detalle"
          tooltipOptions={{ position: "top" }}
          size="small"
          onClick={() => {
            setSelectedEvent(event);
            setShowDetailModal(true);
          }}
        />
        <EventActions event={event} loadEvents={loadEvents} />
      </div>
    );
  };

  const itemTemplate = (event: Event, index: number) => {
    return (
      <div className="col-12" key={event.id}>
        <div
          className={classNames("flex flex-column p-4 gap-4", {
            "border-top-1 surface-border": index !== 0,
          })}
        >
          <div className="flex flex-column gap-3">
            <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-2">
              <h2 className="text-xl font-bold m-0">{event.title}</h2>
              <EventStatusTemplate event={event} />
            </div>

            <div className="flex flex-column gap-2">
              <div className="flex align-items-center gap-2">
                <i className="pi pi-calendar"></i>
                <span>{formatDate(event.dateTime)}</span>
              </div>
              <div className="flex align-items-center gap-2">
                <i className="pi pi-map-marker"></i>
                <span>
                  {event.space.name}
                  {event.distance !== undefined && (
                    <span className="text-color-secondary ml-1">
                      ({event.distance}m)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex align-items-center gap-2">
                <SportBadge key={event.sport.id} sport={event.sport} />
              </div>

              <div className="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-3 mt-2">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-users"></i>
                  <span>
                    {event.participants.length}/{event.maxParticipants}{" "}
                    participantes
                  </span>
                </div>
                <div className="w-full sm:w-auto flex justify-content-end">
                  {getEventActions(event)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const listTemplate = (items: Event[]) => {
    if (!items || items.length === 0) return null;

    let list = items.map((event, index) => {
      return itemTemplate(event, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
  };

  return (
    <>
      <DataView
        value={events}
        listTemplate={listTemplate}
        paginator
        rows={pageSize}
        totalRecords={totalRecords}
        lazy
        first={page * pageSize}
        onPage={(e) => onPageChange(e.page ?? 0)}
        loading={loading}
        emptyMessage="No hay eventos disponibles"
      />
      <EventDetailModal
        visible={showDetailModal}
        onHide={() => {
          setShowDetailModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        loadEvents={loadEvents}
      />
    </>
  );
};
