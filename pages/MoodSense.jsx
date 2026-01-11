import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles, Save, WifiOff, BarChart3, BookOpen, Plus, Activity, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePWA } from '@/components/pwa/PWAProvider';
import { OfflineStorage } from '@/components/pwa/OfflineStorage';
import { base44 } from '@/api/base44Client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import MoodAnalysis from '@/components/ai/MoodAnalysis';
import MessageAnalyzer from '@/components/ai/MessageAnalyzer';
import AICounsellor from '@/components/ai/AICounsellor';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import OnboardingOverlay from '@/components/tutorials/OnboardingOverlay';
import { TUTORIALS } from '@/components/tutorials/tutorialData';
import LearningHub from '@/components/shared/LearningHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShareToHarmony from '@/components/moodsense/ShareToHarmony';

const tutorialSteps = [
  {
    title: 'Track Your Emotional Journey',
    description: 'Log your mood daily to understand patterns and triggers over time.',
    icon: <Heart className="w-8 h-8 text-white" />
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get personalized coping strategies and mental health insights from our AI.',
    icon: <Sparkles className="w-8 h-8 text-white" />
  },
  {
    title: 'Works Offline',
    description: 'Your entries are saved even without internet and synced when you reconnect.',
    icon: <WifiOff className="w-8 h-8 text-white" />
  }
];

