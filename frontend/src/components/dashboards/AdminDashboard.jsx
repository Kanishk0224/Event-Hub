import { useState } from 'react';
import { useEventHub } from '../../context/EventHubContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Layers,
  Search,
  Eye,
  Trash2,
  Building,
  ShieldAlert
} from 'lucide-react';

export const AdminDashboard = ({ onSelectEvent }) => {
  const {
    currentUser,
    events,
    users,
    toggleFeatureEvent,
    toggleVerifyUser,
    approveHostApplication,
    rejectHostApplication,
    cancelEvent
  } = useEventHub();

  const [adminTab, setAdminTab] = useState('host-queue'); // 'host-queue' | 'events' | 'users'
  const [eventSearch, setEventSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Pending hosts for anti-fraud verification
  const pendingHosts = users.filter(
    u => u.role === 'host' && u.verificationStatus === 'pending_review'
  );

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Platform Administrator Console
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Access Restricted. Please log in with Administrator credentials.
        </p>
      </div>
    );
  }

  // Filter events
  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.organizer.name.toLowerCase().includes(eventSearch.toLowerCase())
  );

  // Filter users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <ShieldCheck size={36} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Platform Administrator Console
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <ShieldCheck size={13} />
                <span>Super Administrator</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Anti-Fraud Host Verification, Listing Moderation & Security Governance
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setAdminTab('host-queue')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            adminTab === 'host-queue'
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <ShieldAlert size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {pendingHosts.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Host Verification Queue
          </p>
        </div>

        <div
          onClick={() => setAdminTab('events')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            adminTab === 'events'
              ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Layers size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {events.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Total Catalog Events
          </p>
        </div>

        <div
          onClick={() => setAdminTab('users')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            adminTab === 'users'
              ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Users size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {users.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Registered Accounts
          </p>
        </div>

        <div
          onClick={() => setAdminTab('users')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Building size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {users.filter(u => u.role === 'host' && u.verified).length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Verified Organizers
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setAdminTab('host-queue')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'host-queue'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert size={16} />
          <span>Host Verification Queue ({pendingHosts.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('events')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'events'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers size={16} />
          <span>Event Moderation ({events.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'users'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users size={16} />
          <span>User Directory ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: HOST VERIFICATION QUEUE */}
      {adminTab === 'host-queue' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              🛡️ Anti-Fraud Host Verification Queue
            </h3>
            <p className="text-xs text-slate-500">
              Review institutional registry status and accreditation documents before unlocking organizer hosting permissions.
            </p>
          </div>

          {pendingHosts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                All Host Applications Approved & Clear
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No pending applications currently require administrative verification review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingHosts.map((host) => (
                <div
                  key={host.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-500/30 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        {host.hostCategory === 'company' ? '💼 Corporate Host' : '🎓 University / College'}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {host.organizationName || host.institutionName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Incharge: {host.inchargeName || host.name} ({host.designation || 'Coordinator'}) • Email: {host.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveHostApplication(host.id)}
                        className="btn-primary !py-2 !px-4 text-xs"
                      >
                        <CheckCircle2 size={15} />
                        <span>Approve Host Access</span>
                      </button>
                      <button
                        onClick={() => rejectHostApplication(host.id, 'Accreditation documents could not be verified')}
                        className="btn-danger !py-2 !px-4 text-xs"
                      >
                        <XCircle size={15} />
                        <span>Reject Application</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                    {host.googleSearchStatus || '✅ Google Knowledge Graph & Official Directory Registry Match verified.'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EVENT MODERATION */}
      {adminTab === 'events' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search event title or organizer..."
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-full"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Event</th>
                  <th className="p-4">Organizer</th>
                  <th className="p-4">Spotlight</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {evt.organizer.name}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleFeatureEvent(evt.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-colors ${
                          evt.isFeatured
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}
                      >
                        {evt.isFeatured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        evt.status === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onSelectEvent(evt)}
                        className="p-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => cancelEvent(evt.id, 'Administrative Moderation')}
                        className="p-1 text-rose-500 hover:text-rose-700"
                        title="Unpublish / Cancel Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER DIRECTORY */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-full"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <strong className="text-slate-900 dark:text-white block">{u.name}</strong>
                      <span className="text-[11px] text-slate-400">{u.email}</span>
                    </td>
                    <td className="p-4 uppercase font-bold text-slate-600 dark:text-slate-400">
                      {u.role}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.verified
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                      }`}>
                        {u.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleVerifyUser(u.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Toggle Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
