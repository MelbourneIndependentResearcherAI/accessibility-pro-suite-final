import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sparkles, Volume2, Image as ImageIcon, Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AIService } from './AIService';
import { base44 } from '@/api/base44Client';

export default function VisionDescription({ imageUrl, onSpeak }) {
  const [description, setDescription] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShareToFamily = async () => {
    if (!description) return;
    
    setIsSharing(true);
    try {
      const user = await base44.auth.me();
      await base44.entities.FamilyStatus.create({
        user_name: user.full_name || 'Family Member',
        status_text: description.poetic_description,
        image_url: imageUrl,
        mood_tag: description.emotional_tone,
        source: 'vision_verse'
      });
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (error) {
      console.error('Error sharing status:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await AIService.describeSceneWithEmotion(imageUrl);
      setDescription(result);
    } catch (error) {
      console.error('Error describing scene:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = (text) => {
    if (onSpeak) {
      onSpeak(text);
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-purple-900/50 rounded-2xl overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Scene" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-24 h-24 text-white/40" />
          </div>
        )}
      </div>

      {!description && !isAnalyzing && (
        <Button
          size="lg"
          onClick={handleAnalyze}
          className="w-full bg-white text-purple-600 hover:bg-slate-100"
          disabled={!imageUrl}
        >
          <Eye className="w-5 h-5 mr-2" />
          Describe Scene
        </Button>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-white animate-pulse mx-auto mb-4" />
          <p className="text-white text-lg">Analyzing scene with AI...</p>
        </div>
      )}

      {description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Poetic Description */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Scene Description
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShareToFamily}
                    className={`text-white hover:bg-white/20 ${shareSuccess ? 'bg-green-500/50' : ''}`}
                    disabled={isSharing}
                  >
                    {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSpeak(description.poetic_description)}
                    className="text-white hover:bg-white/20"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 text-lg leading-relaxed italic">
                "{description.poetic_description}"
              </p>
            </CardContent>
          </Card>

          {/* Emotional Tone */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm mb-1">Emotional Tone</p>
            <p className="text-white font-medium text-lg">{description.emotional_tone}</p>
          </div>

          {/* Atmosphere */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm mb-1">Atmosphere</p>
            <p className="text-white">{description.atmosphere}</p>
          </div>

          {/* Key Elements */}
          {description.key_elements && description.key_elements.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-3">Key Elements</p>
              <div className="flex flex-wrap gap-2">
                {description.key_elements.map((element, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/20 rounded-full text-white text-sm"
                  >
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Audio Cues */}
          {description.suggested_audio_cues && description.suggested_audio_cues.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-3">Audio Navigation Cues</p>
              <div className="space-y-2">
                {description.suggested_audio_cues.map((cue, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <p className="text-white/90 text-sm">{cue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleAnalyze}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            Analyze Another Scene
          </Button>
        </motion.div>
      )}
    </div>
  );
}