const MessageService = require('./services/comun/messageService');
const TicketService = require('./services/comun/ticketService');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const messageService = new MessageService();
const pdfParse = require('pdf-parse');
const fs = require('fs');
const Carrera = require('./models/administrador/carreraModel');
const Bloque = require('./models/administrador/bloqueModel');
const Curso = require('./models/administrador/cursoModel');

let pdfContent = '';

async function cargarPdfDesdeArchivo() {
  try {
    const buffer = fs.readFileSync('./docs/edutrackinfo.pdf');
    const data = await pdfParse(buffer);
    pdfContent = data.text;
    console.log('✅ PDF cargado en memoria.');
  } catch (error) {
    console.error('❌ Error al cargar el PDF:', error.message);
  }
}

async function getChatbotResponse(userMessage) {
  try {
    const prompt = `Eres un asistente virtual de una institución educativa. 
    El usuario pregunta: "${userMessage}". 
    Responde de manera clara y concisa basándote en el siguiente contenido: 
    ${pdfContent.substring(0, 5000)}... [continúa]`;

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
    return result.response?.trim() || 'No encontré información relevante.';
  } catch (error) {
    console.error('Error con Ollama:', error);
    return 'Disculpa, estoy teniendo dificultades. Por favor intenta nuevamente.';
  }
}

cargarPdfDesdeArchivo();

