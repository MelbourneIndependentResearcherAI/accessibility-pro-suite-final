import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ConversationCoach from '@/components/ai/ConversationCoach';

export default function SocialEaseDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('SocialEase')}>
          <Button variant="ghost" className="mb-6 text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Social Conversation Coach</h1>
          <p className="text-xl text-white/90">
            Get real-time coaching for any social situation
          </p>
        </motion.div>

        <ConversationCoach />
      </div>
    </div>
  );
}