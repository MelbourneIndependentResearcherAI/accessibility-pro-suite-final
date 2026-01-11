import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, User, Sparkles, Volume2, StopCircle, RotateCcw, Wand2, Save, BookMarked, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const SCENARIO_CATEGORIES = [
  { value: 'work', label: 'Work & Career', icon: '💼' },
  { value: 'casual', label: 'Casual Social', icon: '☕' },
  { value: 'formal', label: 'Formal Events', icon: '🎩' },
  { value: 'dating', label: 'Dating & Romance', icon: '💕' },
  { value: 'family', label: 'Family Relations', icon: '👨‍👩‍👧' },
  { value: 'conflict', label: 'Difficult Conversations', icon: '⚡' },
  { value: 'phone_call', label: 'Phone Calls', icon: '📞' },
  { value: 'public', label: 'Public Speaking', icon: '🎤' }
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy - Light conversation' },
  { value: 'moderate', label: 'Moderate - Some challenge' },
  { value: 'challenging', label: 'Challenging - Complex situation' }
];

const PERSONALITIES = [
  { value: 'friendly', label: 'Friendly & Supportive', emoji: '😊', description: 'Warm, understanding, and encouraging' },
  { value: 'neutral', label: 'Neutral & Professional', emoji: '😐', description: 'Polite but reserved' },
  { value: 'impatient', label: 'Impatient & Rushed', emoji: '😤', description: 'Hurried and easily annoyed' },
  { value: 'defensive', label: 'Defensive & Sensitive', emoji: '😠', description: 'Takes things personally' },
  { value: 'aggressive', label: 'Aggressive & Hostile', emoji: '😡', description: 'Confrontational and difficult' },
  { value: 'short_tempered', label: 'Short-Tempered', emoji: '🤬', description: 'Quick to anger, volatile' }
];

