const socket = io();

// Tickets recibidos desde el servidor
let tickets = window.tickets || [];

const ticketList = document.getElementById("ticket-list");
const conversationDiv = document.getElementById("conversation");
const ticketTitle = document.getElementById("ticket-title");
const closeTicketButton = document.getElementById('close-ticket-button');
let selectedTicketNumber = null;

// Función para limpiar conversación
function clearConversation() {
    conversationDiv.innerHTML = "";
}

// Función para actualizar título del ticket
function updateTicketTitle(ticketId) {
    const ticket = tickets.find(t => t.ticketNumber === ticketId);
    if (!ticket) return;
    ticketTitle.textContent = `📩 Ticket #${ticket.ticketNumber} - ${ticket.userName}`;
}

// Función para renderizar mensajes reales
function renderRealConversation(messages) {
    clearConversation();
    messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message-row", "flex", "items-start");
        if (msg.rol === "support") {
            msgDiv.classList.add("justify-end", "ml-auto");
        }

        const bubble = document.createElement("div");
        bubble.classList.add("chat-bubble");
        if (msg.rol === "user") {
            bubble.classList.add("chat-bubble-student");
        } else if (msg.rol === "support") {
            bubble.classList.add("chat-bubble-support", "text-right");
        } else {
            bubble.classList.add("chat-bubble-support", "text-right");
        }
        const time = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        bubble.innerHTML = `${msg.message} <time class="block mt-2 ${msg.rol === "user" ? "text-gray-400" : "text-indigo-700"}">${time}</time>`;

        msgDiv.appendChild(bubble);
        conversationDiv.appendChild(msgDiv);
    });
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

// Función para manejar selección de ticket
async function selectTicket(ticketElement) {
    console.log("Ticket seleccionado:", ticketElement);
    // Remover clase activa de todos los tickets
    ticketList.querySelectorAll("li").forEach(li => {
        li.classList.remove("bg-indigo-100", "shadow-inner");
    });
    // Agregar clase activa al ticket seleccionado
    ticketElement.classList.add("bg-indigo-100", "shadow-inner");

    // Obtener id del ticket
    const ticketId = ticketElement.getAttribute("data-ticket-id");
    console.log("ID del ticket seleccionado:", ticketId);
    selectedTicketNumber = ticketId;
    updateTicketTitle(ticketId);
    closeTicketButton.disabled = false;

    // Deshabilitar input del chatbot mientras el ticket está activo
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    if (messageInput && sendButton) {
        messageInput.disabled = true;
        sendButton.disabled = true;
    }

    // Cargar mensajes reales desde el servidor
    socket.emit('load-messages-by-ticket', ticketId);
}

// Función para agregar un ticket a la lista
function addTicketToList(ticket) {
    // Check if ticket already exists in tickets array
    if (tickets.find(t => t.ticketNumber === ticket.ticketNumber)) {
        return; // Ticket already added, skip
    }
    tickets.push(ticket);

    // Check if ticket already exists in DOM
    if (ticketList.querySelector(`li[data-ticket-id="${ticket.ticketNumber}"]`)) {
        return; // Ticket element already exists, skip
    }

    const li = document.createElement("li");
    li.setAttribute("data-ticket-id", ticket.ticketNumber);
    li.classList.add("p-5", "cursor-pointer", "rounded-r-lg");
    li.innerHTML = `
        <p class="font-semibold text-gray-800 text-lg">Ticket #${ticket.ticketNumber}</p>
        <p class="text-gray-500 mt-1">Usuario: ${ticket.userName}</p>
    `;
    li.addEventListener("click", () => {
        selectTicket(li);
    });
    ticketList.appendChild(li);
}

// Inicializar con el ticket que está activo en HTML (si hay alguno)
window.addEventListener("DOMContentLoaded", () => {
    const initialTicket = ticketList.querySelector("li.bg-indigo-100");
    if (initialTicket) {
        selectTicket(initialTicket);
    }
});

// Agregar evento click a cada ticket existente
ticketList.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
        selectTicket(li);
    });
});

closeTicketButton.addEventListener('click', async () => {
    console.log("Botón cerrar ticket clickeado");
    if (!selectedTicketNumber) return;

    try {
    const response = await fetch(`/api/tickets/close/${selectedTicketNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'  // Enviar cookies para autenticación de sesión
    });

if (response.ok) {
    alert('Ticket cerrado exitosamente.');
    // Remove closed ticket from the list
    const ticketElement = document.querySelector(`li[data-ticket-id="${selectedTicketNumber}"]`);
    if (ticketElement) {
        ticketElement.remove();
    }
    // Clear conversation and disable close button
    clearConversation();
    ticketTitle.textContent = '';
    closeTicketButton.disabled = true;
    selectedTicketNumber = null;
} else {
    alert('Error cerrando el ticket.');
}
    } catch (error) {
        console.error('Error cerrando ticket:', error);
        alert('Error cerrando el ticket.');
    }
});

// Escuchar evento de nuevo ticket desde el servidor
socket.on('new-ticket', (ticket) => {
    addTicketToList(ticket);
});

// Escuchar mensajes por ticket desde el servidor
socket.on('messages-by-ticket', (messages) => {
    console.log("Mensajes recibidos para el ticket:", messages);
    renderRealConversation(messages);
});

// Enviar mensaje nuevo
async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    if (!message || !selectedTicketNumber) return;

    const messageData = {
        username: window.userName || "Soporte",
        message: message,
        ticket: selectedTicketNumber,
        rol: "support"
    };

    console.log("Enviando mensaje:", messageData);

    socket.emit('new-message', messageData);
    messageInput.value = '';
}

// Evento click para enviar mensaje
document.getElementById('send-button').addEventListener('click', sendMessage);

// Enviar mensaje con Enter
document.getElementById('message-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});


