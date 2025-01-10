import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function translateText(text, sourceLanguage, targetLanguage) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
      temperature: 0.3
    });

    return {
      translatedText: response.choices[0].message.content,
      error: null
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: null,
      error: error.message
    };
  }
}