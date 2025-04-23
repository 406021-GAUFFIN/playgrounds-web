"use client";
import { Menubar } from "primereact/menubar";
import React from "react";

const Header = () => {
  const navItems = [
    {
      label: "Inicio",
      icon: "pi pi-fw pi-home",
      command: () => (window.location.href = "/"),
    },
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => (window.location.href = "/profile"),
    },
    {
      label: "Usuarios",
      icon: "pi pi-user-edit",
      command: () => (window.location.href = "/users"),
    },
  ];

  const end = <h1 style={{ color: "gray", marginRight: 28 }}>Playgrounds</h1>;
  return <Menubar model={navItems} className="" end={end} />;
};

export default Header;
