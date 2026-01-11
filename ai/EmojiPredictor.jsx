import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AIService } from './AIService';

export default function EmojiPredictor({ context, onSelect, recentlyUsed = [] }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (context && context.length > 3) {
      loadSuggestions();
    }
  }, [context]);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const result = await AIService.predictEmoji(context, recentlyUsed);
      setSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('Error predicting emoji:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-white" />
        <p className="text-white text-sm font-medium">AI Suggestions</p>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {suggestions.slice(0, 8).map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(suggestion.emoji, suggestion.phrase)}
            className="flex flex-col items-center gap-1 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors group"
          >
            <span className="text-3xl leading-none" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{suggestion.emoji}</span>
            <span className="text-xs text-white/80 text-center line-clamp-2 group-hover:text-white">
              {suggestion.phrase}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}