const MessageService = require('./services/comun/messageService');
const TicketService = require('./services/comun/ticketService');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const messageService = new MessageService();
const pdfParse = require('pdf-parse');
const fs = require('fs');
const Carrera = require('./models/administrador/carreraModel');

let pdfContent = '';

// Cargar el PDF
async function cargarPdfDesdeArchivo() {
  try {
    const buffer = fs.readFileSync('./docs/edu7.pdf');
    const data = await pdfParse(buffer);
    pdfContent = data.text;
    console.log('✅ PDF cargado en memoria.');
  } catch (error) {
    console.error('❌ Error al cargar el PDF:', error.message);
  }
}

cargarPdfDesdeArchivo();

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log("Un nuevo usuario se ha conectado");

    try {
      const messages = await messageService.getAll();
      socket.emit('all-messages', messages);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error.message);
    }

    socket.on('load-messages-by-ticket', async (ticketId) => {
      try {
        console.log("Cargando mensajes para ticket:", ticketId);
        const messages = await messageService.getMessagesByTicket(ticketId);
        console.log("Mensajes obtenidos:", messages);
        socket.emit('messages-by-ticket', messages);
      } catch (error) {
        console.error("Error al obtener mensajes por ticket:", error.message);
      }
    });

    socket.on('new-message', async (data) => {
      try {
        const userMessage = data.message.toLowerCase();

        // Guardar el mensaje del usuario en la base de datos con ticket o sin ticket
        const messageData = {
          username: data.username || "Usuario desconocido",  // Nombre de usuario dinámico
          message: data.message,
          ticket: data.ticket || "SIN TICKET - CHATBOT",
          rol: data.rol || "user"
        };

        // Llamar al método create para guardar el mensaje del usuario
        await messageService.create(messageData);

        // Detectar si el mensaje menciona "hablar con el administrador"
        if (
          userMessage.includes("hablar con el administrador") || 
          userMessage.includes("quiero hablar con el soporte") || 
          userMessage.includes("necesito ayuda de un administrador") ||
          userMessage.includes("quiero comunicarme con administración") ||
          userMessage.includes("quiero hablar con un administrador")
        ) {

          // Aquí puedes redirigir a la lógica para contactar al administrador
          console.log('Redirigiendo su solicitud ...');

          // Crear ticket para el usuario
          const userName = data.username || "Usuario desconocido";
          const userRole = data.userRole || "sin rol";
          const ticket = await TicketService.createTicket(userName, userRole);
          console.log('Ticket creado:', ticket);

          // Emitir evento para actualizar la lista de tickets en tiempo real
          io.emit('new-ticket', ticket);

          io.emit('chatbot-response', 'Estamos conectándote con un administrador y/o soporte. Un momento, por favor...');
        } else if (userMessage.includes("carreras")) {
          // Consultar la cantidad de carreras en la base de datos
          const count = await Carrera.countDocuments();
          const responseMessage = `Actualmente tenemos ${count} carreras disponibles. ¿Quieres saber más detalles?`;
          io.emit('chatbot-response', responseMessage);
        } else if (userMessage.includes("becas") || userMessage.includes("descuentos")) {
          // Responder con información del PDF para becas y descuentos
          const prompt = `
          Eres un chatbot que responde preguntas sobre el contenido del PDF cargado.
          El PDF contiene información sobre becas, descuentos y otros beneficios.
          Usuario: ${data.message}
          `;

          const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3.2', 
              prompt,
              stream: false
            })
          });

          const result = await response.json();
          const botMessage = result.response?.trim() || 'No encontré información relevante en el PDF.';
          
          // Guardar la respuesta del bot en la base de datos con el nombre de usuario "botedu"
          const botMessageData = {
            username: "botedu",  // Nombre de usuario del bot
            message: botMessage,
            ticket: "SIN TICKET - CHATBOT",
            rol: "bot"
          };
          await messageService.create(botMessageData);  // Guardar respuesta del bot

          // Enviar la respuesta del bot al cliente
          io.emit('chatbot-response', botMessage);
        } else {
          // Si no se detecta que el usuario quiere hablar con un administrador, Ollama responde normalmente.
          const prompt = `
          Eres un chatbot que responde preguntas sobre el contenido del PDF cargado.
          El PDF contiene información sobre la institución educativa, sus servicios, programas académicos y más.
          Usuario: ${data.message}
          `;

          const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3.2', 
              prompt,
              stream: false
            })
          });

          const result = await response.json();
          const botMessage = result.response?.trim() || 'No encontré información relevante en el PDF.';
          
          // Guardar la respuesta del bot en la base de datos con el nombre de usuario "botedu"
          const botMessageData = {
            username: "botedu",  // Nombre de usuario del bot
            message: botMessage,
            ticket: "SIN TICKET - CHATBOT",
            rol: "bot"
          };
          await messageService.create(botMessageData);  // Guardar respuesta del bot

          // Enviar la respuesta del bot al cliente
          io.emit('chatbot-response', botMessage);
        }
      } catch (error) {
        console.error("Error con Ollama o al leer el PDF:", error.message);
        io.emit('chatbot-response', 'Hubo un error al procesar tu solicitud.');
      }
    });
  });   
}
