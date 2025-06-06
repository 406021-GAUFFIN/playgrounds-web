"use client";
import { Rating } from "../../_types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useState } from "react";
import CreateRatingModal from "./CreateRatingModal";
import { Divider } from "primereact/divider";

interface SpaceRatingsProps {
  ratings: Rating[];
  spaceId: string;
  onRatingCreated: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function SpaceRatings({
  ratings,
  spaceId,
  onRatingCreated,
}: SpaceRatingsProps) {
  const [showCreateRatingModal, setShowCreateRatingModal] = useState(false);

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex justify-content-between align-items-center mb-4">
          <h2 className="text-xl font-semibold m-0">
            Calificaciones y comentarios
          </h2>
          <Button
            label="Calificar"
            icon="pi pi-star"
            onClick={() => setShowCreateRatingModal(true)}
          />
        </div>
        {ratings.length === 0 ? (
          <p className="text-gray-500">No hay calificaciones aún</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div key={rating.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    label={getInitials(rating.user.name)}
                    size="large"
                    style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                    shape="circle"
                  />
                  <div className="flex-1">
                    <div className="flex justify-content-between">
                      <div className="flex justify-content-start gap-2">
                        <span className="font-semibold">
                          {rating.user.name}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {format(
                            new Date(rating.createdAt),
                            "dd 'de' MMMM 'de' yyyy",
                            {
                              locale: es,
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <i
                              key={index}
                              className={`pi ${
                                index < rating.rating
                                  ? "pi-star-fill"
                                  : "pi-star"
                              } text-yellow-500`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p
                      className={`mt-2 ${
                        rating.comment
                          ? "text-gray-700"
                          : "text-gray-400 italic"
                      }`}
                    >
                      {rating.comment || "Sin comentario"}
                    </p>
                  </div>
                </div>
                {index < ratings.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateRatingModal
        visible={showCreateRatingModal}
        onHide={() => setShowCreateRatingModal(false)}
        spaceId={spaceId}
        onSuccess={onRatingCreated}
      />
    </Card>
  );
}
