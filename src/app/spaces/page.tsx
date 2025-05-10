"use client";
import { useRequireAuth } from "@/context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState, useEffect } from "react";
import { PaginatedResponse } from "@/types/pagination";
import { formatDate } from "@/utils/dateUtils";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { EditUserModal } from "@/components/users/EditUserModal";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { Space, Sport } from "./_types";
import { EditSpaceModal } from "./_components/EditSpaceModal";
import { CreateSpaceModal } from "./_components/CreateSpaceModal";
import { spaceService } from "../services/spaceService";

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
            <div
              key={sport.id}
              className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
            >
              <div
                className="w-6 h-6"
                dangerouslySetInnerHTML={{ __html: sport.pictogram }}
              />
              <span>{sport.name}</span>
            </div>
          ))
        ) : (
          <div>Sin deportes</div>
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

  const accessibleTemplate = (rowData: Space) => {
    return (
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          rowData.isAccessible
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {rowData.isAccessible ? "Sí" : "No"}
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
        <Column field="isActive" header="Estado" body={statusTemplate} />
        <Column
          field="isAccessible"
          header="Accesible"
          body={accessibleTemplate}
        />
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
