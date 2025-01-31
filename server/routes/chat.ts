import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getContextPrompt = (path: string) => {
  const contexts: { [key: string]: string } = {
    '/dashboard': 'You are assisting with the HOA Reserve Study dashboard. You can help with navigating features, understanding financial data, and generating reports.',
    '/documents': 'You are assisting with the HOA document center. You can help with document organization, search, and management.',
    '/photos': 'You are assisting with the community photos section. You can help with photo organization and management.',
    '/components': 'You are assisting with the components section. You can help with managing and understanding HOA components and their details.',
    '/database': 'You are assisting with the database management section. You can help with understanding and managing database records.',
  };

  return contexts[path] || 'You are a helpful assistant for the HOA Reserve Study platform.';
};

router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    const contextPrompt = getContextPrompt(context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: contextPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

export default router;