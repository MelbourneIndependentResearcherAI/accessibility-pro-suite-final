import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowLeft, ArrowRight, Eye, Lightbulb, Heart, Users, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import { TUTORIALS } from '@/components/tutorials/tutorialData';
import ConversationCoach from '@/components/ai/ConversationCoach';
import RoleplayPartner from '@/components/socialease/RoleplayPartner';
import LearningHub from '@/components/shared/LearningHub';
import ProgressTracker from '@/components/socialease/ProgressTracker';
import HarmonyIntegration from '@/components/socialease/HarmonyIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SocialEase() {
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsCheckingAuth(false);
    if (authenticated) {
      setHasStarted(true);
    }
  };

  const handleStartJourney = async () => {
    const authenticated = await base44.auth.isAuthenticated();
    if (!authenticated) {
      base44.auth.redirectToLogin(window.location.href);
    } else {
      setHasStarted(true);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 text-white flex flex-col overflow-x-hidden">
        <div className="flex justify-between items-center p-3 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold truncate">SocialEase AI</h1>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/20 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 p-0" onClick={() => navigate(createPageUrl('Home'))}>
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center"
          >
            <MessageCircle className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-8" />
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-6 leading-tight px-2">
              Navigate Social Situations with Confidence
            </h2>
            
            <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-2">
              Real-time AI coaching for conversations, social anxiety support, and personalized guidance for every interaction
            </p>

            <div className="mb-6 sm:mb-8 w-full px-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927455a54886e1ce03e6c89/b6d08d867_images111.jpeg" 
                alt="Social connection and communication" 
                className="rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 text-left px-2">
              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <MessageCircle className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">Conversation Coaching</h3>
                <p className="text-xs sm:text-base text-white/80">Get real-time suggestions for conversation starters, topics, and graceful exits</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <Eye className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">Body Language Guide</h3>
                <p className="text-xs sm:text-base text-white/80">Learn to read and respond to non-verbal cues in social situations</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <Lightbulb className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">Active Listening Tips</h3>
                <p className="text-xs sm:text-base text-white/80">Master the art of meaningful conversation with AI-powered listening strategies</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6">
                <Heart className="w-5 h-5 sm:w-8 sm:h-8 mb-2 sm:mb-3 flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">Confidence Building</h3>
                <p className="text-xs sm:text-base text-white/80">Receive personalized reminders and encouragement to boost your social confidence</p>
              </div>
            </div>

            <div className="px-2">
              <Button
                size="lg"
                onClick={handleStartJourney}
                className="w-full max-w-md h-12 sm:h-16 text-base sm:text-lg font-bold bg-white text-orange-600 hover:bg-orange-50 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white"
              >
                <span className="font-bold text-orange-600">{isAuthenticated ? 'Start Your Journey' : 'Login to Continue'}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-orange-600" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 text-white overflow-x-hidden">
      <InteractiveTutorial steps={TUTORIALS.SocialEase} appName="SocialEase" />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-8">
        <Button variant="ghost" className="mb-3 sm:mb-6 text-white hover:bg-white/20 h-9 sm:h-10" onClick={() => navigate(createPageUrl('Home'))}>
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Back to Hub</span>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="text-center mb-4 sm:mb-8 mt-2 sm:mt-4">
            <MessageCircle className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4" />
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 px-2">SocialEase AI</h1>
            <p className="text-base sm:text-xl opacity-90 px-3">Navigate social situations with confidence</p>
          </div>

          <Tabs defaultValue="coach" className="w-full space-y-3 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-md border border-white/30 h-10 sm:h-14 p-1 rounded-xl gap-0.5 sm:gap-1">
              <TabsTrigger value="coach" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white font-bold h-8 sm:h-12 rounded-lg text-[10px] sm:text-sm px-1 sm:px-3">
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline font-bold">AI Coach</span>
              </TabsTrigger>
              <TabsTrigger value="roleplay" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white font-bold h-8 sm:h-12 rounded-lg text-[10px] sm:text-sm px-1 sm:px-3">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline font-bold">Roleplay</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white font-bold h-8 sm:h-12 rounded-lg text-[10px] sm:text-sm px-1 sm:px-3">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline font-bold">Learn</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:text-orange-600 text-white font-bold h-8 sm:h-12 rounded-lg text-[10px] sm:text-sm px-1 sm:px-3">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline font-bold">Progress</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coach" className="mt-3 sm:mt-6">
              <div className="space-y-6">
                <HarmonyIntegration />
                <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl overflow-hidden">
                  <div className="p-3 sm:p-8 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Conversation Coach</h1>
                    <p className="text-xs sm:text-base text-slate-600">Get real-time advice for any social situation</p>
                  </div>
                  <div className="p-3 sm:p-8">
                    <ConversationCoach />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roleplay" className="mt-3 sm:mt-6">
              <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl overflow-hidden p-3 sm:p-8">
                <div className="mb-3 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-slate-900">Interactive Roleplay</h2>
                  <p className="text-xs sm:text-base text-slate-600">Practice conversations in a safe, AI-guided environment</p>
                </div>
                <RoleplayPartner />
              </div>
            </TabsContent>

            <TabsContent value="learn" className="mt-3 sm:mt-6">
              <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl overflow-hidden p-3 sm:p-8">
                <LearningHub appName="SocialEase" />
              </div>
            </TabsContent>

            <TabsContent value="progress" className="mt-3 sm:mt-6">
              <div className="bg-white rounded-xl sm:rounded-3xl shadow-xl overflow-hidden p-3 sm:p-8">
                <ProgressTracker />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}