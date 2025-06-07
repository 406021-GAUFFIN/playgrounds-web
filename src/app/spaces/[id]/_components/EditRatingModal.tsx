"use client";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Rating } from "../../_types";

interface EditRatingModalProps {
  visible: boolean;
  onHide: () => void;
  spaceId: string;
  rating: Rating;
  onSuccess: () => void;
}

export default function EditRatingModal({
  visible,
  onHide,
  spaceId,
  rating,
  onSuccess,
}: EditRatingModalProps) {
  const [loading, setLoading] = useState(false);
  const [currentRating, setCurrentRating] = useState(rating.rating);
  const [comment, setComment] = useState(rating.comment || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const toast = useRef<Toast>(null);

  const handleSubmit = async () => {
    if (currentRating === 0) {
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
        `${process.env.NEXT_PUBLIC_API_URL}/spaces/${spaceId}/ratings/${rating.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify({
            rating: currentRating,
            comment: comment || null,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar la calificación");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Calificación actualizada correctamente",
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar la calificación",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={onHide}
        header="Editar calificación"
        style={{ width: "90vw", maxWidth: "500px" }}
        footer={
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
        }
      >
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
                    star <= (hoveredRating || currentRating)
                      ? "pi-star-fill"
                      : "pi-star"
                  } text-2xl cursor-pointer transition-colors ${
                    star <= (hoveredRating || currentRating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setCurrentRating(star)}
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
      </Dialog>
    </>
  );
}
