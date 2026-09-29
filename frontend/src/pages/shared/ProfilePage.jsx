import React, { useState } from 'react';
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Edit,
  Shield,
  Calendar,
  Ticket,
  Award,
  Globe,
  Star,
  CheckCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';
import EventCard from '../../components/EventCard';
import StatCard from '../../components/ui/StatCard';

export const ProfilePage = () => {
  const { currentUser, events, registrations, bookmarks, toggleBookmark, showToast } = useEventHub();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(currentUser?.headline || 'AI/ML Enthusiast & Full-Stack Builder');
  const [bio, setBio] = useState(currentUser?.bio || 'Passionate software engineering enthusiast participating in national hackathons and developer bootcamps.');
  const [interests, setInterests] = useState(currentUser?.interests || ['Generative AI', 'System Design', 'Kubernetes', 'Web3']);
  const [newInterest, setNewInterest] = useState('');

  const userRegs = registrations.filter((r) => r.userId === currentUser?.id && r.status === 'confirmed');
  const registeredEventIds = userRegs.map((r) => r.eventId);
  const attendedEvents = events.filter((e) => registeredEventIds.includes(e.id));
  const savedEvents = events.filter((e) => bookmarks.includes(e.id));

  // Profile Completeness Score (e.g. 85%)
  const completeness = 85;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('Profile updated successfully!');
  };

  const addInterestChip = (e) => {
    e.preventDefault();
    if (!newInterest.trim() || interests.includes(newInterest.trim())) return;
    setInterests([...interests, newInterest.trim()]);
    setNewInterest('');
  };

  const removeInterest = (item) => {
    setInterests(interests.filter((i) => i !== item));
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner & Profile Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        {/* Cover Photo */}
        <div className="h-44 sm:h-60 w-full bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 relative">
          <div className="absolute inset-0 bg-mesh-glow opacity-60" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {currentUser?.name || 'Attendee'}
                  </h1>
                  {currentUser?.verified && (
                    <Shield className="h-5 w-5 fill-emerald-500 text-white" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {headline}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{currentUser?.location || 'New Delhi, India'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                    <span>{currentUser?.college || 'IIT Delhi'}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Profile Completeness Progress Meter */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Profile Completeness</span>
              </span>
              <span className="text-indigo-600 dark:text-indigo-400">{completeness}% Complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-indigo-200/50 dark:bg-indigo-900/50 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" style={{ width: `${completeness}%` }} />
            </div>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
              💡 Tip: Add your GitHub and portfolio links to reach 100% and unlock fast-track event shortlisting.
            </p>
          </div>

          {/* Edit Form Drawer */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 mb-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Edit Bio & Headline</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Professional Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Bio</label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-center sm:text-left">
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{attendedEvents.length}</p>
              <p className="text-xs text-slate-500">Events Attended</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{userRegs.length}</p>
              <p className="text-xs text-slate-500">Confirmed Passes</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{savedEvents.length}</p>
              <p className="text-xs text-slate-500">Saved Wishlist</p>
            </div>
            <div>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">3</p>
              <p className="text-xs text-slate-500">Skill Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interests & Bio Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">About Me</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {bio}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Areas of Interest & Skills
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {interests.map((tag) => (
                <span
                  key={tag}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <span>{tag}</span>
                  <button onClick={() => removeInterest(tag)} className="text-indigo-400 hover:text-rose-500">×</button>
                </span>
              ))}
              <form onSubmit={addInterestChip} className="inline-flex items-center">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="+ Add interest"
                  className="rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-transparent px-3 py-1 text-xs outline-none focus:border-indigo-500"
                />
              </form>
            </div>
          </div>
        </div>

        {/* Social and Linked Accounts */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Public Profiles</h3>
          <div className="space-y-2.5">
            {[
              { label: 'LinkedIn Profile', url: 'https://linkedin.com', verified: true },
              { label: 'GitHub Repositories', url: 'https://github.com', verified: true },
              { label: 'Personal Portfolio', url: 'https://alex.dev', verified: false }
            ].map((soc, i) => (
              <a
                key={i}
                href={soc.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <span>{soc.label}</span>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Registered & Attended Events Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'text-slate-500'
            }`}
          >
            Confirmed Passes ({attendedEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'text-slate-500'
            }`}
          >
            Saved Events ({savedEvents.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'overview' ? attendedEvents : savedEvents).map((evt) => (
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

export default ProfilePage;
