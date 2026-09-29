import { useState } from 'react';
import { useEventHub } from '../../context/EventHubContext';
import { AnimatePresence, motion } from 'framer-motion';
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
import {
  Layers,
  PlusCircle,
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  Eye,
  Trash2,
  AlertCircle,
  ArrowRight,
  Building,
  Activity
} from 'lucide-react';

export const OrganizerDashboard = ({ onSelectEvent }) => {
  const {
    currentUser,
    events,
    registrations,
    createEvent,
    cancelEvent,
    checkInAttendee,
    showToast
  } = useEventHub();

  const [activeSubTab, setActiveSubTab] = useState('manage-events'); // 'manage-events' | 'create-event' | 'participants' | 'analytics'
  const [eventFilterStatus, setEventFilterStatus] = useState('all');
  const [selectedEventForRoster, setSelectedEventForRoster] = useState('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [cancelModalEventId, setCancelModalEventId] = useState(null);

  // Form state for Create Event
  const [newEventData, setNewEventData] = useState({
    title: '',
    category: 'hackathon',
    categoryLabel: 'Hackathon',
    tagline: '',
    description: '',
    mode: 'Hybrid',
    location: 'IIT Delhi Campus & Virtual Live Stream',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    registrationDeadline: '2026-10-12T23:59:59',
    maxCapacity: 300,
    allowWaitlist: true,
    isFree: true,
    price: 0,
    teamSize: '1 - 4 Members',
    eligibility: 'Open for all students and professionals',
    schedule: [
      {
        day: 'Day 1',
        sessions: [
          { time: '10:00 AM - 11:30 AM', title: 'Keynote & Problem Statement Release', speaker: 'Lead Architect', room: 'Main Conclave' },
          { time: '02:00 PM - 05:00 PM', title: 'Mentorship Rounds & Code Review', speaker: 'Industry Specialist', room: 'Lab 1' }
        ]
      }
    ],
    prizes: [
      { rank: '1st Prize (Grand Winner)', prize: '₹1,50,000 Cash + Grants' },
      { rank: 'Runner Up', prize: '₹75,000 Cash + Cloud Credits' }
    ],
    perks: ['Official Verified Certificate', 'Direct Internship Interviews', 'Exclusive Swag Kits']
  });

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Building size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Organizer Studio
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please log in as an Event Host or Organizer to manage your events and attendee rosters.
        </p>
      </div>
    );
  }

  // Host events
  const hostEvents = events.filter(
    e => e.organizer?.email === currentUser.email || currentUser.role === 'host' || currentUser.role === 'admin'
  );

  const filteredEvents = hostEvents.filter(e => {
    if (eventFilterStatus === 'all') return true;
    return e.status === eventFilterStatus;
  });

  // Host Metrics
  const totalHostRegistrations = registrations.filter(
    r => hostEvents.some(e => e.id === r.eventId) && r.status !== 'cancelled'
  );
  const totalCheckedIn = totalHostRegistrations.filter(r => r.checkedIn).length;
  const avgFillRate = hostEvents.length > 0
    ? Math.round(
        (hostEvents.reduce((acc, e) => acc + (e.registeredCount / e.maxCapacity), 0) / hostEvents.length) * 100
      )
    : 0;

  // Chart Mock Data
  const registrationTrendData = [
    { name: 'Mon', registrations: 24, checkins: 10 },
    { name: 'Tue', registrations: 48, checkins: 22 },
    { name: 'Wed', registrations: 72, checkins: 45 },
    { name: 'Thu', registrations: 110, checkins: 80 },
    { name: 'Fri', registrations: 165, checkins: 130 },
    { name: 'Sat', registrations: 220, checkins: 195 },
    { name: 'Sun', registrations: 280, checkins: 240 }
  ];

  const categoryDistributionData = [
    { name: 'Hackathons', value: 45, color: '#6366F1' },
    { name: 'Workshops', value: 25, color: '#A855F7' },
    { name: 'Summits', value: 18, color: '#EC4899' },
    { name: 'Cultural', value: 12, color: '#F59E0B' }
  ];

  // Roster Filter
  const rosterParticipants = registrations.filter(r => {
    const matchesEvent = selectedEventForRoster === 'all' || r.eventId === selectedEventForRoster;
    const matchesSearch = rosterSearch === '' ||
      r.userName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.ticketId.toLowerCase().includes(rosterSearch.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const handleExportCSV = () => {
    if (rosterParticipants.length === 0) {
      showToast('No participants to export.', 'warning');
      return;
    }
    const headers = 'Ticket ID,Name,Email,Role,Affiliation,Event,Status,Checked In\n';
    const rows = rosterParticipants.map(r =>
      `"${r.ticketId}","${r.userName}","${r.userEmail}","${r.userRole}","${r.affiliation}","${r.eventTitle}","${r.status}","${r.checkedIn ? 'Yes' : 'No'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EventHub-Participants-${Date.now()}.csv`;
    a.click();
    showToast('Participant roster exported to CSV successfully!');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createEvent(newEventData);
    setActiveSubTab('manage-events');
  };

  const handleConfirmCancelEvent = (eventId) => {
    cancelEvent(eventId, 'Host administrative schedule revision');
    setCancelModalEventId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Building size={32} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentUser.organizationName || currentUser.institutionName || currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>Verified Event Host</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Organizer Studio • Real-Time Ticket Desk, Capacity Engine & Analytics
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveSubTab('create-event')}
          className="btn-primary flex-shrink-0"
        >
          <PlusCircle size={16} />
          <span>Publish New Event</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Events Hosted</span>
            <Layers size={18} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {hostEvents.length}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">Published & Active</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registrations</span>
            <Users size={18} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {totalHostRegistrations.length}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">Active passes</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Desk Check-Ins</span>
            <CheckCircle2 size={18} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {totalCheckedIn}
          </span>
          <p className="text-xs text-slate-500 mt-0.5">Verified QR scans</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-amber-500 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Capacity Fill</span>
            <TrendingUp size={18} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {avgFillRate}%
          </span>
          <p className="text-xs text-slate-500 mt-0.5">Attendance demand</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('manage-events')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'manage-events'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers size={16} />
          <span>My Events ({hostEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('participants')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'participants'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users size={16} />
          <span>Attendee Desk & Roster ({totalHostRegistrations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity size={16} />
          <span>Analytics & Reports</span>
        </button>

        <button
          onClick={() => setActiveSubTab('create-event')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'create-event'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PlusCircle size={16} />
          <span>Create Event Wizard</span>
        </button>
      </div>

      {/* TAB 1: MANAGE EVENTS TABLE */}
      {activeSubTab === 'manage-events' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Status:</span>
              <select
                value={eventFilterStatus}
                onChange={(e) => setEventFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">All Events</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Event Details</th>
                  <th className="p-4">Format</th>
                  <th className="p-4">Registrations / Cap</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerUrl}
                          alt=""
                          className="w-12 h-9 rounded-lg object-cover flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm block">
                            {evt.title}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(evt.startDate).toLocaleDateString()} • {evt.categoryLabel || evt.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {evt.mode}
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span>{evt.registeredCount} / {evt.maxCapacity}</span>
                          <span className="text-indigo-600 dark:text-indigo-400">
                            {Math.round((evt.registeredCount / evt.maxCapacity) * 100)}%
                          </span>
                        </div>
                        <div className="w-28 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${Math.min(100, (evt.registeredCount / evt.maxCapacity) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectEvent(evt)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          title="Preview Detail View"
                        >
                          <Eye size={16} />
                        </button>
                        {evt.status === 'published' && (
                          <button
                            onClick={() => setCancelModalEventId(evt.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Cancel Event"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PARTICIPANTS ROSTER & DESK CHECK-IN */}
      {activeSubTab === 'participants' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search attendee by name, email, ticket..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={selectedEventForRoster}
                onChange={(e) => setSelectedEventForRoster(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">All Events Roster</option>
                {hostEvents.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleExportCSV}
              className="btn-secondary !py-1.5 !px-3 text-xs"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Ticket ID</th>
                  <th className="p-4">Attendee Name</th>
                  <th className="p-4">Affiliation / Org</th>
                  <th className="p-4">Target Event</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Desk Check-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rosterParticipants.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {reg.ticketId}
                    </td>
                    <td className="p-4">
                      <strong className="text-slate-900 dark:text-white block">{reg.userName}</strong>
                      <span className="text-[11px] text-slate-400">{reg.userEmail}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {reg.affiliation}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">
                      {reg.eventTitle}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        reg.status === 'confirmed'
                          ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => checkInAttendee(reg.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          reg.checkedIn
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {reg.checkedIn ? '✓ Checked In' : 'Scan & Check-In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ANALYTICS & CHARTS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration Trends Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Registration Growth & Check-Ins
                  </h3>
                  <p className="text-xs text-slate-400">Daily ticket issuance tracking</p>
                </div>
                <TrendingUp size={18} className="text-indigo-500" />
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={registrationTrendData}>
                    <defs>
                      <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderRadius: '0.75rem',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="registrations" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#regGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Attendance by Category
                  </h3>
                  <p className="text-xs text-slate-400">Distribution across hosted formats</p>
                </div>
                <Layers size={18} className="text-purple-500" />
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderRadius: '0.75rem',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                {categoryDistributionData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CREATE EVENT WIZARD */}
      {activeSubTab === 'create-event' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Create & Publish Event
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure event schedule, capacity limits, tickets, and awards.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Event Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Genesis AI Hackathon 2026"
                value={newEventData.title}
                onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category *
                </label>
                <select
                  value={newEventData.category}
                  onChange={(e) => setNewEventData({
                    ...newEventData,
                    category: e.target.value,
                    categoryLabel: e.target.options[e.target.selectedIndex].text
                  })}
                  className="input-field"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="tech-talk">Tech Talk & Summit</option>
                  <option value="cultural">Cultural Festival</option>
                  <option value="case-comp">Case Competition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Event Format *
                </label>
                <select
                  value={newEventData.mode}
                  onChange={(e) => setNewEventData({ ...newEventData, mode: e.target.value })}
                  className="input-field"
                >
                  <option value="Hybrid">Hybrid (Campus + Online)</option>
                  <option value="Online">100% Online / Virtual</option>
                  <option value="In-Person">In-Person / Offline Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Tagline / Summary
              </label>
              <input
                type="text"
                placeholder="Brief high-impact one-liner about the event..."
                value={newEventData.tagline}
                onChange={(e) => setNewEventData({ ...newEventData, tagline: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Detailed Description & Problem Statement
              </label>
              <textarea
                rows={3}
                placeholder="Comprehensive description of tracks, perks, and eligibility..."
                value={newEventData.description}
                onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                required
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={newEventData.maxCapacity}
                  onChange={(e) => setNewEventData({ ...newEventData, maxCapacity: parseInt(e.target.value) || 100 })}
                  required
                  className="input-field"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Free or Paid
                </label>
                <select
                  value={newEventData.isFree ? 'free' : 'paid'}
                  onChange={(e) => setNewEventData({
                    ...newEventData,
                    isFree: e.target.value === 'free',
                    price: e.target.value === 'free' ? 0 : 499
                  })}
                  className="input-field"
                >
                  <option value="free">Free for All</option>
                  <option value="paid">Paid Delegate Ticket</option>
                </select>
              </div>

              {!newEventData.isFree && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newEventData.price}
                    onChange={(e) => setNewEventData({ ...newEventData, price: parseInt(e.target.value) || 0 })}
                    className="input-field"
                  />
                </div>
              )}
            </div>

            <button type="submit" className="w-full btn-primary !py-3">
              <span>Publish Event to Catalog</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Cancel Event Confirm Modal */}
      <AnimatePresence>
        {cancelModalEventId && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cancel This Event?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  All registered attendees will be dispatched automated cancellation notifications and the event will be unlisted.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCancelModalEventId(null)}
                  className="flex-1 btn-secondary !py-2 text-xs"
                >
                  Keep Event Active
                </button>
                <button
                  onClick={() => handleConfirmCancelEvent(cancelModalEventId)}
                  className="flex-1 btn-danger !py-2 text-xs"
                >
                  Confirm Cancellation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
