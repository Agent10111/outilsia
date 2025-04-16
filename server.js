require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const Joi = require('joi');
const config = require('./config');
const qs = require('qs');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Configuration du timeout pour les requêtes
const TIMEOUT = 30000; // 30 secondes

// Configuration de l'URL d'Open WebUI avec une valeur par défaut
const OPENWEBUI_URL = process.env.OPENWEBUI_URL || 'http://localhost:8081';
console.log('URL Open WebUI configurée:', OPENWEBUI_URL);

// Configuration de l'API OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Schéma de validation pour les requêtes de chat
const chatSchema = Joi.object({
    message: Joi.string().min(1).required().messages({
        'string.empty': 'Le message ne peut pas être vide',
        'any.required': 'Le message est requis'
    })
});

// Middleware de logging des requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Corps de la requête:', req.body);
    }
    next();
});

// Configuration CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de validation des requêtes
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            console.error(`[${new Date().toISOString()}] Erreur de validation:`, error.details);
            return res.status(400).json({ 
                error: 'Erreur de validation',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

// Middleware de logging des erreurs
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Erreur:`, {
        message: err.message,
        stack: err.stack,
        status: err.status || 500,
        path: req.path,
        method: req.method,
        body: req.body,
        headers: req.headers
    });
    next(err);
});

// Fonction pour appeler l'API OpenAI
async function callOpenAI(messages) {
    try {
        console.log('Appel à l\'API OpenAI...');
        console.log('Messages:', messages);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        });

        console.log('Réponse OpenAI:', completion.choices[0].message.content);
        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Erreur OpenAI:', error);
        throw error;
    }
}

// Route pour le chat
app.post('/api/chat', async (req, res) => {
    try {
        console.log('POST /api/chat');
        console.log('Corps de la requête:', req.body);

        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message manquant' });
        }

        const messages = [
            {
                role: 'system',
                content: "Vous êtes un assistant numérique spécialisé dans l'investigation des crimes assistés par l'IA. Vos réponses doivent être précises, professionnelles et utiles pour les enquêteurs. Utilisez le français dans toutes vos réponses."
            },
            {
                role: 'user',
                content: userMessage
            }
        ];

        const response = await callOpenAI(messages);
        res.json({ response });
    } catch (error) {
        console.error('Erreur dans le traitement de la requête:', error);
        res.status(500).json({ error: 'Erreur lors du traitement de la requête' });
    }
});

// Fallback SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (err) => {
    console.error('Erreur non capturée:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promesse rejetée non gérée:', reason);
});

// Gestion de l'arrêt propre du serveur
process.on('SIGTERM', () => {
    console.log('Arrêt du serveur...');
    server.close(() => {
        console.log('Serveur arrêté');
        process.exit(0);
    });
});

const server = app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] Serveur démarré sur le port ${port}`);
}); 