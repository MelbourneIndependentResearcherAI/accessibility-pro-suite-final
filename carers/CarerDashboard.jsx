import React from 'react';
import { Users, Star, ShieldCheck, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CarerDashboard({ carers }) {
  const activeCarers = carers.filter(c => c.status === 'active').length;
  const primaryCarer = carers.find(c => c.is_primary);
  const emergencyContacts = carers.filter(c => c.permissions?.includes('emergency_contact')).length;

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">Total Carers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-slate-900">{carers.length}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-slate-900">{activeCarers}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-red-600" />
            <span className="text-3xl font-bold text-slate-900">{emergencyContacts}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-600">Primary Carer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {primaryCarer ? primaryCarer.full_name : 'Not set'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}