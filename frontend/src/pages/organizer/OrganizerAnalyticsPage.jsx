import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useEventHub } from '../../context/EventHubContext';
import { useTheme } from '../../context/ThemeContext';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';

export const OrganizerAnalyticsPage = () => {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';

  const conversionFunnel = [
    { stage: 'Page Views', count: 12450, fill: '#6366F1' },
    { stage: 'Clicked Register', count: 4800, fill: '#8B5CF6' },
    { stage: 'Completed Forms', count: 1680, fill: '#EC4899' },
    { stage: 'Admitted Attendees', count: 1420, fill: '#10B981' }
  ];

  const trafficSources = [
    { source: 'Direct / EventHub Discovery', percentage: 48 },
    { source: 'LinkedIn & Social Shares', percentage: 26 },
    { source: 'Campus GDG & College Clubs', percentage: 18 },
    { source: 'Email Invites & Referrals', percentage: 8 }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Audience & Conversion Analytics"
        subtitle="Track registration conversion funnel, traffic origins, and session engagement rates."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Analytics' }
        ]}
      />

      {/* Conversion Funnel KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Page Impressions" value="12,450" change="+34%" icon={Eye} color="indigo" />
        <StatCard title="Registration Conversion" value="13.5%" change="+2.1%" icon={TrendingUp} color="purple" />
        <StatCard title="Desk Show-up Rate" value="84.5%" change="+5.4%" icon={CheckCircle2} color="emerald" />
        <StatCard title="Average Attendee Rating" value="4.9 / 5.0" icon={Sparkles} color="amber" />
      </div>

      {/* Funnel Chart */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Event Discovery & Conversion Funnel
        </h3>
        <p className="text-xs text-slate-500">
          Conversion progression from initial impression to desk check-in
        </p>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="stage" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                  borderRadius: '0.75rem',
                  color: isDark ? '#FFFFFF' : '#0F172A'
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic Breakdown */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Traffic & Referral Channels
        </h3>
        <div className="space-y-3">
          {trafficSources.map((t) => (
            <div key={t.source} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{t.source}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${t.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerAnalyticsPage;
