import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/ui/EmptyState';

export const SavedEventsPage = () => {
  const { events, bookmarks, toggleBookmark } = useEventHub();

  const savedEvents = events.filter((e) => bookmarks.includes(e.id));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Saved Events Wishlist"
        subtitle="Keep track of upcoming hackathons, conferences, and workshops you plan to attend."
        breadcrumbs={[
          { label: 'Attendee Hub', to: '/app/attendee/overview' },
          { label: 'Saved Wishlist' }
        ]}
      />

      {savedEvents.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Click the heart icon on any event card across the catalog to save it here for quick access."
          action={
            <Link
              to="/events"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              Explore Events
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isBookmarked={true}
              onToggleBookmark={() => toggleBookmark(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedEventsPage;
