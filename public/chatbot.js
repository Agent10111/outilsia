// Configuration du chatbot
const API_URL = 'http://localhost:3001/api/chat';  // Port 3001 pour le serveur Node.js

// Fonction pour basculer l'affichage du chatbot
function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (chatContainer.style.display === 'none' || !chatContainer.style.display) {
        chatContainer.style.display = 'block';
        toggleBtn.textContent = '▼';
    } else {
        chatContainer.style.display = 'none';
        toggleBtn.textContent = '▲';
    }
}

// Fonction pour envoyer un message à l'API
async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Afficher le message de l'utilisateur
    appendMessage('user', message);
    userInput.value = '';

    try {
        // Afficher l'indicateur de chargement
        appendMessage('bot', '... Traitement en cours');
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        // Log de la réponse brute
        const rawResponse = await response.text();
        console.log('Réponse brute:', rawResponse);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(rawResponse);
        
        // Supprimer le message de chargement
        const loadingMessage = document.querySelector('.message.bot:last-child');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        if (data.error) {
            throw new Error(data.error);
        }

        // Afficher la réponse du chatbot
        appendMessage('bot', data.choices[0].message.content);
        
    } catch (error) {
        console.error('Erreur:', error);
        appendMessage('bot', 'Désolé, une erreur est survenue. Veuillez réessayer.');
    }
}

// Fonction pour ajouter un message à la conversation
function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialisation du chatbot
document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'none';
    
    // Ajouter la gestion de la touche Entrée
    const userInput = document.getElementById('userInput');
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 