import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ManualPayment from '@/components/payment/ManualPayment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Pricing() {
  const features = [
    'All 6 Apps Included',
    'Unlimited AI Features',
    'Advanced Sign Language Translation',
    'Priority Support',
    'Offline Mode',
    'No Ads',
    'Data Export',
    'Regular Updates'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-bold">Back to Hub</span>
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-bold text-sm">Free Beta Access</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Free During Beta</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AccessibilityPro is completely free during our beta period. All features unlocked!
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">Beta Program</span>
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  Everything's Free Right Now!
                </h2>
                <p className="text-white/90 text-xl mb-6 max-w-2xl mx-auto">
                  We're in beta and all features are completely free. Help us improve by providing feedback as you use the apps.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
                  <h3 className="font-bold text-2xl mb-4">What You Get:</h3>
                  <ul className="space-y-3 text-left">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                        <span className="text-white text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link to={createPageUrl('Home')} className="inline-block mt-8">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100 h-14 px-8 text-lg font-bold">
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-slate-900 mb-2">How long will the beta be free?</h3>
                <p className="text-slate-600">We'll announce pricing plans well in advance. Beta users will receive special early-adopter benefits!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-slate-900 mb-2">What happens to my data after beta?</h3>
                <p className="text-slate-600">All your data is safe and will carry over. You'll never lose your history or preferences.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-slate-900 mb-2">How can I provide feedback?</h3>
                <p className="text-slate-600">Use the feedback feature in each app or contact us at feedback@accessibilitypro.com</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-slate-900 mb-2">Are there any limitations during beta?</h3>
                <p className="text-slate-600">No! All features are fully unlocked and available for free during the beta period.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}