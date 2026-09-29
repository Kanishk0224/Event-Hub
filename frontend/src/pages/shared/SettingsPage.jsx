import React, { useState } from 'react';
import {
  User,
  Bell,
  Palette,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Laptop
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import { useTheme } from '../../context/ThemeContext';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export const SettingsPage = () => {
  const { currentUser, showToast } = useEventHub();
  const { themeMode, setThemeMode } = useTheme();

  const [activeTab, setActiveTab] = useState('account');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Account State
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Notifications State
  const [notifState, setNotifState] = useState({
    ticketUpdates: true,
    waitlistPromotions: true,
    hostBroadcasts: true,
    marketingEmails: false
  });

  // Privacy State
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [showAttended, setShowAttended] = useState(true);

  const handleSaveAccount = (e) => {
    e.preventDefault();
    showToast('Account credentials saved.');
  };

  const toggleNotif = (key) => {
    setNotifState((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification preference updated.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Account & Platform Settings"
        subtitle="Manage personal credentials, notification alerts, appearance themes, and security."
        breadcrumbs={[
          { label: 'Settings' }
        ]}
      />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sub-nav */}
        <div className="w-full md:w-60 shrink-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm space-y-1">
          {[
            { id: 'account', label: 'Account Credentials', icon: User },
            { id: 'notifications', label: 'Notification Alerts', icon: Bell },
            { id: 'appearance', label: 'Theme & Appearance', icon: Palette },
            { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
            { id: 'sessions', label: 'Active Sessions', icon: Laptop }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Body */}
        <div className="flex-1 w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          {/* 1. Account */}
          {activeTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Account Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Change Password</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete My Account</span>
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* 2. Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                {[
                  { key: 'ticketUpdates', title: 'Ticket & Check-in QR Alerts', desc: 'Receive instant notifications when your admission ticket is issued or confirmed.' },
                  { key: 'waitlistPromotions', title: 'Automated Waitlist Promotion', desc: 'Get SMS & email alerts immediately when a seat opens up for a waitlisted event.' },
                  { key: 'hostBroadcasts', title: 'Host Announcements & Discord Links', desc: 'Receive urgent broadcast notifications and live room links from event organizers.' },
                  { key: 'marketingEmails', title: 'Weekly Event Digest', desc: 'Weekly newsletter of trending national hackathons and developer summits.' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="max-w-md">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifState[item.key]}
                      onChange={() => toggleNotif(item.key)}
                      className="h-4 w-4 rounded text-indigo-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Theme & Interface Appearance
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light Theme', icon: Sun },
                  { id: 'dark', label: 'Dark Mode (Default)', icon: Moon },
                  { id: 'system', label: 'System Automatic', icon: Monitor }
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setThemeMode(t.id);
                        showToast(`Theme switched to ${t.label}`);
                      }}
                      className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center gap-3 cursor-pointer ${
                        themeMode === t.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-md'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Privacy */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Privacy & Visibility
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Public Profile Visibility</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Allow organizers and teammates to view your bio and certifications.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPublicProfile}
                    onChange={(e) => {
                      setIsPublicProfile(e.target.checked);
                      showToast('Profile visibility updated.');
                    }}
                    className="h-4 w-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Display Attended Events</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Showcase completed hackathons and workshops on your public profile.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={showAttended}
                    onChange={(e) => {
                      setShowAttended(e.target.checked);
                      showToast('Showcase settings saved.');
                    }}
                    className="h-4 w-4 rounded text-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Sessions */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Active Browser Sessions
              </h3>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Chrome on Windows (Current Session)</p>
                      <p className="text-[11px] text-slate-500">IP: 103.21.244.12 • New Delhi, India</p>
                    </div>
                  </div>
                  <span className="badge-chip badge-success text-[10px]">Active Now</span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Safari on iPhone 15 Pro</p>
                      <p className="text-[11px] text-slate-500">Last active 2 days ago</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Session revoked.')}
                    className="text-xs text-rose-600 hover:underline font-semibold"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          showToast('Account marked for deletion.');
        }}
        title="Permanently Delete Account?"
        message="This action will permanently delete your account, saved passes, and organizer listings. This cannot be undone."
        confirmText="Yes, Delete Everything"
        isDanger={true}
      />
    </div>
  );
};

export default SettingsPage;
