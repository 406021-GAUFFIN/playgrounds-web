"use client";
import { useRequireAuth } from "@/context/AuthContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import { Tooltip } from "primereact/tooltip";
import { Sport } from "@/app/spaces/_types";
import MapComponent from "./_components/MapComponent";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  emailValidatedAt: string;
  latitude: number | null;
  longitude: number | null;
  searchRadius: number;
  wantsNearbyNotifications: boolean;
  interestedSports: Sport[];
}

const CORDOBA_LAT = -31.420103;
const CORDOBA_LNG = -64.188764;

const Page = () => {
  const { user } = useRequireAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    latitude: null as number | null,
    longitude: null as number | null,
    searchRadius: null as number | null,
    wantsNearbyNotifications: false,
    interestedSportIds: [] as number[],
  });
  const [sports, setSports] = useState<Sport[]>([]);
  const [passwordModified, setPasswordModified] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchProfile();
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sports`);
      if (!response.ok) throw new Error("Error al obtener los deportes");
      const data = await response.json();
      setSports(data);
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los deportes",
      });
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );
      if (!response.ok) throw new Error("Error al obtener el perfil");
      const data = await response.json();
      setProfile(data);
      setFormData({
        ...formData,
        name: data.name,
        latitude: data.latitude,
        longitude: data.longitude,
        searchRadius: data.searchRadius,
        wantsNearbyNotifications: data.wantsNearbyNotifications,
        interestedSportIds: data.interestedSports.map(
          (sport: Sport) => sport.id
        ),
      });
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el perfil",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setPasswordModified(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordModified(false);
    setFormData({
      ...formData,
      name: profile?.name || "",
      password: "",
      latitude: profile?.latitude || null,
      longitude: profile?.longitude || null,
      searchRadius: profile?.searchRadius || null,
      wantsNearbyNotifications: profile?.wantsNearbyNotifications || false,
      interestedSportIds:
        profile?.interestedSports.map((sport) => sport.id) || [],
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (
        formData.wantsNearbyNotifications &&
        (!formData.latitude ||
          !formData.longitude ||
          formData.interestedSportIds.length < 1)
      ) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "Debes seleccionar una ubicación, un radio y al menos un deporte para recibir notificaciones cercanas",
        });
        setLoading(false);
        return;
      }

      const updateData: {
        name: string;
        password?: string;
        latitude: number | null;
        longitude: number | null;
        searchRadius: number | null;
        wantsNearbyNotifications: boolean;
        interestedSportIds: number[];
      } = {
        name: formData.name,
        latitude: formData.latitude,
        longitude: formData.longitude,
        searchRadius: formData.searchRadius,
        wantsNearbyNotifications: formData.wantsNearbyNotifications,
        interestedSportIds: formData.interestedSportIds,
      };

      if (passwordModified && formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${profile?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el perfil");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Perfil actualizado correctamente",
      });

      setIsEditing(false);
      setPasswordModified(false);
      fetchProfile();
    } catch (error) {
      console.error("Error:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="w-full min-h-screen p-4">
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-2 border-round max-w-3xl mx-auto w-full lg:w-6">
        <div className="mb-5 flex flex-column align-items-center">
          <h5 className="text-center text-3xl font-medium text-900 mt-2 mb-4">
            Mi Perfil
          </h5>
        </div>

        <div className="grid">
          <div className="col-12 mb-3">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              Nombre
            </label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full"
              disabled={!isEditing}
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              value={profile.email}
              className="w-full"
              disabled
            />
          </div>

          <div className="col-12 mb-3">
            <label htmlFor="role" className="block text-900 font-medium mb-2">
              Rol
            </label>
            <InputText
              id="role"
              value={profile.role}
              className="w-full"
              disabled
            />
          </div>

          <div className="col-12 mb-3">
            <label className="block text-900 font-medium mb-2">Ubicación</label>
            <div className="border-1 border-round" style={{ height: "300px" }}>
              <MapComponent
                initialLat={formData.latitude || CORDOBA_LAT}
                initialLng={formData.longitude || CORDOBA_LNG}
                onLocationSelect={(lat, lng) =>
                  setFormData({
                    ...formData,
                    latitude: lat,
                    longitude: lng,
                  })
                }
                showMarker={!!formData.latitude && !!formData.longitude}
                interactive={isEditing}
                searchRadius={
                  formData.wantsNearbyNotifications
                    ? formData.searchRadius
                    : null
                }
              />
            </div>
            <div className="flex align-items-center justify-content-between mt-2">
              <small className="text-600">
                {isEditing
                  ? "Haz clic en el mapa para seleccionar tu ubicación"
                  : "Tu ubicación actual"}
              </small>
              {isEditing && formData.latitude && formData.longitude && (
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  onClick={() =>
                    setFormData({
                      ...formData,
                      latitude: null,
                      longitude: null,
                      wantsNearbyNotifications: false,
                    })
                  }
                  tooltip="Eliminar ubicación"
                  tooltipOptions={{ position: "top" }}
                />
              )}
            </div>
          </div>

          <div className="col-12 mb-3">
            <label
              htmlFor="searchRadius"
              className="block text-900 font-medium mb-2"
            >
              Radio de búsqueda (metros)
            </label>
            <div className="flex align-items-center">
              <InputNumber
                id="searchRadius"
                value={formData.searchRadius}
                onValueChange={(e) =>
                  setFormData({ ...formData, searchRadius: e.value || 5000 })
                }
                min={100}
                max={50000}
                step={100}
                className="w-full"
                disabled={!isEditing}
              />
              <Tooltip target=".search-radius-tooltip" />
              <i
                className="pi pi-info-circle search-radius-tooltip ml-2"
                data-pr-tooltip="Distancia máxima para recibir notificaciones de eventos cercanos"
              />
            </div>
          </div>

          <div className="col-12 mb-3">
            <div className="flex align-items-center">
              <Checkbox
                inputId="wantsNearbyNotifications"
                checked={formData.wantsNearbyNotifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wantsNearbyNotifications: e.checked ?? false,
                  })
                }
                disabled={!isEditing}
              />
              <label htmlFor="wantsNearbyNotifications" className="ml-2">
                Recibir notificaciones de eventos cercanos
              </label>
            </div>
            {formData.wantsNearbyNotifications &&
              !formData.latitude &&
              !formData.longitude && (
                <small className="text-red-500 block mt-1">
                  Debes seleccionar una ubicación para recibir notificaciones
                  cercanas
                </small>
              )}
          </div>

          <div className="col-12 mb-3">
            <label
              htmlFor="interestedSports"
              className="block text-900 font-medium mb-2"
            >
              Deportes favoritos
            </label>
            <MultiSelect
              id="interestedSports"
              value={formData.interestedSportIds}
              options={sports}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  interestedSportIds: e.value,
                })
              }
              optionLabel="name"
              optionValue="id"
              placeholder="Selecciona tus deportes favoritos"
              className="w-full"
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="col-12 mb-3">
              <label
                htmlFor="password"
                className="block text-900 font-medium mb-2"
              >
                Nueva Contraseña
              </label>
              <Password
                id="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setPasswordModified(true);
                }}
                className="w-full"
                inputClassName="w-full"
                pt={{
                  iconField: {
                    root: {
                      style: { width: "100%" },
                    },
                  },
                  input: {
                    style: { width: "100%" },
                  },
                  root: {
                    style: { width: "100%" },
                  },
                }}
                inputStyle={{ width: "100%" }}
                feedback={false}
                toggleMask
              />
            </div>
          )}

          <div className="col-12 flex justify-content-end gap-2">
            {!isEditing ? (
              <Button label="Editar" icon="pi pi-pencil" onClick={handleEdit} />
            ) : (
              <>
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  severity="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                />
                <Button
                  label="Guardar"
                  icon="pi pi-check"
                  onClick={handleSave}
                  loading={loading}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
