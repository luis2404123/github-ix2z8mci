import { supabase } from '../config/supabase.js';

export class AnalyticsService {
  static async getActivityData(days) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('translations')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (error) throw error;

      // Process data for chart
      const dateLabels = [];
      const dateCounts = new Map();

      // Create all date labels
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dateLabels.push(dateStr);
        dateCounts.set(dateStr, 0);
      }

      // Count translations per day
      data.forEach(item => {
        const dateStr = item.created_at.split('T')[0];
        dateCounts.set(dateStr, (dateCounts.get(dateStr) || 0) + 1);
      });

      return {
        labels: dateLabels,
        values: dateLabels.map(date => dateCounts.get(date))
      };
    } catch (error) {
      console.error('Error fetching activity data:', error);
      return { labels: [], values: [] };
    }
  }
}