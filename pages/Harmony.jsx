import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, ArrowLeft, ArrowRight, Sparkles, Heart, CheckCircle, BookOpen, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import RelationshipAnalysis from '@/components/ai/RelationshipAnalysis';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import { TUTORIALS } from '@/components/tutorials/tutorialData';
import LearningHub from '@/components/shared/LearningHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MeditationLightTube from '@/components/harmony/MeditationLightTube';
import MoodContextDisplay from '@/components/harmony/MoodContextDisplay';

export default function Harmony() {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);

  const { data: checkIns = [] } = useQuery({
    queryKey: ['relationshipCheckIns'],
    queryFn: () => base44.entities.RelationshipCheckIn.list('-created_date', 20),
    initialData: [],
  });

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 to-rose-600 text-white flex flex-col overflow-x-hidden">
        <div className="flex justify-between items-center p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold truncate">Harmony AI</h1>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 p-0" onClick={() => navigate(createPageUrl('Home'))}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12 pb-24 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center mb-12"
          >
            <HeartHandshake className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-8" />
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 leading-tight px-2">
              Build Stronger Relationships
            </h2>
            
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-2">
              AI-powered insights to strengthen your bond, improve communication, and navigate conflicts with confidence
            </p>

            <div className="mb-6 sm:mb-8 px-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927455a54886e1ce03e6c89/9c8a7ae1d_images51.jpeg" 
                alt="Relationship growth from conflict to harmony" 
                className="rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl mx-auto w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 text-left px-2">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <HeartHandshake className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">Relationship Analysis</h3>
                <p className="text-xs sm:text-base text-white/80">Track connection levels, communication quality, and relationship health over time</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">AI Insights</h3>
                <p className="text-xs sm:text-base text-white/80">Get personalized patterns, strengths, and actionable improvement strategies</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <Heart className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">De-escalation Techniques</h3>
                <p className="text-xs sm:text-base text-white/80">Learn proven conflict resolution methods tailored to your relationship dynamics</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <CheckCircle className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">Love Language Guide</h3>
                <p className="text-xs sm:text-base text-white/80">Understand and speak your partner's love language with AI guidance</p>
              </div>
            </div>

            <div className="px-2">
              <Button
                size="lg"
                onClick={() => setHasStarted(true)}
                className="w-full max-w-md h-12 sm:h-16 text-base sm:text-lg font-bold bg-white text-pink-600 hover:bg-pink-50 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white"
              >
                <span className="font-bold text-pink-600">Start Building Harmony</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-pink-600" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-rose-600 text-white overflow-x-hidden">
      <InteractiveTutorial steps={TUTORIALS.Harmony} appName="Harmony" />
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-8">
        <Button variant="ghost" className="mb-3 sm:mb-6 text-white hover:bg-white/20 h-9 sm:h-10" onClick={() => navigate(createPageUrl('Home'))}>
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Back to Hub</span>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-8 mt-2 sm:mt-4"
        >
          <HeartHandshake className="w-12 h-12 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-8" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-6 px-2">Harmony AI</h1>
          <p className="text-base sm:text-xl lg:text-2xl mb-6 sm:mb-12 px-3">Strengthen your relationships with AI insights</p>
        </motion.div>

        <MoodContextDisplay />

        <Tabs defaultValue="meditate" className="space-y-3 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-md p-1 sm:p-1.5 rounded-xl gap-1">
            <TabsTrigger value="meditate" className="data-[state=active]:bg-white data-[state=active]:text-pink-600 text-white font-bold py-2 sm:py-3 rounded-lg text-xs sm:text-base">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="font-bold">Meditate</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:text-pink-600 text-white font-bold py-2 sm:py-3 rounded-lg text-xs sm:text-base">
              <BrainCircuit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="font-bold">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-white data-[state=active]:text-pink-600 text-white font-bold py-2 sm:py-3 rounded-lg text-xs sm:text-base">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="font-bold">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meditate" className="mt-3 sm:mt-6 pb-20">
            <MeditationLightTube />
          </TabsContent>

          <TabsContent value="analysis" className="mt-3 sm:mt-6 pb-20">
            <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-8 text-slate-900">
              <RelationshipAnalysis checkIns={checkIns} />
            </div>
          </TabsContent>

          <TabsContent value="learn" className="mt-3 sm:mt-6 pb-20">
            <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-8 text-slate-900">
              <LearningHub appName="Harmony" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}