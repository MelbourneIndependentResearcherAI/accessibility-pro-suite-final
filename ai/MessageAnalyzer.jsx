import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, AlertTriangle, Info, Copy, Loader, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MessageAnalyzer() {
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the following message or post for emotional content, context, and safety concerns.

Message: "${message}"

Provide a detailed analysis including:
1. Primary mood/emotion detected (happy, sad, angry, anxious, worried, excited, etc.)
2. Context and underlying meaning
3. Any safety concerns or threats (self-harm, violence, abuse, danger)
4. Severity level of any concerns (low, medium, high, critical)
5. Supportive response suggestions
6. Whether professional help should be sought

Be empathetic, thorough, and prioritize safety.`,
        response_json_schema: {
          type: "object",
          properties: {
            primary_mood: { type: "string" },
            mood_intensity: { type: "string", enum: ["very_low", "low", "moderate", "high", "very_high"] },
            emotions: { type: "array", items: { type: "string" } },
            context: { type: "string" },
            safety_concerns: { type: "array", items: { type: "string" } },
            severity: { type: "string", enum: ["none", "low", "medium", "high", "critical"] },
            requires_professional_help: { type: "boolean" },
            supportive_response: { type: "string" },
            red_flags: { type: "array", items: { type: "string" } },
            positive_aspects: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis(response);
    } catch (error) {
      console.error('Error analyzing message:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMessage(text);
    } catch (error) {
      console.error('Error reading clipboard:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-900 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-900 border-blue-300';
      default: return 'bg-green-100 text-green-900 border-green-300';
    }
  };

  const getMoodColor = (intensity) => {
    switch (intensity) {
      case 'very_high': return 'bg-purple-100 text-purple-900';
      case 'high': return 'bg-pink-100 text-pink-900';
      case 'moderate': return 'bg-blue-100 text-blue-900';
      case 'low': return 'bg-slate-100 text-slate-900';
      case 'very_low': return 'bg-gray-100 text-gray-900';
      default: return 'bg-slate-100 text-slate-900';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-purple-500" />
          Message Analysis
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Paste any message, post, or text to analyze mood, context, and detect safety concerns
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
          <div className="relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a message, social media post, text message, or any text you want to analyze..."
              rows={5}
              className="resize-none text-sm sm:text-base pr-20"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaste}
              className="absolute top-2 right-2 h-8 text-xs sm:text-sm"
            >
              <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Paste</span>
            </Button>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!message.trim() || isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 sm:h-12 text-sm sm:text-base"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Analyze Message
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Safety Alert */}
          {analysis.severity !== 'none' && (
            <Card className={`border-2 ${getSeverityColor(analysis.severity)}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg flex-wrap">
                  {analysis.severity === 'critical' || analysis.severity === 'high' ? (
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  )}
                  <span className="break-words">Safety Alert - {analysis.severity.toUpperCase()} Severity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm sm:text-base">
                {analysis.safety_concerns && analysis.safety_concerns.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Concerns Identified:</h3>
                    <ul className="space-y-1.5">
                      {analysis.safety_concerns.map((concern, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-base sm:text-lg flex-shrink-0">⚠️</span>
                          <span className="text-sm sm:text-base break-words">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.red_flags && analysis.red_flags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Red Flags:</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {analysis.red_flags.map((flag, i) => (
                        <Badge key={i} variant="destructive" className="text-xs sm:text-sm">{flag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.requires_professional_help && (
                  <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-current mt-3">
                    <p className="font-bold mb-2 text-sm sm:text-base">⚕️ Professional Help Recommended</p>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Based on this analysis, it's important to reach out to a mental health professional 
                      or crisis hotline. If this is an emergency, please call emergency services immediately.
                    </p>
                    <div className="mt-3 space-y-1 text-xs sm:text-sm font-medium">
                      <p className="break-words">🆘 Emergency: 000 (Australia) / 911 (US)</p>
                      <p className="break-words">💬 Lifeline: 13 11 14 (Australia)</p>
                      <p className="break-words">💬 Suicide Prevention Lifeline: 1-800-273-8255 (US)</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Mood & Emotion Analysis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 flex-shrink-0" />
                Emotional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <div>
                <h3 className="font-semibold mb-2">Primary Mood:</h3>
                <Badge className={`${getMoodColor(analysis.mood_intensity)} text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 break-words`}>
                  {analysis.primary_mood} ({analysis.mood_intensity})
                </Badge>
              </div>

              {analysis.emotions && analysis.emotions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Detected Emotions:</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {analysis.emotions.map((emotion, i) => (
                      <Badge key={i} variant="outline" className="text-xs sm:text-sm">{emotion}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Context & Meaning:</h3>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base break-words">
                  {analysis.context}
                </p>
              </div>

              {analysis.positive_aspects && analysis.positive_aspects.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-green-700">✨ Positive Aspects:</h3>
                  <ul className="space-y-1.5">
                    {analysis.positive_aspects.map((aspect, i) => (
                      <li key={i} className="flex items-start gap-2 text-green-800 text-sm sm:text-base">
                        <span className="flex-shrink-0">💚</span>
                        <span className="break-words">{aspect}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supportive Response */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                Supportive Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200 text-sm sm:text-base break-words">
                {analysis.supportive_response}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!analysis && !isAnalyzing && (
        <Card className="border-dashed border-2">
          <CardContent className="py-8 sm:py-12 text-center px-4">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm sm:text-base">
              Paste or type a message above and click "Analyze Message" to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}