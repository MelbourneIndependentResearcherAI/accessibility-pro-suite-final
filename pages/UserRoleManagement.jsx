import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Shield, Edit, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const CUSTOM_ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full system access and permissions' },
  { value: 'content_manager', label: 'Content Manager', description: 'Manage app catalog and content' },
  { value: 'support_staff', label: 'Support Staff', description: 'View user data and provide support' },
  { value: 'beta_tester', label: 'Beta Tester', description: 'Early access to new features' },
  { value: 'regular_user', label: 'Regular User', description: 'Standard user access' }
];

const PERMISSIONS = [
  'manage_apps',
  'manage_users',
  'view_analytics',
  'schedule_maintenance',
  'export_data',
  'manage_content',
  'beta_access'
];

export default function UserRoleManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list('-created_date'),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.User.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setIsDialogOpen(false);
      setEditingUser(null);
      toast.success('User role updated successfully');
    },
  });

  const handleRoleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const customRole = formData.get('custom_role');
    const permissions = PERMISSIONS.filter(p => formData.get(`perm_${p}`) === 'on');
    
    const data = {
      custom_role: customRole,
      permissions,
      role_assigned_by: currentUser?.email,
      role_assigned_date: new Date().toISOString()
    };

    updateUserMutation.mutate({ id: editingUser.id, data });
  };

  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await base44.users.inviteUser(inviteEmail, inviteRole);
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('user');
    } catch (error) {
      toast.error('Failed to invite user');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">This page is only accessible to administrators.</p>
            <Link to={createPageUrl('Home')}>
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-500/20 text-red-400',
      super_admin: 'bg-purple-500/20 text-purple-400',
      content_manager: 'bg-blue-500/20 text-blue-400',
      support_staff: 'bg-green-500/20 text-green-400',
      beta_tester: 'bg-yellow-500/20 text-yellow-400',
      regular_user: 'bg-slate-500/20 text-slate-400'
    };
    return colors[role] || colors.regular_user;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('AdminAppManagement')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">User Role Management</h1>
              <p className="text-slate-400">Manage user roles and permissions</p>
            </div>
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="w-5 h-5" />
              Invite New User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="user@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 bg-slate-800 border-slate-700 text-white"
              />
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInviteUser} className="bg-purple-600 hover:bg-purple-700">
                Send Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{user.full_name}</h3>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      {user.custom_role && (
                        <Badge className={getRoleColor(user.custom_role)}>
                          {CUSTOM_ROLES.find(r => r.value === user.custom_role)?.label || user.custom_role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{user.email}</p>
                    {user.permissions && user.permissions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.map(perm => (
                          <span key={perm} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded">
                            {perm.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingUser(user);
                      setIsDialogOpen(true);
                    }}
                    disabled={user.id === currentUser.id}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User Role - {editingUser?.full_name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRoleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Custom Role</label>
                <Select name="custom_role" defaultValue={editingUser?.custom_role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUSTOM_ROLES.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-slate-500">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permissions</label>
                <div className="space-y-2">
                  {PERMISSIONS.map(perm => (
                    <div key={perm} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`perm_${perm}`}
                        name={`perm_${perm}`}
                        defaultChecked={editingUser?.permissions?.includes(perm)}
                        className="rounded"
                      />
                      <label htmlFor={`perm_${perm}`} className="text-sm">
                        {perm.replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  <Shield className="w-4 h-4 mr-2" />
                  Update Role
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}