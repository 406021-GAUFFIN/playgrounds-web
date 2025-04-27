"use client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Toast } from "primereact/toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!response.ok) {
        if (response.status === 409) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              "Ya existe un usuario con este correo electrónico",
          });
          return;
        }
        throw new Error("Error en el registro");
      }

      const data = await response.json();
      // Redirigir a la página de verificación con el email
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Ha ocurrido un error al registrar tu usuario, intentá nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
          <div className="flex flex-column align-items-center">
            <div className="flex align-items-center gap-2 mb-2">
              <Image
                src="/logo-medium.webp"
                alt="Logo Playgrounds"
                width={40}
                height={40}
                priority
                className="rounded-full"
              />
              <span className="text-600 text-3xl font-bold">Playgrounds</span>
            </div>
            <h5 className="text-center text-3xl font-medium text-900 mt-2 mb-2">
              Registro
            </h5>
            <p className="text-center text-600 mb-4">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-900 font-medium mb-2">
                Nombre
              </label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-900 font-medium mb-2"
              >
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
                pt={{
                  iconField: {
                    root: {
                      style: { width: "100%" },
                    },
                  },
                  input: {
                    style: { width: "100%" },
                  },
                  root: {
                    style: { width: "100%" },
                  },
                }}
                inputStyle={{ width: "100%" }}
                required
              />
            </div>
            <Button
              label="Registrarse"
              type="submit"
              className="w-full"
              loading={loading}
            />
          </form>
        </div>
      </div>
    </>
  );
}
