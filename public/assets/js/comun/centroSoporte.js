const socket = io();

// Variables globales
let tickets = window.tickets || [];
let selectedTicketNumber = null;
const userRole = window.userRole || 'user';

// Elementos del DOM
const ticketList = document.getElementById("ticket-list");
const conversationDiv = document.getElementById("conversation");
const ticketTitle = document.getElementById("ticket-title");
const closeTicketButton = document.getElementById('close-ticket-button');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Función para renderizar mensajes
function renderMessages(messages) {
  conversationDiv.innerHTML = "";
  
  messages.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message-row flex items-start ${
      msg.rol === "support" ? "justify-end ml-auto" : ""
    }`;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${
      msg.rol === "user" ? "chat-bubble-student" :
      msg.rol === "support" ? "chat-bubble-support text-right" :
      "chat-bubble-bot"
    }`;

    const senderLabel = document.createElement("div");
    senderLabel.className = "sender-label text-xs font-semibold mb-1";
    senderLabel.textContent = msg.username || (msg.rol === "support" ? "Soporte" : "Usuario");

    const time = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    bubble.innerHTML = `${msg.message} <time class="block mt-2 ${
      msg.rol === "user" ? "text-gray-400" : 
      msg.rol === "support" ? "text-indigo-700" : 
      "text-green-600"
    }">${time}</time>`;

    msgDiv.appendChild(senderLabel);
    msgDiv.appendChild(bubble);
    conversationDiv.appendChild(msgDiv);
  });

  conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function selectTicket(ticketId) {
  selectedTicketNumber = ticketId;

  // Actualizar UI
  document.querySelectorAll("#ticket-list li").forEach(li => {
    li.classList.remove("bg-indigo-100");
  });
  const selectedLi = document.querySelector(`#ticket-list li[data-ticket-id="${ticketId}"]`);
  if (selectedLi) selectedLi.classList.add("bg-indigo-100");

  // Emitir credenciales actualizadas al servidor
  socket.emit('credentials', {
    username: window.userName || "Usuario",
    rol: userRole,
    ticket: ticketId
  });

  // Cargar mensajes del ticket
  socket.emit('load-messages-by-ticket', ticketId);

  // Actualizar controles según rol
  if (userRole === 'user') {
    // Mantener input habilitado para que el usuario pueda escribir al soporte
    messageInput.disabled = false;
    messageInput.placeholder = "Escribe tu mensaje para soporte...";
    closeTicketButton.disabled = false; // Habilitar botón cerrar ticket para usuario

    // Deshabilitar chatbot
    if (window.disableChatbot) window.disableChatbot();
  } else {
    messageInput.disabled = false;
    messageInput.placeholder = "Escribe tu respuesta...";
    closeTicketButton.disabled = false;

    // Deshabilitar chatbot para soporte también
    if (window.disableChatbot) window.disableChatbot();
  }
}

function deselectTicket() {
  if (userRole === 'user') {
    // Usuario no puede perder su ticket, no hacer nada
    return;
  }

  selectedTicketNumber = null;

  // Quitar selección visual
  document.querySelectorAll("#ticket-list li").forEach(li => {
    li.classList.remove("bg-indigo-100");
  });

  // Limpiar conversación
  conversationDiv.innerHTML = "";
  ticketTitle.textContent = "";

  // Reactivar input y chatbot para soporte
  messageInput.disabled = false;
  messageInput.placeholder = "Escribe tu respuesta...";
  closeTicketButton.disabled = true;

  if (window.enableChatbot) window.enableChatbot();
}

