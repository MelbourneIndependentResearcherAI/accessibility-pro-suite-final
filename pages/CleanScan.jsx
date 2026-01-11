import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, CheckCircle, Sparkles, Eye, Home, TrendingUp, Trophy, DollarSign, Menu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import OnboardingOverlay from '@/components/tutorials/OnboardingOverlay';
import ShareButton from '@/components/shared/ShareButton';

export default function CleanScan() {
  const [currentView, setCurrentView] = useState('home');
  const [roomType, setRoomType] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fileInputRef = useRef(null);

  const onboardingSteps = [
    {
      id: 'clean-welcome',
      title: 'Welcome to CleanScan Pro',
      description: 'Transform any room into a clean space with AI-powered cleaning plans.',
      icon: <Sparkles className="w-6 h-6 text-white" />,
      position: 'center'
    },
    {
      id: 'clean-roomtype',
      title: 'Select Room Type',
      description: 'First, choose what type of room you\'re scanning. This helps the AI provide more accurate recommendations.',
      action: 'Select a room type from the dropdown',
      targetSelector: '[data-room-selector]',
      position: 'bottom',
      icon: <Camera className="w-6 h-6 text-white" />
    },
    {
      id: 'clean-upload',
      title: 'Upload a Photo',
      description: 'Take or upload a photo of your room. The AI will analyze it and create a personalized cleaning plan.',
      action: 'Click "Choose File" to upload a room photo',
      targetSelector: '[data-upload-area]',
      position: 'top',
      icon: <Upload className="w-6 h-6 text-white" />
    },
    {
      id: 'clean-analyze',
      title: 'Get Your Cleaning Plan',
      description: 'Once uploaded, click "Analyze Room" to receive your AI-powered cleaning plan with tasks and time estimates.',
      targetSelector: '[data-analyze-button]',
      position: 'top',
      icon: <Sparkles className="w-6 h-6 text-white" />
    }
  ];

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (currentView === 'scanner') {
      setShowOnboarding(true);
    }
  }, [currentView]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAnalyzeRoom = async () => {
    if (!uploadedFile || !roomType) return;
    
    setIsAnalyzing(true);
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file: uploadedFile });
      
      // Analyze with AI
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this ${roomType} photo and provide a detailed cleaning plan.
        
