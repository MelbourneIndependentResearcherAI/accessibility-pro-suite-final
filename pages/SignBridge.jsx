import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, ArrowLeft, ArrowRight, Globe, Camera, Book, Video, BookOpen, Download, Brain, TrendingUp, Target, Users, Clock, Sparkles, Link2, Menu, X } from 'lucide-react';
import LearningHub from '@/components/shared/LearningHub';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignCamera from '@/components/signbridge/SignCamera';
import PhraseLibrary from '@/components/signbridge/PhraseLibrary';
import LiveVideoTranslator from '@/components/signbridge/LiveVideoTranslator';
import LearningModule from '@/components/signbridge/LearningModule';
import OfflineLanguagePacks from '@/components/signbridge/OfflineLanguagePacks';
import AITutor from '@/components/signbridge/AITutor';
import SignDictionary from '@/components/signbridge/SignDictionary';
import ProgressDashboard from '@/components/signbridge/ProgressDashboard';
import SignPractice from '@/components/signbridge/SignPractice';
import OnlineConversation from '@/components/signbridge/OnlineConversation';
import TranslationHistory from '@/components/signbridge/TranslationHistory';
import RealtimeSignAnimator from '@/components/signbridge/RealtimeSignAnimator';
import AppConnector from '@/components/shared/AppConnector';
import CleaningTaskTranslator from '@/components/signbridge/CleaningTaskTranslator';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import { TUTORIALS } from '@/components/tutorials/tutorialData';

const tutorialSteps = [
  {
    title: 'Real-Time Translation',
    description: 'Take photos of sign language gestures and get instant AI-powered translations.',
    icon: <Camera className="w-8 h-8 text-white" />
  },
  {
    title: 'Learn Sign Language',
    description: 'Browse our comprehensive phrase library with visual guides and voice pronunciation.',
    icon: <Book className="w-8 h-8 text-white" />
  },
  {
    title: 'Break Down Barriers',
    description: 'Communicate across languages and cultures with AI assistance.',
    icon: <Globe className="w-8 h-8 text-white" />
  }
];

