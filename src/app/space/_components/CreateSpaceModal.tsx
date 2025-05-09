import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

interface CreateSpaceModalProps {
  visible: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

interface NewSpace {
  name: string;
  address: string;
  schedule: string;
  conditions: string;
  isAccessible: boolean;
  description: string;
}

const initialSpace: NewSpace = {
  name: "",
  address: "",
  schedule: "",
  conditions: "",
  isAccessible: false,
  description: "",
};


export const CreateSpaceModal = ({
  visible,
  onHide,
  onSuccess,
}: CreateSpaceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [space, setSpace] = useState<NewSpace>(initialSpace);
  const toast = useRef<Toast>(null);

  const handleCreate = async () => {
    if (!space.name || !space.address || !space.schedule || !space.conditions || !space.description) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Todos los campos son obligatorios",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie.split("token=")[1].split(";")[0]
          }`,
        },
        body: JSON.stringify(space),
      });

      if (!response.ok) throw new Error("Error al crear el espacio");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Espacio creado correctamente",
      });

      onSuccess();
      onHide();
      setSpace(initialSpace);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el espacio",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Crear Espacio"
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
            value={space.name}
            onChange={(e) => setSpace({ ...space, name: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="adress" className="font-bold">
            Dirección *
          </label>
          <InputText
            id="address"
            value={space.address}
            onChange={(e) => setSpace({ ...space, address: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="schedule" className="font-bold">
            Horario *
          </label>
          <Password
            id="schedule"
            value={space.schedule}
            onChange={(e) => setSpace({ ...space, schedule: e.target.value })}
            toggleMask
            feedback={false}
          />
        </div>

        {/* <div className="field mb-4">
          <label htmlFor="role" className="font-bold">
            Rol *
          </label>
          <Dropdown
            id="conditions"
            value={space.conditions}
            onChange={(e) => setSpace({ ...space, conditions: e.value })}
            options={conditions}
            placeholder="Seleccione una condición"
          />
        </div> */}
      </div>
    </Dialog>
  );
};
