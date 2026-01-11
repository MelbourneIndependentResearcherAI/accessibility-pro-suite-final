
import React, { Suspense } from 'react';
import PWAProvider from './components/pwa/PWAProvider';
import InstallPrompt from './components/pwa/InstallPrompt';
import OfflineIndicator from './components/pwa/OfflineIndicator';

import { AppProvider } from './components/shared/AppContext';

const Loader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-12 h-12 border-3 border-slate-700 border-t-slate-400 rounded-full animate-spin"></div>
  </div>
);

export default function Layout({ children }) {
  return (
    <AppProvider>
      <PWAProvider>
        <div className="min-h-screen flex flex-col">
          <OfflineIndicator />
          <main id="main-content" className="flex-1" role="main">
            <Suspense fallback={<Loader />}>
              {children}
            </Suspense>
          </main>
          <InstallPrompt />
          <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} AccessibilityPro Suite. All rights reserved.
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Created by Michael McNamara, Australia
              </p>
            </div>
          </footer>
        </div>
      </PWAProvider>
    </AppProvider>
  );
}
