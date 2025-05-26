import { Button } from "primereact/button";
import { Event } from "../services/eventService";
import { useAuth } from "../../context/AuthContext";
import { confirmDialog } from "primereact/confirmdialog";
import { eventService } from "../services/eventService";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { EditEventModal } from "./EditEventModal";

interface EventActionsProps {
  event: Event;
  loadEvents: () => void;
  onHide?: () => void;
}

export const EventActions = ({
  event,
  loadEvents,
  onHide,
}: EventActionsProps) => {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
  const canEdit = event.creator.id === user?.id && event.status === "available";

  //un usuario puede cancelar un evento si es el creador y el evento está disponible
  const canCancel =
    event.creator.id === user?.id && event.status === "available";

  const confirmJoinEvent = (event: Event) => {
    confirmDialog({
      message: "¿Estás seguro que deseas unirte a este evento?",
      header: "Confirmar participación",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleJoinEvent(event),
      acceptLabel: "Sí, unirme",
      rejectLabel: "No",
    });
  };

  const confirmLeaveEvent = (event: Event) => {
    confirmDialog({
      message: "¿Estás seguro que deseas salir de este evento?",
      header: "Confirmar salida",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleLeaveEvent(event),
      acceptLabel: "Sí, salir",
      rejectLabel: "No",
    });
  };

  const confirmCancelEvent = (event: Event) => {
    confirmDialog({
      message:
        "¿Estás seguro que deseas cancelar este evento? Esta acción no se puede deshacer.",
      header: "Confirmar cancelación",
      icon: "pi pi-exclamation-triangle",
      accept: () => handleCancelEvent(event),
      acceptLabel: "Sí, cancelar",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
    });
  };

  const handleJoinEvent = async (event: Event) => {
    try {
      await eventService.joinEvent(event.id);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Te has unido al evento correctamente",
        life: 3000,
      });
      loadEvents();
      if (onHide) onHide();
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

  const handleLeaveEvent = async (event: Event) => {
    try {
      await eventService.leaveEvent(event.id);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Has salido del evento correctamente",
        life: 3000,
      });
      loadEvents();
      if (onHide) onHide();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error ? error.message : "Error al salir del evento",
        life: 3000,
      });
    }
  };

  const handleCancelEvent = async (event: Event) => {
    try {
      await eventService.cancelEvent(event.id);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Evento cancelado correctamente",
        life: 3000,
      });
      loadEvents();
      if (onHide) onHide();
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

  return (
    <>
      <Toast ref={toast} />
      <div className="flex gap-2">
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
            onClick={() => confirmLeaveEvent(event)}
          />
        )}
        {canEdit && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text"
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
            onClick={() => setShowEditModal(true)}
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
      <EditEventModal
        visible={showEditModal}
        onHide={() => setShowEditModal(false)}
        event={event}
        onSuccess={loadEvents}
      />
    </>
  );
};
