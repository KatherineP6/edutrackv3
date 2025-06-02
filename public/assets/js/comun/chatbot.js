//CHATBOT
window.onload = () => {
    const socket = io();
    const chatbotElement = document.getElementById('chatbot');
    let username = chatbotElement?.dataset.username || "Usuario";
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotSendButton = document.getElementById('chatbotSend');
    const writing = document.getElementById('writing');
    const closeChatButton = document.getElementById('closeChatbot');
    const changeUsernameButton = document.getElementById('changeUsernameButton');
    const usernameInput = document.getElementById('usernameInput');
    const minimizeChatButton = document.getElementById('minimizeChatbot');
    // const chatbotMinimized = document.getElementById('chatbotMinimized');
    const chatbotBubble = document.getElementById('chatbotBubble');

    // Variables para ticket activo y rol
    let activeTicket = window.activeTicket || null;
    let userRole = window.userRole || 'user';

    if (activeTicket) {
        socket.emit('join-ticket-room', activeTicket);
    }

    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        if (sender === 'bot') {
            const colorClasses = ['color1', 'color2', 'color3', 'color4'];
            const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
            messageElement.classList.add(randomColor);
            messageElement.textContent = `Bot: ${message}`;
        } else if (sender === 'support') {
            messageElement.textContent = `Soporte: ${message}`;
            messageElement.classList.add('support-message');
        } else {
            messageElement.textContent = `${username}: ${message}`;
        }
        chatbotMessages.appendChild(messageElement);
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 0);
    }

    chatbotSendButton.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (!message) return alert('Por favor ingresa un mensaje');
        displayMessage('user', message);
        socket.emit('new-message', { username, message, ticket: activeTicket, rol: userRole });
        chatbotInput.value = "";
    });

    // Escuchar evento para actualizar ticket activo y rol
    socket.on('ticket-created', (data) => {
        if (data.ticketNumber) {
            activeTicket = data.ticketNumber;
            window.activeTicket = data.ticketNumber;
            socket.emit('join-ticket-room', data.ticketNumber);
            userRole = 'user'; // Asumir rol usuario tras creación de ticket
            window.userRole = 'user';
        }
    });

    chatbotInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') chatbotSendButton.click();
    });

    chatbotElement.style.display = 'block';
    displayMessage('bot', 'Bienvenido, ¿en qué podemos ayudarte?');

    socket.on('chatbot-response', response => displayMessage('bot', response));

    // Mostrar mensajes de soporte en el chat del usuario
    socket.on('new-support-message', message => {
        displayMessage('support', message.message);
    });

    chatbotInput.addEventListener('input', () => {
        if (username) socket.emit('writing', username);
    });

    socket.on('writing', username => {
        writing.innerHTML = `${username} está escribiendo...`;
        setTimeout(() => { writing.innerHTML = ''; }, 3000);
    });

    if (changeUsernameButton && usernameInput) {
        changeUsernameButton.addEventListener('click', () => {
            const newUsername = usernameInput.value.trim();
            if (newUsername) {
                username = newUsername;
                alert(`¡Nombre de usuario cambiado a ${username}!`);
            } else alert('Por favor, ingresa un nombre de usuario válido.');
        });
    }

    function clearConversation() {
        chatbotMessages.innerHTML = '';
    }

    closeChatButton.addEventListener('click', () => {
        chatbotElement.style.display = 'none';
        // chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'none';
        clearConversation();
    });

    minimizeChatButton.addEventListener('click', () => {
        chatbotElement.classList.add('minimized');
        // chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'block';
    });

    // chatbotMinimized.addEventListener('click', () => {
    //     chatbotElement.style.display = 'block';
    //     chatbotMinimized.style.display = 'none';
    //     chatbotBubble.style.display = 'none';
    // });

    chatbotBubble.addEventListener('click', () => {
        chatbotElement.classList.remove('minimized');
        // chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'none';
    });

    // Nuevas funciones para habilitar y deshabilitar el chatbot
    window.disableChatbot = function() {
        chatbotElement.style.display = 'none';
        clearConversation();
    };

    window.enableChatbot = function() {
        chatbotElement.style.display = 'block';
        displayMessage('bot', 'Bienvenido, ¿en qué podemos ayudarte?');
    };
};
