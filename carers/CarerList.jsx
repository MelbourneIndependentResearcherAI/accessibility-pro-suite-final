import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ShieldCheck, Star, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CarerList({ carers, onEdit }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Carer.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carers'] });
    },
  });

  const handleDelete = (carer) => {
    if (confirm(`Remove ${carer.full_name} from your carer network?`)) {
      deleteMutation.mutate(carer.id);
    }
  };

  const relationshipColors = {
    parent: 'bg-blue-100 text-blue-800',
    spouse: 'bg-pink-100 text-pink-800',
    sibling: 'bg-purple-100 text-purple-800',
    child: 'bg-green-100 text-green-800',
    friend: 'bg-yellow-100 text-yellow-800',
    professional: 'bg-slate-100 text-slate-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {carers.map((carer, index) => (
        <motion.div
          key={carer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{carer.full_name}</CardTitle>
                    {carer.is_primary && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={relationshipColors[carer.relationship]}>
                      {carer.relationship}
                    </Badge>
                    <Badge className={statusColors[carer.status]}>
                      {carer.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(carer)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(carer)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{carer.phone}</span>
              </div>
              {carer.email && (
                <div className="flex items-center gap-3 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{carer.email}</span>
                </div>
              )}
              
              {carer.permissions && carer.permissions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Permissions</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {carer.permissions.map((perm) => (
                      <Badge key={perm} variant="outline" className="text-xs">
                        {perm.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {carer.availability && (
                <div className="text-sm text-slate-600">
                  <strong>Availability:</strong> {carer.availability}
                </div>
              )}

              {carer.specializations && carer.specializations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {carer.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}