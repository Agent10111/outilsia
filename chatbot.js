// Zameelak al-Raqmi - Chatbot sécurisé avec avertissement et appel OpenAI

const welcomeMessage = "مرحباً! أنا زميلك الرقمي، كيف يمكنني مساعدتك؟";
const API_BASE = 'http://localhost:4000'; // À remplacer par l'URL de production

function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    const toggleBtn = document.querySelector('.toggle-btn');
    chatContainer.style.display = (chatContainer.style.display === 'none') ? 'block' : 'none';
    toggleBtn.textContent = chatContainer.style.display === 'block' ? '▲' : '▼';
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage('user', message);
    userInput.value = '';

    const loading = appendMessage('bot', '... جاري التحميل');

    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: welcomeMessage },
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();
        console.log("🎯 Contenu JSON reçu du backend :", data);
        loading.remove();

        if (data.error) throw new Error(data.error);

        console.log("🎯 Réponse reçue du serveur :", data);
        console.log("📥 Message brut reçu du serveur :", data);
        console.log("📥 Message à afficher :", data.message);
        appendMessage('bot', data.message || '🟥 Réponse vide.');
    } catch (error) {
        console.error('❌ Erreur OpenAI :', error);
        loading.remove();
        appendMessage('bot', '⚠️ عذراً، حدث خطأ في الاتصال. حاول مجدداً.');
    }
}

function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    console.log("💬 Message affiché :", message);
    return messageDiv;
}

// Initialisation du chat
window.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('userInput');
    const chatContainer = document.getElementById('chatContainer');

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    chatContainer.style.display = 'block';
});
