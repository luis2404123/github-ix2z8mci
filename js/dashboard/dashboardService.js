import { supabase } from '../config/supabase.js';

export class DashboardService {
  static async getDashboardStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      // Get total documents count
      const { count: totalDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Get total translations count
      const { count: totalTranslations } = await supabase
        .from('translations')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      // Get active QR codes count
      const { count: activeQRCodes } = await supabase
        .from('qr_codes')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('active', true);

      // Get recent activity
      const { data: recentActivity } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalDocuments: totalDocuments || 0,
        totalTranslations: totalTranslations || 0,
        activeQRCodes: activeQRCodes || 0,
        recentActivity: recentActivity || []
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalDocuments: 0,
        totalTranslations: 0,
        activeQRCodes: 0,
        recentActivity: []
      };
    }
  }
}