export default function RoleplayPartner() {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your roleplay partner. Choose a scenario to practice, generate a custom one, or load a saved scenario." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState(null);
  const [scenarioDetails, setScenarioDetails] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [generatorParams, setGeneratorParams] = useState({
    category: 'casual',
    difficulty: 'moderate',
    personality: 'neutral',
    customPrompt: ''
  });
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [showRealWorld, setShowRealWorld] = useState(false);
  const [realWorldInput, setRealWorldInput] = useState({
    situation: '',
    when: '',
    challenges: '',
    desiredOutcome: ''
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionFeedback, setSessionFeedback] = useState([]);
  const scrollRef = useRef(null);

  const { data: savedScenarios = [] } = useQuery({
    queryKey: ['socialScripts'],
    queryFn: () => base44.entities.SocialScript.list('-created_date', 50)
  });

  const saveScenarioMutation = useMutation({
    mutationFn: (data) => base44.entities.SocialScript.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['socialScripts']);
      setSaveDialogOpen(false);
      setScenarioTitle('');
    }
  });

  const createSessionMutation = useMutation({
    mutationFn: (data) => base44.entities.SocialPracticeSession.create(data),
    onSuccess: (data) => {
      setCurrentSessionId(data.id);
      queryClient.invalidateQueries(['socialPracticeSessions']);
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SocialPracticeSession.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['socialPracticeSessions']);
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // If scenarios isn't set, the first input sets the scenario
      let prompt = "";
      const personalityInstruction = scenarioDetails?.personality 
        ? `IMPORTANT: You must stay in character with a ${PERSONALITIES.find(p => p.value === scenarioDetails.personality)?.label} personality: ${PERSONALITIES.find(p => p.value === scenarioDetails.personality)?.description}. Respond accordingly.`
        : '';
      
      if (!scenario) {
        setScenario(input);
        prompt = `The user wants to roleplay the following scenario: "${input}". 
        Act as the other person in this scenario. Be realistic but helpful. 
        Start the roleplay by setting the scene briefly and then saying your first line as the character.
        Keep responses concise (max 2-3 sentences) to allow for back-and-forth dialogue.`;
      } else {
        prompt = `Continue the roleplay scenario: "${scenario}". 
        ${personalityInstruction}
        You are the other person. Respond naturally to the user's last message: "${input}".
        Keep responses concise (max 2-3 sentences).`;
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
            type: "object",
            properties: {
                response: { type: "string" },
                feedback: { type: "string", description: "Brief feedback on the user's social skills in this turn (optional)" }
            }
        }
      });

      const newMessage = { 
        role: 'assistant', 
        content: response.response,
        feedback: response.feedback 
      };
      setMessages(prev => [...prev, newMessage]);

      // Track feedback
      if (response.feedback && currentSessionId) {
        const newFeedback = [...sessionFeedback, { feedback: response.feedback, timestamp: new Date().toISOString() }];
        setSessionFeedback(newFeedback);
      }

      // Update session message count
      if (currentSessionId) {
        const messageCount = messages.filter(m => m.role === 'user').length + 1;
        updateSessionMutation.mutate({
          id: currentSessionId,
          data: { message_count: messageCount, feedback_received: sessionFeedback }
        });
      }
    } catch (error) {
      console.error("Roleplay error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Let's try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = (rating, notes = '') => {
    if (!currentSessionId || !sessionStartTime) return;

    const durationMinutes = Math.round((new Date() - sessionStartTime) / 60000);
    updateSessionMutation.mutate({
      id: currentSessionId,
      data: {
        completed: true,
        duration_minutes: durationMinutes,
        self_rating: rating,
        notes: notes,
        feedback_received: sessionFeedback
      }
    });
  };

  const generateScenario = async () => {
    setIsLoading(true);
    try {
      const personalityData = PERSONALITIES.find(p => p.value === generatorParams.personality);
      const prompt = `Generate a ${generatorParams.difficulty} difficulty ${SCENARIO_CATEGORIES.find(c => c.value === generatorParams.category)?.label} roleplay scenario.
      ${generatorParams.customPrompt ? `Additional context: ${generatorParams.customPrompt}` : ''}
      
      The character should have a ${personalityData.label} personality: ${personalityData.description}.
      
      Provide a complete scenario with setting, character details, and conversational goals.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Short scenario title" },
            description: { type: "string", description: "Detailed scenario description" },
            character_role: { type: "string", description: "Who the AI will play" },
            user_goal: { type: "string", description: "What the user should try to achieve" },
            opening_line: { type: "string", description: "AI's first line to start the scenario" }
          }
        }
      });

      setScenarioDetails({...result, personality: generatorParams.personality});
      setScenario(result.title);
      setMessages([{ 
        role: 'assistant', 
        content: `**${result.title}**\n\n${result.description}\n\n*I'll be playing: ${result.character_role} (${personalityData.emoji} ${personalityData.label})*\n*Your goal: ${result.user_goal}*\n\n---\n\n${result.opening_line}`
      }]);
      setShowGenerator(false);
      startSession(result.title, 'generated');
    } catch (error) {
      console.error("Scenario generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRealWorldScenario = async () => {
    setIsLoading(true);
    try {
      const personalityData = PERSONALITIES.find(p => p.value === generatorParams.personality);
      const prompt = `Create a detailed roleplay scenario based on this real-world situation:

Situation: ${realWorldInput.situation}
When: ${realWorldInput.when}
Challenges: ${realWorldInput.challenges}
Desired outcome: ${realWorldInput.desiredOutcome}

The character should have a ${personalityData.label} personality: ${personalityData.description}.

Generate a realistic scenario that helps the user practice for this specific situation, including dialogue context and helpful coaching points.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            character_role: { type: "string" },
            user_goal: { type: "string" },
            opening_line: { type: "string" },
            specific_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setScenarioDetails({...result, personality: generatorParams.personality, isRealWorld: true});
      setScenario(result.title);
      const tipsText = result.specific_tips?.length > 0 ? `\n\n**Tips for this situation:**\n${result.specific_tips.map(t => `• ${t}`).join('\n')}` : '';
      setMessages([{ 
        role: 'assistant', 
        content: `**${result.title}**\n\n${result.description}\n\n*I'll be playing: ${result.character_role} (${personalityData.emoji} ${personalityData.label})*\n*Your goal: ${result.user_goal}*${tipsText}\n\n---\n\n${result.opening_line}`
      }]);
      setShowRealWorld(false);
      setRealWorldInput({ situation: '', when: '', challenges: '', desiredOutcome: '' });
      startSession(result.title, 'real_world');
    } catch (error) {
      console.error("Real-world scenario error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = (title, type) => {
    setSessionStartTime(new Date());
    setSessionFeedback([]);
    createSessionMutation.mutate({
      scenario_title: title,
      scenario_type: type,
      category: generatorParams.category,
      difficulty: generatorParams.difficulty,
      personality_practiced: generatorParams.personality,
      message_count: 0,
      duration_minutes: 0,
      feedback_received: [],
      completed: false
    });
  };

  const loadScenario = async (script) => {
    setScenario(script.situation);
    setScenarioDetails({
      title: script.situation,
      description: script.scenario_description,
      tips: script.tips
    });
    
    const openingLine = script.conversation_starters?.[0] || "Let's begin this scenario.";
    setMessages([{ 
      role: 'assistant', 
      content: `**${script.situation}**\n\n${script.scenario_description}\n\n---\n\n${openingLine}`
    }]);
    setShowSaved(false);
  };

  const saveCurrentScenario = () => {
    if (!scenarioDetails || !scenarioTitle.trim()) return;

    saveScenarioMutation.mutate({
      situation: scenarioTitle,
      scenario_description: scenarioDetails.description || scenario,
      category: generatorParams.category,
      difficulty_level: generatorParams.difficulty,
      conversation_starters: scenarioDetails.opening_line ? [scenarioDetails.opening_line] : [],
      tips: [],
      exit_strategies: []
    });
  };

  const resetRoleplay = () => {
    // Prompt for session rating if session was active
    if (currentSessionId && messages.filter(m => m.role === 'user').length > 2) {
      const rating = window.prompt('Rate this session (1-5):');
      if (rating && !isNaN(rating)) {
        endSession(parseInt(rating));
      }
    }

    setMessages([{ role: 'assistant', content: "Hi! I'm your roleplay partner. Choose a scenario to practice, generate a custom one, or load a saved scenario." }]);
    setScenario(null);
    setScenarioDetails(null);
    setShowGenerator(false);
    setShowSaved(false);
    setShowRealWorld(false);
    setCurrentSessionId(null);
    setSessionStartTime(null);
    setSessionFeedback([]);
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-3 sm:p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-indigo-900 text-sm sm:text-base truncate">AI Roleplay Partner</h3>
            <p className="text-xs text-indigo-600 hidden sm:block">Practice social scenarios in a safe space</p>
          </div>
        </div>
        <div className="flex gap-2">
          {scenario && scenarioDetails && (
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-100">
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Scenario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Scenario name..."
                    value={scenarioTitle}
                    onChange={(e) => setScenarioTitle(e.target.value)}
                  />
                  <Button 
                    onClick={saveCurrentScenario} 
                    disabled={!scenarioTitle.trim() || saveScenarioMutation.isPending}
                    className="w-full"
                  >
                    {saveScenarioMutation.isPending ? 'Saving...' : 'Save Scenario'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="ghost" size="sm" onClick={resetRoleplay} className="text-indigo-600 hover:bg-indigo-100 flex-shrink-0">
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
            <span className="hidden sm:inline text-xs">Reset</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollRef}>
        {!scenario && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                onClick={() => setShowGenerator(!showGenerator)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Scenario
              </Button>
              <Button
                onClick={() => setShowSaved(!showSaved)}
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <BookMarked className="w-4 h-4 mr-2" />
                Saved ({savedScenarios.length})
              </Button>
              <Button
                onClick={() => setShowRealWorld(!showRealWorld)}
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Real-World
              </Button>
            </div>

            <AnimatePresence>
              {showGenerator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-50 rounded-lg p-3 sm:p-4 space-y-3"
                >
                  <div>
                    <label className="text-xs font-medium text-indigo-900 mb-1 block">Category</label>
                    <Select value={generatorParams.category} onValueChange={(val) => setGeneratorParams({...generatorParams, category: val})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCENARIO_CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-indigo-900 mb-1 block">Difficulty</label>
                    <Select value={generatorParams.difficulty} onValueChange={(val) => setGeneratorParams({...generatorParams, difficulty: val})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-indigo-900 mb-1 block">Character Personality</label>
                    <Select value={generatorParams.personality} onValueChange={(val) => setGeneratorParams({...generatorParams, personality: val})}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONALITIES.map(personality => (
                          <SelectItem key={personality.value} value={personality.value}>
                            {personality.emoji} {personality.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      {PERSONALITIES.find(p => p.value === generatorParams.personality)?.description}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-indigo-900 mb-1 block">Custom Details (optional)</label>
                    <Input
                      placeholder="e.g., 'first time meeting partner's parents' or 'asking boss for time off'"
                      value={generatorParams.customPrompt}
                      onChange={(e) => setGeneratorParams({...generatorParams, customPrompt: e.target.value})}
                      className="bg-white"
                    />
                  </div>
                  <Button
                    onClick={generateScenario}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? 'Generating...' : 'Generate Scenario'}
                  </Button>
                </motion.div>
              )}

              {showRealWorld && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 rounded-lg p-3 sm:p-4 space-y-3"
                >
                  <h3 className="font-semibold text-green-900 text-sm">Tell me about your situation</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-green-900 mb-1 block">What's the situation?</label>
                      <Input
                        placeholder="e.g., Meeting my partner's parents for the first time"
                        value={realWorldInput.situation}
                        onChange={(e) => setRealWorldInput({...realWorldInput, situation: e.target.value})}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-green-900 mb-1 block">When is it happening?</label>
                      <Input
                        placeholder="e.g., This weekend at their house"
                        value={realWorldInput.when}
                        onChange={(e) => setRealWorldInput({...realWorldInput, when: e.target.value})}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-green-900 mb-1 block">What challenges do you anticipate?</label>
                      <Input
                        placeholder="e.g., I'm nervous about making a good impression"
                        value={realWorldInput.challenges}
                        onChange={(e) => setRealWorldInput({...realWorldInput, challenges: e.target.value})}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-green-900 mb-1 block">What's your desired outcome?</label>
                      <Input
                        placeholder="e.g., Build rapport and feel comfortable"
                        value={realWorldInput.desiredOutcome}
                        onChange={(e) => setRealWorldInput({...realWorldInput, desiredOutcome: e.target.value})}
                        className="bg-white"
                      />
                    </div>
                    <div className="pt-2">
                      <label className="text-xs font-medium text-green-900 mb-1 block">Character Personality</label>
                      <Select value={generatorParams.personality} onValueChange={(val) => setGeneratorParams({...generatorParams, personality: val})}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PERSONALITIES.map(personality => (
                            <SelectItem key={personality.value} value={personality.value}>
                              {personality.emoji} {personality.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={generateRealWorldScenario}
                      disabled={isLoading || !realWorldInput.situation.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? 'Creating...' : 'Create Practice Scenario'}
                    </Button>
                  </div>
                </motion.div>
              )}

              {showSaved && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-indigo-50 rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto"
                >
                  {savedScenarios.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No saved scenarios yet</p>
                  ) : (
                    savedScenarios.map(script => (
                      <button
                        key={script.id}
                        onClick={() => loadScenario(script)}
                        className="w-full text-left p-3 bg-white rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate">{script.situation}</p>
                            <p className="text-xs text-slate-500 line-clamp-2">{script.scenario_description}</p>
                            <div className="flex gap-2 mt-1">
                              {script.category && (
                                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                  {SCENARIO_CATEGORIES.find(c => c.value === script.category)?.icon || '📝'}
                                </span>
                              )}
                              {script.difficulty_level && (
                                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                                  {script.difficulty_level}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-indigo-600 transform -rotate-90" />
                        </div>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div className="space-y-3 sm:space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.feedback && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500 italic">
                        <span className="font-semibold text-indigo-600 not-italic">Coach Tip: </span>
                        {msg.feedback}
                    </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}