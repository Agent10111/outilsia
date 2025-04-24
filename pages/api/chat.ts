import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '', // pas de ! pour éviter l'erreur locale
  project: OPENAI_PROJECT_ID || ''
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Le champ "messages" est requis et doit être un tableau.' });
  }

  // ✅ Mode local sans clé API : simule une réponse
  if (!OPENAI_API_KEY || !OPENAI_PROJECT_ID) {
    return res.status(200).json({
      message: '🤖 Mode local : aucune clé API fournie, réponse simulée.'
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.3,
      max_tokens: 800,
    });

    return res.status(200).json({ message: completion.choices[0]?.message?.content || '' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('❌ Erreur OpenAI :', err);
    return res.status(500).json({ error: 'Erreur interne', details: message });
  }
}
