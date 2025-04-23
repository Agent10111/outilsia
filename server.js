import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Correction pour __dirname dans les modules ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ajout du middleware pour servir les fichiers statiques
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID, // ← ceci est obligatoire avec sk-proj
});

// Modification de la route racine pour afficher login.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Ajout d'une redirection vers index.html après interaction
app.get('/redirect-to-index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ajout des routes pour afficher les pages HTML
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/chatbot', (req, res) => {
  res.sendFile(__dirname + '/chatbot.html');
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log("Corps reçu:", req.body); // Log pour debug

    const { messages, message } = req.body;

    // Gestion des cas où le corps contient `message` au lieu de `messages`
    if (!messages && message) {
      return res.status(400).json({ error: 'Le paramètre "messages" est attendu sous forme de tableau, mais "message" a été reçu.' });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Paramètre "messages" manquant ou invalide' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.3,
      max_tokens: 800
    });

    const reply = completion.choices?.[0]?.message?.content || '❌ Réponse vide d’OpenAI';
    console.log("✅ Réponse renvoyée :", reply);
    res.json({ message: reply });
  } catch (error) {
    console.error('Erreur API OpenAI :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(port, () => {
  console.log(`🧠 Serveur IA en écoute sur https://outilsia.vercel.app`);
});