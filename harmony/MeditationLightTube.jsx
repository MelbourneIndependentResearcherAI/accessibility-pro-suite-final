import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MEDITATION_TRACKS = [
  { id: 'deep-meditation', name: 'Deep Meditation', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3', emoji: '🧘' },
  { id: 'ocean-waves', name: 'Ocean Waves', url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_1d0e51fc5d.mp3', emoji: '🌊' },
  { id: 'rain-forest', name: 'Rain Forest', url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', emoji: '🌧️' },
  { id: 'birds-chirping', name: 'Birds Chirping', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c610232532.mp3', emoji: '🐦' },
  { id: 'thunder-storm', name: 'Thunder Storm', url: 'https://cdn.pixabay.com/audio/2021/11/07/audio_4661fe1c68.mp3', emoji: '⛈️' },
  { id: 'zen-garden', name: 'Zen Garden', url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_df8feb5bdc.mp3', emoji: '🎋' },
  { id: 'peaceful-garden', name: 'Peaceful Garden', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c610232532.mp3', emoji: '🌸' },
  { id: 'mountain-breeze', name: 'Mountain Breeze', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_eefbb28ba5.mp3', emoji: '🏔️' },
  { id: 'waterfall', name: 'Waterfall', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_2d6c07c895.mp3', emoji: '💧' },
  { id: 'wind-chimes', name: 'Wind Chimes', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_d1718ab41b.mp3', emoji: '🎐' },
  { id: 'forest-ambience', name: 'Forest Ambience', url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_c610232532.mp3', emoji: '🌲' },
  { id: 'night-crickets', name: 'Night Crickets', url: 'https://cdn.pixabay.com/audio/2021/08/09/audio_077dfe6b35.mp3', emoji: '🦗' }
];

export default function MeditationLightTube() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [currentTrack, setCurrentTrack] = useState(MEDITATION_TRACKS[0].id);
  const audioRef = useRef(null);

  useEffect(() => {
    const track = MEDITATION_TRACKS.find(t => t.id === currentTrack);
    if (!track) return;

    // Create or update audio element
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(track.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume / 100;
    audioRef.current.preload = 'auto';
    
    if (isPlaying && !isMuted) {
      audioRef.current.play().catch(err => {
        console.log('Audio autoplay prevented, waiting for user interaction');
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Audio play prevented, user interaction may be needed');
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-purple-900 via-pink-900 to-rose-900 rounded-3xl overflow-hidden">
      {/* Animated Light Tube */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative w-32 h-full"
          animate={{
            opacity: isPlaying ? [0.3, 0.7, 0.3] : 0.3,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Main tube */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 rounded-full blur-xl"
            animate={isPlaying ? {
              background: [
                'linear-gradient(to bottom, #22d3ee, #a78bfa, #f472b6)',
                'linear-gradient(to bottom, #a78bfa, #f472b6, #22d3ee)',
                'linear-gradient(to bottom, #f472b6, #22d3ee, #a78bfa)',
                'linear-gradient(to bottom, #22d3ee, #a78bfa, #f472b6)',
              ]
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner glow */}
          <motion.div
            className="absolute inset-8 bg-white rounded-full blur-2xl"
            animate={isPlaying ? {
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Floating particles */}
        {isPlaying && [0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{
              x: Math.random() * 300 - 150,
              y: 400,
              opacity: 0
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
              x: Math.random() * 300 - 150
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-4 px-6">
        <motion.div 
          className="text-white text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-lg font-semibold mb-1">Breathe In... Breathe Out...</p>
          <p className="text-sm text-white/70">Find your inner peace</p>
        </motion.div>

        {/* Track Selector */}
        <Select value={currentTrack} onValueChange={setCurrentTrack}>
          <SelectTrigger className="w-64 bg-white/10 backdrop-blur-md border-white/20 text-white">
            <Music className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEDITATION_TRACKS.map(track => (
              <SelectItem key={track.id} value={track.id}>
                {track.emoji} {track.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsPlaying(!isPlaying);
              // Force play on user interaction to overcome autoplay restrictions
              if (!isPlaying && audioRef.current && !isMuted) {
                audioRef.current.play().catch(err => console.log('Play error:', err));
              }
            }}
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>

          {!isMuted && (
            <div className="flex items-center gap-2 w-24">
              <Slider
                value={[volume]}
                onValueChange={(val) => setVolume(val[0])}
                max={100}
                step={1}
                className="cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}