import { supabase } from '../config/supabase.js';

export class QRCodeService {
  static async getQRCodes() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          *,
          translations (
            source_language,
            target_language,
            documents (name)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(qrCode => ({
        ...qrCode,
        translation_name: `${qrCode.translations.documents.name} (${qrCode.translations.source_language} → ${qrCode.translations.target_language})`
      }));
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      return [];
    }
  }

  static async getCompletedTranslations() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('translations')
        .select(`
          id,
          source_language,
          target_language,
          documents (name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(translation => ({
        ...translation,
        document_name: translation.documents.name
      }));
    } catch (error) {
      console.error('Error fetching completed translations:', error);
      return [];
    }
  }

  static async generateQRCode(translationId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Generate QR code URL (you'll need to implement the actual QR code generation)
      const qrCodeUrl = `https://api.qrlingo.com/v1/translations/${translationId}`;

      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.id,
          translation_id: translationId,
          code_url: qrCodeUrl,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error generating QR code:', error);
      return { data: null, error: error.message };
    }
  }

  static async deactivateQRCode(id) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('qr_codes')
        .update({ active: false })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error deactivating QR code:', error);
      return { data: null, error: error.message };
    }
  }
}