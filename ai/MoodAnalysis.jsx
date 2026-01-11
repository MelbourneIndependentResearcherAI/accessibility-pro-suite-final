import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, AlertCircle, Heart, Lightbulb, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIService } from './AIService';

export default function MoodAnalysis({ moodEntries, onClose }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await AIService.analyzeMoodTrends(moodEntries);
      setAnalysis(result);
    } catch (err) {
      setError('Unable to analyze mood trends. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  React.useEffect(() => {
    if (moodEntries && moodEntries.length > 0) {
      handleAnalyze();
    }
  }, []);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Sparkles className="w-16 h-16 text-purple-500 animate-pulse mb-4" />
        <p className="text-lg text-slate-700">Analyzing your mood patterns...</p>
        <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-900 font-medium">{error}</p>
          <Button onClick={handleAnalyze} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Trend Analysis */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <TrendingUp className="w-6 h-6" />
            Mood Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">{analysis.trend_analysis}</p>
        </CardContent>
      </Card>

      {/* Identified Patterns */}
      {analysis.patterns && analysis.patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Patterns Identified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.patterns.map((pattern, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-700">{pattern}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coping Strategies */}
      {analysis.coping_strategies && analysis.coping_strategies.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Lightbulb className="w-6 h-6 text-green-600" />
              Personalized Coping Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.coping_strategies.map((strategy, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-green-50 rounded-xl border border-green-200"
                >
                  <h4 className="font-bold text-green-900 mb-2">{strategy.title}</h4>
                  <p className="text-slate-700 mb-2">{strategy.description}</p>
                  <p className="text-sm text-green-700 italic">
                    <strong>When to use:</strong> {strategy.when_to_use}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positive Observations */}
      {analysis.positive_observations && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Heart className="w-6 h-6 text-orange-600 fill-orange-600" />
              Positive Observations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed">{analysis.positive_observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Professional Help Alert */}
      {analysis.professional_help_needed && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="w-6 h-6 text-red-600" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-900 font-medium mb-4">
              Based on your mood patterns, we recommend speaking with a mental health professional.
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Find Support Resources
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Encouragement */}
      {analysis.encouragement && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="pt-6">
            <p className="text-lg leading-relaxed text-center font-medium">
              {analysis.encouragement}
            </p>
          </CardContent>
        </Card>
      )}

      {onClose && (
        <Button onClick={onClose} variant="outline" className="w-full">
          Close Analysis
        </Button>
      )}
    </motion.div>
  );
}