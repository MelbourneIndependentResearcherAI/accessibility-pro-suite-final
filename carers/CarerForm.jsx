import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PERMISSIONS = [
  { id: 'view_mood', label: 'View Mood Entries' },
  { id: 'view_tasks', label: 'View Tasks & Calendar' },
  { id: 'view_documents', label: 'View Documents' },
  { id: 'view_location', label: 'View Location' },
  { id: 'receive_alerts', label: 'Receive Alerts' },
  { id: 'emergency_contact', label: 'Emergency Contact' }
];

export default function CarerForm({ carer, onClose, onSuccess }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(carer || {
    full_name: '',
    email: '',
    phone: '',
    relationship: 'parent',
    is_primary: false,
    permissions: [],
    availability: '',
    specializations: [],
    notes: '',
    status: 'active'
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (carer) {
        return base44.entities.Carer.update(carer.id, data);
      }
      return base44.entities.Carer.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carers'] });
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const togglePermission = (permId) => {
    const permissions = formData.permissions || [];
    if (permissions.includes(permId)) {
      setFormData({
        ...formData,
        permissions: permissions.filter(p => p !== permId)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...permissions, permId]
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{carer ? 'Edit Carer' : 'Add New Carer'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label>Relationship</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData({...formData, relationship: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="spouse">Spouse/Partner</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="professional">Professional Carer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Availability Schedule</Label>
              <Input
                placeholder="e.g., Monday-Friday 9am-5pm"
                value={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.value})}
              />
            </div>

            <div>
              <Label className="mb-3 block">Permissions</Label>
              <div className="grid md:grid-cols-2 gap-3">
                {PERMISSIONS.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={perm.id}
                      checked={formData.permissions?.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <Label htmlFor={perm.id} className="text-sm cursor-pointer">
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_primary"
                checked={formData.is_primary}
                onCheckedChange={(checked) => setFormData({...formData, is_primary: checked})}
              />
              <Label htmlFor="is_primary" className="cursor-pointer">
                Set as Primary Carer
              </Label>
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save Carer'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}