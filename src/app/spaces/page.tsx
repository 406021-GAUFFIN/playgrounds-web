"use client";
import { useRequireAuth } from "@/context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useRef, useState, useEffect } from "react";
import { SportBadge } from "@/components/common/SportBadge";
import { PaginatedResponse } from "@/types/pagination";
import { formatDate } from "@/utils/dateUtils";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { EditUserModal } from "@/components/users/EditUserModal";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { Accessibility, Space, Sport } from "./_types";
import { EditSpaceModal } from "./_components/EditSpaceModal";
import { CreateSpaceModal } from "./_components/CreateSpaceModal";
import { spaceService } from "../services/spaceService";
import { Chip } from "primereact/chip";

const Page = () => {
  const { user } = useRequireAuth(["ADMIN"]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  });

  const [nameFilter, setNameFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadSpaces = async () => {
    setLoading(true);
    try {
      const data = await spaceService.getSpaces({
        page: lazyState.page,
        pageSize: lazyState.rows,
        name: nameFilter,
      });
      setSpaces(data.data);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, [lazyState, nameFilter]);

  const onPage = (event: any) => {
    setLazyState({
      ...lazyState,
      first: event.first,
      rows: event.rows,
      page: event.page,
    });
  };

  const sportTemplate = (rowData: Space) => {
    return (
      <div className="flex flex-wrap gap-2">
        {rowData.sports && rowData.sports.length > 0 ? (
          rowData.sports.map((sport: Sport) => (
            <SportBadge key={sport.id} sport={sport} />
          ))
        ) : (
          <div>Sin deportes</div>
        )}
      </div>
    );
  };
  const accessibilityTemplate = (rowData: Space) => {
    return (
      <div className="flex flex-wrap gap-2">
        {rowData.accessibilities && rowData.accessibilities.length > 0 ? (
          rowData.accessibilities.map((accessibility: Accessibility) => (
            <Chip key={accessibility.id} label={accessibility.name} />
          ))
        ) : (
          <div>Sin accesibilidad</div>
        )}
      </div>
    );
  };

  const statusTemplate = (rowData: Space) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          rowData.isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {rowData.isActive ? "Activo" : "Inactivo"}
      </span>
    );
  };

  const actionsTemplate = (rowData: Space) => {
    return (
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text"
        onClick={() => {
          setSelectedSpaceId(rowData.id);
          setShowEditModal(true);
        }}
      />
    );
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-900 font-bold text-5xl mb-3 text-center">
        Gestión de Espacios
      </h2>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Button
          icon="pi pi-eraser"
          rounded
          outlined
          severity="secondary"
          aria-label="Limpiar filtros"
          onClick={() => {
            setNameFilter("");
          }}
        />

        <div className="w-full md:w-auto">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              placeholder="Buscar por nombre"
              className="w-full"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </IconField>
        </div>

        <div className="ml-auto">
          <Button
            label="Nuevo Espacio"
            icon="pi pi-plus"
            onClick={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      <DataTable
        value={spaces}
        lazy
        dataKey="id"
        paginator
        rowsPerPageOptions={[5, 10, 25, 50]}
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        className="p-datatable-sm"
        emptyMessage="No se encontraron espacios"
      >
        <Column field="name" header="Nombre" />
        <Column field="address" header="Dirección" />
        <Column field="sports" header="Deportes" body={sportTemplate} />
        <Column
          field="accessibilities"
          header="Accesibilidad"
          body={accessibilityTemplate}
        />
        <Column field="isActive" header="Estado" body={statusTemplate} />

        <Column body={actionsTemplate} style={{ width: "4rem" }} />
      </DataTable>

      <EditSpaceModal
        visible={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedSpaceId(null);
        }}
        spaceId={selectedSpaceId}
        onSuccess={loadSpaces}
      />

      <CreateSpaceModal
        visible={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={loadSpaces}
      />
    </div>
  );
};

export default Page;
