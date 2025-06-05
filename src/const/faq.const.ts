export interface FAQ {
  question: string;
  answer: string;
}

export const faqList: FAQ[] = [
  {
    question: "¿Qué es Playgrounds?",
    answer:
      "Playgrounds es una plataforma que permite a los usuarios organizar y participar en eventos deportivos. Nuestro objetivo es facilitar la conexión entre personas que comparten intereses deportivos y crear una comunidad activa.",
  },
  {
    question: "¿Cómo puedo registrarme?",
    answer:
      "Para registrarte, simplemente haz clic en el botón 'Registrarse' en la página de inicio. Necesitarás proporcionar tu nombre, correo electrónico y crear una contraseña. Una vez completado el registro, recibirás un correo de verificación.",
  },
  {
    question: "¿Cómo puedo crear un evento deportivo?",
    answer:
      "Para crear un evento, primero debes iniciar sesión en tu cuenta. Luego, ve a la sección de eventos y haz clic en 'Crear Evento'. Deberás proporcionar detalles como el tipo de deporte, fecha, hora, ubicación y número máximo de participantes.",
  },
  {
    question: "¿Cuando se confirma un evento deportivo?",
    answer:
      "Una vez que se inscriban la cantidad mínima de participantes que indicó el organizador del evento, automaticamente queda confirmado.",
  },
  {
    question: "¿Puedo cancelar mi participación en un evento?",
    answer:
      "Sí, puedes cancelar tu participación en un evento hasta que el mismo no se confirme. Para hacerlo, ve a la página del evento y haz clic en 'Cancelar Participación'.",
  },
  {
    question: "¿Que pasa si un evento no llega a la cantidad mínima de participantes?",
    answer:
      "Si un evento sigue sin llegar a la cantidad mínima de participantes una hora antes del inicio, entonces éste queda suspendido por falta de aforo.",
  },
  {
    question: "¿Se puede cancelar un evento?",
    answer:
      "Un evento puede ser cancelado por su organizador siempre que el mismo no sea confirmado, es decir, que no se hayan anotado la cantidad mínima de participantes",
  },
  {
    question: "¿Se puede modificar un evento?",
    answer:
      "Un evento puede ser modificado por el organizador si el evento aún no está confirmado, ésto tambien incluye la fecha y hora, así como la cantidad de participantes, por lo que todos los participantes serán avisados del cambio por correo para que tengan la posibilidad de cancelar su participación si es que no pueden participar bajo las nuevas condiciones.",
  },
  {
    question: "¿Cómo puedo contactar al soporte?",
    answer:
      "Puedes enviar un correo electrónico a ljgauffin@gmail.com",
  },

];
