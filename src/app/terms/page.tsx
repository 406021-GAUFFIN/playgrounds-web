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
          <h6 className="text-xl font-bold mb-2">1. Definiciones</h6>
          <p className="mb-3">
            En este documento, &quot;Playgrounds&quot; se refiere a la plataforma web y móvil que permite a los usuarios organizar y participar en eventos deportivos, así como gestionar espacios deportivos. &quot;Usuario&quot; se refiere a cualquier persona que acceda o utilice la plataforma.
          </p>

          <h6 className="text-xl font-bold mb-2">2. Aceptación de los Términos</h6>
          <p className="mb-3">
            Al acceder y utilizar Playgrounds, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
          </p>

          <h6 className="text-xl font-bold mb-2">3. Descripción del Servicio</h6>
          <p className="mb-3">
            Playgrounds es una plataforma que permite a los usuarios organizar y participar en eventos deportivos. Nuestro objetivo es promover el deporte social y al aire libre, facilitando el encuentro de compañeros/as de deporte.
          </p>

          <h6 className="text-xl font-bold mb-2">4. Registro y Cuentas de Usuario</h6>
          <p className="mb-3">
            Para utilizar nuestros servicios, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y acepta la responsabilidad por todas las actividades que ocurran bajo su cuenta. Playgrounds se reserva el derecho de suspender o cancelar cuentas que incumplan estos términos.
          </p>

          <h6 className="text-xl font-bold mb-2">5. Pagos y Facturación</h6>
          <p className="mb-3">
            No existen pagos o facturas en la plataforma. Playgrounds no pretende solicitar pagos de sus usuarios.
          </p>

          <h6 className="text-xl font-bold mb-2">6. Borrado de datos</h6>
          <p className="mb-3">
            Los usuarios pueden solicitar el borrado de todos sus datos contactando a soporte de playgrounds.
          </p>

          <h6 className="text-xl font-bold mb-2">7. Conducta del Usuario</h6>
          <p className="mb-3">
            Los usuarios deben comportarse de manera respetuosa. No se tolerará ningún tipo de acoso, discriminación o comportamiento inapropiado. Playgrounds se reserva el derecho de suspender o eliminar cuentas que violen estas normas de conducta.
          </p>

          <h6 className="text-xl font-bold mb-2">8. Privacidad</h6>
          <p className="mb-3">
            La información personal que recopilamos está sujeta a nuestra Política de Privacidad. Los datos del usuario solamente serán usados de forma interna sin el objetivo de lucrar de ellos ni ser compartidos.
          </p>

          <h6 className="text-xl font-bold mb-2">9. Limitación de Responsabilidad</h6>
          <p className="mb-3">
            Playgrounds no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de uso de la plataforma, incluyendo pero no limitado a la pérdida de datos, ingresos o reputación.
            Playgrounds no será responsable de daños o acciedentes sucedidos durante un evento coordinado por la plataforma. Dado que la misma solo es espacio para encontrar usuarios que deseen realizad deportes y no un organizador de eventos.
          </p>

          <h6 className="text-xl font-bold mb-2">10. Modificaciones de los Términos</h6>
          <p className="mb-3">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. Es responsabilidad del usuario revisar periódicamente los términos.
          </p>

          <h6 className="text-xl font-bold mb-2">11. Jurisdicción y Ley Aplicable</h6>
          <p className="mb-3">
            Estos términos y condiciones se rigen por las leyes de la República Argentina. Cualquier disputa derivada del uso de Playgrounds será sometida a la jurisdicción de los tribunales competentes de la Ciudad de Córdoba, Argentina.
          </p>

          <h6 className="text-xl font-bold mb-2">12. Contacto</h6>
          <p className="mb-3">
            Si tiene preguntas o inquietudes sobre estos términos y condiciones, puede contactarnos a través del correo electrónico playgrounds.contact@gmail.com o mediante el formulario de contacto en la plataforma.
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
