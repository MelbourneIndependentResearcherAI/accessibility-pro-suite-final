import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, X, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrossAppIntegration } from '@/components/shared/CrossAppIntegration';

export default function MoodContextDisplay() {
  const [moodData, setMoodData] = useState(null);

  useEffect(() => {
    const data = CrossAppIntegration.retrieveData('MoodSense', 'moodSummary');
    if (data) {
      setMoodData(data.data.moodSummary);
    }
  }, []);

  const handleDismiss = () => {
    CrossAppIntegration.clearData('MoodSense', 'moodSummary');
    setMoodData(null);
  };

  if (!moodData) return null;

  const moodEmojis = {
    excellent: '😊',
    good: '🙂',
    okay: '😐',
    low: '😔',
    very_low: '😢'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-pink-300 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Heart className="w-5 h-5 text-pink-500" />
              Shared Mood Context from MoodSense
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="hover:bg-purple-100">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-slate-900">
                {moodData.entryCount} mood entries in the last 7 days
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-slate-900">
                Dominant mood: {moodEmojis[moodData.dominantMood]} {moodData.dominantMood}
              </span>
            </div>

            {moodData.recentEntries && moodData.recentEntries.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-slate-700 mb-2">Recent moods:</p>
                <div className="space-y-2">
                  {moodData.recentEntries.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-xl">{entry.emoji}</span>
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                      {entry.journal && (
                        <span className="text-xs text-slate-500 truncate">- {entry.journal.slice(0, 50)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600">
            💡 Use this emotional context to provide better relationship insights and de-escalation strategies.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}