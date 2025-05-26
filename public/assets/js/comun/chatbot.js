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
    const chatbotMinimized = document.getElementById('chatbotMinimized');
    const chatbotBubble = document.getElementById('chatbotBubble');

    function displayMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(`${sender}-message`);
        messageElement.textContent = `${sender === 'user' ? username : 'Bot'}: ${message}`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    chatbotSendButton.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (!message) return alert('Por favor ingresa un mensaje');
        displayMessage('user', message);
        socket.emit('new-message', { username, message });
        chatbotInput.value = "";
    });

    chatbotInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') chatbotSendButton.click();
    });

    chatbotElement.style.display = 'block';
    displayMessage('bot', 'Bienvenido, ¿en qué podemos ayudarte?');

    socket.on('chatbot-response', response => displayMessage('bot', response));

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
        chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'none';
        clearConversation();
    });

    minimizeChatButton.addEventListener('click', () => {
        chatbotElement.classList.add('minimized');
        chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'block';
    });

    chatbotMinimized.addEventListener('click', () => {
        chatbotElement.classList.remove('minimized');
        chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'none';
    });

    chatbotBubble.addEventListener('click', () => {
        chatbotElement.classList.remove('minimized');
        chatbotMinimized.style.display = 'none';
        chatbotBubble.style.display = 'none';
    });
};
