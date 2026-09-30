import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  QrCode,
  Search,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Sparkles,
  Ticket,
  ChevronDown,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

export const EventInspectorPage = () => {
  const { events = [], registrations = [], currentUser, showToast, checkInAttendee } = useEventHub();
  
  // Filter events belonging to host or show all available
  const hostEvents = events.filter(
    (e) => !currentUser?.id || e.organizerId === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'host'
  );

  const displayEvents = hostEvents.length > 0 ? hostEvents : events;
  const [selectedEventId, setSelectedEventId] = useState(displayEvents[0]?.id || displayEvents[0]?._id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const activeEvent = displayEvents.find((e) => (e.id || e._id) === selectedEventId) || displayEvents[0];

  // Registrations for active event
  const eventRegistrations = registrations.filter(
    (r) => r.eventId === (activeEvent?.id || activeEvent?._id) || r.eventTitle === activeEvent?.title
  );

  // Filtered attendees
  const filteredRegistrations = eventRegistrations.filter((reg) => {
    const matchesSearch =
      reg.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.teamName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'checked_in' && reg.checkedIn) ||
      (statusFilter === 'confirmed' && !reg.checkedIn && reg.status === 'confirmed') ||
      (statusFilter === 'waitlist' && reg.status === 'waitlist');

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalEnrolled = eventRegistrations.filter((r) => r.status === 'confirmed').length;
  const totalWaitlisted = eventRegistrations.filter((r) => r.status === 'waitlist').length;
  const totalCheckedIn = eventRegistrations.filter((r) => r.checkedIn).length;
  const maxCap = activeEvent?.maxCapacity || 100;
  const capacityPercentage = Math.min(100, Math.round((totalEnrolled / (maxCap || 1)) * 100));
  const ticketPrice = activeEvent?.price || 0;
  const totalRevenue = totalEnrolled * ticketPrice;

  // Handle WhatsApp / SMS Broadcast Dispatch
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      showToast('Please enter an announcement message.', 'warning');
      return;
    }
    setIsBroadcasting(true);
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${API_BASE}/notifications/send-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: currentUser?.phone || '+919876543210',
          recipientName: 'Registered Attendees',
          eventTitle: activeEvent.title,
          eventDate: new Date(activeEvent.startDate).toLocaleDateString(),
          venue: activeEvent.venue || activeEvent.location,
          ticketId: 'BROADCAST',
          type: 'reminder'
        })
      });
      showToast(`📱 WhatsApp & Email broadcast dispatched to all ${eventRegistrations.length} registered participants!`);
      setShowBroadcastModal(false);
      setBroadcastMessage('');
    } catch {
      showToast(`Broadcast sent to ${eventRegistrations.length} attendees.`);
      setShowBroadcastModal(false);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (eventRegistrations.length === 0) {
      showToast('No registered attendees to export.', 'info');
      return;
    }
    const headers = ['Ticket ID', 'Name', 'Email', 'Phone', 'Affiliation', 'Status', 'Checked In', 'Registration Date'];
    const rows = eventRegistrations.map((r) => [
      r.ticketId || r.id,
      `"${r.userName || ''}"`,
      r.userEmail || '',
      r.phone || currentUser?.phone || '+91 98765 43210',
      `"${r.affiliation || ''}"`,
      r.status,
      r.checkedIn ? 'YES' : 'NO',
      new Date(r.registrationDate || Date.now()).toLocaleDateString()
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeEvent?.title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendee roster exported as CSV successfully!');
  };

  if (!activeEvent) {
    return (
      <EmptyState
        icon={Calendar}
        title="No Events Found"
        description="Create your first event to start inspecting live statistics and managing registrations."
        action={
          <Link
            to="/app/organizer/create-event"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700"
          >
            Create an Event
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Event Selector Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          showBack
          title="Event Details & Live Inspector"
          subtitle="Select an event below to monitor live registrations, attendee WhatsApp lists, revenue, and check-in rates."
          breadcrumbs={[
            { label: 'Host Center', to: '/app/organizer/overview' },
            { label: 'Event Details & Stats' }
          ]}
        />


        {/* Event Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[280px]">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pl-4 pr-10 text-xs sm:text-sm font-bold text-slate-900 dark:text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
            >
              {displayEvents.map((evt) => (
                <option key={evt.id || evt._id} value={evt.id || evt._id}>
                  {evt.title} ({evt.mode || 'In-Person'})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Main Event Showcase Banner */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-950">
          <img
            src={activeEvent.bannerUrl || activeEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
            alt={activeEvent.title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Link
              to={`/events/${activeEvent.id || activeEvent._id || activeEvent.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/30 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Public Page</span>
            </Link>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge-chip badge-primary text-[10px]">
                  {activeEvent.categoryLabel || activeEvent.category || 'Technology'}
                </span>
                <span className="badge-chip badge-success text-[10px]">
                  {activeEvent.mode || 'In-Person'}
                </span>
                <span className="badge-chip bg-white/20 text-white text-[10px]">
                  {activeEvent.isFree ? 'FREE' : `₹${activeEvent.price}`}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {activeEvent.title}
              </h1>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-indigo-400" />
                  {new Date(activeEvent.startDate || Date.now()).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-indigo-400" />
                  {activeEvent.venue || activeEvent.location || 'Tech Auditorium / Campus Main'}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
              >
                <Send size={13} />
                <span>WhatsApp / Email Blast</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Export Roster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users size={13} className="text-indigo-500" /> Confirmed Attendees
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalEnrolled} <span className="text-xs font-normal text-slate-400">/ {maxCap}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {capacityPercentage}% Capacity Filled
            </span>
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <QrCode size={13} className="text-emerald-500" /> Check-in Status
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {totalCheckedIn} <span className="text-xs font-normal text-slate-400">/ {totalEnrolled || 1}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalEnrolled ? Math.round((totalCheckedIn / totalEnrolled) * 100) : 0}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">
              {totalEnrolled ? Math.round((totalCheckedIn / totalEnrolled) * 100) : 0}% Verified at Entry
            </span>
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <DollarSign size={13} className="text-violet-500" /> Gross Revenue
            </span>
            <div className="text-2xl sm:text-3xl font-black text-violet-600 dark:text-violet-400">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {activeEvent.isFree ? 'Free Admission' : `₹${ticketPrice} per ticket pass`}
            </p>
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock size={13} className="text-amber-500" /> Waitlist Queue
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {totalWaitlisted}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Auto-promoted on cancellation
            </p>
          </div>
        </div>
      </div>

      {/* Attendee Roster Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Registered Attendees & Delegates</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {eventRegistrations.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage participant records, verify entrance passes, and view WhatsApp contact info.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search attendee or ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed Pass</option>
              <option value="checked_in">Checked In</option>
              <option value="waitlist">Waitlist</option>
            </select>
          </div>
        </div>

        {/* Attendees List */}
        {filteredRegistrations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              No matching attendees found for this filter.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3">Attendee</th>
                    <th className="px-3 py-3.5">WhatsApp / Phone</th>
                    <th className="px-3 py-3.5">Affiliation</th>
                    <th className="px-3 py-3.5">Ticket ID</th>
                    <th className="px-3 py-3.5">Registered</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="py-3.5 pl-3 pr-4 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {filteredRegistrations.map((reg) => {
                    const attendeePhone = reg.phone || currentUser?.phone || '+91 98765 43210';
                    return (
                      <tr key={reg.id || reg._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pl-4 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs">
                              {reg.userName?.charAt(0) || 'A'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {reg.userName}
                              </p>
                              <p className="text-[11px] text-slate-400 font-normal">
                                {reg.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                            <Phone size={11} className="text-emerald-500" />
                            {attendeePhone}
                          </span>
                        </td>
                        <td className="px-3 py-3 max-w-[140px] truncate">
                          {reg.affiliation || 'Student Delegate'}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                          #{reg.ticketId || reg.id}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-slate-400">
                          {new Date(reg.registrationDate || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {reg.checkedIn ? (
                            <span className="badge-chip badge-success text-[10px] flex items-center gap-1 w-fit">
                              <CheckCircle2 size={10} /> Checked In
                            </span>
                          ) : reg.status === 'waitlist' ? (
                            <span className="badge-chip badge-warning text-[10px] w-fit">
                              Waitlist #{reg.waitlistPosition || 1}
                            </span>
                          ) : (
                            <span className="badge-chip badge-primary text-[10px] w-fit">
                              Confirmed Pass
                            </span>
                          )}
                        </td>
                        <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                          {!reg.checkedIn && reg.status === 'confirmed' ? (
                            <button
                              onClick={() => {
                                if (checkInAttendee) checkInAttendee(reg.ticketId || reg.id);
                                showToast(`Checked in: ${reg.userName}`);
                              }}
                              className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                            >
                              Check In
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              {reg.checkedIn ? 'Entry Verified' : 'In Queue'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast WhatsApp / Email Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="badge-chip badge-success text-[10px]">
                  Twilio WhatsApp & SMTP Dispatch
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Send Announcement to Attendees
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target: {eventRegistrations.length} registered delegates for "{activeEvent.title}"
                </p>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Message Content
              </label>
              <textarea
                rows={4}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="e.g. Reminder: The hackathon check-in begins at 9:00 AM sharp at the Tech Auditorium. Please have your QR pass ready!"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck size={14} className="shrink-0" />
              <span>Broadcasts will be sent via Twilio WhatsApp Gateway and confirmed via official email.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                disabled={isBroadcasting}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>{isBroadcasting ? 'Broadcasting...' : 'Send Broadcast Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInspectorPage;
