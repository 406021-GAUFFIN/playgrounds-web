"use client";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useState, Suspense, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Toast } from "primereact/toast";

function VerifyEmailContent() {
  const [code, setCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const urlCode = searchParams.get("code");
  const toast = useRef<Toast>(null);

  const verifyEmail = async (verificationCode: string) => {
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
            code: verificationCode.padStart(6, "0"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la verificación");
      }

      setVerified(true);
      toast.current?.show({
        severity: "success",
        summary: "¡Éxito!",
        detail: "Email verificado correctamente",
      });
    } catch (error) {
      console.error("Error al verificar:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Código de verificación inválido",
      });
      if (urlCode) {
        // Si el código vino por URL y falló, limpiamos el código de la URL
        router.push(`/verify-email?email=${email}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlCode && email && !verified) {
      verifyEmail(urlCode);
    }
  }, [urlCode, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    await verifyEmail(code.toString());
  };

  if (verified) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4 text-center">
          <div className="mb-5 flex flex-column align-items-center">
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
    <>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
          <div className="mb-5 flex flex-column align-items-center">
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
    </>
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
