import { supabase } from '../config/supabase.js';

export class TranslationService {
  static async createTranslation({ userId, filePath, fileName, sourceLanguage, targetLanguage }) {
    try {
      // Create document record
      const { data: document, error: docError } = await this.createDocumentRecord(userId, fileName, filePath);
      if (docError) throw docError;

      // Create translation record with initial status
      const { data: translation, error: transError } = await supabase
        .from('translations')
        .insert({
          user_id: userId,
          document_id: document.id,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          status: 'pending',
          translated_text: '', // Initialize empty translated text
          error_message: null
        })
        .select()
        .single();

      if (transError) throw transError;

      // Start translation process in background
      this.processTranslation(translation.id, filePath, sourceLanguage, targetLanguage);

      return { data: translation, error: null };
    } catch (error) {
      console.error('Error creating translation:', error);
      return { data: null, error: error.message };
    }
  }

  static async processTranslation(translationId, filePath, sourceLanguage, targetLanguage) {
    try {
      // Update status to processing
      await this.updateTranslationStatus(translationId, 'processing');

      // Download file content
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('documents')
        .download(filePath);

      if (downloadError) throw downloadError;

      // Process in chunks if file is large
      const text = await fileData.text();
      const chunkSize = 5000; // Process 5000 characters at a time
      const chunks = this.splitIntoChunks(text, chunkSize);
      let translatedText = '';

      for (const chunk of chunks) {
        const { translatedChunk, error } = await this.translateChunk(chunk, sourceLanguage, targetLanguage);
        if (error) throw new Error(error);
        translatedText += translatedChunk;

        // Update progress periodically
        await this.updateTranslationProgress(translationId, translatedText);
      }

      // Update with completed status and final translated text
      await this.updateTranslationStatus(translationId, 'completed', translatedText);
    } catch (error) {
      console.error('Translation processing error:', error);
      await this.updateTranslationStatus(translationId, 'failed', null, error.message);
    }
  }

  static splitIntoChunks(text, chunkSize) {
    const chunks = [];
    let index = 0;
    while (index < text.length) {
      chunks.push(text.slice(index, index + chunkSize));
      index += chunkSize;
    }
    return chunks;
  }

  static async translateChunk(text, sourceLanguage, targetLanguage) {
    // Mock translation for demo - replace with actual translation service
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          translatedChunk: `[${sourceLanguage}->${targetLanguage}] ${text}`,
          error: null
        });
      }, 1000); // Simulate API delay
    });
  }

  static async updateTranslationProgress(translationId, currentText) {
    try {
      const { error } = await supabase
        .from('translations')
        .update({
          translated_text: currentText,
          updated_at: new Date().toISOString()
        })
        .eq('id', translationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating translation progress:', error);
    }
  }

  static async updateTranslationStatus(translationId, status, translatedText = null, errorMessage = null) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...(translatedText !== null && { translated_text: translatedText }),
        ...(errorMessage !== null && { error_message: errorMessage })
      };

      const { error } = await supabase
        .from('translations')
        .update(updateData)
        .eq('id', translationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating translation status:', error);
    }
  }

  static async getTranslations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('translations')
        .select(`
          *,
          documents (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(translation => ({
        ...translation,
        document_name: translation.documents.name
      }));
    } catch (error) {
      console.error('Error fetching translations:', error);
      throw error;
    }
  }
}