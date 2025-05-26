import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Event } from "../services/eventService";
import { eventService } from "../services/eventService";

interface EditEventModalProps {
  visible: boolean;
  onHide: () => void;
  event: Event;
  onSuccess: () => void;
}

export const EditEventModal = ({
  visible,
  onHide,
  event,
  onSuccess,
}: EditEventModalProps) => {
  const toast = useRef<Toast>(null);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [dateTime, setDateTime] = useState<Date | null>(
    new Date(event.dateTime)
  );
  const [minParticipants, setMinParticipants] = useState(event.minParticipants);
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle(event.title);
    setDescription(event.description);
    setDateTime(new Date(event.dateTime));
    setMinParticipants(event.minParticipants);
    setMaxParticipants(event.maxParticipants);
  };

  const handleHide = () => {
    resetForm();
    onHide();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateTime) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor complete todos los campos requeridos",
        life: 3000,
      });
      return;
    }

    // Validar que la fecha sea posterior a la original
    if (dateTime < new Date(event.dateTime)) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "La fecha debe ser posterior a la fecha original del evento",
        life: 3000,
      });
      return;
    }

    // Validar que la cantidad mínima de participantes sea mayor a la actual
    if (minParticipants <= event.participants.length) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "La cantidad mínima de participantes debe ser mayor a la cantidad actual",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify({
            title,
            description,
            dateTime: dateTime.toISOString(),
            minParticipants,
            maxParticipants,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al editar el evento");
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Evento editado correctamente",
        life: 3000,
      });

      resetForm();
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error ? error.message : "Error al editar el evento",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleHide}
        className="p-button-text"
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={loading}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Editar Evento"
        visible={visible}
        style={{ width: "90vw", maxWidth: "600px" }}
        onHide={handleHide}
        footer={footer}
      >
        <div className="formgrid grid">
          <div className="field col-12">
            <label htmlFor="title" className="block mb-2">
              Título
            </label>
            <InputText
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="field col-12">
            <label htmlFor="description" className="block mb-2">
              Descripción
            </label>
            <InputTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>

          <div className="field col-12">
            <label htmlFor="dateTime" className="block mb-2">
              Fecha y Hora
            </label>
            <Calendar
              id="dateTime"
              value={dateTime}
              onChange={(e) => setDateTime(e.value ?? null)}
              showTime
              hourFormat="24"
              dateFormat="dd/mm/yy"
              showIcon
              stepMinute={15}
              minDate={new Date(event.dateTime)}
              className="w-full"
            />
          </div>

          <div className="field col-6">
            <label htmlFor="minParticipants" className="block mb-2">
              Participantes Mínimos
            </label>
            <InputText
              id="minParticipants"
              type="number"
              value={minParticipants.toString()}
              onChange={(e) => setMinParticipants(Number(e.target.value))}
              min={event.participants.length + 1}
              className="w-full"
            />
          </div>

          <div className="field col-6">
            <label htmlFor="maxParticipants" className="block mb-2">
              Participantes Máximos
            </label>
            <InputText
              id="maxParticipants"
              type="number"
              value={maxParticipants.toString()}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              min={minParticipants}
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
