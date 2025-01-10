import { translateWithPerplexity } from './perplexityService.js';

export async function translateDocument(text, sourceLanguage, targetLanguage) {
  try {
    return await translateWithPerplexity(text, sourceLanguage, targetLanguage);
  } catch (error) {
    console.error('Translation service error:', error);
    return {
      translatedText: null,
      error: 'Translation failed. Please try again.'
    };
  }
}