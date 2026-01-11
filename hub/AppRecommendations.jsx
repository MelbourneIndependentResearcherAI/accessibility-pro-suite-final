import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import AppCard from './AppCard';

export default function AppRecommendations({ apps, favorites, recentApps, onToggleFavorite }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateRecommendations();
  }, [favorites, recentApps]);

  const generateRecommendations = async () => {
    try {
      setIsLoading(true);
      
      const favoriteApps = apps.filter(app => favorites.includes(app.id));
      const recentAppsList = apps.filter(app => recentApps.includes(app.id));
      
      const prompt = `Based on user behavior:
- Favorite apps: ${favoriteApps.map(a => `${a.name} (${a.category})`).join(', ') || 'None'}
- Recently used: ${recentAppsList.map(a => `${a.name} (${a.category})`).join(', ') || 'None'}
- Available apps: ${apps.map(a => `${a.id}:${a.name} (${a.category})`).join(', ')}

Recommend 3 app IDs that would be most relevant and useful. Consider:
1. Similar categories to favorites
2. Complementary functionality
3. Apps not yet favorited or recently used

Return ONLY the app IDs as a JSON array.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      });

      const recommendedIds = result.recommendations || [];
      const recommendedApps = apps.filter(app => 
        recommendedIds.includes(app.id) && 
        !favorites.includes(app.id) &&
        !recentApps.includes(app.id)
      ).slice(0, 3);

      setRecommendations(recommendedApps);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(app => (
          <AppCard
            key={app.id}
            app={app}
            isFavorite={favorites.includes(app.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </motion.section>
  );
}