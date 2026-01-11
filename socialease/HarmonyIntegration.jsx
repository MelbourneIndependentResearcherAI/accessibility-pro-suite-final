import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrossAppIntegration } from '@/components/shared/CrossAppIntegration';
import { AIService } from '@/components/ai/AIService';

export default function HarmonyIntegration() {
  const [moodData, setMoodData] = useState(null);
  const [conversationStarters, setConversationStarters] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = CrossAppIntegration.retrieveData('MoodSense', 'moodSummary');
    if (data) {
      setMoodData(data.data.moodSummary);
    }
  }, []);

  const generateConversationStarters = async () => {
    if (!moodData) return;
    
    setLoading(true);
    try {
      const starters = await AIService.generateRelationshipConversationStarters(moodData);
      setConversationStarters(starters);
    } catch (error) {
      console.error('Error generating starters:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!moodData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <HeartHandshake className="w-5 h-5" />
            Relationship-Focused Conversation Starters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-700">
            Based on your shared mood context (dominant mood: <strong>{moodData.dominantMood}</strong>), 
            here are conversation starters for your relationship.
          </p>

          {!conversationStarters ? (
            <Button
              onClick={generateConversationStarters}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Conversation Starters
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              {conversationStarters.starters?.map((starter, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-sm font-medium text-slate-900">{starter.phrase}</p>
                  <p className="text-xs text-slate-600 mt-1">{starter.context}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}