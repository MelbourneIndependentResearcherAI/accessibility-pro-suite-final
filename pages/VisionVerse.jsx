import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowLeft, Sparkles, Video, Camera, WifiOff, Upload, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePWA } from '@/components/pwa/PWAProvider';
import { base44 } from '@/api/base44Client';
import VisionDescription from '@/components/ai/VisionDescription';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import OnboardingOverlay from '@/components/tutorials/OnboardingOverlay';
import { TUTORIALS } from '@/components/tutorials/tutorialData';
import LiveCameraScanner from '@/components/visionverse/LiveCameraScanner';
import LearningHub from '@/components/shared/LearningHub';
import CleanScanIntegration from '@/components/visionverse/CleanScanIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tutorialSteps = [
  {
    title: 'See the World Through AI',
    description: 'Upload any photo and get poetic, emotional descriptions that paint vivid mental images.',
    icon: <Eye className="w-8 h-8 text-white" />
  },
  {
    title: 'Audio Descriptions',
    description: 'Listen to scene descriptions with text-to-speech for a fully accessible experience.',
    icon: <Sparkles className="w-8 h-8 text-white" />
  },
  {
    title: 'Camera or Upload',
    description: 'Use your camera for real-time assistance or upload photos from your gallery.',
    icon: <Camera className="w-8 h-8 text-white" />
  }
];

export default function VisionVerse() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const onboardingSteps = [
    {
      id: 'vision-welcome',
      title: 'Welcome to VisionVerse AI',
      description: 'Your AI-powered visual assistant that helps you see and understand the world around you.',
      icon: <Eye className="w-6 h-6 text-white" />,
      position: 'center'
    },
    {
      id: 'vision-tabs',
      title: 'Three Ways to Use VisionVerse',
      description: 'Live Vision for real-time camera analysis, Photo Analysis to describe uploaded images, and Learning resources.',
      targetSelector: '[role="tablist"]',
      position: 'bottom',
      icon: <Camera className="w-6 h-6 text-white" />
    },
    {
      id: 'vision-upload',
      title: 'Upload a Photo',
      description: 'Tap here to upload any photo and get an AI-powered description of what\'s in the image.',
      action: 'Try uploading an image to see it in action',
      targetSelector: 'input[type="file"]',
      position: 'bottom',
      icon: <Upload className="w-6 h-6 text-white" />
    }
  ];
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { isOnline } = usePWA();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 text-white flex flex-col">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">VisionVerse</h1>
          </div>
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-white hover:bg-white/20">
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
              <Eye className="w-16 h-16" />
            </div>

            <h2 className="text-6xl font-bold mb-8 leading-tight">
              VisionVerse
            </h2>

            <p className="text-xl text-white/90 mb-4 leading-relaxed">
              See the world through words
            </p>

            <p className="text-lg text-white/80 mb-12 max-w-xl mx-auto leading-relaxed">
              AI-powered visual descriptions that transform images into beautiful, spoken poetry. Experience the visual world through rich, emotional language.
            </p>

            <div className="space-y-4 mb-8">
              <Button
                size="lg"
                className="w-full max-w-md h-16 text-lg font-bold bg-white text-purple-600 hover:bg-purple-50 rounded-2xl shadow-lg border-2 border-white"
                onClick={() => setHasStarted(true)}
              >
                <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                <span className="text-purple-600 font-bold">Get Started Free</span>
              </Button>
              
              <Button
                size="lg"
                className="w-full max-w-md h-16 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg"
                onClick={() => setHasStarted(true)}
              >
                <Video className="w-5 h-5 mr-2" />
                <span className="font-bold">Try Live Camera</span>
              </Button>
            </div>

            <div className="mt-16 grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Video className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Live Camera Mode</h3>
                <p className="text-white/80 text-sm">Real-time scene descriptions as you move your camera</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Camera className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Photo Analysis</h3>
                <p className="text-white/80 text-sm">Upload or capture photos for detailed AI descriptions</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Poetic Descriptions</h3>
                <p className="text-white/80 text-sm">Beautiful, emotional language that brings images to life</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Eye className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold mb-2">Safety Guardian Mode</h3>
                <p className="text-white/80 text-sm">Real-time hazard detection and emergency alerts</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 text-white">
      <InteractiveTutorial steps={TUTORIALS.VisionVerse} appName="VisionVerse" />
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-4 sm:mb-6 text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Hub
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 mt-4"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 px-2">VisionVerse AI</h1>
          <p className="text-white/80 px-4">Your AI-powered eyes for navigating the world</p>
          
          {!isOnline && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              Limited offline mode - Basic features available
            </div>
          )}
        </motion.div>

        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid grid-cols-3 bg-white/10 mb-6 p-1 gap-1 rounded-xl">
            <TabsTrigger value="live" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80 rounded-lg py-3">
              <Video className="w-4 h-4 mr-2" />
              <span className="font-semibold">Live Vision</span>
            </TabsTrigger>
            <TabsTrigger value="photo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80 rounded-lg py-3">
              <Camera className="w-4 h-4 mr-2" />
              <span className="font-semibold">Photo</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/80 rounded-lg py-3">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="font-semibold">Learn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <LiveCameraScanner />
          </TabsContent>

          <TabsContent value="photo">
            <div className="space-y-6">
              <CleanScanIntegration />
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <VisionDescription imageUrl={imageUrl} />

              {!imageUrl && (
                <div className="space-y-3 mt-6">
                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-14"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    <span className="font-bold">{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-14"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    <span className="font-bold">Take Photo</span>
                  </Button>
                </div>
              )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learn">
            <div className="bg-white rounded-3xl p-8 text-slate-900">
              <LearningHub appName="VisionVerse" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}