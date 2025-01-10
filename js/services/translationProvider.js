import { translateText as translateWithOpenAI } from './openaiService.js';
import { translateWithPerplexity } from './perplexityService.js';

export const TranslationProvider = {
  OPENAI: 'openai',
  PERPLEXITY: 'perplexity'
};

export async function translate(text, sourceLanguage, targetLanguage, provider = TranslationProvider.OPENAI) {
  try {
    switch (provider) {
      case TranslationProvider.OPENAI:
        return await translateWithOpenAI(text, sourceLanguage, targetLanguage);
      case TranslationProvider.PERPLEXITY:
        return await translateWithPerplexity(text, sourceLanguage, targetLanguage);
      default:
        throw new Error('Invalid translation provider');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: null,
      error: error.message
    };
  }
}