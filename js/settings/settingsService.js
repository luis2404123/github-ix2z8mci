import { supabase } from '../config/supabase.js';

export class SettingsService {
  static async updateProfile(userData) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error: error.message };
    }
  }

  static async updatePassword(currentPassword, newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating password:', error);
      return { error: error.message };
    }
  }

  static async updateNotificationSettings(settings) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return { data: null, error: error.message };
    }
  }
}