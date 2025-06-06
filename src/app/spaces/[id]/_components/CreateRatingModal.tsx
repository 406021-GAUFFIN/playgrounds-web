"use client";
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface CreateRatingModalProps {
  visible: boolean;
  onHide: () => void;
  spaceId: string;
  onSuccess: () => void;
}

export default function CreateRatingModal({
  visible,
  onHide,
  spaceId,
  onSuccess,
}: CreateRatingModalProps) {
  const [loading, setLoading] = useState(false);
  const [canRate, setCanRate] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (visible) {
      checkCanRate();
    }
  }, [visible]);

  const checkCanRate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spaces/${spaceId}/can-rate`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Error al verificar si puede calificar");

      const data = await response.json();
      setCanRate(data.canRate);
      setReason(data.reason);
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo verificar si puede calificar",
      });
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar una calificación",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spaces/${spaceId}/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify({
            rating,
            comment: comment || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al crear la calificación");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Calificación creada correctamente",
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear la calificación",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (canRate === null) {
      return (
        <div className="flex justify-center items-center p-4">
          <i className="pi pi-spin pi-spinner text-2xl"></i>
        </div>
      );
    }

    if (!canRate) {
      return (
        <div className="p-4 text-center">
          <i className="pi pi-info-circle text-2xl text-blue-500 mb-2"></i>
          <p className="text-gray-700">{reason}</p>
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Calificación *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`pi ${
                  star <= (hoveredRating || rating) ? "pi-star-fill" : "pi-star"
                } text-2xl cursor-pointer transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              ></i>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-gray-700 font-semibold mb-2"
          >
            Comentario (opcional)
          </label>
          <InputTextarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full"
            placeholder="Escribe tu comentario aquí..."
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Calificar espacio"
        style={{ width: "90vw", maxWidth: "500px" }}
        footer={
          canRate && (
            <div className="flex justify-end gap-2">
              <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
              />
              <Button
                label="Guardar"
                icon="pi pi-check"
                onClick={handleSubmit}
                loading={loading}
              />
            </div>
          )
        }
      >
        {renderContent()}
      </Dialog>
    </>
  );
}
