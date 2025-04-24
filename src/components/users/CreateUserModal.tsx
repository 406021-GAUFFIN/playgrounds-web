import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

interface CreateUserModalProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const initialUser: NewUser = {
  name: "",
  email: "",
  password: "",
  role: "SPORTSMAN",
};

const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Deportista", value: "SPORTSMAN" },
];

export const CreateUserModal = ({
  visible,
  onHide,
  onSuccess,
}: CreateUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<NewUser>(initialUser);
  const toast = useRef<Toast>(null);

  const handleCreate = async () => {
    if (!user.name || !user.email || !user.password || !user.role) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Todos los campos son obligatorios",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) throw new Error("Error al crear el usuario");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario creado correctamente",
      });

      onSuccess();
      onHide();
      setUser(initialUser);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Crear Usuario"
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
            label="Crear"
            icon="pi pi-check"
            onClick={handleCreate}
            disabled={loading}
          />
        </div>
      }
    >
      <div className="p-fluid">
        <Toast ref={toast} />
        <div className="field mb-4">
          <label htmlFor="name" className="font-bold">
            Nombre *
          </label>
          <InputText
            id="name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="email" className="font-bold">
            Email *
          </label>
          <InputText
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            type="email"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="password" className="font-bold">
            Contraseña *
          </label>
          <Password
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            toggleMask
            feedback={false}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="role" className="font-bold">
            Rol *
          </label>
          <Dropdown
            id="role"
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.value })}
            options={roles}
            placeholder="Seleccione un rol"
          />
        </div>
      </div>
    </Dialog>
  );
};
