// Zameelak al-Raqmi - Chatbot sécurisé avec PDF, Speech-to-Text et mot de passe

const API_BASE = 'https://outilsia-silk.vercel.app'; // Mise à jour de l'adresse du backend pour pointer vers l'URL déployée

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

// Protection par mot de passe simple pour /chatbot
window.addEventListener('DOMContentLoaded', function () {
    const password = prompt("🔐 Entrez le mot de passe pour accéder au chatbot :");
    if (password !== 'zamil2025') {
        document.body.innerHTML = '<h2 style="color:red;text-align:center;margin-top:20%">🔒 Accès refusé. Mot de passe incorrect.</h2>';
        return;
    }

    const userInput = document.getElementById('userInput');
    const chatContainer = document.getElementById('chatContainer');

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    document.getElementById('btnExportPDF').addEventListener('click', exportChatToPDF);
    document.getElementById('btnVoice').addEventListener('click', startVoiceInput);

    chatContainer.style.display = 'block';
    // Supprime l'appel avec welcomeMessage brut et garde uniquement l'appel avec HTML
    appendMessage(
        'bot',
        `<div style="border: 1px solid #e74c3c; background: #f9e6e6; padding: 10px; border-radius: 6px;">
           ⚠️ <strong>تنبيه:</strong> هذا المساعد الذكي هو نموذج تجريبي.<br>
           لا تدخل أي معلومات شخصية أو حساسة.<br>
           يُستخدم هذا النظام لأغراض دراسية وتجريبية فقط.
         </div>`
    );
});
