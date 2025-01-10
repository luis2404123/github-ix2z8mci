import { TRANSLATION_CONFIG } from '../config/translationConfig.js';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export async function translateWithPerplexity(text, sourceLanguage, targetLanguage) {
  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: TRANSLATION_CONFIG.model,
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from ${sourceLanguage} to ${targetLanguage}. Maintain the original formatting and structure.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: TRANSLATION_CONFIG.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      translatedText: data.choices[0].message.content,
      error: null
    };
  } catch (error) {
    console.error('Perplexity translation error:', error);
    return {
      translatedText: null,
      error: error.message
    };
  }
}