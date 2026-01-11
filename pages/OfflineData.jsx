import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cloud, Trash2, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { usePWA } from '@/components/pwa/PWAProvider';
import { OfflineStorage } from '@/components/pwa/OfflineStorage';

export default function OfflineData() {
  const { isOnline, syncOfflineData, getOfflineDataKeys } = usePWA();
  const [storageInfo, setStorageInfo] = useState(null);
  const [offlineMoodEntries, setOfflineMoodEntries] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = () => {
    const info = OfflineStorage.getStorageInfo();
    setStorageInfo(info);
    
    const moods = OfflineStorage.getOfflineMoodEntries();
    setOfflineMoodEntries(moods);
  };

  const handleSync = async () => {
    if (!isOnline) {
      setSyncResult({ success: false, message: 'No internet connection' });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const result = await syncOfflineData();
      setSyncResult(result);
      loadOfflineData();
    } catch (error) {
      setSyncResult({ success: false, message: error.message });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data?')) {
      OfflineStorage.clearCache();
      loadOfflineData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Settings')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Settings
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Database className="w-8 h-8 text-slate-700" />
            <h1 className="text-4xl font-bold text-slate-900">Offline Data</h1>
          </div>

          {/* Connection Status */}
          <div className={`rounded-2xl p-6 mb-6 ${isOnline ? 'bg-green-100' : 'bg-amber-100'}`}>
            <div className="flex items-center gap-3">
              <Cloud className={`w-6 h-6 ${isOnline ? 'text-green-600' : 'text-amber-600'}`} />
              <div>
                <h3 className={`font-bold ${isOnline ? 'text-green-900' : 'text-amber-900'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </h3>
                <p className={`text-sm ${isOnline ? 'text-green-700' : 'text-amber-700'}`}>
                  {isOnline ? 'Your data is syncing with the cloud' : 'Changes will sync when you reconnect'}
                </p>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          {storageInfo && (
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Storage Usage</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{storageInfo.totalSize}</p>
                  <p className="text-sm text-slate-600">Total Size</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-3xl font-bold text-purple-600">{storageInfo.offlineItems}</p>
                  <p className="text-sm text-slate-600">Offline Items</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{storageInfo.cachedItems}</p>
                  <p className="text-sm text-slate-600">Cached Items</p>
                </div>
              </div>
            </div>
          )}

          {/* Offline Mood Entries */}
          {offlineMoodEntries.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Pending Mood Entries</h2>
              <div className="space-y-3">
                {offlineMoodEntries.map((entry, index) => (
                  <div key={index} className="p-4 bg-pink-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {entry.data.emoji} {entry.data.mood}
                      </p>
                      <p className="text-sm text-slate-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      entry.synced ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {entry.synced ? 'Synced' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sync Result */}
          {syncResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 mb-6 ${
                syncResult.success ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
              }`}
            >
              <p className="font-medium">
                {syncResult.success
                  ? `Successfully synced ${syncResult.results?.length || 0} items`
                  : `Sync failed: ${syncResult.message}`}
              </p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              size="lg"
              onClick={handleSync}
              disabled={!isOnline || isSyncing || storageInfo?.offlineItems === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={handleClearCache}
              className="w-full border-red-600 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Cache
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Note:</strong> Offline data is stored locally on your device and will automatically 
              sync when you reconnect to the internet. Clearing cache will remove downloaded data but 
              not your pending changes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}