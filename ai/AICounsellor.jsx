import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AICounsellor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there 👋\n\nI'm here to listen, support you, and chat about whatever's on your mind. No judgment, just a friendly ear.\n\nHow are you feeling today?",
      image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6927455a54886e1ce03e6c89/213c2d16d_images61.jpeg"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Simulate typing delay for more human feel
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(true);
    setIsTyping(false);

    try {
      const conversationContext = messages
        .slice(-6)
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a warm, caring friend who happens to be an AI counsellor. You're here to listen and support.

Your style:
- Talk like a supportive friend, not a therapist
- Use natural, conversational language with appropriate emojis
- Be genuinely caring and empathetic
- Ask thoughtful follow-up questions
- Validate feelings before offering advice
- Keep responses warm but concise (2-3 short paragraphs)
- Use line breaks for readability
- If someone is in crisis, acknowledge it and suggest professional resources (Lifeline 13 11 14, Beyond Blue)

Previous conversation:
${conversationContext}

User: ${userMessage}

Respond with warmth and authenticity:`
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now 😔 Can you try again in a moment?" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 hover:from-purple-600 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all relative group"
                size="icon"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-purple-400 opacity-20 group-hover:opacity-30"
                />
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 p-4 flex items-center justify-between relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-white/10"
                animate={{ 
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="flex items-center gap-3 text-white relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 fill-white drop-shadow" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Let's Talk</h3>
                  <p className="text-xs text-white/90">I'm here for you</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full relative z-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4 bg-gradient-to-b from-white to-purple-50/30">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-br-md'
                        : 'bg-white text-slate-700 border border-purple-100 rounded-bl-md'
                    }`}
                  >
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Support illustration" 
                        className="rounded-2xl mb-3 w-full"
                      />
                    )}
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {(isTyping || isLoading) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-2">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="bg-white border border-purple-100 rounded-3xl rounded-bl-md px-5 py-3 flex items-center gap-1.5 shadow-sm">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-purple-100 bg-white">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="What's on your mind?"
                    rows={1}
                    className="resize-none text-sm border-purple-200 focus:border-purple-400 rounded-2xl pr-3 min-h-[44px] max-h-32"
                    disabled={isLoading}
                  />
                </div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full flex-shrink-0 w-11 h-11 shadow-md disabled:opacity-50"
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
              <p className="text-xs text-slate-400 mt-2.5 text-center leading-relaxed">
                💜 In crisis? <span className="font-medium text-slate-600">Call 000 or Lifeline 13 11 14</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}