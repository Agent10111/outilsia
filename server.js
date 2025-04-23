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

app.listen(port, () => {
  console.log(`🧠 Serveur IA en écoute sur https://outilsia.vercel.app`);
});