// Función para agregar ticket a la lista
function addTicketToList(ticket) {
  if (tickets.some(t => t.ticketNumber === ticket.ticketNumber)) return;
  tickets.push(ticket);

  const li = document.createElement("li");
  li.dataset.ticketId = ticket.ticketNumber;
  li.className = "p-4 cursor-pointer hover:bg-indigo-50 rounded-lg";
  li.innerHTML = `
    <p class="font-semibold">Ticket #${ticket.ticketNumber}</p>
    <p class="text-sm text-gray-600">${ticket.userName}</p>
    <p class="text-xs text-gray-400">${new Date(ticket.createdAt).toLocaleString()}</p>
  `;
  
  li.addEventListener('click', () => selectTicket(ticket.ticketNumber));
  ticketList.appendChild(li);
}

// Función para enviar mensaje
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  const messageData = {
    username: window.userName || "Usuario",
    message: message,
    ticket: selectedTicketNumber || "SIN TICKET - CHATBOT",
    rol: userRole
  };

  // Mostrar mensaje inmediatamente
  const tempMsg = {
    message,
    rol: userRole,
    createdAt: new Date()
  };
  renderMessages([...conversationDiv.messages || [], tempMsg]);

  socket.emit('new-message', messageData);
  messageInput.value = '';
}

socket.emit('credentials', {
  username: window.userName || "Usuario",
  rol: userRole,
  ticket: selectedTicketNumber || null
});

// Event Listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

closeTicketButton.addEventListener('click', () => {
  if (selectedTicketNumber) {
    socket.emit('close-ticket', selectedTicketNumber);
  }
});

// Socket Events
socket.on('messages-by-ticket', (messages) => {
  renderMessages(messages);

  // Actualizar título del ticket
  if (selectedTicketNumber) {
    const ticket = tickets.find(t => t.ticketNumber === selectedTicketNumber);
    if (ticket) {
      ticketTitle.textContent = `Ticket #${ticket.ticketNumber} - ${ticket.userName}`;
    } else {
      ticketTitle.textContent = `Ticket #${selectedTicketNumber}`;
    }
  } else {
    ticketTitle.textContent = "";
  }
});

socket.on('new-ticket', (ticket) => {
  addTicketToList(ticket);
  if (userRole === 'support' && !selectedTicketNumber) {
    selectTicket(ticket.ticketNumber);
  }
});

socket.on('ticket-created', (data) => {
  alert(data.message);
  if (data.ticketNumber) {
    selectTicket(data.ticketNumber);
    // Actualizar variable global para chatbot
    window.activeTicket = data.ticketNumber;
    // Emitir para unirse a la sala del ticket
    socket.emit('join-ticket-room', data.ticketNumber);
  }
});

socket.on('new-support-message', (message) => {
  if (message.ticket === selectedTicketNumber) {
    renderMessages([...conversationDiv.messages || [], message]);
  }
});

socket.on('chatbot-response', (response) => {
  if (!selectedTicketNumber || response.ticket === "SIN TICKET - CHATBOT") {
    renderMessages([...conversationDiv.messages || [], {
      message: response.message || response,
      rol: "bot",
      createdAt: new Date()
    }]);
  }
});

socket.on('ticket-closed', (ticketNumber) => {
  if (ticketNumber === selectedTicketNumber) {
    const ticketElement = document.querySelector(`li[data-ticket-id="${ticketNumber}"]`);
    if (ticketElement) ticketElement.remove();
    
    conversationDiv.innerHTML = "";
    ticketTitle.textContent = "";
    selectedTicketNumber = null;
    
    if (userRole === 'user') {
      messageInput.disabled = false;
      messageInput.placeholder = "Escribe tu mensaje...";
      if (window.enableChatbot) window.enableChatbot();
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Cargar tickets iniciales
  tickets.forEach(ticket => addTicketToList(ticket));
  
  // Agregar event listeners a los tickets ya renderizados
  const ticketItems = document.querySelectorAll('#ticket-list li');
  ticketItems.forEach(li => {
    li.addEventListener('click', () => {
      const ticketId = li.dataset.ticketId;
      selectTicket(ticketId);
    });
  });

  // Seleccionar primer ticket si es soporte
  if (userRole === 'support' && tickets.length > 0) {
    selectTicket(tickets[0].ticketNumber);
  }
});
