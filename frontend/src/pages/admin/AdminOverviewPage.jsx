import React from 'react';
import {
  ShieldCheck,
  Users,
  Calendar,
  AlertTriangle,
  Server,
  Zap,
  Activity,
  Sparkles
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';

export const AdminOverviewPage = () => {
  const { users, events, registrations } = useEventHub();

  const pendingHosts = users.filter((u) => u.role === 'host' && u.verificationStatus === 'pending_review');

  return (
    <div className="space-y-8">
      <PageHeader
        title="EventHub SuperAdmin Console"
        subtitle="Platform governance, anti-fraud host accreditation, and live security telemetry."
        breadcrumbs={[
          { label: 'Admin Portal', to: '/app/admin/overview' },
          { label: 'Overview' }
        ]}
      />

      {/* 4 Platform Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Platform Users" value={users.length || 4} change="+12.8%" icon={Users} color="indigo" />
        <StatCard title="Catalog Events" value={events.length || 6} change="+8.3%" icon={Calendar} color="emerald" />
        <StatCard title="Total Registrations" value={registrations.length || 48} change="+24.1%" icon={Activity} color="purple" />
        <StatCard
          title="Pending Host Reviews"
          value={pendingHosts.length}
          subtitle="24h SLA Active"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* System Health Telemetry */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-500" />
          <span>Cluster Health & Microservices Telemetry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">API Gateway</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">99.98%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Latency: 24ms • 0 errors</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">MongoDB Replica Set</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">Connected</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Primary Node Active</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 dark:text-purple-300">Waitlist Promotion Queue</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">Operational</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Workers: 4 active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
