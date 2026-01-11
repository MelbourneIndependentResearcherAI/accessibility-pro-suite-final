import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { OfflineStorage } from '@/components/pwa/OfflineStorage';
import { usePWA } from '@/components/pwa/PWAProvider';

export default function OnboardingOverlay({ appName, steps, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [visible, setVisible] = useState(true);
  const { isOnline } = usePWA();

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const localProgress = OfflineStorage.getTutorialProgress(appName);
        
        if (localProgress?.is_completed || localProgress?.skipped) {
          setVisible(false);
          return;
        }

        if (isOnline) {
          try {
            const results = await base44.entities.TutorialProgress.filter({ app_name: appName });
            if (results[0]?.is_completed || results[0]?.skipped) {
              setVisible(false);
            }
          } catch (error) {
            console.error('Error checking progress:', error);
          }
        }
      } catch (error) {
        console.error('Error in checkProgress:', error);
      }
    };
    
    checkProgress();
  }, [appName, isOnline]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setCompleted(true);
    
    const progressData = {
      app_name: appName,
      is_completed: true,
      completed_steps: steps.map(s => s.id),
      progress_percentage: 100,
      completion_date: new Date().toISOString()
    };

    OfflineStorage.saveTutorialProgress(appName, progressData);

    if (isOnline) {
      try {
        const existing = await base44.entities.TutorialProgress.filter({ app_name: appName });
        if (existing[0]) {
          await base44.entities.TutorialProgress.update(existing[0].id, progressData);
        } else {
          await base44.entities.TutorialProgress.create(progressData);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }

    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1500);
  };

  const handleSkipTutorial = async () => {
    const progressData = {
      app_name: appName,
      skipped: true,
      progress_percentage: 0
    };

    OfflineStorage.saveTutorialProgress(appName, progressData);

    if (isOnline) {
      try {
        const existing = await base44.entities.TutorialProgress.filter({ app_name: appName });
        if (existing[0]) {
          await base44.entities.TutorialProgress.update(existing[0].id, progressData);
        } else {
          await base44.entities.TutorialProgress.create(progressData);
        }
      } catch (error) {
        console.error('Error saving skip:', error);
      }
    }

    setVisible(false);
    if (onSkip) onSkip();
  };

  if (!visible) return null;

  const step = steps[currentStep];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop with spotlight effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Spotlight on target element */}
        {step.targetSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute"
            style={{
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
              pointerEvents: 'none',
              ...getElementPosition(step.targetSelector)
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute pointer-events-auto"
          style={getTooltipPosition(step.position, step.targetSelector)}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-3 sm:mx-0 border border-slate-200">
            {/* Progress bar */}
            <div className="h-1 sm:h-1.5 bg-slate-200 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="p-4 sm:p-6">
              {completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-6 sm:py-8"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">You're all set!</h3>
                  <p className="text-sm sm:text-base text-slate-600">You've completed the tutorial</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {step.icon && (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          {step.icon}
                        </div>
                      )}
                      <span className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>
                    <button
                      onClick={handleSkipTutorial}
                      className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 leading-relaxed">{step.description}</p>

                  {step.action && (
                    <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-purple-100">
                      <p className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                        Try it now:
                      </p>
                      <p className="text-xs sm:text-sm text-purple-800">{step.action}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      onClick={handleSkipTutorial}
                      className="flex-1 text-sm sm:text-base"
                    >
                      Skip Tutorial
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base"
                    >
                      {currentStep < steps.length - 1 ? (
                        <>
                          Next <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Complete <Check className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getElementPosition(selector) {
  if (typeof window === 'undefined') return {};
  
  try {
    const element = document.querySelector(selector);
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    return {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: '12px'
    };
  } catch (error) {
    return {};
  }
}

function getTooltipPosition(position = 'bottom', targetSelector) {
  if (typeof window === 'undefined') {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  if (!targetSelector) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }

  try {
    const element = document.querySelector(targetSelector);
    if (!element) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    const rect = element.getBoundingClientRect();
    const padding = 20;

    switch (position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - rect.top + padding}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + padding}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          right: `${window.innerWidth - rect.left + padding}px`,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + padding}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return {
          top: `${rect.bottom + padding}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)'
        };
    }
  } catch (error) {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
}