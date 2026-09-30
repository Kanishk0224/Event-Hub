import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommandPalette from '../components/ui/CommandPalette';
import { useEventHub } from '../context/EventHubContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, Wifi, WifiOff } from 'lucide-react';

export const PublicLayout = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { toastMessage, isBackendConnected } = useEventHub();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Backend Connection Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm backdrop-blur-md ${
          isBackendConnected
            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
        }`}>
          {isBackendConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          <span>{isBackendConnected ? 'Atlas Connected' : 'Offline Mode'}</span>
        </div>
      </div>

      {/* Global Animated Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div
              className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                toastMessage.type === 'error'
                  ? 'border-rose-500/30 bg-rose-950/90 text-rose-100'
                  : toastMessage.type === 'warning'
                  ? 'border-amber-500/30 bg-amber-950/90 text-amber-100'
                  : toastMessage.type === 'info'
                  ? 'border-blue-500/30 bg-blue-950/90 text-blue-100'
                  : 'border-emerald-500/30 bg-slate-900/95 text-emerald-100'
              }`}
            >
              {toastMessage.type === 'error' ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              ) : toastMessage.type === 'warning' ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
              ) : toastMessage.type === 'info' ? (
                <Info className="h-5 w-5 shrink-0 text-blue-400" />
              ) : (
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
              )}
              <div className="flex-1 text-sm font-medium leading-snug">
                {toastMessage.message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicLayout;
