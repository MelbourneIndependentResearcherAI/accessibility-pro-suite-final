import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, CheckCircle, ShieldCheck, Sparkles, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FamilyCalendar from '@/components/familybridge/FamilyCalendar';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import { TUTORIALS } from '@/components/tutorials/tutorialData';
import LearningHub from '@/components/shared/LearningHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FamilyBridge() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex flex-col">
        <div className="flex justify-between items-center p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'cursive' }}>
              Family Bridge
            </h1>
            <p className="text-slate-600 text-sm">Your journey to reunification</p>
          </div>
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-slate-600 hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-12">
            <Users className="w-16 h-16 text-white" />
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'cursive' }}>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Family Bridge</span>
          </h2>

          <h3 className="text-3xl font-bold text-slate-900 mb-12">
            The #1 App for Parents Working Toward Reunification
          </h3>

          <p className="text-xl text-slate-700 mb-8 max-w-xl mx-auto leading-relaxed">
            Stay organized, never miss anything important, and show everyone how hard you're working to bring your family back together.
          </p>

          <div className="mb-8">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927455a54886e1ce03e6c89/420f3bf59_images81.jpeg" 
              alt="Family communication and understanding" 
              className="rounded-2xl shadow-xl max-w-md mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto text-left">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Easy to Use</h3>
              <p className="text-slate-600 text-sm">Simple, intuitive design for busy parents</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Private</h3>
              <p className="text-slate-600 text-sm">Your family data stays secure and encrypted</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Powered</h3>
              <p className="text-slate-600 text-sm">Smart scheduling and task recommendations</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100">
              <Calendar className="w-8 h-8 text-pink-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Family Calendar</h3>
              <p className="text-slate-600 text-sm">Coordinate schedules and never miss events</p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setHasStarted(true)}
            className="w-full max-w-md h-16 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-xl"
          >
            <span className="font-bold">Get Started</span>
          </Button>
        </motion.div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white">
      <InteractiveTutorial steps={TUTORIALS.FamilyBridge} appName="FamilyBridge" />
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
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
          <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-blue-600" />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            Family Bridge
          </h1>
          <p className="text-slate-600 text-base sm:text-lg px-4">Organize your family with AI-powered scheduling</p>
        </motion.div>

        <Tabs defaultValue="calendar">
          <TabsList className="w-full justify-start bg-transparent border-b border-slate-200 rounded-none p-0 mb-6 h-auto">
            <TabsTrigger 
              value="calendar" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3 font-bold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-bold">Family Calendar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="learn"
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-6 py-3 font-bold"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="font-bold">Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <FamilyCalendar />
          </TabsContent>

          <TabsContent value="learn">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <LearningHub appName="FamilyBridge" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}