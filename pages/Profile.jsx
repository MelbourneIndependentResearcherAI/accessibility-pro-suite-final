import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowLeft, Crown, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (error) {
      console.log('Not logged in');
    }
  };

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8" role="main">
        <nav aria-label="Breadcrumb navigation">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="mb-6" aria-label="Back to Hub">
              <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
              <span className="font-bold">Back to Hub</span>
            </Button>
          </Link>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-slate-700" />
            <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center" role="img" aria-label="User profile avatar">
                  <User className="w-12 h-12 text-white" aria-hidden="true" />
                </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user?.full_name || 'User'}</h2>
                <p className="text-slate-600">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Free Plan</h3>
            </div>
            <p className="mb-6">Upgrade to unlock all 6 apps and premium features</p>

            <Link to={createPageUrl('Pricing')}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100 h-14">
                <Crown className="w-5 h-5 mr-2 text-purple-600" />
                <span className="font-bold text-purple-600">Upgrade to Premium</span>
              </Button>
            </Link>
          </div>

          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-600 hover:bg-red-50 h-12"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-bold">Sign Out</span>
          </Button>
          
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <Link to={createPageUrl('Privacy')}>
              <Button variant="outline" className="w-full h-12">
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span className="font-bold">Privacy Policy</span>
              </Button>
            </Link>
            <Link to={createPageUrl('SecuritySettings')}>
              <Button variant="outline" className="w-full h-12">
                <ShieldCheck className="w-5 h-5 mr-2" />
                <span className="font-bold">Security Settings</span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}