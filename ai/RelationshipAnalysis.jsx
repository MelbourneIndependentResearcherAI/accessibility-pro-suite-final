import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Lightbulb, Sparkles, ShieldCheck, BrainCircuit, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AIService } from './AIService';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function RelationshipAnalysis({ checkIns }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMoodContext, setShowMoodContext] = useState(false);
  const [relationshipIssue, setRelationshipIssue] = useState('');
  const [showIssueInput, setShowIssueInput] = useState(false);

  const { data: moodEntries = [] } = useQuery({
    queryKey: ['userMoods'],
    queryFn: () => base44.entities.MoodEntry.list('-created_date', 5),
    initialData: [],
  });

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeRelationship(checkIns);
      setAnalysis(result);
      setShowIssueInput(false);
    } catch (error) {
      console.error('Error analyzing relationship:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeIssue = async () => {
    if (!relationshipIssue.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await AIService.analyzeRelationshipIssue(relationshipIssue, checkIns);
      setAnalysis(result);
      setShowIssueInput(false);
    } catch (error) {
      console.error('Error analyzing issue:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  React.useEffect(() => {
    if (checkIns && checkIns.length > 0) {
      handleAnalyze();
    }
  }, []);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Sparkles className="w-16 h-16 text-pink-500 animate-pulse mb-4" />
        <p className="text-lg text-slate-700">Analyzing relationship patterns...</p>
      </div>
    );
  }

  if (!analysis && !showIssueInput) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <p className="text-slate-600 mb-4">Get AI-powered relationship insights and communication guidance</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => setShowIssueInput(true)} 
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Discuss a Problem
            </Button>
            {checkIns && checkIns.length > 0 && (
              <Button 
                onClick={handleAnalyze} 
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Heart className="w-4 h-4 mr-2" />
                Analyze Check-ins
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showIssueInput) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-900">
            <MessageSquare className="w-6 h-6 text-pink-600" />
            Tell Us About Your Relationship Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          <p className="text-slate-600 text-sm">
            Share what's going on in your relationship. Our AI will help you understand the situation and find healthy ways to communicate with your partner.
          </p>
          <Textarea
            placeholder="Example: My partner and I have been arguing a lot about finances lately. I feel like they don't listen to my concerns about saving money, and it's causing tension between us..."
            value={relationshipIssue}
            onChange={(e) => setRelationshipIssue(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleAnalyzeIssue}
              disabled={!relationshipIssue.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex-1 h-12 text-base"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Guidance
            </Button>
            <Button 
              onClick={() => setShowIssueInput(false)}
              variant="outline"
              className="h-12"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {relationshipIssue && (
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-900">Your Situation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 italic">"{relationshipIssue}"</p>
          </CardContent>
        </Card>
      )}
      {/* Health Score */}
      <Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-white/80 mb-2">Relationship Health Score</p>
            <div className="text-6xl font-bold mb-4">{analysis.health_score ? Math.round(analysis.health_score) : 'N/A'}/10</div>
            <p className="text-white/90">{analysis.health_assessment || 'Analyzing your relationship health...'}</p>
            
            {moodEntries.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/20">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMoodContext(!showMoodContext)}
                  className="text-white hover:bg-white/20 w-full"
                >
                  <BrainCircuit className="w-4 h-4 mr-2" />
                  {showMoodContext ? 'Hide Mood Context' : 'Show Mood Context'}
                </Button>
                
                {showMoodContext && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 text-left bg-white/10 rounded-xl p-3"
                  >
                    <p className="text-xs text-white/80 mb-2 uppercase font-bold">Recent Moods affecting relationship:</p>
                    <div className="flex flex-wrap gap-2">
                      {moodEntries.map(entry => (
                        <span key={entry.id} className="px-2 py-1 bg-white/20 rounded-lg text-xs flex items-center gap-1">
                          <span>{entry.emoji}</span>
                          <span>{entry.mood}</span>
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Heart className="w-6 h-6 text-green-600 fill-green-600" />
              Relationship Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-slate-700">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Validation & Understanding */}
      {analysis.validation && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Heart className="w-6 h-6 text-purple-600 fill-purple-600" />
              We Hear You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{analysis.validation}</p>
          </CardContent>
        </Card>
      )}

      {/* Root Causes */}
      {analysis.root_causes && analysis.root_causes.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <BrainCircuit className="w-6 h-6 text-blue-600" />
              Understanding the Issue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.root_causes.map((cause, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-slate-700">{cause}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Partner's Perspective */}
      {analysis.partner_perspective && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Heart className="w-6 h-6 text-amber-600" />
              Your Partner's Potential Perspective
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed italic">{analysis.partner_perspective}</p>
          </CardContent>
        </Card>
      )}

      {/* Communication Strategies */}
      {analysis.communication_strategies && analysis.communication_strategies.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <MessageSquare className="w-6 h-6 text-green-600" />
              Healthy Communication Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.communication_strategies.map((strategy, index) => (
                <div key={index} className="p-4 bg-green-50 rounded-xl">
                  <h4 className="font-bold text-green-900 mb-2">{strategy.strategy}</h4>
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>Why it works:</strong> {strategy.why_it_works}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Example:</strong> "{strategy.example}"
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation Starters */}
      {analysis.conversation_starters && analysis.conversation_starters.length > 0 && (
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-900">
              <MessageSquare className="w-6 h-6 text-cyan-600" />
              How to Start This Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.conversation_starters.map((starter, index) => (
                <div key={index} className="p-3 bg-white rounded-lg border border-cyan-200">
                  <p className="text-slate-700">💬 "{starter}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communication Patterns */}
      {analysis.communication_patterns && analysis.communication_patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Communication Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.communication_patterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-slate-700">{pattern}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* De-escalation Techniques */}
      {analysis.deescalation_techniques && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <ShieldCheck className="w-6 h-6 text-orange-600" />
              Conflict De-escalation Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927455a54886e1ce03e6c89/199aa433e_images41.jpeg" 
                alt="Apology and conflict resolution" 
                className="rounded-xl w-full max-w-md mx-auto mb-4"
              />
            </div>
            <div className="space-y-4">
              {analysis.deescalation_techniques.map((technique, index) => (
                <div key={index} className="p-4 bg-orange-50 rounded-xl">
                  <h4 className="font-bold text-orange-900 mb-2">{technique.technique}</h4>
                  <p className="text-sm text-slate-700 mb-2">
                    <strong>When to use:</strong> {technique.when_to_use}
                  </p>
                  <p className="text-sm text-orange-700">
                    <strong>How to apply:</strong> {technique.how_to_apply}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggested Activities */}
      {analysis.suggested_activities && analysis.suggested_activities.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              Suggested Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggested_activities.map((activity, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-purple-600">💡</span>
                  <span className="text-slate-700">{activity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Steps */}
      {analysis.action_steps && analysis.action_steps.length > 0 && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Lightbulb className="w-6 h-6 text-purple-600" />
              Steps to Move Forward Together
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {analysis.action_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicators */}
      {analysis.progress_indicators && analysis.progress_indicators.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Signs You're Making Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.progress_indicators.map((indicator, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-slate-700">{indicator}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Therapy Consideration */}
      {analysis.therapy_consideration && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <ShieldCheck className="w-6 h-6 text-slate-600" />
              About Professional Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{analysis.therapy_consideration}</p>
          </CardContent>
        </Card>
      )}

      {/* Love Language Insights */}
      {analysis.love_language_insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              Love Language Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{analysis.love_language_insights}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}