"use client";
import { useRequireAuth } from "@/context/AuthContext";

const Page = () => {
  // Solo permitir acceso a administradores
  const { user } = useRequireAuth(["ADMIN"]);

  return (
    <div>
      <h2 className="text-900 font-bold text-5xl mb-3 text-center">
        Gestión de Usuarios
      </h2>
      <p className="text-900 text-xl mb-3 text-center font-bold">
        Bienvenido, {user?.email}
      </p>
    </div>
  );
};

export default Page;
