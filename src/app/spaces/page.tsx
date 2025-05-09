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
import { Space } from "./_types";
import { EditSpaceModal } from "./_components/EditSpaceModal";
import { CreateSpaceModal } from "./_components/CreateSpaceModal";

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
      const queryParams = new URLSearchParams({
        page: lazyState.page.toString(),
        pageSize: lazyState.rows.toString(),
      });

      if (nameFilter) queryParams.append("name", nameFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spaces?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar usuarios");

      const data: PaginatedResponse<Space> = await response.json();
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
      page: event.page,
      rows: event.rows,
    });
  };

  const actionBodyTemplate = (rowData: Space) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
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
      >
        <Column field="name" header="Nombre" sortable />
        <Column field="address" header="Dirección" sortable />
        <Column
          field="isActive"
          header="Estado"
          body={(rowData: Space) => (
            <span
              className={`font-bold ${
                rowData.isActive ? "text-green-500" : "text-red-500"
              }`}
            >
              {rowData.isActive ? "Activo" : "Inactivo"}
            </span>
          )}
          sortable
        />
        <Column
          field="isAccessible"
          header="Accesible"
          body={(rowData: Space) => (
            <i
              className={`pi ${
                rowData.isAccessible
                  ? "pi-check-circle text-green-500"
                  : "pi-times-circle text-red-500"
              }`}
            ></i>
          )}
          sortable
        />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "8rem" }}
        />
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
