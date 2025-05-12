import { DataView } from "primereact/dataview";
import { Event } from "../services/eventService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventStatusTemplate } from "./EventStatusTemplate";
import { Button } from "primereact/button";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { eventService } from "../services/eventService";
import { classNames } from "primereact/utils";

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
  const { user } = useAuth();
  const toast = useRef<Toast>(null);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yy HH:mm", { locale: es });
  };

  const handleJoinEvent = async (eventId: number) => {
    try {
      await eventService.joinEvent(eventId);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Te has unido al evento correctamente",
        life: 3000,
      });
      loadEvents();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error ? error.message : "Error al unirse al evento",
        life: 3000,
      });
    }
  };

  const handleCancelEvent = async (eventId: number) => {
    try {
      await eventService.cancelEvent(eventId);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Evento cancelado correctamente",
        life: 3000,
      });
      loadEvents();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error
            ? error.message
            : "Error al cancelar el evento",
        life: 3000,
      });
    }
  };

  const confirmJoinEvent = (event: Event) => {
    confirmDialog({
      message: "¿Estás seguro que deseas unirte a este evento?",
      header: "Confirmar participación",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleJoinEvent(event.id),
      acceptLabel: "Sí, unirme",
      rejectLabel: "No",
    });
  };

  const confirmCancelEvent = (event: Event) => {
    confirmDialog({
      message:
        "¿Estás seguro que deseas cancelar este evento? Esta acción no se puede deshacer.",
      header: "Confirmar cancelación",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleCancelEvent(event.id),
      acceptLabel: "Sí, cancelar",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
    });
  };

  const getEventActions = (event: Event) => {
    //Para qu eun usuario se pueda unir a un evento: NO debe estar ya en el evento, no debe ser el creador,
    // el evento debe tener menos que la cant max de participantes,
    // el evento debe estar disponible o confirmado

    const canJoin =
      (event.status === "available" || event.status === "confirmed") &&
      event.participants.length < event.maxParticipants &&
      !event.participants.some((p) => p.id === user?.id) &&
      event.creator.id !== user?.id;

    //Para poder salir del evento: debe ser participante, y el evento debe estar AVALIBLE, el usuario no debe ser el creador
    const canLeave =
      event.participants.some((p) => p.id === user?.id) &&
      event.status === "available" &&
      event.creator.id !== user?.id;

    //Un usuario solo puede editar un evento si es el creador y el evento está disponible
    const canEdit =
      event.creator.id === user?.id && event.status === "available";

    //un usuario puede cancelar un evento si es el creador y el evento está disponible
    const canCancel =
      event.creator.id === user?.id && event.status === "available";

    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-text"
          tooltip="Ver detalle"
          tooltipOptions={{ position: "top" }}
        />
        {canJoin && (
          <Button
            icon="pi pi-check-circle"
            className="p-button-rounded p-button-text"
            tooltip="Anotarse"
            tooltipOptions={{ position: "top" }}
            onClick={() => confirmJoinEvent(event)}
          />
        )}
        {canLeave && (
          <Button
            icon="pi pi-sign-out"
            className="p-button-rounded p-button-text p-button-danger"
            tooltip="Abandonar evento"
            tooltipOptions={{ position: "top" }}
          />
        )}
        {canEdit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text"
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
          />
        )}
        {canCancel && (
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text p-button-danger"
            tooltip="Cancelar"
            tooltipOptions={{ position: "top" }}
            onClick={() => confirmCancelEvent(event)}
          />
        )}
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
            <div className="flex justify-content-between align-items-center">
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
                <span>{event.space.name}</span>
              </div>
              <div className="flex align-items-center gap-2">
                <div
                  dangerouslySetInnerHTML={{ __html: event.sport.pictogram }}
                />
                <span>{event.sport.name}</span>
              </div>
              <div className="flex align-items-center gap-2">
                <i className="pi pi-users"></i>
                <span>
                  {event.participants.length}/{event.maxParticipants}{" "}
                  participantes
                </span>
              </div>
            </div>

            <div className="flex justify-content-end">
              {getEventActions(event)}
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
      <Toast ref={toast} />
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
    </>
  );
};
