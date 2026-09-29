import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  Search,
  Building2,
  Calendar,
  Eye
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

export const AdminModerationPage = () => {
  const {
    users,
    events,
    approveHostApplication,
    rejectHostApplication,
    toggleFeatureEvent,
    approveEvent,
    showToast
  } = useEventHub();

  const [activeTab, setActiveTab] = useState('hosts'); // 'hosts' | 'events'
  const pendingHosts = users.filter((u) => u.role === 'host' && u.verificationStatus === 'pending_review');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Moderation & Anti-Fraud Queue"
        subtitle="Review host organization accreditations, audit listings, and toggle featured event spotlights."
        breadcrumbs={[
          { label: 'Admin Portal', to: '/app/admin/overview' },
          { label: 'Moderation Queue' }
        ]}
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('hosts')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'hosts'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pending Host Reviews ({pendingHosts.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
            activeTab === 'events'
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Event Approvals & Spotlights ({events.length})
        </button>
      </div>

      {/* Tab 1: Host Accreditations */}
      {activeTab === 'hosts' && (
        <div className="space-y-4">
          {pendingHosts.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No pending host applications"
              description="All organizer applications have been reviewed and resolved under the 24h security SLA."
            />
          ) : (
            <div className="space-y-4">
              {pendingHosts.map((host) => (
                <div
                  key={host.id}
                  className="p-6 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={host.avatar}
                      alt={host.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {host.organizationName || host.name}
                        </h4>
                        <span className="badge-chip badge-warning text-[10px]">
                          Pending 24h Review
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Applicant: {host.name} ({host.email}) • Category: {host.hostCategory || 'Tech Community'}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Google Search Index Verified</span>
                        </span>
                        <span>•</span>
                        <span>DNS Domain Linked</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                      onClick={() => rejectHostApplication(host.id)}
                      className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveHostApplication(host.id)}
                      className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                    >
                      Approve & Grant Host Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Events List */}
      {activeTab === 'events' && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-6">Event Program</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Spotlight</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{evt.title}</p>
                    <p className="text-[11px] text-slate-400">{evt.categoryLabel} • {evt.mode}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    {evt.organizer?.name}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleFeatureEvent(evt.id)}
                      className={`badge-chip text-[10px] cursor-pointer transition-colors ${
                        evt.isFeatured ? 'badge-purple' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{evt.isFeatured ? 'Featured Spotlight' : 'Standard'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => approveEvent(evt.id)}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Approve & Refresh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminModerationPage;
