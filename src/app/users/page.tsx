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

interface User {
  id: number;
  name: string;
  email: string;
  emailValidatedAt: string | null;
  role: string;
}

const Page = () => {
  const { user } = useRequireAuth(["ADMIN"]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  });

  // Filtros
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Modal de creación
  const [showCreateModal, setShowCreateModal] = useState(false);

  const roles = [
    { label: "Todos", value: "" },
    { label: "Admin", value: "ADMIN" },
    { label: "Deportista", value: "SPORTSMAN" },
  ];

  const loadUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: lazyState.page.toString(),
        pageSize: lazyState.rows.toString(),
      });

      if (nameFilter) queryParams.append("name", nameFilter);
      if (roleFilter) queryParams.append("role", roleFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${
              document.cookie.split("token=")[1].split(";")[0]
            }`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar usuarios");

      const data: PaginatedResponse<User> = await response.json();
      setUsers(data.data);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [lazyState, nameFilter, roleFilter]);

  const onPage = (event: any) => {
    setLazyState({
      ...lazyState,
      first: event.first,
      page: event.page,
      rows: event.rows,
    });
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <Button
        icon="pi pi-pencil"
        rounded
        outlined
        className="mr-2"
        onClick={() => {
          setSelectedUserId(rowData.id);
          setShowEditModal(true);
        }}
      />
    );
  };

  const dateBodyTemplate = (rowData: User) => {
    return rowData.emailValidatedAt
      ? formatDate(rowData.emailValidatedAt)
      : "No validado";
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-900 font-bold text-5xl mb-3 text-center">
        Gestión de Usuarios
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
            setRoleFilter("");
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

        <div className="w-full md:w-auto">
          <Dropdown
            options={roles}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.value)}
            placeholder="Seleccionar rol"
            className="w-full"
          />
        </div>

        <div className="flex-8 flex justify-end">
          <Button
            label="Nuevo Usuario"
            icon="pi pi-plus"
            onClick={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      <DataTable
        value={users}
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
        <Column field="name" header="Nombre" />
        <Column field="email" header="Email" />
        <Column
          field="emailValidatedAt"
          header="Fecha Validación"
          body={dateBodyTemplate}
        />
        <Column field="role" header="Rol" />
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ width: "8rem" }}
        />
      </DataTable>

      <EditUserModal
        visible={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
        onSuccess={loadUsers}
      />

      <CreateUserModal
        visible={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />
    </div>
  );
};

export default Page;
