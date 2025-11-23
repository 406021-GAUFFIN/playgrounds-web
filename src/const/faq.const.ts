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
      "Puedes enviar un correo electrónico a playgrounds.contact@gmail.com",
  },
  {
    question: "¿Puedo usar Playgrounds desde el celular?",
    answer:
      "Sí, la plataforma está optimizada para dispositivos móviles y puedes acceder desde cualquier navegador en tu celular o tablet.",
  },
  {
    question: "¿Qué deportes puedo organizar o buscar en Playgrounds?",
    answer:
      "Puedes organizar o buscar eventos de cualquier deporte disponible en la plataforma, como fútbol, básquet, vóley, handball, entre otros. La lista siempre crece, por lo que si falta algún deporte, puedes sugerirlo a soporte.",
  },
  {
    question: "¿Cómo se protege mi información personal?",
    answer:
      "Tus datos personales solo se usan para el funcionamiento interno de la plataforma y no se comparten con terceros ni se utilizan con fines comerciales.",
  },
  {
    question: "¿Puedo eliminar mi cuenta y mis datos?",
    answer:
      "Sí, puedes solicitar el borrado total de tu cuenta y datos personales contactando a soporte a través del correo playgrounds.contact@gmail.com.",
  },
  {
    question: "¿Qué hago si tengo un problema con otro usuario?",
    answer:
      "Si tienes un inconveniente con otro usuario, puedes reportarlo enviando un correo a soporte. El equipo de Playgrounds analizará la situación y tomará las medidas necesarias.",
  },
  {
    question: "¿Playgrounds organiza los eventos?",
    answer:
      "No, Playgrounds solo facilita el contacto entre usuarios para organizar eventos deportivos. La organización y responsabilidad de cada evento recae en los propios usuarios.",
  },
  {
    question: "¿Puedo editar los datos de mi perfil?",
    answer:
      "Sí, puedes editar tu nombre, correo electrónico y otros datos desde la sección de perfil una vez que hayas iniciado sesión.",
  },
  {
    question: "¿Qué pasa si olvido mi contraseña?",
    answer:
      "Para restaurar tu contraseña debés contactarte con soporte",
  },
  {
    question: "¿Para que se usa mi ubicación, como será usada esa información?",
    answer:
      "Los usuarios tienen la posibilidad de marcar su ubicación en la configuración de perfil. El único uso de ésta información es si el usuario habilita la opción de Recibir notificaciones de eventos cerca mío. No es necesario seleccionar una ubicación exacta si no deseas compartirla.",
  },
];
