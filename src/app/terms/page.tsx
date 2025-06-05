"use client";
import { Button } from "primereact/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="flex flex-column align-items-center mb-4">
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
            Términos y Condiciones
          </h5>
        </div>

        <div className="text-900 mb-4">
          <h6 className="text-xl font-bold mb-2">
            1. Aceptación de los Términos
          </h6>
          <p className="mb-3">
            Al acceder y utilizar Playgrounds, usted acepta estar sujeto a estos
            términos y condiciones. Si no está de acuerdo con alguna parte de
            estos términos, no podrá acceder al servicio.
          </p>

          <h6 className="text-xl font-bold mb-2">
            2. Descripción del Servicio
          </h6>
          <p className="mb-3">
            Playgrounds es una plataforma que permite a los usuarios organizar y
            participar en eventos deportivos. El servicio incluye la gestión de
            espacios deportivos, eventos y participantes.
          </p>

          <h6 className="text-xl font-bold mb-2">3. Cuentas de Usuario</h6>
          <p className="mb-3">
            Para utilizar nuestros servicios, debe registrarse y crear una
            cuenta. Usted es responsable de mantener la confidencialidad de su
            cuenta y contraseña, y acepta la responsabilidad por todas las
            actividades que ocurran bajo su cuenta.
          </p>

          <h6 className="text-xl font-bold mb-2">4. Conducta del Usuario</h6>
          <p className="mb-3">
            Los usuarios deben comportarse de manera respetuosa y profesional.
            No se tolerará ningún tipo de acoso, discriminación o comportamiento
            inapropiado.
          </p>

          <h6 className="text-xl font-bold mb-2">5. Privacidad</h6>
          <p className="mb-3">
            La información personal que recopilamos está sujeta a nuestra
            Política de Privacidad. Al utilizar nuestro servicio, usted acepta
            nuestra recopilación y uso de información de acuerdo con esta
            política.
          </p>

          <h6 className="text-xl font-bold mb-2">6. Modificaciones</h6>
          <p className="mb-3">
            Nos reservamos el derecho de modificar estos términos en cualquier
            momento. Las modificaciones entrarán en vigor inmediatamente después
            de su publicación en la plataforma.
          </p>
        </div>

        <div className="flex justify-content-center">
          <Button
            label="Volver"
            icon="pi pi-arrow-left"
            onClick={() => router.back()}
            className="p-button-secondary"
          />
        </div>
      </div>
    </div>
  );
}
