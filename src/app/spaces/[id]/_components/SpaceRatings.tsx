"use client";
import { Rating } from "../../_types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useState } from "react";
import CreateRatingModal from "./CreateRatingModal";
import EditRatingModal from "./EditRatingModal";
import { Divider } from "primereact/divider";
import { useAuth } from "../../../../context/AuthContext";

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
  const [showEditRatingModal, setShowEditRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const { user } = useAuth();

  const sortedRatings = [...ratings].sort((a, b) => {
    if (a.user.email === user?.email) return -1;
    if (b.user.email === user?.email) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleEditClick = (rating: Rating) => {
    setSelectedRating(rating);
    setShowEditRatingModal(true);
  };

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
            size="small"
            onClick={() => setShowCreateRatingModal(true)}
          />
        </div>
        {ratings.length === 0 ? (
          <p className="text-gray-500">No hay calificaciones aún</p>
        ) : (
          <div className="space-y-4">
            {sortedRatings.map((rating, index) => (
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
                          {rating.user.email === user?.email && (
                            <span className="ml-2 text-sm text-blue-500">
                              (Tú)
                            </span>
                          )}
                        </span>
                        <span className="text-sm">
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
                    <p className={`mt-2`}>
                      {rating.comment || "Sin comentario"}
                    </p>
                    {rating.user.id === user?.id && (
                      <div className="flex justify-content-end flex-wrap">
                        <Button
                          icon="pi pi-pencil"
                          rounded
                          outlined
                          onClick={() => handleEditClick(rating)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {index < sortedRatings.length - 1 && <Divider />}
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

      {selectedRating && (
        <EditRatingModal
          visible={showEditRatingModal}
          onHide={() => {
            setShowEditRatingModal(false);
            setSelectedRating(null);
          }}
          spaceId={spaceId}
          rating={selectedRating}
          onSuccess={onRatingCreated}
        />
      )}
    </Card>
  );
}
