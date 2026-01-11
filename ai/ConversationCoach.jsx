import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Lightbulb, Eye, DoorOpen, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AIService } from './AIService';

export default function ConversationCoach() {
  const [situation, setSituation] = useState('');
  const [coaching, setCoaching] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCoaching = async () => {
    if (!situation.trim()) return;

    setIsLoading(true);
    try {
      const result = await AIService.provideConversationCoaching(situation);
      setCoaching(result);
    } catch (error) {
      console.error('Error getting coaching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
            <span className="truncate">Describe Your Situation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <Input
            placeholder="E.g., Meeting new coworkers at lunch..."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="mb-3 sm:mb-4 text-sm sm:text-base"
          />
          <Button
            onClick={handleGetCoaching}
            disabled={!situation.trim() || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-10 sm:h-11 text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse flex-shrink-0" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span>Get Coaching</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {coaching && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Conversation Starters */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-blue-900 text-base sm:text-lg">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Conversation Starters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-2">
                {coaching.conversation_starters.map((starter, index) => (
                  <div
                    key={index}
                    className="p-2 sm:p-3 bg-white rounded-lg border border-blue-200"
                  >
                    <p className="text-slate-700 text-xs sm:text-base break-words">💬 "{starter}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Body Language Guide */}
          {coaching.body_language_guide && coaching.body_language_guide.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-purple-900 text-base sm:text-lg">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Body Language Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <div className="mb-3 sm:mb-4">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927455a54886e1ce03e6c89/ebbc51861_images31.jpeg" 
                    alt="Effective communication and conversation" 
                    className="rounded-lg sm:rounded-xl w-full max-w-sm mx-auto"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {coaching.body_language_guide.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 sm:p-4 bg-white rounded-lg border border-purple-200"
                    >
                      <p className="font-semibold text-purple-900 mb-1 text-xs sm:text-base break-words">
                        {item.signal}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 mb-1 sm:mb-2 break-words">
                        <strong>Meaning:</strong> {item.meaning}
                      </p>
                      <p className="text-xs sm:text-sm text-purple-700 break-words">
                        <strong>How to respond:</strong> {item.response}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Listening Tips */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-green-900 text-base sm:text-lg">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Active Listening Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <ul className="space-y-2">
                {coaching.active_listening_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5 sm:mt-1 flex-shrink-0">✓</span>
                    <span className="text-slate-700 text-xs sm:text-base break-words">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm text-green-900">Topics to Discuss</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <ul className="space-y-1">
                  {coaching.topics_to_discuss.map((topic, index) => (
                    <li key={index} className="text-xs sm:text-sm text-slate-700 break-words">
                      ✓ {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm text-red-900">Topics to Avoid</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <ul className="space-y-1">
                  {coaching.topics_to_avoid.map((topic, index) => (
                    <li key={index} className="text-xs sm:text-sm text-slate-700 break-words">
                      ✗ {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Exit Strategies */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-amber-900 text-base sm:text-lg">
                <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Exit Strategies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="space-y-2">
                {coaching.exit_strategies.map((strategy, index) => (
                  <p key={index} className="text-slate-700 text-xs sm:text-base break-words">
                    {index + 1}. {strategy}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidence Reminders */}
          <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white flex-shrink-0" />
                <span>Remember</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <ul className="space-y-2">
                {coaching.confidence_reminders.map((reminder, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-0.5 sm:mt-1 flex-shrink-0">💪</span>
                    <span className="text-xs sm:text-base break-words">{reminder}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}