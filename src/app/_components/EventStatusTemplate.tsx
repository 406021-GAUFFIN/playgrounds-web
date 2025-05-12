import { Event } from "../services/eventService";

interface EventStatusTemplateProps {
  event: Event;
}

export const EventStatusTemplate = ({ event }: EventStatusTemplateProps) => {
  const statusColors = {
    available: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    finished: "bg-gray-100 text-gray-800",
    suspended: "bg-yellow-100 text-yellow-800",
  };

  const statusLabels = {
    available: "Disponible",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    finished: "Finalizado",
    suspended: "Suspendido",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm ${statusColors[event.status]}`}
    >
      {statusLabels[event.status]}
    </span>
  );
};