Identify:
1. Current cleanliness level (1-10)
2. Areas that need attention
3. Recommended cleaning tasks (prioritized)
4. Estimated time to complete
5. Difficulty level (Easy/Medium/Hard)
6. Pro tips for maintaining cleanliness`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            cleanliness_score: { type: "number" },
            areas_needing_attention: { type: "array", items: { type: "string" } },
            cleaning_tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  task: { type: "string" },
                  priority: { type: "string" },
                  estimated_minutes: { type: "number" }
                }
              }
            },
            estimated_total_time: { type: "string" },
            difficulty: { type: "string" },
            pro_tips: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <button 
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${currentView === 'home' ? 'text-white' : 'text-white/60'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button 
          onClick={() => setCurrentView('scanner')}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-full ${
            currentView === 'scanner' ? 'bg-white text-blue-600' : 'text-white/60'
          }`}
        >
          <Camera className="w-6 h-6" />
          <span className="text-xs font-bold">Scanner</span>
        </button>
        <button 
          onClick={() => setCurrentView('progress')}
          className={`flex flex-col items-center gap-1 px-4 py-2 ${currentView === 'progress' ? 'text-white' : 'text-white/60'}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs font-medium">Progress</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-4 py-2 text-white/60">
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-medium">Achievements</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-4 py-2 text-white/60">
          <DollarSign className="w-5 h-5" />
          <span className="text-xs font-medium">Pricing</span>
        </button>
      </div>
    </div>
  );

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">CleanScan Pro</h1>
          </div>
          <button className="text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-8 space-y-6">
          {/* Welcome Message */}
          <div>
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
            </h2>
            <p className="text-slate-600 text-lg">
              Ready to transform another space? Let's get cleaning.
            </p>
          </div>

          {/* Start New Scan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-6 text-white shadow-xl"
          >
            <h3 className="text-2xl font-bold mb-3">Start a New Scan</h3>
            <p className="text-white/90 mb-6 text-base">
              Upload a photo to get your next AI-powered cleaning plan.
            </p>
            <button
              onClick={() => setCurrentView('scanner')}
              className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-md"
            >
              <Camera className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-bold">Scan a Room</span>
            </button>
          </motion.div>

          {/* Secondary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border-2 border-blue-100 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Scan a room</h3>
            <p className="text-slate-600">...to get smart insights here!</p>
          </motion.div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {showOnboarding && currentView === 'scanner' && (
        <OnboardingOverlay
          appName="CleanScan"
          steps={onboardingSteps}
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}
      
      {/* Header */}
      <div className="bg-white border-b px-6 py-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Room Scanner</h1>
        <p className="text-slate-600 text-center mt-2">
          Upload a photo of your room and get an AI-powered cleaning plan.
        </p>
        <div className="mt-4 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-200 rounded-full px-4 py-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-semibold text-sm">Unlimited Scans</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-2xl mx-auto">
        {/* Upload Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Upload Room Photo</h2>
          </div>

          {/* Room Type Selector */}
          <div className="mb-6" data-room-selector>
            <label className="block text-sm font-bold text-slate-900 mb-2">Room Type</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="w-full h-12 bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="living_room">Living Room</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="dining_room">Dining Room</SelectItem>
                <SelectItem value="garage">Garage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-blue-50/30" data-upload-area>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {uploadedFile ? uploadedFile.name : 'Upload a room photo'}
            </h3>
            <p className="text-slate-500 text-sm mb-4">JPG, PNG up to 10MB</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-bold">Choose File</span>
            </button>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyzeRoom}
            disabled={!uploadedFile || !roomType || isAnalyzing}
            data-analyze-button
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Room
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Analysis Results</h2>
          </div>

          {!analysisResult ? (
            <div className="text-center py-12">
              <Camera className="w-20 h-20 text-blue-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                Upload a room photo to see AI analysis results
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Cleanliness Score */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white">
                <p className="text-white/80 text-sm font-semibold mb-2">Cleanliness Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">{analysisResult.cleanliness_score}</span>
                  <span className="text-2xl text-white/80 mb-2">/10</span>
                </div>
                <p className="text-white/90 text-sm mt-2">Difficulty: {analysisResult.difficulty}</p>
                <p className="text-white/90 text-sm">Time needed: {analysisResult.estimated_total_time}</p>
              </div>

              {/* Areas Needing Attention */}
              {analysisResult.areas_needing_attention?.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Areas Needing Attention</h3>
                  <div className="space-y-2">
                    {analysisResult.areas_needing_attention.map((area, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cleaning Tasks */}
              {analysisResult.cleaning_tasks?.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Recommended Cleaning Tasks</h3>
                  <div className="space-y-3">
                    {analysisResult.cleaning_tasks.map((task, i) => (
                      <div key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-slate-900">{task.task}</p>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">⏱️ ~{task.estimated_minutes} minutes</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pro Tips */}
              {analysisResult.pro_tips?.length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.pro_tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-purple-900">
                        <span className="text-purple-600">💡</span>
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cross-App Sharing */}
              {uploadedFile && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-4 border border-blue-100">
                    <p className="text-sm text-slate-700 mb-3">
                      Get detailed visual descriptions of objects in this room
                    </p>
                    <ShareButton
                      sourceApp="CleanScan"
                      dataType="roomAnalysis"
                      data={{
                        roomType,
                        cleanlinessScore: analysisResult.cleanliness_score,
                        imageUrl: uploadedFile
                      }}
                      targetApp="VisionVerse"
                      label="Share to VisionVerse"
                    />
                  </div>
                  
                  {analysisResult.cleaning_tasks?.length > 0 && (
                    <div className="bg-white rounded-2xl p-4 border border-purple-100">
                      <p className="text-sm text-slate-700 mb-3">
                        Translate cleaning tasks to sign language
                      </p>
                      <ShareButton
                        sourceApp="CleanScan"
                        dataType="roomAnalysis"
                        data={{
                          roomType,
                          tasks: analysisResult.cleaning_tasks,
                          cleanlinessScore: analysisResult.cleanliness_score
                        }}
                        targetApp="SignBridge"
                        label="Share to SignBridge"
                      />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-slate-500 text-sm">
        © 2025 CleanScan Pro. All Rights Reserved.
      </div>

      <BottomNav />
    </div>
  );
}