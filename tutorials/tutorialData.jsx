
import { Eye, Hand, Heart, Smile, ScanLine, Users, HeartHandshake, Shield, MessageCircle, Camera, Mic, Book, Bell, CheckCircle } from 'lucide-react';

export const TUTORIALS = {
  VisionVerse: [
    {
      id: 'visionverse-1',
      title: 'Welcome to VisionVerse AI',
      description: 'Your AI-powered visual assistant that describes the world around you in real-time. Perfect for navigation, reading, and understanding your environment.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['Works offline after initial setup', 'Use voice commands for hands-free operation']
    },
    {
      id: 'visionverse-2',
      title: 'Live Camera Analysis',
      description: 'Point your camera at anything - text, objects, people, scenes - and get instant AI descriptions spoken aloud.',
      icon: <Camera className="w-10 h-10 text-white" />,
      tips: ['Hold steady for best results', 'Auto-scan mode continuously analyzes your surroundings'],
      interactive: 'Try it now: Tap "Live Vision" and point at something nearby!'
    },
    {
      id: 'visionverse-3',
      title: 'Safety Features',
      description: 'Emergency detection alerts your contacts if hazards are detected. Location tracking keeps you safe during navigation.',
      icon: <Bell className="w-10 h-10 text-white" />,
      tips: ['Set up emergency contacts in settings', 'Safety AI monitors for obstacles and dangers']
    }
  ],

  SignBridge: [
    {
      id: 'signbridge-1',
      title: 'Welcome to SignBridge AI',
      description: 'Real-time sign language translation powered by AI. Translate signs to speech, learn phrases, and communicate seamlessly.',
      icon: <Hand className="w-10 h-10 text-white" />,
      tips: ['Supports 12 languages', 'Works with video input or live camera']
    },
    {
      id: 'signbridge-2',
      title: 'Live Translation',
      description: 'Point your camera at sign language and get instant voice translation in your chosen language.',
      icon: <Mic className="w-10 h-10 text-white" />,
      tips: ['Ensure good lighting for accuracy', 'Position hands fully in frame'],
      interactive: 'Select your preferred output language from the dropdown'
    },
    {
      id: 'signbridge-3',
      title: 'Phrase Library',
      description: 'Learn common phrases with visual demonstrations and practice mode. Build your sign language vocabulary.',
      icon: <Book className="w-10 h-10 text-white" />,
      tips: ['Favorite phrases for quick access', 'Practice mode helps you learn']
    }
  ],

  MoodSense: [
    {
      id: 'moodsense-1',
      title: 'Welcome to MoodSense',
      description: 'Track your mental health journey with AI-powered insights. Monitor moods, identify patterns, and receive personalized coping strategies.',
      icon: <Heart className="w-10 h-10 text-white" />,
      tips: ['Daily tracking provides better insights', 'All data is private and encrypted']
    },
    {
      id: 'moodsense-2',
      title: 'Mood Tracking',
      description: 'Select your mood, add journal entries, and track triggers. The AI analyzes patterns to help you understand your mental health.',
      icon: <CheckCircle className="w-10 h-10 text-white" />,
      tips: ['Be honest for accurate insights', 'Track sleep and energy levels too'],
      interactive: 'Try logging your current mood now!'
    },
    {
      id: 'moodsense-3',
      title: 'AI Insights',
      description: 'Get personalized analysis of your mood trends, identified patterns, and tailored coping strategies based on your data.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['Review insights weekly', 'Share reports with your therapist']
    }
  ],

  EmojiSpeak: [
    {
      id: 'emojispeak-1',
      title: 'Welcome to EmojiSpeak',
      description: 'Communicate using emojis and symbols with text-to-speech. Perfect for non-verbal communication or speech difficulties.',
      icon: <Smile className="w-10 h-10 text-white" />,
      tips: ['Create custom phrases', 'AI predicts next emojis']
    },
    {
      id: 'emojispeak-2',
      title: 'Build Messages',
      description: 'Tap emojis to build messages, then speak them aloud with one tap. Save favorites for quick access.',
      icon: <Mic className="w-10 h-10 text-white" />,
      tips: ['Combine emojis for complex ideas', 'Use categories to find emojis fast'],
      interactive: 'Try building a message: Tap emojis below to start!'
    },
    {
      id: 'emojispeak-3',
      title: 'AI Predictions',
      description: 'Smart emoji suggestions based on your conversation context and frequently used phrases.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['AI learns your communication style', 'Save time with predictions']
    }
  ],

  CleanScan: [
    {
      id: 'cleanscan-1',
      title: 'Welcome to CleanScan Pro',
      description: 'AI-powered document scanning with OCR. Scan documents, extract text, and organize with smart categorization.',
      icon: <ScanLine className="w-10 h-10 text-white" />,
      tips: ['Works offline', 'Supports multiple formats']
    },
    {
      id: 'cleanscan-2',
      title: 'Scan Documents',
      description: 'Take photos or upload files. AI extracts text, categorizes documents, and makes everything searchable.',
      icon: <Camera className="w-10 h-10 text-white" />,
      tips: ['Use good lighting', 'Flatten documents for best results'],
      interactive: 'Scan your first document using the camera or upload!'
    },
    {
      id: 'cleanscan-3',
      title: 'Organization',
      description: 'Smart folders, tags, and AI-powered search help you find documents instantly. Export or share anytime.',
      icon: <CheckCircle className="w-10 h-10 text-white" />,
      tips: ['Tag documents for easy retrieval', 'Text-to-speech reads scanned text']
    }
  ],

  FamilyBridge: [
    {
      id: 'familybridge-1',
      title: 'Welcome to Family Bridge',
      description: 'Coordinate family schedules, tasks, and communication. AI helps optimize routines and prevent conflicts.',
      icon: <Users className="w-10 h-10 text-white" />,
      tips: ['Invite family members', 'Sync calendars for coordination']
    },
    {
      id: 'familybridge-2',
      title: 'Shared Calendar',
      description: 'View everyone\'s schedules, assign tasks, and track activities. AI detects conflicts and suggests optimal timing.',
      icon: <CheckCircle className="w-10 h-10 text-white" />,
      tips: ['Color-code family members', 'Set reminders for tasks'],
      interactive: 'Add your first family event or task!'
    },
    {
      id: 'familybridge-3',
      title: 'AI Coordination',
      description: 'Get smart suggestions for family time, conflict resolution, and schedule optimization.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['Review weekly summaries', 'AI learns your family patterns']
    }
  ],

  Harmony: [
    {
      id: 'harmony-1',
      title: 'Welcome to Harmony AI',
      description: 'Strengthen relationships with AI-powered insights. Track connection, improve communication, and navigate conflicts.',
      icon: <HeartHandshake className="w-10 h-10 text-white" />,
      tips: ['Daily check-ins provide best insights', 'Share results with your partner']
    },
    {
      id: 'harmony-2',
      title: 'Relationship Check-Ins',
      description: 'Rate connection levels, communication quality, and express gratitude. Track patterns over time.',
      icon: <Heart className="w-10 h-10 text-white" />,
      tips: ['Be honest for accurate analysis', 'Include challenges you\'re facing'],
      interactive: 'Complete your first relationship check-in!'
    },
    {
      id: 'harmony-3',
      title: 'AI Insights & De-escalation',
      description: 'Get personalized analysis, identify communication patterns, and learn proven de-escalation techniques.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['Review insights together', 'Practice techniques before conflicts arise']
    }
  ],

  CIGGuardian: [
    {
      id: 'cigguardian-1',
      title: 'Welcome to CIG Guardian',
      description: 'Digital safety and content filtering for families. AI monitors activity and detects potential threats.',
      icon: <Shield className="w-10 h-10 text-white" />,
      tips: ['All monitoring is transparent', 'Customize alert sensitivity']
    },
    {
      id: 'cigguardian-2',
      title: 'Activity Monitoring',
      description: 'Track screen time, app usage, and website visits. AI flags concerning content or behavior patterns.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['Set age-appropriate filters', 'Review activity logs regularly'],
      interactive: 'Set up your first monitored profile!'
    },
    {
      id: 'cigguardian-3',
      title: 'Smart Alerts',
      description: 'Get notified of concerning activity with context and AI recommendations for how to address it.',
      icon: <Bell className="w-10 h-10 text-white" />,
      tips: ['Balance safety with privacy', 'Have open conversations']
    }
  ],

  SocialEase: [
    {
      id: 'socialease-1',
      title: 'Welcome to SocialEase AI',
      description: 'Navigate social situations with confidence. Get real-time coaching for conversations and anxiety support.',
      icon: <MessageCircle className="w-10 h-10 text-white" />,
      tips: ['Practice in low-stress situations first', 'Review tips before events']
    },
    {
      id: 'socialease-2',
      title: 'Conversation Coaching',
      description: 'Describe your situation and get conversation starters, body language tips, and active listening strategies.',
      icon: <Eye className="w-10 h-10 text-white" />,
      tips: ['Be specific about the situation', 'Review exit strategies'],
      interactive: 'Try it: Describe a social situation you\'re facing!'
    },
    {
      id: 'socialease-3',
      title: 'Build Confidence',
      description: 'Learn what to discuss, what to avoid, and get confidence-boosting reminders tailored to your needs.',
      icon: <Heart className="w-10 h-10 text-white" />,
      tips: ['Practice makes perfect', 'Celebrate small wins']
    }
  ],

  Carers: [
    {
      id: 'carers-1',
      title: 'Welcome to Carer Network',
      description: 'Coordinate with carers, family, and support professionals. Manage permissions, track visits, and ensure everyone stays informed.',
      icon: <Users className="w-10 h-10 text-white" />,
      tips: ['Set up primary carer first', 'Customize permissions carefully']
    },
    {
      id: 'carers-2',
      title: 'Add Carers',
      description: 'Add family members, friends, and professional carers. Set their relationship, permissions, and contact info.',
      icon: <CheckCircle className="w-10 h-10 text-white" />,
      tips: ['Mark emergency contacts', 'Include availability schedules'],
      interactive: 'Add your first carer to your network!'
    },
    {
      id: 'carers-3',
      title: 'Permissions & Logs',
      description: 'Control what each carer can access. Track visits and care activities with detailed logs.',
      icon: <Shield className="w-10 h-10 text-white" />,
      tips: ['Review permissions regularly', 'Log all care activities']
    }
  ]
};
