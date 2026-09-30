import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useEventHub } from '../../context/EventHubContext';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';

export const OrganizerOverviewPage = () => {
  const { currentUser, events, registrations } = useEventHub();
  const { resolvedTheme } = useTheme();

  // Metrics computation
  const myEvents = events.filter((e) => e.organizer?.id === currentUser?.id || e.organizer?.name === currentUser?.name);
  const totalRegistrations = myEvents.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
  const totalCapacity = myEvents.reduce((acc, curr) => acc + (curr.maxCapacity || 100), 0);
  const totalRevenue = myEvents.reduce((acc, curr) => acc + (curr.isFree ? 0 : (curr.price || 0) * (curr.registeredCount || 0)), 0);

  // Chart data
  const registrationTrajectory = [
    { day: 'Mon', registrations: 45, checkins: 38 },
    { day: 'Tue', registrations: 85, checkins: 72 },
    { day: 'Wed', registrations: 140, checkins: 110 },
    { day: 'Thu', registrations: 210, checkins: 185 },
    { day: 'Fri', registrations: 320, checkins: 290 },
    { day: 'Sat', registrations: 480, checkins: 440 },
    { day: 'Sun', registrations: 620, checkins: 580 }
  ];

  const categoryDistribution = [
    { name: 'Hackathons', value: 45, color: '#6366F1' },
    { name: 'Bootcamps', value: 30, color: '#10B981' },
    { name: 'Summits', value: 15, color: '#8B5CF6' },
    { name: 'Webinars', value: 10, color: '#F59E0B' }
  ];

  const isDark = resolvedTheme === 'dark';
  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const gridColor = isDark ? '#1E293B' : '#E2E8F0';

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Host Management Console`}
        subtitle={`Organization: ${currentUser?.organizationName || currentUser?.name} • Accreditation Status: Verified`}
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Overview' }
        ]}
        actions={
          <Link
            to="/app/organizer/create-event"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Event</span>
          </Link>
        }
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Events Hosted"
          value={myEvents.length || 3}
          subtitle="Active & completed"
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Total Registrations"
          value={totalRegistrations || 680}
          change="+18.4%"
          subtitle="Across all programs"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Check-in Attendance"
          value="92.4%"
          change="+4.2%"
          subtitle="Desk verification rate"
          icon={CheckCircle2}
          color="purple"
        />
        <StatCard
          title="Ticketing Volume"
          value={totalRevenue > 0 ? `₹${totalRevenue.toLocaleString()}` : '₹1,45,000'}
          change="+24.8%"
          subtitle="Gross volume processed"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Trajectory Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registration & Check-in Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live participant signups vs desk scan check-ins
              </p>
            </div>
            <span className="badge-chip badge-success text-[10px]">
              Live 7-Day Trend
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationTrajectory}>
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="checkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={11} />
                <YAxis stroke={axisColor} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '0.75rem',
                    color: isDark ? '#FFFFFF' : '#0F172A'
                  }}
                />
                <Area type="monotone" dataKey="registrations" stroke="#6366F1" strokeWidth={2.5} fill="url(#regGrad)" />
                <Area type="monotone" dataKey="checkins" stroke="#10B981" strokeWidth={2} fill="url(#checkGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Event Category Share
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Distribution of hosted programs
            </p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    borderRadius: '0.75rem',
                    color: isDark ? '#FFFFFF' : '#0F172A'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 dark:text-slate-400">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerOverviewPage;
