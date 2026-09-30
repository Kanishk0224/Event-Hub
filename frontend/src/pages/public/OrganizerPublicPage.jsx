import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Calendar,
  Star,
  Globe,
  Mail,
  MapPin,
  CheckCircle,
  Sparkles,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import EventCard from '../../components/EventCard';
import RatingStars from '../../components/ui/RatingStars';
import EmptyState from '../../components/ui/EmptyState';

export const OrganizerPublicPage = () => {
  const { id } = useParams();
  const { users, events, bookmarks, toggleBookmark, showToast } = useEventHub();

  const organizer = users.find((u) => u.id === id || u.organizationName?.toLowerCase().includes(id?.toLowerCase())) || {
    id: id || 'org-1',
    name: 'Google Developer Group & IIT Delhi',
    organizationName: 'Google Developer Group & IIT Delhi',
    hostCategory: 'Premier Tech Community',
    avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
    verified: true,
    website: 'https://gdg.community.dev',
    email: 'contact@gdg.org',
    location: 'New Delhi, India'
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(2450);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
      showToast(`Unfollowed ${organizer.organizationName || organizer.name}`);
    } else {
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
      showToast(`Now following ${organizer.organizationName || organizer.name}! You will be notified of new events.`);
    }
  };

  const hostedEvents = events.filter(
    (e) => e.organizer?.id === organizer.id || e.organizer?.name === (organizer.organizationName || organizer.name)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Profile Banner Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        {/* Cover Photo */}
        <div className="h-44 sm:h-64 w-full bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 relative">
          <div className="absolute inset-0 bg-mesh-glow opacity-60" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={organizer.avatar}
                alt={organizer.name}
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {organizer.organizationName || organizer.name}
                  </h1>
                  {organizer.verified && (
                    <Shield className="h-5 w-5 fill-emerald-500 text-white" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {organizer.hostCategory || 'Premier Technology Community'}
                </p>
              </div>
            </div>

            {/* Follow & Contact Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleFollowToggle}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md ${
                  isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 hover:opacity-95'
                }`}
              >
                {isFollowing ? <UserCheck className="h-4 w-4 text-emerald-500" /> : <UserPlus className="h-4 w-4" />}
                <span>{isFollowing ? 'Following' : 'Follow Host'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-center sm:text-left">
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{followerCount.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{hostedEvents.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Events Hosted</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">4.9 / 5.0</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Host Rating</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified Accreditation</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hosted Events Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Hosted Events
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Browse flagship hackathons and workshops organized by this community.
            </p>
          </div>
        </div>

        {hostedEvents.length === 0 ? (
          <EmptyState
            title="No events listed yet"
            description="This organizer has no active events right now. Follow them to be notified of new announcements."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isBookmarked={bookmarks.includes(event.id)}
                onToggleBookmark={() => toggleBookmark(event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerPublicPage;
