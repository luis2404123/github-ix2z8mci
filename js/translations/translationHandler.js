import { translateWithPerplexity } from '../services/perplexityService.js';
import { extractTextFromFile, createTranslatedFile } from './documentProcessor.js';
import { uploadFilesAndCreateRecords } from './fileHandler.js';

export async function handleTranslation(file, sourceLanguage, targetLanguage, userId) {
  try {
    // Extract text from file
    const text = await extractTextFromFile(file);
    
    // Translate text using Perplexity
    const { translatedText, error } = await translateWithPerplexity(
      text,
      sourceLanguage,
      targetLanguage
    );

    if (error) throw new Error(error);

    // Create translated file
    const { blob, fileName } = createTranslatedFile(
      translatedText,
      file.name,
      targetLanguage
    );

    // Upload files and create records
    return await uploadFilesAndCreateRecords({
      originalFile: file,
      translatedBlob: blob,
      fileName,
      userId,
      sourceLanguage,
      targetLanguage
    });
  } catch (error) {
    console.error('Translation handler error:', error);
    return { error: error.message };
  }
}