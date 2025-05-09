import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { useState, useEffect, use } from "react";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Space, Sport } from "../_types";
import { ProgressSpinner } from "primereact/progressspinner";
import MapComponent from "./MapComponent";

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
  isActive: boolean;
  latitude: number;
  longitude: number;
  sportIds: number[];
}

const initialSpace: NewSpace = {
  name: "",
  address: "",
  schedule: "",
  conditions: "",
  isAccessible: false,
  description: "",
  isActive: true,
  latitude: 0,
  longitude: 0,
  sportIds: [],
};

export const CreateSpaceModal = ({
  visible,
  onHide,
  onSuccess,
}: CreateSpaceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingSports, setLoadingSports] = useState(false);
  const [space, setSpace] = useState<NewSpace>(initialSpace);
  const [sports, setSports] = useState<Sport[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    console.log(sports);
  }, [sports]);

  useEffect(() => {
    if (visible) {
      loadSports();
    }
  }, [visible]);

  const loadSports = async () => {
    setLoadingSports(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sports`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar los deportes");

      const data = await response.json();
      setSports(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los deportes",
      });
    } finally {
      setLoadingSports(false);
    }
  };

  const handleCreate = async () => {
    if (
      !space.name ||
      !space.address ||
      !space.schedule ||
      !space.conditions ||
      !space.description
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Todos los campos son obligatorios",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spaces`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
          body: JSON.stringify(space),
        }
      );

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

  const sportTemplate = (option: Sport | number) => {
    // Si es un número (ID), buscamos el sport correspondiente
    const sport =
      typeof option === "number" ? sports.find((s) => s.id === option) : option;

    if (!sport) return null;

    return (
      <div className="flex align-items-center gap-2">
        {sport.pictogram && (
          <img
            src={sport.pictogram}
            alt={sport.name || "Sport icon"}
            className="w-6 h-6"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <span>{sport.name || "Sin nombre"}</span>
      </div>
    );
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
          <label htmlFor="address" className="font-bold">
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
          <InputText
            id="schedule"
            value={space.schedule}
            onChange={(e) => setSpace({ ...space, schedule: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="conditions" className="font-bold">
            Condiciones *
          </label>
          <InputText
            id="conditions"
            value={space.conditions}
            onChange={(e) => setSpace({ ...space, conditions: e.target.value })}
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="description" className="font-bold">
            Descripción *
          </label>
          <InputText
            id="description"
            value={space.description}
            onChange={(e) =>
              setSpace({ ...space, description: e.target.value })
            }
          />
        </div>

        <div className="field mb-4">
          <label className="font-bold">Ubicación</label>
          <MapComponent
            initialLat={space.latitude || -34.6037}
            initialLng={space.longitude || -58.3816}
            onLocationSelect={(lat, lng) => {
              setSpace((prev) => ({
                ...prev,
                latitude: lat,
                longitude: lng,
              }));
            }}
          />
          <small className="block mt-2">
            Haga clic en el mapa para seleccionar la ubicación
          </small>
        </div>

        <div className="grid">
          <div className="col-6">
            <div className="field mb-4">
              <label htmlFor="latitude" className="font-bold">
                Latitud
              </label>
              <InputNumber
                id="latitude"
                value={space.latitude}
                onValueChange={(e) =>
                  setSpace({ ...space, latitude: e.value || 0 })
                }
                mode="decimal"
                minFractionDigits={6}
                maxFractionDigits={6}
                readOnly
              />
            </div>
          </div>
          <div className="col-6">
            <div className="field mb-4">
              <label htmlFor="longitude" className="font-bold">
                Longitud
              </label>
              <InputNumber
                id="longitude"
                value={space.longitude}
                onValueChange={(e) =>
                  setSpace({ ...space, longitude: e.value || 0 })
                }
                mode="decimal"
                minFractionDigits={6}
                maxFractionDigits={6}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="field mb-4">
          <label htmlFor="sports" className="font-bold">
            Deportes
          </label>
          {loadingSports ? (
            <div className="flex align-items-center justify-content-center p-3 border-1 border-round">
              <ProgressSpinner style={{ width: "30px", height: "30px" }} />
            </div>
          ) : (
            <MultiSelect
              id="sports"
              value={space.sportIds}
              options={sports}
              onChange={(e) => setSpace({ ...space, sportIds: e.value })}
              optionLabel="name"
              optionValue="id"
              itemTemplate={sportTemplate}
              selectedItemTemplate={sportTemplate}
              placeholder="Seleccione los deportes"
              className="w-full"
            />
          )}
        </div>

        <div className="field-checkbox mb-4">
          <label htmlFor="isAccessible" className="font-bold">
            Accesible
          </label>
          <input
            type="checkbox"
            id="isAccessible"
            checked={space.isAccessible}
            onChange={(e) =>
              setSpace({ ...space, isAccessible: e.target.checked })
            }
          />
        </div>

        <div className="field-checkbox mb-4">
          <label htmlFor="isActive" className="font-bold">
            Activo
          </label>
          <input
            type="checkbox"
            id="isActive"
            checked={space.isActive}
            onChange={(e) => setSpace({ ...space, isActive: e.target.checked })}
          />
        </div>
      </div>
    </Dialog>
  );
};
