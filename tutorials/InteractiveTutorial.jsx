import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usePWA } from '@/components/pwa/PWAProvider';
import { OfflineStorage } from '@/components/pwa/OfflineStorage';

export default function InteractiveTutorial({ appName, steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(null);
  const queryClient = useQueryClient();
  const { isOnline } = usePWA();

  // Load tutorial progress (offline-first)
  useEffect(() => {
    const loadProgress = async () => {
      // Try local storage first
      const localProgress = OfflineStorage.getTutorialProgress(appName);
      if (localProgress) {
        setProgress(localProgress);
      }

      // Sync with server if online
      if (isOnline) {
        try {
          const results = await base44.entities.TutorialProgress.filter({ app_name: appName });
          if (results[0]) {
            setProgress(results[0]);
            OfflineStorage.saveTutorialProgress(appName, results[0]);
          }
        } catch (error) {
          console.error('Error loading tutorial progress:', error);
        }
      }
    };
    
    loadProgress();
  }, [appName, isOnline]);

  const saveProgress = async (data) => {
    const updatedProgress = { ...progress, ...data, app_name: appName };
    
    // Save locally immediately
    setProgress(updatedProgress);
    OfflineStorage.saveTutorialProgress(appName, updatedProgress);

    // Sync with server if online
    if (isOnline) {
      try {
        if (progress?.id) {
          await base44.entities.TutorialProgress.update(progress.id, data);
        } else {
          const created = await base44.entities.TutorialProgress.create({ app_name: appName, ...data });
          setProgress(created);
          OfflineStorage.saveTutorialProgress(appName, created);
        }
      } catch (error) {
        console.error('Error saving tutorial progress:', error);
        // Still works offline
      }
    }
  };

  useEffect(() => {
    if (progress) {
      if (progress.is_completed || progress.skipped) {
        setShow(false);
      } else if (progress.last_step) {
        const stepIndex = steps.findIndex(s => s.id === progress.last_step);
        if (stepIndex >= 0) {
          setCurrentStep(stepIndex);
        }
        setShow(true);
      }
    } else {
      setShow(true);
    }
  }, [progress, steps]);

  const handleNext = async () => {
    const step = steps[currentStep];
    const completedSteps = [...(progress?.completed_steps || []), step.id];
    const progressPercentage = Math.round((completedSteps.length / steps.length) * 100);

    await saveProgress({
      completed_steps: completedSteps,
      last_step: step.id,
      progress_percentage: progressPercentage,
    });

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    await saveProgress({
      is_completed: true,
      completion_date: new Date().toISOString(),
      progress_percentage: 100,
      completed_steps: steps.map(s => s.id),
    });
    setShow(false);
    if (onComplete) onComplete();
  };

  const handleSkip = async () => {
    await saveProgress({
      skipped: true,
      progress_percentage: 0,
    });
    setShow(false);
  };

  if (!show) return null;

  const step = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-auto"
        >
          {/* Progress Bar */}
          <div className="h-2 bg-slate-200">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex gap-1 sm:gap-2">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        i === currentStep
                          ? 'w-6 sm:w-8 bg-purple-600'
                          : i < currentStep
                          ? 'w-1.5 sm:w-2 bg-purple-400'
                          : 'w-1.5 sm:w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-slate-500">
                  {currentStep + 1} of {steps.length}
                </span>
                {!isOnline && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <WifiOff className="w-3 h-3" />
                    <span className="hidden sm:inline">Offline</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                {step.icon || <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 text-white" />}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">{step.title}</h2>
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed mb-3 sm:mb-4">{step.description}</p>
              
              {step.tips && step.tips.length > 0 && (
                <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
                  <p className="text-xs sm:text-sm font-semibold text-purple-900 mb-2">💡 Pro Tips:</p>
                  <ul className="space-y-1">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="text-xs sm:text-sm text-purple-800">• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {step.interactive && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                  <p className="text-xs sm:text-sm text-blue-900">{step.interactive}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-24 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 text-sm sm:text-base font-semibold text-slate-700"
              >
                <span className="font-semibold">Skip Tutorial</span>
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base"
                style={{ color: 'white' }}
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    <span className="font-semibold" style={{ color: 'white' }}>Next</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 inline" style={{ color: 'white' }} />
                  </>
                ) : (
                  <>
                    <span className="font-semibold" style={{ color: 'white' }}>Complete</span>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 ml-2 inline" style={{ color: 'white' }} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}