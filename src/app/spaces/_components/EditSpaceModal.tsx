import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Button } from "primereact/button";
import { formatDate } from "@/utils/dateUtils";
import { Accessibility, Space, Sport } from "../_types";
import MapComponent from "./MapComponent";
import Image from "next/image";
import { accessibilityService } from "../../services/accessibilityService";
import { spaceService } from "../../services/spaceService";

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
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingAccessibilities, setLoadingAccessibilities] = useState(false);
  const [space, setSpace] = useState<Space | null>(null);
  const [sports, setSports] = useState<Sport[]>([]);
  const [accessibilities, setAccessibilities] = useState<Accessibility[]>([]);
  const toast = useRef<Toast>(null);

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

  const loadAccessibilities = async () => {
    setLoadingAccessibilities(true);
    try {
      const data = await accessibilityService.getAccessibilities();
      setAccessibilities(data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar las accesibilidades",
      });
    } finally {
      setLoadingAccessibilities(false);
    }
  };

  const loadSpace = async () => {
    if (!spaceId) return;

    setLoading(true);
    try {
      const data = await spaceService.getSpaceById(spaceId.toString());
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
    if (visible) {
      loadSports();
      loadAccessibilities();
      if (spaceId) {
        loadSpace();
      }
    } else {
      setSpace(null);
    }
  }, [visible, spaceId]);

  const handleSave = async () => {
    if (!space) return;

    setLoading(true);
    try {
      const { sports, id, createdAt, updatedAt, ...spaceWithoutIdAndSports } =
        space;
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
            ...spaceWithoutIdAndSports,
            sportIds: space.sports.map((sport) => sport.id),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el espacio");
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Espacio actualizado correctamente",
        life: 3000,
      });

      onSuccess();
      onHide();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar el espacio",
        life: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const sportTemplate = (option: Sport | number) => {
    const sport =
      typeof option === "number" ? sports.find((s) => s.id === option) : option;

    if (!sport) return null;

    return (
      <div className="flex align-items-center gap-2">
        {sport.pictogram && (
          <div
            className="w-6 h-6"
            dangerouslySetInnerHTML={{ __html: sport.pictogram }}
          />
        )}
        <span>{sport.name || "Sin nombre"}</span>
      </div>
    );
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
            initialLat={space.latitude}
            initialLng={space.longitude}
            onLocationSelect={(lat, lng) => {
              setSpace((prev) => ({
                ...prev!,
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
              value={space.sports}
              options={sports}
              onChange={(e) => setSpace({ ...space, sports: e.value })}
              optionLabel="name"
              optionValue="id"
              itemTemplate={sportTemplate}
              selectedItemTemplate={sportTemplate}
              placeholder="Seleccione los deportes"
              className="w-full"
            />
          )}
        </div>
        <div className="field mb-4">
          <label htmlFor="accessibilities" className="font-bold">
            Accesibilidad
          </label>
          {loadingAccessibilities ? (
            <div className="flex align-items-center justify-content-center p-3 border-1 border-round">
              <ProgressSpinner style={{ width: "30px", height: "30px" }} />
            </div>
          ) : (
            <MultiSelect
              id="accesibilities"
              value={space.accessibilities}
              options={accessibilities}
              onChange={(e) => setSpace({ ...space, accessibilities: e.value })}
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione las accesibilidades"
              className="w-full"
            />
          )}
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
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Editar Espacio"
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
