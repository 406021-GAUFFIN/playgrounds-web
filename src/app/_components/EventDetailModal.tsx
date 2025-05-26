import { Dialog } from "primereact/dialog";
import { Event } from "../services/eventService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventStatusTemplate } from "./EventStatusTemplate";
import { Button } from "primereact/button";
import dynamic from "next/dynamic";
import { Space } from "../spaces/_types";
import { EventActions } from "./EventActions";

const SpaceMap = dynamic(() => import("../spaces/[id]/_components/SpaceMap"), {
  ssr: false,
});

interface EventDetailModalProps {
  visible: boolean;
  onHide: () => void;
  event: Event | null;
  loadEvents: () => void;
}

export const EventDetailModal = ({
  visible,
  onHide,
  event,
  loadEvents,
}: EventDetailModalProps) => {
  if (!event) return null;

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yy HH:mm", { locale: es });
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Detalle del Evento"
      style={{ width: "50vw" }}
      footer={
        <div className="flex justify-content-end">
          <EventActions event={event} loadEvents={loadEvents} onHide={onHide} />
        </div>
      }
    >
      <div className="flex flex-column gap-4">
        <div className="flex justify-content-between align-items-center">
          <h2 className="text-xl font-bold m-0">{event.title}</h2>
          <EventStatusTemplate event={event} />
        </div>

        <div className="flex flex-column gap-3">
          <div className="flex align-items-center gap-2">
            <i className="pi pi-calendar"></i>
            <span>{formatDate(event.dateTime)}</span>
          </div>
          <div className="flex flex-column gap-2">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-map-marker"></i>
              <span>{event.space.name}</span>
            </div>
            <div className="border-1 border-round">
              <SpaceMap space={event.space} />
            </div>
          </div>
          <div className="flex align-items-center gap-2">
            <div dangerouslySetInnerHTML={{ __html: event.sport.pictogram }} />
            <span>{event.sport.name}</span>
          </div>
          <div className="flex align-items-center gap-2">
            <i className="pi pi-users"></i>
            <span>
              {event.participants.length}/{event.maxParticipants} participantes
            </span>
          </div>
          {event.description && (
            <div className="flex flex-column gap-2">
              <h3 className="text-lg font-semibold m-0">Descripción</h3>
              <p className="m-0">{event.description}</p>
            </div>
          )}
          <div className="flex flex-column gap-2">
            <h3 className="text-lg font-semibold m-0">Participantes</h3>
            <div className="flex flex-wrap gap-2">
              {event.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex align-items-center gap-2 p-2 border-1 border-round"
                >
                  <i className="pi pi-user"></i>
                  <span>{participant.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
