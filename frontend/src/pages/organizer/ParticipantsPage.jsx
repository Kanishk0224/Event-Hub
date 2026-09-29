import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  CheckCircle,
  Clock,
  Filter,
  Trash2,
  Mail,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

export const ParticipantsPage = () => {
  const { registrations, checkInAttendee, showToast } = useEventHub();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.userName?.toLowerCase().includes(q);
        const matchesEmail = r.userEmail?.toLowerCase().includes(q);
        const matchesTicket = r.ticketId?.toLowerCase().includes(q);
        const matchesEvent = r.eventTitle?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesTicket && !matchesEvent) return false;
      }
      return true;
    });
  }, [registrations, searchQuery, statusFilter]);

  const exportCsv = () => {
    const headers = ['Ticket ID', 'Attendee Name', 'Email', 'Event Title', 'Status', 'Checked In', 'Registration Date'];
    const rows = filteredRegistrations.map((r) => [
      r.ticketId,
      r.userName,
      r.userEmail || 'attendee@eventhub.com',
      `"${r.eventTitle}"`,
      r.status,
      r.checkedIn ? 'Yes' : 'No',
      new Date(r.registrationDate).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'attendee-roster.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported attendee roster to CSV.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Participant Roster & Check-ins"
        subtitle={`Total Registrants: ${registrations.length} • Checked In: ${registrations.filter((r) => r.checkedIn).length}`}
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Participants' }
        ]}
        actions={
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-indigo-500 shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-indigo-500" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, ticket ID..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'confirmed', 'waitlist'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-6">Attendee & Email</th>
                <th className="py-3.5 px-4">Event Program</th>
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Desk Check-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900 dark:text-white">{reg.userName}</p>
                    <p className="text-[11px] text-slate-400">{reg.userEmail || `${reg.userName.toLowerCase().replace(/\s+/g, '')}@gmail.com`}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                    <p className="font-medium line-clamp-1">{reg.eventTitle}</p>
                    <p className="text-[10px] text-slate-400">{reg.ticketType || 'Standard Entry'}</p>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    #{reg.ticketId}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`badge-chip text-[10px] ${
                        reg.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {reg.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => checkInAttendee(reg.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        reg.checkedIn
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                          : 'border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{reg.checkedIn ? 'Checked In' : 'Mark Present'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsPage;
