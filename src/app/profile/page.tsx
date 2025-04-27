"use client";
import { useRequireAuth } from "@/context/AuthContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  emailValidatedAt: string;
}

const Page = () => {
  const { user } = useRequireAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const toast = useRef<Toast>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

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
      setFormData({ ...formData, name: data.name });
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
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...formData, name: profile?.name || "", password: "" });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData: { name: string; password?: string } = {
        name: formData.name,
      };

      // Solo incluir la contraseña si se ha introducido una
      if (formData.password) {
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
      fetchProfile(); // Recargar el perfil
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