export default function MoodSense() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { isOnline, saveOfflineData } = usePWA();
  const queryClient = useQueryClient();

  const onboardingSteps = [
    {
      id: 'mood-welcome',
      title: 'Welcome to MoodSense',
      description: 'Let\'s take a quick tour of how to track your emotional wellness journey.',
      icon: <Heart className="w-6 h-6 text-white" />,
      position: 'center'
    },
    {
      id: 'mood-journal',
      title: 'Start with a Journal Entry',
      description: 'Share what\'s on your mind. This is optional but helps you reflect on your feelings.',
      action: 'Type something in the text area above',
      targetSelector: 'textarea',
      position: 'bottom',
      icon: <Sparkles className="w-6 h-6 text-white" />
    },
    {
      id: 'mood-select',
      title: 'Select Your Mood',
      description: 'Tap one of the mood buttons to log how you\'re feeling today. Your mood will be saved automatically.',
      action: 'Click any mood emoji to continue',
      targetSelector: '.mood-button-grid',
      position: 'bottom',
      icon: <Heart className="w-6 h-6 text-white" />
    },
    {
      id: 'mood-insights',
      title: 'Get AI Insights',
      description: 'After logging a few moods, visit the AI Insights tab to see patterns and get personalized coping strategies.',
      targetSelector: '[data-tab="analysis"]',
      position: 'bottom',
      icon: <Sparkles className="w-6 h-6 text-white" />
    }
  ];

  const { data: moodEntries = [] } = useQuery({
    queryKey: ['moodEntries'],
    queryFn: () => base44.entities.MoodEntry.list('-created_date', 30),
    initialData: [],
  });

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setIsSaving(true);
    setSaveSuccess(false);

    const moodEntry = {
      mood: mood.value,
      emoji: mood.emoji,
      journal_entry: journalEntry || '',
      energy_level: 5,
      sleep_hours: 7
    };

    try {
      if (isOnline) {
        await base44.entities.MoodEntry.create(moodEntry);
        queryClient.invalidateQueries(['moodEntries']);
      } else {
        // Save offline
        OfflineStorage.saveMoodEntryOffline(moodEntry);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSelectedMood(null);
        setJournalEntry('');
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-200/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-200/30 via-transparent to-transparent"></div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center"
          >
            <motion.div 
              className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 fill-rose-500 drop-shadow-lg" />
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">MoodSense</h1>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-r from-pink-100/80 to-purple-100/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 inline-flex items-center gap-2 mb-8 sm:mb-12 shadow-lg border border-white/50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-rose-800 font-semibold text-sm sm:text-base">Your safe space for emotional wellness 💜</span>
            </motion.div>

            <motion.h2 
              className="text-3xl sm:text-5xl font-bold text-slate-800 mb-3 sm:mb-4 leading-tight px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              You deserve to feel
            </motion.h2>
            <motion.h2 
              className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-8 leading-tight bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              understood and supported
            </motion.h2>

            <motion.p 
              className="text-slate-700 text-base sm:text-xl leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Sometimes we all need a gentle space to explore our feelings. MoodSense is here to listen, understand, and support you—every step of your journey. 🌸
            </motion.p>

            <motion.div 
              className="mb-6 sm:mb-8 px-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative max-w-full sm:max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-400 rounded-2xl blur-2xl opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" 
                  alt="Emotional support and understanding" 
                  className="rounded-2xl shadow-2xl max-w-full mx-auto w-full relative z-10 border-4 border-white/50"
                />
              </div>
            </motion.div>

            <motion.div 
              className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                size="lg"
                className="w-full max-w-md h-14 sm:h-16 text-base sm:text-lg font-bold bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-rose-500/50 transition-all hover:scale-105"
                onClick={() => setHasStarted(true)}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
                <span className="font-bold">Start Your Journey</span>
              </Button>
              
              <Link to={createPageUrl('Home')} className="block">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full max-w-md h-14 sm:h-16 text-base sm:text-lg font-bold border-2 border-rose-300 rounded-2xl bg-white/80 hover:bg-white hover:border-rose-400 text-rose-700 hover:text-rose-800 transition-all hover:scale-105 shadow-lg"
                >
                  <span className="font-bold">Welcome Back</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-2xl mx-auto text-left px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-white to-rose-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-rose-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-3 shadow-lg">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Mood Tracking</h3>
                <p className="text-sm sm:text-base text-slate-600">Log your daily emotions with quick emoji selections</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">AI Insights</h3>
                <p className="text-sm sm:text-base text-slate-600">Get personalized coping strategies and pattern analysis</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                  <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Trend Analysis</h3>
                <p className="text-sm sm:text-base text-slate-600">Visualize your emotional patterns over time</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center mb-3 shadow-lg">
                  <WifiOff className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">Offline Support</h3>
                <p className="text-sm sm:text-base text-slate-600">Track moods offline, sync when reconnected</p>
              </motion.div>
            </motion.div>
            
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm px-4">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Free to start · No credit card needed · 3 daily analyses</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-200/20 via-transparent to-transparent"></div>
      <AICounsellor />
      {showOnboarding && (
        <OnboardingOverlay
          appName="MoodSense"
          steps={onboardingSteps}
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8 relative z-10">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-4 sm:mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Hub
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 mt-4"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4 px-2">MoodSense Dashboard</h1>
          <p className="text-slate-600 px-4">Track your emotional wellness journey</p>
          
          {!isOnline && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              Offline Mode - Your entries will sync when you reconnect
            </div>
          )}
        </motion.div>

        <Tabs defaultValue="messages" className="w-full space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/80 backdrop-blur-sm p-1 sm:p-1.5 rounded-xl gap-1 shadow-lg border border-rose-200/50">
            <TabsTrigger value="track" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 sm:py-3 text-xs sm:text-sm transition-all">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="font-semibold">Track</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" data-tab="analysis" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 sm:py-3 text-xs sm:text-sm transition-all">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="font-semibold">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 sm:py-3 text-xs sm:text-sm transition-all">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="font-semibold">Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg py-2 sm:py-3 text-xs sm:text-sm transition-all">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="font-semibold">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="track">
            <motion.div 
              className="bg-gradient-to-br from-white to-rose-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl border border-rose-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">How are you feeling today?</h2>
              
              <div className="mb-4 sm:mb-6">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="What's on your mind? (Optional)"
                  className="w-full p-3 sm:p-4 border-2 border-rose-200 rounded-xl resize-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 focus:outline-none text-sm sm:text-base bg-white/80 backdrop-blur-sm shadow-inner"
                  rows={3}
                />
              </div>

              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 sm:p-4 bg-green-100 text-green-800 rounded-xl flex items-center gap-2"
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">
                    Mood saved {isOnline ? 'successfully' : 'offline - will sync later'}!
                  </span>
                </motion.div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4 mood-button-grid">
                {[
                  { emoji: '😊', label: 'Excellent', value: 'excellent', color: 'from-green-400 to-emerald-500' },
                  { emoji: '🙂', label: 'Good', value: 'good', color: 'from-blue-400 to-cyan-500' },
                  { emoji: '😐', label: 'Okay', value: 'okay', color: 'from-yellow-400 to-amber-500' },
                  { emoji: '😔', label: 'Low', value: 'low', color: 'from-orange-400 to-red-500' },
                  { emoji: '😢', label: 'Very Low', value: 'very_low', color: 'from-purple-400 to-pink-500' }
                ].map((mood, index) => (
                  <motion.button
                    key={mood.value}
                    onClick={() => handleMoodSelect(mood)}
                    disabled={isSaving}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl transition-all shadow-lg ${
                      selectedMood?.value === mood.value
                        ? `bg-gradient-to-br ${mood.color} text-white border-2 border-white shadow-2xl scale-105`
                        : 'bg-white/80 backdrop-blur-sm border-2 border-rose-200/50 hover:border-rose-300 hover:shadow-xl'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow-lg">{mood.emoji}</span>
                    <span className={`text-xs sm:text-sm font-semibold ${selectedMood?.value === mood.value ? 'text-white' : 'text-slate-700'}`}>{mood.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="analysis">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl border border-purple-200/50">
                <MoodAnalysis moodEntries={moodEntries} />
              </div>
              <ShareToHarmony moodEntries={moodEntries} />
            </motion.div>
          </TabsContent>

          <TabsContent value="messages">
            <motion.div 
              className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl border border-blue-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MessageAnalyzer />
            </motion.div>
          </TabsContent>

          <TabsContent value="learn">
            <motion.div 
              className="bg-gradient-to-br from-white to-amber-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-xl border border-amber-200/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LearningHub appName="MoodSense" />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}