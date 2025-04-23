import { NextApiRequest, NextApiResponse } from 'next';
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
  project: OPENAI_PROJECT_ID // 🔥 obligatoire avec sk-proj
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { messages } = req.body;

    console.log('🔍 Corps de la requête reçu :', req.body);

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Requête invalide : le champ "messages" est requis et doit être un tableau.' });
    }

    try {
        console.log("📤 Envoi à OpenAI :", {
            model: 'gpt-4',
            messages
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages,
            temperature: 0.3,
            max_tokens: 800,
        });

        const reply = completion.choices[0].message.content;

        console.log("✅ Réponse OpenAI :", reply);

        console.log("🧠 Contenu renvoyé au frontend :", reply);

        return res.status(200).json({ message: reply });
    } catch (error) {
        console.error('❌ Erreur lors de la communication avec OpenAI :', error);
        console.error('❌ Erreur de requête :', error);
        return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}