module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log("Nuevo usuario conectado:", socket.id);

    // Imprimir credenciales del socket (si están disponibles)
    socket.on('credentials', (credentials) => {
      console.log(`Credenciales recibidas de socket ${socket.id}:`, credentials);
    });

    // Cargar mensajes iniciales
    try {
      const messages = await messageService.getAll();
      socket.emit('all-messages', messages);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
    }

    // Unirse a sala de ticket
    socket.on('join-ticket-room', (ticketId) => {
      socket.join(ticketId);
      console.log(`Socket ${socket.id} se unió a la sala ${ticketId}`);
    });

    // Salir de sala de ticket
    socket.on('leave-ticket-room', (ticketId) => {
      socket.leave(ticketId);
      console.log(`Socket ${socket.id} salió de la sala ${ticketId}`);
    });

    // Cargar mensajes por ticket
    socket.on('load-messages-by-ticket', async (ticketId) => {
      try {
        const messages = await messageService.getMessagesByTicket(ticketId);
        socket.emit('messages-by-ticket', messages);
      } catch (error) {
        console.error("Error al cargar mensajes:", error);
      }
    });

    // Manejar nuevo mensaje
    socket.on('new-message', async (data) => {
      try {
        const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
        console.log(`Nuevo mensaje recibido. Ticket: ${data.ticket}, Rol: ${data.rol}, Usuario: ${data.username}, Salas: ${rooms.join(', ')}`);
        const userMessage = data.message.toLowerCase();
        const isSupport = data.rol === 'support';

        // Guardar mensaje en BD
        const messageData = {
          username: data.username || (isSupport ? "Soporte" : "Usuario"),
          message: data.message,
          ticket: data.ticket || "SIN TICKET - CHATBOT",
          rol: isSupport ? "support" : "user"
        };

        // Detectar consulta sobre número de carreras
        if (!isSupport && (userMessage.includes("cuántas carreras") || userMessage.includes("cuantas carreras") || userMessage.includes("cantidad de carreras"))) {
          const totalCarreras = await Carrera.countDocuments();
          const respuesta = `Actualmente hay ${totalCarreras} carreras disponibles.`;
          socket.emit('chatbot-response', respuesta);
          return;
        }

        // Detectar consulta sobre qué carreras hay o disponibles
        if (!isSupport && (userMessage.includes("qué carreras hay") || userMessage.includes("carreras disponibles") || userMessage.includes("carreras que hay"))) {
          const carreras = await Carrera.find({}, 'nombre').lean();
          if (carreras.length === 0) {
            socket.emit('chatbot-response', 'Actualmente no hay carreras disponibles.');
          } else {
            const nombres = carreras.map(c => c.nombre).join(', ');
            socket.emit('chatbot-response', `Las carreras disponibles son: ${nombres}.`);
          }
          return;
        }

        // Detectar consulta sobre breve descripción de carreras
        if (!isSupport && (userMessage.includes("breve descripción") || userMessage.includes("me podrías dar una breve descripción"))) {
          const carreras = await Carrera.find({}, 'nombre descripcion').lean();
          if (carreras.length === 0) {
            socket.emit('chatbot-response', 'Actualmente no hay carreras disponibles para describir.');
          } else {
            const descripciones = carreras.map(c => `${c.nombre}: ${c.descripcion}`).join(' | ');
            socket.emit('chatbot-response', `Descripción breve de las carreras: ${descripciones}.`);
          }
          return;
        }

        // Detectar consulta sobre bloques para inscribirse
        if (!isSupport && (userMessage.includes("bloques para inscribirse") || userMessage.includes("hay bloques para inscribirse") || userMessage.includes("bloques disponibles"))) {
          const bloquesCount = await Bloque.countDocuments();
          if (bloquesCount === 0) {
            socket.emit('chatbot-response', 'Actualmente no hay bloques disponibles para inscribirse.');
          } else {
            socket.emit('chatbot-response', `Hay ${bloquesCount} bloques disponibles para inscribirse.`);
          }
          return;
        }

        // Detectar consulta sobre costo de la carrera o semestre
        if (!isSupport && (userMessage.includes("cuánto cuesta la carrera") || userMessage.includes("cuanto cuesta la carrera") || userMessage.includes("cuánto cuesta el semestre") || userMessage.includes("cuanto cuesta el semestre"))) {
          const carreras = await Carrera.find({}, 'nombre precio duracionSem').lean();
          if (carreras.length === 0) {
            socket.emit('chatbot-response', 'No hay información disponible sobre el costo de las carreras.');
          } else {
            const costos = carreras.map(c => `${c.nombre}: $${c.precio} por semestre, duración: ${c.duracionSem} semestres`).join(' | ');
            socket.emit('chatbot-response', `Información de costos de las carreras: ${costos}.`);
          }
          return;
        }

        // Detectar consulta sobre cursos de una carrera
        if (!isSupport && (userMessage.includes("qué cursos tiene la carrera") || userMessage.includes("que cursos tiene la carrera") || userMessage.includes("cursos de la carrera"))) {
          // Extraer nombre de la carrera de la consulta
          const regex = /carrera (.+)$/i;
          const match = userMessage.match(regex);
          if (match && match[1]) {
            const nombreCarrera = match[1].trim();
            const carrera = await Carrera.findOne({ nombre: new RegExp(`^${nombreCarrera}$`, 'i') });
            if (!carrera) {
              socket.emit('chatbot-response', `No encontré la carrera llamada "${nombreCarrera}".`);
              return;
            }
            const cursos = await Curso.find({ 'carreras.carrera': carrera._id }, 'nombre descripcion semestre').lean();
            if (cursos.length === 0) {
              socket.emit('chatbot-response', `La carrera "${nombreCarrera}" no tiene cursos asignados.`);
            } else {
              const listaCursos = cursos.map(c => `${c.nombre} (semestre ${c.semestre || 'N/A'})`).join(', ');
              socket.emit('chatbot-response', `Los cursos de la carrera "${nombreCarrera}" son: ${listaCursos}.`);
            }
          } else {
            socket.emit('chatbot-response', 'Por favor, especifica el nombre de la carrera para consultar sus cursos.');
          }
          return;
        }

        // Detectar consulta sobre qué carreras hay o disponibles
        if (!isSupport && (userMessage.includes("qué carreras hay") || userMessage.includes("carreras disponibles") || userMessage.includes("carreras que hay"))) {
          const carreras = await Carrera.find({}, 'nombre').lean();
          if (carreras.length === 0) {
            socket.emit('chatbot-response', 'Actualmente no hay carreras disponibles.');
          } else {
            const nombres = carreras.map(c => c.nombre).join(', ');
            socket.emit('chatbot-response', `Las carreras disponibles son: ${nombres}.`);
          }
          return;
        }

        // Detectar consulta sobre breve descripción de carreras
        if (!isSupport && (userMessage.includes("breve descripción") || userMessage.includes("me podrías dar una breve descripción"))) {
          const carreras = await Carrera.find({}, 'nombre descripcion').lean();
          if (carreras.length === 0) {
            socket.emit('chatbot-response', 'Actualmente no hay carreras disponibles para describir.');
          } else {
            const descripciones = carreras.map(c => `${c.nombre}: ${c.descripcion}`).join(' | ');
            socket.emit('chatbot-response', `Descripción breve de las carreras: ${descripciones}.`);
          }
          return;
        }

        // Detectar consulta sobre bloques para inscribirse
        if (!isSupport && (userMessage.includes("bloques para inscribirse") ||
         userMessage.includes("hay bloques para inscribirse") || userMessage.includes("bloques disponibles"))) {
          const bloquesCount = await Bloque.countDocuments();
          if (bloquesCount === 0) {
            socket.emit('chatbot-response', 'Actualmente no hay bloques disponibles para inscribirse.');
          } else {
            socket.emit('chatbot-response', `Hay ${bloquesCount} bloques disponibles para inscribirse.`);
          }
          return;
        }

        // Detectar consulta sobre costo de la carrera o semestre
        if (!isSupport && (userMessage.includes("cuánto cuesta la carrera") || 
        userMessage.includes("cuanto cuesta la carrera") ||
        userMessage.includes("cuánto cuesta el semestre") || 
        userMessage.includes("cuanto cuesta el semestre"))) {
          const carreras = await Carrera.find({}, 'nombre precio duracionSem').lean();
          if (carreras.length === 0) {
            socket.emit('chatbot-response', 'No hay información disponible sobre el costo de las carreras.');
          } else {
            const costos = carreras.map(c => `${c.nombre}: $${c.precio} por semestre, duración: ${c.duracionSem} semestres`).join(' | ');
            socket.emit('chatbot-response', `Información de costos de las carreras: ${costos}.`);
          }
          return;
        }

        // Detectar consulta sobre cursos de una carrera
        if (!isSupport && (userMessage.includes("qué cursos tiene la carrera") || userMessage.includes("que cursos tiene la carrera") || userMessage.includes("cursos de la carrera"))) {
          // Extraer nombre de la carrera de la consulta
          const regex = /carrera (.+)$/i;
          const match = userMessage.match(regex);
          if (match && match[1]) {
            const nombreCarrera = match[1].trim();
            const carrera = await Carrera.findOne({ nombre: new RegExp(`^${nombreCarrera}$`, 'i') });
            if (!carrera) {
              socket.emit('chatbot-response', `No encontré la carrera llamada "${nombreCarrera}".`);
              return;
            }
            const cursos = await Curso.find({ 'carreras.carrera': carrera._id }, 'nombre descripcion semestre').lean();
            if (cursos.length === 0) {
              socket.emit('chatbot-response', `La carrera "${nombreCarrera}" no tiene cursos asignados.`);
            } else {
              const listaCursos = cursos.map(c => `${c.nombre} (semestre ${c.semestre || 'N/A'})`).join(', ');
              socket.emit('chatbot-response', `Los cursos de la carrera "${nombreCarrera}" son: ${listaCursos}.`);
            }
          } else {
            socket.emit('chatbot-response', 'Por favor, especifica el nombre de la carrera para consultar sus cursos.');
          }
          return;
        }

        const savedMessage = await messageService.create(messageData);

        // Si es mensaje de soporte, enviar solo a la sala del ticket
        if (isSupport && data.ticket && data.ticket !== "SIN TICKET - CHATBOT") {
          const messageToSend = {
            ...savedMessage.toObject(),
            username: data.username || "Soporte"
          };
          io.to(data.ticket).emit('new-support-message', messageToSend);
          return;
        }

        // Si es mensaje de usuario, enviar solo a la sala del ticket
        if (!isSupport && data.ticket && data.ticket !== "SIN TICKET - CHATBOT") {
          const messageToSend = {
            ...savedMessage.toObject(),
            username: data.username || "Usuario"
          };
          io.to(data.ticket).emit('new-user-message', messageToSend);
          return;
        }

        // Detectar solicitud de soporte humano
        if (userMessage.includes("administración") || 
            userMessage.includes("soporte") || 
            userMessage.includes("administrador")) {
          
          // Crear ticket
          const ticket = await TicketService.createTicket(
            data.username || "Usuario", 
            data.userRole || "user"
          );
          
          // Actualizar mensaje con número de ticket
          savedMessage.ticket = ticket.ticketNumber;
          await savedMessage.save();

          // Notificar a todos
          io.emit('new-ticket', ticket);
          socket.emit('ticket-created', {
            message: 'Un administrador se pondrá en contacto contigo pronto.',
            ticketNumber: ticket.ticketNumber
          });

          return; // No continuar con chatbot
        }

        // Si tiene ticket asignado, no responder con chatbot
        if (data.ticket && data.ticket !== "SIN TICKET - CHATBOT") {
          // No enviar respuesta chatbot para mensajes con ticket activo
          return;
        }

        // Detectar consulta sobre becas con palabras clave más específicas
        if (!isSupport && (userMessage.includes("programa de becas") || userMessage.includes("becas edutrack") || userMessage.includes("requisitos beca") || userMessage.includes("tipos de beca") || userMessage.includes("cómo postular beca") || userMessage.includes("convocatoria beca"))) {
          const botResponse = await getChatbotResponse(data.message);
          const botMessage = {
            username: "Chatbot",
            message: botResponse,
            ticket: data.ticket || "SIN TICKET - CHATBOT",
            rol: "bot"
          };
          await messageService.create(botMessage);
          socket.emit('chatbot-response', botMessage.message);
          return;
        }

        // Respuesta rápida para saludos simples
        if (!isSupport && (userMessage === "hola" || userMessage === "buenas" || userMessage === "buenos días" || userMessage === "buenas tardes" || userMessage === "buenas noches")) {
          const saludo = "¡Hola! soy edubot ¿En qué puedo ayudarte hoy?";
          const botMessage = {
            username: "Chatbot",
            message: saludo,
            ticket: data.ticket || "SIN TICKET - CHATBOT",
            rol: "bot"
          };
          await messageService.create(botMessage);
          socket.emit('chatbot-response', botMessage.message);
          return;
        }

        // Respuesta del chatbot
        const botResponse = await getChatbotResponse(data.message);
        const botMessage = {
          username: "Chatbot",
          message: botResponse,
          ticket: data.ticket || "SIN TICKET - CHATBOT",
          rol: "bot"
        };
        
        await messageService.create(botMessage);
        // Emitir respuesta chatbot solo al socket que envió el mensaje
        socket.emit('chatbot-response', botMessage.message);

      } catch (error) {
        console.error("Error en new-message:", error);
        socket.emit('error-message', 'Error al procesar tu mensaje');
      }
    });

    // Cerrar ticket
    socket.on('close-ticket', async (ticketNumber) => {
      try {
        await TicketService.closeTicket(ticketNumber);
        io.emit('ticket-closed', ticketNumber);
      } catch (error) {
        console.error("Error al cerrar ticket:", error);
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
};