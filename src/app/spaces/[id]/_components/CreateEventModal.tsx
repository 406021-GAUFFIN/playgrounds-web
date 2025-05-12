"use client";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Sport } from "../../../_types";

interface CreateEventModalProps {
  visible: boolean;
  onHide: () => void;
  spaceId: number;
  onSuccess: () => void;
  sports: Sport[];
}

export default function CreateEventModal({
  visible,
  onHide,
  spaceId,
  onSuccess,
  sports,
}: CreateEventModalProps) {
  const toast = useRef<Toast>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [minParticipants, setMinParticipants] = useState(2);
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [sportId, setSportId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!dateTime || !sportId) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor complete todos los campos requeridos",
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          method: "POST",
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
            spaceId,
            sportId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear el evento");
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Evento creado correctamente",
        life: 3000,
      });

      onSuccess();
      onHide();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error ? error.message : "Error al crear el evento",
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
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Crear"
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
        header="Nuevo Evento"
        visible={visible}
        style={{ width: "90vw", maxWidth: "600px" }}
        onHide={onHide}
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
              showIcon
              stepMinute={15}
              className="w-full"
            />
          </div>

          <div className="field col-12 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="field">
                <label htmlFor="minParticipants" className="block mb-2">
                  Mínimo de Participantes
                </label>
                <InputText
                  id="minParticipants"
                  type="number"
                  value={minParticipants.toString()}
                  onChange={(e) => setMinParticipants(parseInt(e.target.value))}
                  min={2}
                  className="w-full"
                />
              </div>

              <div className="field">
                <label htmlFor="maxParticipants" className="block mb-2">
                  Máximo de Participantes
                </label>
                <InputText
                  id="maxParticipants"
                  type="number"
                  value={maxParticipants.toString()}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                  min={minParticipants}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="field col-12">
            <label htmlFor="sport" className="block mb-2">
              Deporte
            </label>
            <Dropdown
              id="sport"
              value={sportId}
              options={sports}
              onChange={(e) => setSportId(e.value)}
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un deporte"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