export default function SignBridge() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('asl');
  const [activeConnection, setActiveConnection] = useState(null);
  const [activeTab, setActiveTab] = useState('online');
  const [menuOpen, setMenuOpen] = useState(false);

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white flex flex-col overflow-x-hidden">
        <div className="flex justify-end items-center p-3 sm:p-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-9 w-9 p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

      <div className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-4 inline-flex items-center gap-2 sm:gap-3 mb-8 sm:mb-12 max-w-full">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold text-xs sm:text-base">🎉 Now Supporting 20 Sign Languages Worldwide!</span>
          </div>

          <h2 className="text-3xl sm:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Breaking Barriers,
          </h2>
          <h2 className="text-3xl sm:text-6xl font-bold mb-8 sm:mb-12 leading-tight bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Building Bridges
          </h2>

          <p className="text-base sm:text-xl text-white/90 mb-8 sm:mb-12 max-w-xl mx-auto leading-relaxed">
            Ever wished you could have a real conversation without the awkward pauses? We translate sign language with the emotion, context, and personality it deserves.
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-8 sm:mb-12 border border-white/20 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              <span className="text-sm sm:text-2xl font-bold text-center">🌍 20 Sign Languages • 6 Continents • Full Global Coverage</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 text-left">
              <div>
                <h4 className="font-bold mb-1 sm:mb-2 text-yellow-300 text-xs sm:text-base">Americas</h4>
                <p className="text-xs sm:text-sm text-white/80">🇺🇸 🇧🇷 🇲🇽</p>
              </div>
              <div>
                <h4 className="font-bold mb-1 sm:mb-2 text-yellow-300 text-xs sm:text-base">Europe</h4>
                <p className="text-xs sm:text-sm text-white/80">🇬🇧 🇫🇷 🇩🇪 🇪🇸</p>
              </div>
              <div>
                <h4 className="font-bold mb-1 sm:mb-2 text-yellow-300 text-xs sm:text-base">Asia-Pacific</h4>
                <p className="text-xs sm:text-sm text-white/80">🇦🇺 🇳🇿 🇵🇭 🇯🇵 🇰🇷 🇨🇳 🇮🇳</p>
              </div>
              <div>
                <h4 className="font-bold mb-1 sm:mb-2 text-yellow-300 text-xs sm:text-base">MEA</h4>
                <p className="text-xs sm:text-sm text-white/80">🇧🇷 🇿🇦</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto px-3">
            <Button
              size="lg"
              onClick={() => setHasStarted(true)}
              className="w-full h-14 sm:h-16 text-base sm:text-lg font-bold bg-white text-purple-600 hover:bg-purple-50 rounded-xl sm:rounded-2xl shadow-xl border-2 border-white"
            >
              <span className="text-purple-600 font-bold">Try It Free Right Now</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-purple-600" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
    );
  }

  const menuItems = [
    { value: 'online', label: 'Online', icon: Users },
    { value: 'history', label: 'History', icon: Clock },
    { value: 'connect', label: 'Connect', icon: Link2, badge: activeConnection },
    { value: 'realtime', label: 'Real-Time', icon: Sparkles },
    { value: 'live', label: 'Live Video', icon: Video },
    { value: 'camera', label: 'Photo', icon: Camera },
    { value: 'dictionary', label: 'Dictionary', icon: BookOpen },
    { value: 'practice', label: 'Practice', icon: Target },
    { value: 'progress', label: 'Progress', icon: TrendingUp },
    { value: 'offline', label: 'Offline', icon: Download },
    { value: 'tutor', label: 'AI Tutor', icon: Brain },
    { value: 'learn', label: 'Learn', icon: Book },
    { value: 'library', label: 'Phrases', icon: Globe },
  ];

  const currentMenuItem = menuItems.find(item => item.value === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white overflow-x-hidden">
      <InteractiveTutorial steps={TUTORIALS.SignBridge} appName="SignBridge" />
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-8">
        <div className="flex items-center justify-between mb-3 sm:mb-6 gap-2">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-white hover:bg-white/20 h-9 px-2 sm:px-4">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Back to Hub</span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:bg-white/20 relative h-9 w-9 p-0"
          >
            {menuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            {activeConnection && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse absolute top-0 right-0"></div>
            )}
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-8"
        >
          <Hand className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4" />
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 px-2">SignBridge AI</h1>
          <p className="text-white/90 text-xs sm:text-base px-3 mb-1 sm:mb-2">Real-time sign language translation and learning</p>
          {currentMenuItem && (
            <div className="flex items-center justify-center gap-2 text-white/80 text-xs sm:text-sm">
              <currentMenuItem.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">{currentMenuItem.label}</span>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden mb-4 sm:mb-6"
            >
              <div className="p-2 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setActiveTab(item.value);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-lg transition-all text-left ${
                      activeTab === item.value
                        ? 'bg-purple-600 text-white'
                        : 'hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CleaningTaskTranslator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsContent value="realtime">
            <RealtimeSignAnimator />
          </TabsContent>

          <TabsContent value="live">
            <LiveVideoTranslator />
          </TabsContent>

          <TabsContent value="camera">
            <SignCamera />
          </TabsContent>

          <TabsContent value="dictionary">
            <SignDictionary />
          </TabsContent>

          <TabsContent value="practice">
            <SignPractice />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressDashboard selectedDialect={selectedLanguage} />
          </TabsContent>

          <TabsContent value="offline">
            <OfflineLanguagePacks />
          </TabsContent>

          <TabsContent value="tutor">
            <AITutor 
              selectedDialect={selectedLanguage}
              onDialectChange={setSelectedLanguage}
            />
          </TabsContent>

          <TabsContent value="learn">
            <LearningModule />
          </TabsContent>

          <TabsContent value="library">
            <PhraseLibrary />
          </TabsContent>

          <TabsContent value="online">
            <OnlineConversation />
          </TabsContent>

          <TabsContent value="history">
            <TranslationHistory />
          </TabsContent>

          <TabsContent value="connect">
            <AppConnector 
              appName="SignBridge" 
              onConnectionChange={setActiveConnection}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}