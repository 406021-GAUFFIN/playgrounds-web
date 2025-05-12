import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Event, eventService } from "../services/eventService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventStatusTemplate } from "./EventStatusTemplate";
import { Button } from "primereact/button";
import { useAuth } from "../../context/AuthContext";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  loadEvents: () => void;
}

export const EventsTable = ({
  events,
  loading,
  totalRecords,
  page,
  pageSize,
  onPageChange,
  loadEvents,
}: EventsTableProps) => {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yy HH:mm", { locale: es });
  };

  const participantsTemplate = (event: Event) => {
    return `${event.participants.length}/${event.maxParticipants}`;
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

  const actionTemplate = (event: Event) => {
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

    //Un usuario siempre puede ver el detalle del evento
    const canSeeDetails = true;

    //Un usuario solo puede editar un evento si es el creador y el evento está disponible
    const canEdit =
      event.creator.id === user?.id && event.status === "available";

    //un usuario puede cancelar un evento si es el creador y el evento está disponible
    const canCancel =
      event.creator.id === user?.id && event.status === "available";

    return (
      <div className="flex">
        {canSeeDetails && (
          <Button
            icon="pi pi-eye"
            className="p-button-rounded p-button-text"
            tooltip="Ver detalle"
            tooltipOptions={{ position: "top" }}
          />
        )}
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

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={events}
        paginator
        rows={pageSize}
        totalRecords={totalRecords}
        lazy
        first={page * pageSize}
        onPage={(e) => onPageChange(e.page ?? 0)}
        loading={loading}
        emptyMessage="No hay eventos disponibles"
      >
        <Column field="title" header="Nombre" />
        <Column
          field="dateTime"
          header="Fecha"
          body={(event) => formatDate(event.dateTime)}
        />
        <Column
          field="sport.name"
          header="Deporte"
          body={(event) => (
            <div className="flex items-center gap-1">
              <div
                className="w-1 h-1"
                dangerouslySetInnerHTML={{ __html: event.sport.pictogram }}
              />
              <span className="ml-1">{event.sport.name}</span>
            </div>
          )}
        />
        <Column field="space.name" header="Lugar" />
        <Column
          field="participants"
          header="Participantes"
          body={participantsTemplate}
        />
        <Column
          field="status"
          header="Estado"
          body={(event) => <EventStatusTemplate event={event} />}
        />
        {actionTemplate && (
          <Column
            body={actionTemplate}
            header="Acciones"
            style={{ width: "150px" }}
          />
        )}
      </DataTable>
    </>
  );
};
