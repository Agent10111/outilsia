import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_PROJECT_ID = process.env.OPENAI_PROJECT_ID;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY || '', // pas de ! pour éviter l'erreur locale
  project: OPENAI_PROJECT_ID || ''
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://agent10111.github.io');
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

  const bilingualSystemPrompt = {
    role: 'system',
    content: `
Vous êtes Zameelak al-Raqmi, un assistant numérique BILINGUE français ↔ arabe.
Vous comprenez parfaitement les questions en français et en arabe.
Vous répondez toujours en fournissant **d’abord** la réponse en français, puis **ensuite** la même réponse en arabe.
    `.trim()
  };

  const openaiMessages: ChatCompletionMessageParam[] = [
    bilingualSystemPrompt,
    ...messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
      name: m.role === 'system' ? 'system' : undefined // Ajout de la propriété 'name' si nécessaire
    }))
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: openaiMessages,
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
