import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Crown } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useApp } from '@/components/shared/AppContext';

export default function AppCard({ app, isFavorite, onToggleFavorite }) {
  const { trackAppUsage } = useApp();

  const handleClick = () => {
    trackAppUsage(app.id);
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={createPageUrl(app.page)} onClick={handleClick}>
        <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 h-full group">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.gradient} flex items-center justify-center`} role="img" aria-label={`${app.name} icon`}>
              <app.icon className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-slate-200 transition-colors">{app.name}</h3>
            {app.category && (
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-400 rounded">
                {app.category}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{app.description}</p>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(app.id);
        }}
        className="absolute top-3 right-3 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-all z-10"
        aria-label={isFavorite ? `Remove ${app.name} from favorites` : `Add ${app.name} to favorites`}
      >
        <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} aria-hidden="true" />
      </button>
    </motion.div>
  );
}