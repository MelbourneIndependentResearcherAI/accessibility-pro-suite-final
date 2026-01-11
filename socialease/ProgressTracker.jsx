import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Calendar, BarChart3, PieChart, Clock, MessageSquare, Smile, Frown, Meh } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const SKILL_LABELS = {
  work: 'Professional Communication',
  casual: 'Casual Conversations',
  formal: 'Formal Events',
  dating: 'Dating & Romance',
  family: 'Family Relations',
  conflict: 'Conflict Resolution',
  phone_call: 'Phone Communication',
  public: 'Public Speaking'
};

const PERSONALITY_COLORS = {
  friendly: 'bg-green-100 text-green-700',
  neutral: 'bg-blue-100 text-blue-700',
  impatient: 'bg-yellow-100 text-yellow-700',
  defensive: 'bg-orange-100 text-orange-700',
  aggressive: 'bg-red-100 text-red-700',
  short_tempered: 'bg-purple-100 text-purple-700'
};

export default function ProgressTracker() {
  const [timeRange, setTimeRange] = useState('all');

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['socialPracticeSessions'],
    queryFn: () => base44.entities.SocialPracticeSession.list('-created_date', 100)
  });

  const filterByTimeRange = (sessions) => {
    if (timeRange === 'all') return sessions;
    const now = new Date();
    const cutoff = new Date();
    
    if (timeRange === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    }
    
    return sessions.filter(s => new Date(s.created_date) >= cutoff);
  };

  const filteredSessions = filterByTimeRange(sessions);
  const completedSessions = filteredSessions.filter(s => s.completed);

  // Calculate statistics
  const totalSessions = completedSessions.length;
  const totalMessages = completedSessions.reduce((sum, s) => sum + (s.message_count || 0), 0);
  const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const avgRating = completedSessions.length > 0
    ? (completedSessions.reduce((sum, s) => sum + (s.self_rating || 0), 0) / completedSessions.filter(s => s.self_rating).length).toFixed(1)
    : 0;

  // Category breakdown
  const categoryStats = {};
  completedSessions.forEach(s => {
    if (!categoryStats[s.category]) {
      categoryStats[s.category] = { count: 0, ratings: [] };
    }
    categoryStats[s.category].count++;
    if (s.self_rating) categoryStats[s.category].ratings.push(s.self_rating);
  });

  // Personality breakdown
  const personalityStats = {};
  completedSessions.forEach(s => {
    if (s.personality_practiced) {
      personalityStats[s.personality_practiced] = (personalityStats[s.personality_practiced] || 0) + 1;
    }
  });

  // Recent feedback insights
  const allFeedback = completedSessions.flatMap(s => s.feedback_received || []).slice(0, 10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Progress</h2>
          <p className="text-slate-600">Track your social skills development</p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
          <TabsList>
            <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
            <TabsTrigger value="all" className="text-xs">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {totalSessions === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No practice sessions yet</h3>
            <p className="text-slate-600">Start practicing to see your progress here!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Total Sessions</p>
                      <p className="text-3xl font-bold text-indigo-600">{totalSessions}</p>
                    </div>
                    <BarChart3 className="w-10 h-10 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Messages Sent</p>
                      <p className="text-3xl font-bold text-green-600">{totalMessages}</p>
                    </div>
                    <MessageSquare className="w-10 h-10 text-green-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Practice Time</p>
                      <p className="text-3xl font-bold text-purple-600">{totalMinutes}m</p>
                    </div>
                    <Clock className="w-10 h-10 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Avg. Rating</p>
                      <p className="text-3xl font-bold text-orange-600">{avgRating}/5</p>
                    </div>
                    <Award className="w-10 h-10 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Skills Practiced
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryStats)
                    .sort((a, b) => b[1].count - a[1].count)
                    .map(([category, stats]) => {
                      const avgRating = stats.ratings.length > 0
                        ? (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(1)
                        : 'N/A';
                      return (
                        <div key={category} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700">{SKILL_LABELS[category]}</span>
                            <span className="text-slate-500">{stats.count} sessions · ⭐ {avgRating}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${(stats.count / totalSessions) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Personality Types Faced
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(personalityStats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([personality, count]) => (
                      <div key={personality} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {personality.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PERSONALITY_COLORS[personality]}`}>
                          {count} {count === 1 ? 'session' : 'sessions'}
                        </span>
                      </div>
                    ))}
                  {Object.keys(personalityStats).length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4">No personality data yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent AI Feedback & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {allFeedback.length > 0 ? (
                    allFeedback.map((fb, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-3 bg-indigo-50 rounded-lg border border-indigo-100"
                      >
                        <p className="text-sm text-slate-700">{fb.feedback}</p>
                        {fb.timestamp && (
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(fb.timestamp).toLocaleString()}
                          </p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">
                      No feedback recorded yet. Keep practicing to receive AI insights!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{session.scenario_title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                          {SKILL_LABELS[session.category]}
                        </span>
                        <span className="text-xs text-slate-500">
                          {session.message_count || 0} messages · {session.duration_minutes || 0}m
                        </span>
                      </div>
                    </div>
                    {session.self_rating && (
                      <div className="flex items-center gap-1 ml-3">
                        {session.self_rating >= 4 ? (
                          <Smile className="w-5 h-5 text-green-500" />
                        ) : session.self_rating >= 3 ? (
                          <Meh className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <Frown className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm font-semibold">{session.self_rating}/5</span>
                      </div>
                    )}
                  </div>
                ))}
                {completedSessions.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No completed sessions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}