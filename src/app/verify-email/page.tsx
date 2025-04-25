"use client";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function VerifyEmailContent() {
  const [code, setCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: code.toString().padStart(6, "0"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la verificación");
      }

      setVerified(true);
    } catch (error) {
      console.error("Error al verificar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 text-center">
          <div className="mb-5 flex flex-column align-items-center">
            <Image
              src="/logo-medium.webp"
              alt="Logo Playgrounds"
              width={80}
              height={80}
              className="mb-3"
              priority
            />
            <i className="pi pi-check-circle text-green-500 text-5xl mb-4"></i>
            <h5 className="text-center text-2xl font-medium text-900 mb-4">
              ¡Correo validado exitosamente!
            </h5>
          </div>
          <Button
            label="Ir al login"
            onClick={() => router.push("/login")}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
        <div className="mb-5 flex flex-column align-items-center">
          <Image
            src="/logo-medium.webp"
            alt="Logo Playgrounds"
            width={80}
            height={80}
            className="mb-3"
            priority
          />
          <h5 className="text-center text-3xl font-medium text-900 mb-4">
            Verifica tu correo
          </h5>
          <p className="text-center text-600 mb-4">
            Enviamos un código de verificación a:
            <br />
            <strong>{email}</strong>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-900 font-medium mb-2">
              Código de verificación
            </label>
            <InputNumber
              id="code"
              value={code}
              onValueChange={(e) => setCode(e.value || null)}
              useGrouping={false}
              className="w-full"
              maxLength={6}
              required
            />
          </div>
          <Button
            label="Verificar"
            type="submit"
            className="w-full"
            loading={loading}
            disabled={!code || code.toString().length !== 6}
          />
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex align-items-center justify-content-center min-h-screen">
          <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 text-center">
            <i className="pi pi-spin pi-spinner text-primary-500 text-5xl"></i>
            <p className="mt-3">Cargando...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
