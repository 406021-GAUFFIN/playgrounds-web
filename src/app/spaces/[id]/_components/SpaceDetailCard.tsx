"use client";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { SportBadge } from "@/components/common/SportBadge";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Space, Sport } from "../../../_types";
import { Card } from "primereact/card";

interface SpaceDetailCardProps {
  space: Space;
}

export default function SpaceDetailCard({ space }: SpaceDetailCardProps) {
  return (
    <>
      <Card>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Información</h2>
            <p>
              <strong>Dirección:</strong> {space.address}
            </p>
            <p>
              <strong>Estado:</strong> {space.isActive ? "Activo" : "Inactivo"}
            </p>
            <p>
              <strong>Accesible:</strong> {space.isAccessible ? "Sí" : "No"}
            </p>
            <p>
              <strong>Calificación promedio:</strong>{" "}
              {space.averageRating ? (
                <span className="flex items-center gap-1">
                  {space.averageRating.toFixed(1)}
                  <i className="pi pi-star-fill text-yellow-500"></i>
                </span>
              ) : (
                "Sin calificaciones"
              )}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Deportes</h2>
            <div className="flex flex-wrap gap-2">
              {space.sports.map((sport) => (
                <SportBadge key={sport.id} sport={sport} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
