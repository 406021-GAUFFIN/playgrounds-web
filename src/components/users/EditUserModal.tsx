import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";
import { formatDate } from "@/utils/dateUtils";

interface User {
  id: number;
  name: string;
  email: string;
  emailValidatedAt: string | null;
  role: string;
  verificationCode: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditUserModalProps {
  visible: boolean;
  onHide: () => void;
  userId: number | null;
  onSuccess: () => void;
}

export const EditUserModal = ({
  visible,
  onHide,
  userId,
  onSuccess,
}: EditUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const toast = useRef<Toast>(null);

  const loadUser = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar el usuario");

      const data = await response.json();
      setUser(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && userId) {
      loadUser();
    } else {
      setUser(null);
      setPassword("");
    }
  }, [visible, userId]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify({
            name: user.name,
            ...(password ? { password } : {}),
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el usuario");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario actualizado correctamente",
      });

      onSuccess();
      onHide();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-4">
          <ProgressSpinner />
        </div>
      );
    }

    if (!user) return null;

    return (
      <div className="p-fluid">
        <Toast ref={toast} />
        <div className="field mb-4">
          <label htmlFor="name" className="font-bold">
            Nombre
          </label>
          <InputText
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="email" className="font-bold">
            Email
          </label>
          <InputText id="email" value={user.email} disabled />
        </div>

        <div className="field mb-4">
          <label htmlFor="verificationCode" className="font-bold">
            Código de verificación
          </label>
          <InputText
            id="verificationCode"
            value={user.verificationCode || "No disponible"}
            disabled
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="emailValidatedAt" className="font-bold">
            Fecha de validación
          </label>
          <InputText
            id="emailValidatedAt"
            value={
              user.emailValidatedAt
                ? formatDate(user.emailValidatedAt)
                : "No validado"
            }
            disabled
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="role" className="font-bold">
            Rol
          </label>
          <InputText id="role" value={user.role} disabled />
        </div>

        <div className="field mb-4">
          <label htmlFor="password" className="font-bold">
            Contraseña
          </label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            placeholder="Ingrese nueva contraseña"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="createdAt" className="font-bold">
            Fecha de creación
          </label>
          <InputText
            id="createdAt"
            value={formatDate(user.createdAt)}
            disabled
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="updatedAt" className="font-bold">
            Última actualización
          </label>
          <InputText
            id="updatedAt"
            value={formatDate(user.updatedAt)}
            disabled
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Editar Usuario"
      style={{ width: "50vw" }}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            label="Cancelar"
            severity="secondary"
            outlined
            icon="pi pi-times"
            onClick={onHide}
            className="p-button-text"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      }
    >
      {renderContent()}
    </Dialog>
  );
};
