import React from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Heart,
  Clock,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/ui/EmptyState';

export const AttendeeOverviewPage = () => {
  const {
    currentUser,
    events,
    registrations,
    bookmarks,
    toggleBookmark,
    ticketModalOpen,
    setTicketModalOpen,
    selectedTicket,
    setSelectedTicket
  } = useEventHub();

  const userRegs = registrations.filter((r) => r.userId === currentUser?.id && r.status !== 'cancelled');
  const confirmedRegs = userRegs.filter((r) => r.status === 'confirmed');
  const waitlistRegs = userRegs.filter((r) => r.status === 'waitlist');

  // Personalized recommendations
  const userInterests = currentUser?.interests || ['hackathon', 'workshop'];
  const recommendedEvents = events
    .filter((e) => e.status === 'published' && !userRegs.some((r) => r.eventId === e.id))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${currentUser?.name || 'Attendee'}! 👋`}
        subtitle="Manage your registered event passes, live waitlist queue, and verified credentials."
        breadcrumbs={[
          { label: 'Attendee Hub', to: '/app/attendee/overview' },
          { label: 'Overview' }
        ]}
        actions={
          <Link
            to="/events"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Discover More Events</span>
          </Link>
        }
      />

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Confirmed Tickets"
          value={confirmedRegs.length}
          subtitle="Ready with QR check-in"
          icon={Ticket}
          color="indigo"
        />
        <StatCard
          title="Saved Wishlist"
          value={bookmarks.length}
          subtitle="Bookmarked events"
          icon={Heart}
          color="rose"
        />
        <StatCard
          title="Waitlist Spots"
          value={waitlistRegs.length}
          subtitle="Auto-promotion active"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Skill Badges"
          value="3"
          subtitle="Verified attendance"
          icon={Award}
          color="emerald"
        />
      </div>

      {/* Confirmed Passes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Registered Passes
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Show your QR code pass at event check-in desks.
            </p>
          </div>
          <Link
            to="/app/attendee/tickets"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View all ({confirmedRegs.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {confirmedRegs.length === 0 ? (
          <EmptyState
            title="No confirmed tickets yet"
            description="Explore our catalog and register for upcoming hackathons, bootcamps and summits."
            action={
              <Link
                to="/events"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors"
              >
                Browse Catalog
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmedRegs.slice(0, 3).map((reg) => {
              const matchedEvent = events.find((e) => e.id === reg.eventId);
              return (
                <div
                  key={reg.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="badge-chip badge-success text-[10px]">
                      Confirmed Pass
                    </span>
                    <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      #{reg.ticketId}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {reg.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {reg.teamName ? `Team: ${reg.teamName}` : 'Individual Entry'}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-500">
                      {reg.ticketType || 'Standard Entry'}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedTicket(reg);
                        setTicketModalOpen(true);
                      }}
                      className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      View Pass
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended for You */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <span>Recommended for You</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated events matching your interests and background.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              isBookmarked={bookmarks.includes(evt.id)}
              onToggleBookmark={() => toggleBookmark(evt.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeeOverviewPage;
