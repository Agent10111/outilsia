import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID;

if (!OPENAI_API_KEY) {
  throw new Error('La clé API OpenAI n\'est pas configurée. Veuillez définir la variable d\'environnement OPENAI_API_KEY.');
}

if (!OPENAI_PROJECT_ID) {
  throw new Error('L\'ID de projet OpenAI n\'est pas configuré. Veuillez définir la variable d\'environnement OPENAI_PROJECT_ID.');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  project: OPENAI_PROJECT_ID
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://agent10111.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Préflight CORS
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Format invalide : "messages" doit être un tableau.' });
  }

  try {
    console.log("📤 Envoi à OpenAI :", messages);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.3,
      max_tokens: 800,
    });

    const reply = completion.choices?.[0]?.message?.content || 'Réponse vide.';

    console.log("✅ Réponse OpenAI :", reply);

    return res.status(200).json({ message: reply });
  } catch (error) {
    console.error('❌ Erreur lors de la communication avec OpenAI :', error);

    if (error instanceof Error) {
      return res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
    } else {
      return res.status(500).json({ error: 'Erreur interne du serveur inconnue' });
    }
  }
}
