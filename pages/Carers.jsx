import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowLeft, Plus, Phone, Mail, ShieldCheck, Calendar, Bell, Heart, BookOpen } from 'lucide-react';
import LearningHub from '@/components/shared/LearningHub';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CarerList from '@/components/carers/CarerList';
import CarerForm from '@/components/carers/CarerForm';
import CarerDashboard from '@/components/carers/CarerDashboard';
import InteractiveTutorial from '@/components/tutorials/InteractiveTutorial';
import { TUTORIALS } from '@/components/tutorials/tutorialData';

export default function Carers() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCarer, setEditingCarer] = useState(null);

  const { data: carers = [] } = useQuery({
    queryKey: ['carers'],
    queryFn: () => base44.entities.Carer.list('-created_date', 50),
    initialData: [],
  });

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 text-white flex flex-col">
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Carer Network</h1>
          </div>
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center"
          >
            <Users className="w-24 h-24 mx-auto mb-8" />
            
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Your Support Network
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-xl mx-auto leading-relaxed">
              Coordinate with carers, family, and support professionals. Share access, track visits, and ensure everyone stays informed.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <ShieldCheck className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold mb-2">Secure Access Control</h3>
                <p className="text-white/80">Grant specific permissions to each carer for viewing mood, tasks, location, and documents</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <Bell className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold mb-2">Emergency Alerts</h3>
                <p className="text-white/80">Instant notifications to carers during emergencies with location and health information</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <Calendar className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold mb-2">Visit Tracking</h3>
                <p className="text-white/80">Log visits, phone calls, and care activities with detailed notes and attachments</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                <Heart className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-bold mb-2">Care Coordination</h3>
                <p className="text-white/80">Manage multiple carers, assign roles, and ensure seamless care coordination</p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setHasStarted(true)}
              className="w-full max-w-md h-16 text-lg font-bold bg-white text-blue-600 hover:bg-blue-50 rounded-2xl shadow-xl border-2 border-white"
            >
              <span className="font-bold text-blue-600">Manage Your Care Network</span>
              <Users className="w-5 h-5 ml-2 text-blue-600" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <InteractiveTutorial steps={TUTORIALS.Carers} appName="Carers" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-bold">Back to Hub</span>
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Carer Network</h1>
              <p className="text-slate-600">Manage your support team and care coordination</p>
            </div>
            <Button
              onClick={() => {
                setEditingCarer(null);
                setShowForm(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="font-bold">Add Carer</span>
            </Button>
          </div>

          <Tabs defaultValue="network">
            <TabsList className="mb-8 bg-white/50 p-1.5 rounded-xl">
              <TabsTrigger value="network" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 font-bold py-2.5 rounded-lg">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-bold">My Network</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 font-bold py-2.5 rounded-lg">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-bold">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 font-bold py-2.5 rounded-lg">
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="font-bold">Learn</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="network">
              {showForm ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <CarerForm
                    carer={editingCarer}
                    onClose={() => {
                      setShowForm(false);
                      setEditingCarer(null);
                    }}
                    onSuccess={() => {
                      setShowForm(false);
                      setEditingCarer(null);
                    }}
                  />
                </motion.div>
              ) : (
                <CarerList
                  carers={carers}
                  onEdit={(carer) => {
                    setEditingCarer(carer);
                    setShowForm(true);
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="dashboard">
              <CarerDashboard carers={carers} />
            </TabsContent>

            <TabsContent value="learn">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                 <LearningHub appName="FamilyBridge" /> {/* Using FamilyBridge resources for care coordination */}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}