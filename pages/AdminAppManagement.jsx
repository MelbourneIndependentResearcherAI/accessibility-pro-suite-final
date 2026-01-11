import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ArrowLeft, Save, Sparkles, Loader2, Download, Upload, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ICON_OPTIONS = ['Heart', 'Eye', 'Hand', 'ScanLine', 'MessageCircle', 'HeartHandshake', 'Users', 'Shield', 'Zap', 'Star'];
const GRADIENT_OPTIONS = [
  'from-pink-400 to-pink-600',
  'from-purple-500 to-purple-700',
  'from-purple-600 to-indigo-600',
  'from-cyan-400 to-blue-600',
  'from-orange-500 to-orange-700',
  'from-pink-500 to-rose-600',
  'from-green-400 to-emerald-600',
  'from-yellow-400 to-orange-500'
];

export default function AdminAppManagement() {
  const [editingApp, setEditingApp] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [suggestedCategory, setSuggestedCategory] = useState(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['appCatalog'],
    queryFn: () => base44.entities.AppCatalog.list('sort_order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.AppCatalog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appCatalog']);
      setIsDialogOpen(false);
      setEditingApp(null);
      toast.success('App created successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AppCatalog.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appCatalog']);
      setIsDialogOpen(false);
      setEditingApp(null);
      toast.success('App updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AppCatalog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['appCatalog']);
      toast.success('App deleted successfully');
    },
  });

  const handleExport = () => {
    const exportData = apps.map(({ id, created_date, updated_date, created_by, ...app }) => app);
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-catalog-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('App catalog exported successfully');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedApps = JSON.parse(event.target.result);
        
        if (!Array.isArray(importedApps)) {
          toast.error('Invalid file format');
          return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const app of importedApps) {
          try {
            const existing = apps.find(a => a.app_id === app.app_id);
            if (existing) {
              await base44.entities.AppCatalog.update(existing.id, app);
            } else {
              await base44.entities.AppCatalog.create(app);
            }
            successCount++;
          } catch (error) {
            console.error('Import error:', error);
            errorCount++;
          }
        }

        queryClient.invalidateQueries(['appCatalog']);
        toast.success(`Imported ${successCount} apps${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      } catch (error) {
        toast.error('Failed to parse file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const suggestCategory = async (name, description) => {
    if (!name || !description) return;
    
    setIsLoadingCategory(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this app information:
Name: ${name}
Description: ${description}

Suggest the most appropriate category from: Health & Wellness, Accessibility, Communication, Productivity, Utilities, Entertainment

Consider the app's primary purpose and target users. Return only the category name.`,
        response_json_schema: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            reasoning: { type: 'string' }
          }
        }
      });
      
      setSuggestedCategory(result);
    } catch (error) {
      console.error('Error suggesting category:', error);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      app_id: formData.get('app_id'),
      name: formData.get('name'),
      description: formData.get('description'),
      icon_name: formData.get('icon_name'),
      gradient: formData.get('gradient'),
      page: formData.get('page'),
      category: formData.get('category'),
      is_premium: formData.get('is_premium') === 'on',
      is_active: formData.get('is_active') === 'on',
      help_text: formData.get('help_text'),
      sort_order: parseInt(formData.get('sort_order') || 0),
    };

    if (editingApp) {
      updateMutation.mutate({ id: editingApp.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">This page is only accessible to administrators.</p>
            <Link to={createPageUrl('Home')}>
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400">Manage apps, maintenance, and user roles</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={createPageUrl('UserRoleManagement')}>
              <Button variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Users className="w-4 h-4 mr-2" />
                User Roles
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="apps" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="apps">App Catalog</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button onClick={handleExport} variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                <Download className="w-4 h-4 mr-2" />
                Export Catalog
              </Button>
              <label>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                <Button as="span" variant="outline" className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Catalog
                </Button>
              </label>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSuggestedCategory(null);
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingApp(null);
                setSuggestedCategory(null);
              }} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New App
              </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingApp ? 'Edit App' : 'Add New App'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="app_id" className="block text-sm font-medium mb-1">App ID</label>
                    <Input id="app_id" name="app_id" defaultValue={editingApp?.app_id} required disabled={!!editingApp} />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <Input id="name" name="name" defaultValue={editingApp?.name} required />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={editingApp?.description} 
                    required 
                    onBlur={(e) => {
                      const name = document.getElementById('name')?.value;
                      if (name && e.target.value && !editingApp) {
                        suggestCategory(name, e.target.value);
                      }
                    }}
                  />
                </div>

                {suggestedCategory && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-purple-900">AI Suggestion</span>
                    </div>
                    <p className="text-sm text-purple-700 mb-2">
                      <strong>Category:</strong> {suggestedCategory.category}
                    </p>
                    <p className="text-xs text-purple-600">{suggestedCategory.reasoning}</p>
                  </div>
                )}

                {isLoadingCategory && (
                  <div className="flex items-center gap-2 text-purple-600 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing app to suggest category...</span>
                  </div>
                )}

                <div>
                  <label htmlFor="help_text" className="block text-sm font-medium mb-1">Help Text</label>
                  <Textarea id="help_text" name="help_text" defaultValue={editingApp?.help_text} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="icon_name" className="block text-sm font-medium mb-1">Icon</label>
                    <Select name="icon_name" defaultValue={editingApp?.icon_name || 'Heart'}>
                      <SelectTrigger id="icon_name">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="gradient" className="block text-sm font-medium mb-1">Gradient</label>
                    <Select name="gradient" defaultValue={editingApp?.gradient || GRADIENT_OPTIONS[0]}>
                      <SelectTrigger id="gradient">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADIENT_OPTIONS.map(grad => (
                          <SelectItem key={grad} value={grad}>{grad}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="page" className="block text-sm font-medium mb-1">Page Route</label>
                    <Input id="page" name="page" defaultValue={editingApp?.page} required />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                    <Select name="category" defaultValue={editingApp?.category}>
                      <SelectTrigger id="category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                        <SelectItem value="Accessibility">Accessibility</SelectItem>
                        <SelectItem value="Communication">Communication</SelectItem>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="sort_order" className="block text-sm font-medium mb-1">Sort Order</label>
                  <Input id="sort_order" name="sort_order" type="number" defaultValue={editingApp?.sort_order || 0} />
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="is_premium" name="is_premium" defaultChecked={editingApp?.is_premium} />
                    <label htmlFor="is_premium" className="text-sm font-medium">Premium App</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="is_active" name="is_active" defaultChecked={editingApp?.is_active ?? true} />
                    <label htmlFor="is_active" className="text-sm font-medium">Active</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingApp ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {apps.map((app) => (
            <Card key={app.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${app.gradient} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-sm">{app.icon_name}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-white">{app.name}</h3>
                        <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded">{app.category}</span>
                        {app.is_premium && <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">Premium</span>}
                        {!app.is_active && <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">Inactive</span>}
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{app.description}</p>
                      <p className="text-slate-500 text-xs">Page: {app.page} • Order: {app.sort_order}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingApp(app);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete ${app.name}?`)) {
                          deleteMutation.mutate(app.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceManager apps={apps} />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  );
}

function MaintenanceManager({ apps }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);

  const { data: maintenances = [] } = useQuery({
    queryKey: ['scheduledMaintenance'],
    queryFn: () => base44.entities.ScheduledMaintenance.list('-start_time'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ScheduledMaintenance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledMaintenance']);
      setIsDialogOpen(false);
      setEditingMaintenance(null);
      toast.success('Maintenance scheduled successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ScheduledMaintenance.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledMaintenance']);
      setIsDialogOpen(false);
      setEditingMaintenance(null);
      toast.success('Maintenance updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ScheduledMaintenance.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduledMaintenance']);
      toast.success('Maintenance deleted successfully');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      app_id: formData.get('app_id'),
      title: formData.get('title'),
      description: formData.get('description'),
      start_time: new Date(formData.get('start_time')).toISOString(),
      end_time: new Date(formData.get('end_time')).toISOString(),
      maintenance_type: formData.get('maintenance_type'),
      status: formData.get('status') || 'scheduled',
      notify_users: formData.get('notify_users') === 'on',
      impact_level: formData.get('impact_level'),
    };

    if (editingMaintenance) {
      updateMutation.mutate({ id: editingMaintenance.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400'
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMaintenance(null)} className="bg-purple-600 hover:bg-purple-700">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMaintenance ? 'Edit Maintenance' : 'Schedule Maintenance'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="app_id" className="block text-sm font-medium mb-1">App</label>
                <Select name="app_id" defaultValue={editingMaintenance?.app_id || 'all'}>
                  <SelectTrigger id="app_id">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Apps (System-wide)</SelectItem>
                    {apps.map(app => (
                      <SelectItem key={app.app_id} value={app.app_id}>{app.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <Input id="title" name="title" defaultValue={editingMaintenance?.title} required />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Textarea id="description" name="description" defaultValue={editingMaintenance?.description} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_time" className="block text-sm font-medium mb-1">Start Time</label>
                  <Input 
                    id="start_time" 
                    name="start_time" 
                    type="datetime-local" 
                    defaultValue={editingMaintenance?.start_time?.slice(0, 16)} 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium mb-1">End Time</label>
                  <Input 
                    id="end_time" 
                    name="end_time" 
                    type="datetime-local" 
                    defaultValue={editingMaintenance?.end_time?.slice(0, 16)} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maintenance_type" className="block text-sm font-medium mb-1">Type</label>
                  <Select name="maintenance_type" defaultValue={editingMaintenance?.maintenance_type || 'maintenance'}>
                    <SelectTrigger id="maintenance_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="bugfix">Bug Fix</SelectItem>
                      <SelectItem value="feature">Feature Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="impact_level" className="block text-sm font-medium mb-1">Impact Level</label>
                  <Select name="impact_level" defaultValue={editingMaintenance?.impact_level || 'medium'}>
                    <SelectTrigger id="impact_level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {editingMaintenance && (
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                  <Select name="status" defaultValue={editingMaintenance?.status}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Switch id="notify_users" name="notify_users" defaultChecked={editingMaintenance?.notify_users ?? true} />
                <label htmlFor="notify_users" className="text-sm font-medium">Notify Users</label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingMaintenance ? 'Update' : 'Schedule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {maintenances.map((maintenance) => (
          <Card key={maintenance.id} className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-white">{maintenance.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(maintenance.status)}`}>
                      {maintenance.status}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded">
                      {maintenance.maintenance_type}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-orange-500/20 text-orange-400 rounded">
                      {maintenance.impact_level} impact
                    </span>
                  </div>
                  {maintenance.description && (
                    <p className="text-slate-400 text-sm mb-3">{maintenance.description}</p>
                  )}
                  <div className="text-slate-500 text-xs space-y-1">
                    <p>App: {maintenance.app_id === 'all' ? 'All Apps' : apps.find(a => a.app_id === maintenance.app_id)?.name || maintenance.app_id}</p>
                    <p>Start: {new Date(maintenance.start_time).toLocaleString()}</p>
                    <p>End: {new Date(maintenance.end_time).toLocaleString()}</p>
                    {maintenance.notify_users && <p>✓ Users will be notified</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingMaintenance(maintenance);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`Delete maintenance: ${maintenance.title}?`)) {
                        deleteMutation.mutate(maintenance.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}