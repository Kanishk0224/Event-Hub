import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, CheckCircle2, AlertTriangle, RefreshCw, Database, Server, Wifi, WifiOff } from 'lucide-react';
import api from '../../services/api';

export const BackendStatusIndicator = ({ className = '', variant = 'badge' }) => {
  const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [latency, setLatency] = useState(null);
  const [dbStatus, setDbStatus] = useState('unknown');
  const [lastChecked, setLastChecked] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const popoverRef = useRef(null);

  const checkHealth = useCallback(async () => {
    const startTime = Date.now();
    try {
      setIsRetrying(true);
      const res = await api.get('/health', { timeout: 4000 });
      const duration = Date.now() - startTime;
      setLatency(duration);
      if (res.data && res.data.success) {
        setStatus('online');
        setDbStatus(res.data.database || 'connected');
        setErrorMessage('');
      } else {
        setStatus('offline');
        setDbStatus('degraded');
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      setLatency(duration);
      setStatus('offline');
      setDbStatus('disconnected');
      setErrorMessage(err.message || 'Unable to connect to backend service');
    } finally {
      setIsRetrying(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkHealth();

    // Regular interval check (every 25 seconds)
    const interval = setInterval(checkHealth, 25000);

    // Online/offline window listeners
    const handleOnline = () => checkHealth();
    const handleOffline = () => {
      setStatus('offline');
      setDbStatus('network_offline');
      setErrorMessage('Browser network is offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkHealth]);

  // Handle outside click for popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOnline = status === 'online';
  const isOffline = status === 'offline';

  // Dot color styles
  const dotColorClass = isOnline
    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
    : isOffline
    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
    : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse';

  const badgeBgClass = isOnline
    ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500/50'
    : isOffline
    ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/30 text-rose-700 dark:text-rose-300 hover:border-rose-500/50'
    : 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:border-amber-500/50';

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Backend: ${isOnline ? 'Online' : isOffline ? 'Offline' : 'Checking...'} (Click for status details)`}
        className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${badgeBgClass}`}
      >
        {/* Pulsing indicator dot */}
        <span className="relative flex h-2 w-2">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          {isOffline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColorClass}`} />
        </span>

        {/* Status text */}
        <span className="hidden sm:inline-block font-medium">
          {isOnline ? 'API Online' : isOffline ? 'API Offline' : 'Connecting...'}
        </span>
        <span className="sm:hidden font-medium">
          {isOnline ? 'API' : 'Offline'}
        </span>

        {/* Latency badge when online */}
        {isOnline && latency !== null && (
          <span className="hidden md:inline-block px-1.5 py-0.2 text-[10px] font-mono rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
            {latency}ms
          </span>
        )}
      </button>

      {/* Interactive Popover Modal */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 shadow-2xl z-50 animate-in fade-in duration-200 space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Backend System Status
              </h4>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                checkHealth();
              }}
              disabled={isRetrying}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
              title="Refresh status now"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin text-indigo-500' : ''}`} />
            </button>
          </div>

          {/* Status Metrics List */}
          <div className="space-y-2 text-xs">
            {/* API Health */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                {isOnline ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                )}
                <span>Node.js Express Server</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                isOnline
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
              }`}>
                {isOnline ? 'Online' : 'Unreachable'}
              </span>
            </div>

            {/* MongoDB Database */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Database className="h-4 w-4 text-indigo-500" />
                <span>MongoDB Atlas Cluster</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                dbStatus === 'connected'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {dbStatus === 'connected' ? 'Atlas Connected' : 'Checking'}
              </span>
            </div>

            {/* Network Latency */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Activity className="h-4 w-4 text-cyan-500" />
                <span>Response Time</span>
              </div>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {latency !== null ? `${latency} ms` : '—'}
              </span>
            </div>
          </div>

          {/* Error Message notice if offline */}
          {isOffline && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] leading-relaxed">
              <strong>Backend Disconnected:</strong> {errorMessage || 'Server might be starting up or offline.'}
              <button
                type="button"
                onClick={checkHealth}
                className="mt-2 w-full py-1.5 px-3 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry Connection</span>
              </button>
            </div>
          )}

          {/* Last check info */}
          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span>Base: http://localhost:5000/api</span>
            <span>
              {lastChecked ? lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Checking'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatusIndicator;
