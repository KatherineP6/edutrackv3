const MessageService = require('./services/comun/messageService');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const messageService = new MessageService();
const pdfParse = require('pdf-parse');
const fs = require('fs');

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

    socket.on('new-message', async (data) => {
      try {
        const userMessage = data.message.toLowerCase();

        // Guardar el mensaje del usuario en la base de datos
        const messageData = {
          username: data.username || "Usuario desconocido",  // Nombre de usuario dinámico
          message: data.message,
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
          console.log('Redirigiendo al administrador...');
          io.emit('chatbot-response', 'Estamos conectándote con un administrador. Un momento, por favor...');

          // Aquí podrías notificar a un administrador real o abrir una nueva conexión para este propósito.
          // Por ejemplo, crear una lógica para redirigir a un administrador real.

        } else {
          // Si no se detecta que el usuario quiere hablar con un administrador, Ollama responde normalmente.
          const prompt = `
          Ejemplo 1:
          Usuario: ¿Cuáles son las funcionalidades de Edutrack360?
          Edutrack360 responde: Edutrack360 es una plataforma educativa diseñada para gestionar cursos, realizar seguimientos académicos, y más.

          ---

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
};
