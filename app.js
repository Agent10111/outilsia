const express = require('express');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = 3001;

// Configuration OpenAI avec la clé API depuis .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
    console.log('Clé API OpenAI configurée:', process.env.OPENAI_API_KEY ? 'Oui' : 'Non');
});