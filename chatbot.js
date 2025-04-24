// Zameelak al-Raqmi - Chatbot sécurisé avec PDF, Speech-to-Text et mot de passe

const API_BASE = 'https://outilsia-silk.vercel.app';

console.log(API_BASE);
console.log("✅ API_BASE utilisé :", API_BASE);

const welcomeMessage = 'مرحباً! أنا زميلك الرقمي، كيف يمكنني مساعدتك؟';

function toggleChat() {
    const chatContainer = document.getElementById('chatContainer');
    const toggleBtn = document.querySelector('.toggle-btn');
    chatContainer.style.display = (chatContainer.style.display === 'none') ? 'block' : 'none';
    toggleBtn.textContent = chatContainer.style.display === 'block' ? '▲' : '▼';
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message === '') {
        appendMessage('bot', '⚠️ الرسالة فارغة. الرجاء إدخال نص.');
        return;
    }

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
        loading.remove();

        if (data.error) throw new Error(data.error);

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
    return messageDiv;
}

function exportChatToPDF() {
    const chatMessages = document.getElementById('chatMessages').innerText;
    const blob = new Blob([chatMessages], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chat_zameelak.pdf';
    link.click();
}

function startVoiceInput() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ar-SA';
    recognition.start();
    recognition.onresult = function (event) {
        document.getElementById('userInput').value = event.results[0][0].transcript;
        sendMessage();
    };
    recognition.onerror = function (event) {
        console.error('🎤 Erreur Speech-to-Text:', event);
    };
}

// Initialisation du chatbot sans mot de passe
window.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    const sendButton = document.querySelector('button[onclick="sendMessage()"]');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    const chatContainer = document.getElementById('chatContainer');

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    const btnExportPDF = document.getElementById('btnExportPDF');
    if (btnExportPDF) {
        btnExportPDF.addEventListener('click', exportChatToPDF);
    }

    const btnVoice = document.getElementById('btnVoice');
    if (btnVoice) {
        btnVoice.addEventListener('click', startVoiceInput);
    }

    chatContainer.style.display = 'block';
    appendMessage('bot', welcomeMessage);
    appendMessage('bot', 'مرحباً! أنا زميلك الرقمي، كيف يمكنني مساعدتك؟');
});
