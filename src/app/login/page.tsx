"use client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div className="flex flex-column align-items-center">
          <Image
            src="/logo-medium.webp"
            alt="Logo Playgrounds"
            width={40}
            height={40}
            priority
            className="rounded-full mb-2"
          />
          <h5 className="text-center text-3xl font-medium text-900 mt-2 mb-2">
            Iniciar Sesión
          </h5>
          <p className="text-center text-600 mb-4">
            ¿Aún no estás registrado?{" "}
            <Link href="/register" className="text-primary hover:underline">
              ¡Regístrate aquí!
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Contraseña
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              className="w-full"
              inputClassName="w-full"
              required
              feedback={false}
            />
          </div>
          <Button
            label="Iniciar Sesión"
            type="submit"
            className="w-full"
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
}
