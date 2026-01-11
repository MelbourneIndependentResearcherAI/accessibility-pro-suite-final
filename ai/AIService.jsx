import { base44 } from '@/api/base44Client';

export const AIService = {
  // MoodSense: Analyze mood trends and generate coping strategies
  analyzeMoodTrends: async (moodEntries) => {
    try {
      const prompt = `Analyze these mood entries and provide personalized insights and coping strategies:

${JSON.stringify(moodEntries, null, 2)}

Please provide:
1. Overall mood trend analysis
2. Identified patterns or triggers
3. 3-5 personalized coping strategies based on the patterns
4. Positive observations and encouragement
5. When to seek professional help (if applicable)

Be empathetic, supportive, and actionable.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            trend_analysis: { type: "string" },
            patterns: { type: "array", items: { type: "string" } },
            coping_strategies: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  when_to_use: { type: "string" }
                }
              }
            },
            positive_observations: { type: "string" },
            professional_help_needed: { type: "boolean" },
            encouragement: { type: "string" }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error analyzing mood trends:', error);
      throw error;
    }
  },

  // VisionVerse: Describe scene with emotional context
  describeSceneWithEmotion: async (imageUrl) => {
    try {
      const prompt = `Describe this image in rich, emotional, poetic language. Go beyond just objects - capture the mood, feeling, atmosphere, and emotional essence of the scene. Make it beautiful and evocative, like spoken poetry.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [imageUrl],
        response_json_schema: {
          type: "object",
          properties: {
            poetic_description: { type: "string" },
            emotional_tone: { type: "string" },
            key_elements: { type: "array", items: { type: "string" } },
            atmosphere: { type: "string" },
            suggested_audio_cues: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error describing scene:', error);
      throw error;
    }
  },

  // SignBridge: Generate common phrase translations
  generateSignPhrases: async (category, language = 'ASL') => {
    try {
      const prompt = `Generate 10 common ${category} phrases for ${language} sign language. For each phrase, provide:
1. The English phrase
2. A step-by-step description of how to sign it
3. Cultural context or tips
4. Common situations where it's used`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            phrases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  english: { type: "string" },
                  sign_description: { type: "string" },
                  cultural_context: { type: "string" },
                  usage_situations: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error generating sign phrases:', error);
      throw error;
    }
  },

  // CleanScan: Analyze and classify document
  analyzeDocument: async (extractedText, imageUrl = null) => {
    try {
      const files = imageUrl ? [imageUrl] : [];
      const prompt = `Analyze this document and provide:
1. Document type classification (receipt, invoice, letter, form, medical, legal, contract, etc.)
2. Key information extracted (dates, amounts, names, addresses, etc.)
3. Summary of the document
4. Suggested filing category
5. Action items if any

Document text:
${extractedText}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: files.length > 0 ? files : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            document_type: { type: "string" },
            confidence: { type: "number" },
            key_info: {
              type: "object",
              properties: {
                dates: { type: "array", items: { type: "string" } },
                amounts: { type: "array", items: { type: "string" } },
                names: { type: "array", items: { type: "string" } },
                addresses: { type: "array", items: { type: "string" } }
              }
            },
            summary: { type: "string" },
            suggested_folder: { type: "string" },
            action_items: { type: "array", items: { type: "string" } },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  },

  // SocialEase: Generate conversation coaching
  provideConversationCoaching: async (situation, conversationContext = '') => {
    try {
      const prompt = `Provide real-time conversation coaching for this social situation:
Situation: ${situation}
Current context: ${conversationContext}

Provide:
1. Conversation starters (3-5 options)
2. Active listening tips
3. Body language to look for and how to interpret it
4. Topics to discuss or avoid
5. Exit strategies if needed
6. Confidence-building reminders`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            conversation_starters: { type: "array", items: { type: "string" } },
            active_listening_tips: { type: "array", items: { type: "string" } },
            body_language_guide: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  signal: { type: "string" },
                  meaning: { type: "string" },
                  response: { type: "string" }
                }
              }
            },
            topics_to_discuss: { type: "array", items: { type: "string" } },
            topics_to_avoid: { type: "array", items: { type: "string" } },
            exit_strategies: { type: "array", items: { type: "string" } },
            confidence_reminders: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error providing coaching:', error);
      throw error;
    }
  },

  // Harmony: Analyze relationship patterns
  analyzeRelationship: async (checkIns) => {
    try {
      const prompt = `Analyze these relationship check-ins and provide insights:

${JSON.stringify(checkIns, null, 2)}

Provide:
1. Overall relationship health assessment
2. Communication patterns identified
3. Strengths of the relationship
4. Areas for improvement
5. Conflict de-escalation techniques tailored to the patterns
6. Suggested activities to strengthen connection
7. Love language compatibility insights`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            health_score: { type: "number" },
            health_assessment: { type: "string" },
            communication_patterns: { type: "array", items: { type: "string" } },
            strengths: { type: "array", items: { type: "string" } },
            improvement_areas: { type: "array", items: { type: "string" } },
            deescalation_techniques: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  technique: { type: "string" },
                  when_to_use: { type: "string" },
                  how_to_apply: { type: "string" }
                }
              }
            },
            suggested_activities: { type: "array", items: { type: "string" } },
            love_language_insights: { type: "string" }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error analyzing relationship:', error);
      throw error;
    }
  },

  // Harmony: Analyze specific relationship issue
  analyzeRelationshipIssue: async (issue, checkIns = []) => {
    try {
      const contextInfo = checkIns && checkIns.length > 0 
        ? `\n\nPrevious relationship context:\n${JSON.stringify(checkIns.slice(0, 3), null, 2)}` 
        : '';

      const prompt = `A person is experiencing this relationship challenge:

"${issue}"
${contextInfo}

As a compassionate relationship counselor, provide:
1. Understanding and validation of their feelings
2. Root cause analysis - what might be underlying this issue
3. Both perspectives - help them see their partner's potential viewpoint
4. Healthy communication strategies specifically for this situation
5. Conversation starters they can use to discuss this with their partner
6. De-escalation techniques if emotions run high
7. Actionable steps to work through this together
8. Signs of progress to look for
9. When to consider professional couples therapy

Be empathetic, non-judgmental, and focus on healthy communication and mutual understanding.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            health_score: { type: "number" },
            health_assessment: { type: "string" },
            validation: { type: "string" },
            root_causes: { type: "array", items: { type: "string" } },
            partner_perspective: { type: "string" },
            communication_strategies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  strategy: { type: "string" },
                  why_it_works: { type: "string" },
                  example: { type: "string" }
                }
              }
            },
            conversation_starters: { type: "array", items: { type: "string" } },
            deescalation_techniques: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  technique: { type: "string" },
                  when_to_use: { type: "string" },
                  how_to_apply: { type: "string" }
                }
              }
            },
            action_steps: { type: "array", items: { type: "string" } },
            progress_indicators: { type: "array", items: { type: "string" } },
            therapy_consideration: { type: "string" },
            strengths: { type: "array", items: { type: "string" } },
            communication_patterns: { type: "array", items: { type: "string" } },
            suggested_activities: { type: "array", items: { type: "string" } },
            love_language_insights: { type: "string" }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error analyzing relationship issue:', error);
      throw error;
    }
  },

  // EmojiSpeak: Predict next emoji or complete phrase
  predictEmoji: async (currentContext, recentlyUsed = []) => {
    try {
      const prompt = `Based on this conversation context: "${currentContext}"
Recently used emojis: ${recentlyUsed.join(' ')}

Suggest 8 relevant emojis that would naturally continue or complete this thought. Consider:
1. Emotional context
2. Common communication patterns
3. Natural conversation flow

Provide emojis with explanations.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  emoji: { type: "string" },
                  phrase: { type: "string" },
                  context: { type: "string" }
                }
              }
            }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error predicting emoji:', error);
      throw error;
    }
  },

  // Family Bridge: Smart scheduling and conflict detection
  analyzeSchedule: async (familyEvents, familyMembers) => {
    try {
      const prompt = `Analyze this family schedule for conflicts and optimization:

Events: ${JSON.stringify(familyEvents, null, 2)}
Family Members: ${JSON.stringify(familyMembers, null, 2)}

Provide:
1. Schedule conflicts detected
2. Optimization suggestions
3. Time management tips
4. Work-life balance recommendations
5. Suggested family time opportunities`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            conflicts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  conflict_type: { type: "string" },
                  description: { type: "string" },
                  affected_members: { type: "array", items: { type: "string" } },
                  severity: { type: "string" },
                  resolution_suggestions: { type: "array", items: { type: "string" } }
                }
              }
            },
            optimization_suggestions: { type: "array", items: { type: "string" } },
            time_management_tips: { type: "array", items: { type: "string" } },
            balance_recommendations: { type: "string" },
            family_time_opportunities: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error analyzing schedule:', error);
      throw error;
    }
  },

  // CIG Guardian: Detect behavioral patterns and threats
  analyzeBehavior: async (activityHistory, contentSamples = []) => {
    try {
      const prompt = `Analyze this digital activity for concerning patterns:

Activity History: ${JSON.stringify(activityHistory, null, 2)}

Identify:
1. Behavioral patterns (normal vs concerning)
2. Potential cyberbullying indicators
3. Exposure to inappropriate content
4. Risky online behavior
5. Recommended parental actions
6. Positive digital habits observed`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            overall_risk_level: { type: "string" },
            behavioral_patterns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pattern: { type: "string" },
                  frequency: { type: "string" },
                  risk_level: { type: "string" },
                  explanation: { type: "string" }
                }
              }
            },
            cyberbullying_indicators: { type: "array", items: { type: "string" } },
            content_concerns: { type: "array", items: { type: "string" } },
            risky_behaviors: { type: "array", items: { type: "string" } },
            recommended_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  priority: { type: "string" },
                  how_to_approach: { type: "string" }
                }
              }
            },
            positive_habits: { type: "array", items: { type: "string" } }
          }
        }
      });

      return response;
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      throw error;
    }
  },

  // General AI helper: Convert text to speech-friendly format
  convertToSpeechText: async (text) => {
    try {
      const prompt = `Convert this text to a more natural, speech-friendly format:
${text}

Make it conversational, easy to listen to, and add appropriate pauses.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt
      });

      return response;
    } catch (error) {
      console.error('Error converting to speech text:', error);
      throw error;
    }
  }
};

export default AIService;