import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";
import { formatDate } from "@/utils/dateUtils";
import { Space } from "../_types";

interface EditSpaceModalProps {
  visible: boolean;
  onHide: () => void;
  spaceId: number | null;
  onSuccess: () => void;
}

export const EditSpaceModal = ({
  visible,
  onHide,
  spaceId,
  onSuccess,
}: EditSpaceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [space, setSpace] = useState<Space | null>(null);
  const toast = useRef<Toast>(null);

  const loadSpace = async () => {
    if (!spaceId) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spaces/${spaceId}`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar el espacio");

      const data = await response.json();
      setSpace(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar el espacio",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && spaceId) {
      loadSpace();
    } else {
      setSpace(null);
    }
  }, [visible, spaceId]);

  const handleSave = async () => {
    if (!space) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spaces/${spaceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify({
            space,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el espacio");

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Espacio actualizado correctamente",
      });

      onSuccess();
      onHide();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el espacio",
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

    if (!space) return null;

    return (
      <div className="p-fluid">
        <Toast ref={toast} />
        <div className="field mb-4">
          <label htmlFor="name" className="font-bold">
            Nombre
          </label>
          <InputText
            id="name"
            value={space.name}
            onChange={(e) => setSpace({ ...space, name: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="adress" className="font-bold">
            Dirección
          </label>
          <InputText id="adress" value={space.address} disabled />
        </div>

        <div className="field mb-4">
          <label htmlFor="schedule" className="font-bold">
            Horario
          </label>
          <InputText
            id="schedule"
            value={space.schedule || "No disponible"}
            disabled
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="conditions" className="font-bold">
            Condiciones
          </label>
          <InputText
            id="conditions"
            value={space.conditions || "No disponible"}
            disabled
          />
        </div>

        {/* <div className="field mb-4">
          <label htmlFor="isAccessible" className="font-bold">
            Accesible
          </label>
          <InputText id="isAccessible" value={space.isAccessible} disabled />
        </div> */}

        <div className="field mb-4">
          <label htmlFor="description" className="font-bold">
            Descripción
          </label>
          <Password
            id="description"
            value={space.description}
            onChange={(e) =>
              setSpace({ ...space, description: e.target.value })
            }
            toggleMask
            feedback={false}
            placeholder="Ingrese nueva descripción"
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="createdAt" className="font-bold">
            Fecha de creación
          </label>
          <InputText
            id="createdAt"
            value={formatDate(space.createdAt)}
            disabled
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="updatedAt" className="font-bold">
            Última actualización
          </label>
          <InputText
            id="updatedAt"
            value={formatDate(space.updatedAt)}
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
