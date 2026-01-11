import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShareButton from '@/components/shared/ShareButton';

export default function ShareToHarmony({ moodEntries }) {
  if (!moodEntries || moodEntries.length === 0) return null;

  // Calculate mood summary for the last 7 days
  const recentMoods = moodEntries.slice(0, 7);
  const moodCounts = recentMoods.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const dominantMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'okay';

  const shareData = {
    moodSummary: {
      dominantMood,
      entryCount: recentMoods.length,
      recentEntries: recentMoods.slice(0, 3).map(e => ({
        mood: e.mood,
        emoji: e.emoji,
        date: e.created_date,
        journal: e.journal_entry
      })),
      moodDistribution: moodCounts
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <HeartHandshake className="w-5 h-5" />
            Share with Harmony
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 text-sm">
            Help your relationship by sharing your emotional patterns with Harmony AI for deeper insights.
          </p>
          
          <div className="bg-white rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Last 7 days: {recentMoods.length} mood entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Dominant mood: {dominantMood}</span>
            </div>
          </div>

          <ShareButton
            sourceApp="MoodSense"
            dataType="moodSummary"
            data={shareData}
            targetApp="Harmony"
            label="Share Mood Insights to Harmony"
            className="shadow-lg"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}