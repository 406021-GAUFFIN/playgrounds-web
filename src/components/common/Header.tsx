"use client";
import { Menubar } from "primereact/menubar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar } from "primereact/avatar";

const Header = () => {
  const { logout, user } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  const getInitials = (name: string) => {
    const names = name?.split(" ") || [];
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name?.[0]?.toUpperCase() || "U";
  };

  const handleNavigation = (path: string) => {
    setSidebarVisible(false);
    router.push(path);
  };

  // Items base que todos los usuarios pueden ver
  const baseItems = [
    
    {
      label: "Inicio",
      icon: "pi pi-fw pi-home",
      command: () => handleNavigation("/"),
    },
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => handleNavigation("/profile"),
    },
    {
      label: "Eventos",
      icon: "pi pi-calendar",
      command: () => handleNavigation("/events"),
    },
  ];

  // Items específicos para administradores
  const adminItems = [
    {
      label: "Usuarios",
      icon: "pi pi-user-edit",
      command: () => handleNavigation("/users"),
    },
    {
      label: "Espacios",
      icon: "pi pi-pen-to-square",
      command: () => handleNavigation("/spaces"),
    },
    {
      label: "Reportes",
      icon: "pi pi-chart-line",
      command: () => handleNavigation("/reports"),
    },
  ];

  const navItems = [
    ...baseItems,
    ...(user?.role === "ADMIN" ? adminItems : []),
  ];

  const headerItems: MenuItem[] = [];

  const start = (
    <div className="flex align-items-center gap-2">
      <Button
        icon="pi pi-bars"
        onClick={() => setSidebarVisible(true)}
        text
        severity="secondary"
        className="mr-2"
      />
      <div
        className="flex align-items-center gap-2 cursor-pointer"
        onClick={() => handleNavigation("/")}
      >
        <Image
          src="/logo-small.webp"
          alt="Logo Playgrounds"
          width={28}
          height={28}
          priority
          className="rounded-full"
        />
        <span className="font-semibold text-lg">Playgrounds</span>
      </div>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <div
        className="cursor-pointer"
        onClick={() => handleNavigation("/profile")}
      >
        <Avatar
          label={getInitials(user?.name || "")}
          style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
          shape="circle"
        />
      </div>
    </div>
  );

  const customSidenavHeader= (

          <div className="flex flex-column">
            <div className="flex align-items-center gap-2">
              <Image
                src="/logo-medium.webp"
                alt="Logo Playgrounds"
                width={28}
                height={28}
                priority
                className="rounded-full"
              />
              <span className="font-bold text-lg">Playgrounds</span>
            </div>
          </div>

  )
   

 

  return (
    <>
      <Menubar
        model={headerItems}
        className="border-noround-p2"
        start={start}
        end={end}
      />

      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        header={customSidenavHeader}
        className="w-full md:w-20rem"
      >
        <div className="flex flex-column h-full">
          <Menu model={navItems} className="w-full border-none flex-1" />

          <div className="flex flex-column gap-2 p-2 mt-auto">
            <hr className="border-top-1 border-none surface-border my-2" />
            <div className="flex align-items-center gap-2">
              <Avatar
                label={getInitials(user?.name || "")}
                style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
                shape="circle"
              />
              <div className="flex flex-column">
                <span className="font-semibold text-base">{user?.name}</span>
                <span className="text-sm text-500">{user?.email}</span>
              </div>
            </div>
            <div className="flex justify-content-center">
              <Button
                label="Cerrar Sesión"
                icon="pi pi-sign-out"
                severity="danger"
                outlined
                onClick={() => {
                  setSidebarVisible(false);
                  logout();
                }}
                className="p-button-text"
              />
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Header;
