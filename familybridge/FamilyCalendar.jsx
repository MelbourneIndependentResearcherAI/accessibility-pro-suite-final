import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Plus, Clock, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function FamilyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['familyTasks'],
    queryFn: () => base44.entities.FamilyTask.list('-created_date', 50),
    initialData: [],
  });

  const { data: familyStatuses = [] } = useQuery({
    queryKey: ['familyStatuses'],
    queryFn: () => base44.entities.FamilyStatus.list('-created_date', 5),
    initialData: [],
  });

  const todayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    const today = new Date();
    return taskDate > today;
  }).slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Family Activity Feed */}
      {familyStatuses.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-purple-100 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {familyStatuses.map((status) => (
              <div key={status.id} className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                {status.image_url && (
                  <img 
                    src={status.image_url} 
                    alt="Activity" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{status.user_name}</p>
                  <p className="text-sm text-slate-600">{status.status_text}</p>
                  {status.mood_tag && (
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full">
                      {status.mood_tag}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Today's Schedule</h3>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Task
          </Button>
        </div>

        {todayTasks.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No tasks scheduled for today</p>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-xl border ${getStatusColor(task.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{task.task_name}</h4>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Users className="w-3 h-3" />
                      <span>{task.assigned_to}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-white/50 rounded">{task.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          Upcoming
        </h3>
        <div className="space-y-2">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">{task.task_name}</p>
                <p className="text-xs text-slate-600">{task.assigned_to}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600">
                  {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}