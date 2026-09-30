import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import DiscoverPage from './pages/public/DiscoverPage';
import EventDetailPage from './pages/public/EventDetailPage';
import OrganizerPublicPage from './pages/public/OrganizerPublicPage';
import AuthPage from './pages/public/AuthPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Attendee Pages
import AttendeeOverviewPage from './pages/attendee/AttendeeOverviewPage';
import MyTicketsPage from './pages/attendee/MyTicketsPage';
import SavedEventsPage from './pages/attendee/SavedEventsPage';
import AttendeeCalendarPage from './pages/attendee/AttendeeCalendarPage';
import WaitlistPage from './pages/attendee/WaitlistPage';
import NotificationsPage from './pages/attendee/NotificationsPage';

// Organizer Pages
import OrganizerOverviewPage from './pages/organizer/OrganizerOverviewPage';
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage';
import CreateEventWizardPage from './pages/organizer/CreateEventWizardPage';
import ParticipantsPage from './pages/organizer/ParticipantsPage';
import CheckInPage from './pages/organizer/CheckInPage';
import OrganizerAnalyticsPage from './pages/organizer/OrganizerAnalyticsPage';
import EventInspectorPage from './pages/organizer/EventInspectorPage';
import AnnouncementsPage from './pages/organizer/AnnouncementsPage';
import TeamMembersPage from './pages/organizer/TeamMembersPage';

// Admin Pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminModerationPage from './pages/admin/AdminModerationPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Shared Profile & Settings
import ProfilePage from './pages/shared/ProfilePage';
import SettingsPage from './pages/shared/SettingsPage';

export function App() {
  return (
    <Routes>
      {/* 1. Public Routes (PublicLayout with Top Navbar & Footer) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<DiscoverPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/organizers/:id" element={<OrganizerPublicPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 2. Authenticated App Routes (AppLayout with Collapsible Sidebar & Header) */}
      <Route path="/app" element={<AppLayout />}>
        {/* Attendee Space */}
        <Route path="attendee/overview" element={<AttendeeOverviewPage />} />
        <Route path="attendee/tickets" element={<MyTicketsPage />} />
        <Route path="attendee/saved" element={<SavedEventsPage />} />
        <Route path="attendee/calendar" element={<AttendeeCalendarPage />} />
        <Route path="attendee/waitlist" element={<WaitlistPage />} />
        <Route path="attendee/notifications" element={<NotificationsPage />} />
        <Route path="attendee/profile" element={<ProfilePage />} />
        <Route path="attendee/settings" element={<SettingsPage />} />

        {/* Organizer Space */}
        <Route path="organizer/overview" element={<OrganizerOverviewPage />} />
        <Route path="organizer/events" element={<OrganizerEventsPage />} />
        <Route path="organizer/event-inspector" element={<EventInspectorPage />} />
        <Route path="organizer/create-event" element={<CreateEventWizardPage />} />
        <Route path="organizer/participants" element={<ParticipantsPage />} />
        <Route path="organizer/check-in" element={<CheckInPage />} />
        <Route path="organizer/analytics" element={<OrganizerAnalyticsPage />} />
        <Route path="organizer/announcements" element={<AnnouncementsPage />} />
        <Route path="organizer/team" element={<TeamMembersPage />} />
        <Route path="organizer/settings" element={<SettingsPage />} />

        {/* Admin Space */}
        <Route path="admin/overview" element={<AdminOverviewPage />} />
        <Route path="admin/moderation" element={<AdminModerationPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="admin/categories" element={<AdminCategoriesPage />} />
        <Route path="admin/reports" element={<AdminReportsPage />} />
        <Route path="admin/settings" element={<SettingsPage />} />

        {/* Root App Redirect */}
        <Route index element={<Navigate to="/app/attendee/overview" replace />} />
      </Route>

      {/* 3. 404 Fallback Route */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
