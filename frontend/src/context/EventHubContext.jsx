import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import {
  INITIAL_CATEGORIES,
  INITIAL_EVENTS,
  INITIAL_USERS,
  INITIAL_REGISTRATIONS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const EventHubContext = createContext();

export const EventHubProvider = ({ children }) => {
  // Local storage helpers
  const getStored = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  };

  // State
  const [users, setUsers] = useState(() => getStored('eventhub_users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => getStored('eventhub_current_user', null));
  const [events, setEvents] = useState(() => getStored('eventhub_events', INITIAL_EVENTS));
  const [registrations, setRegistrations] = useState(() => getStored('eventhub_registrations', INITIAL_REGISTRATIONS));
  const [notifications, setNotifications] = useState(() => getStored('eventhub_notifications', INITIAL_NOTIFICATIONS));
  const [bookmarks, setBookmarks] = useState(() => getStored('eventhub_bookmarks', ['evt-101', 'evt-103']));
  const [categories, setCategories] = useState(() => getStored('eventhub_categories', INITIAL_CATEGORIES));
  const [isLoading, setIsLoading] = useState(false);

  // Global Navigation & Modal UI states
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRoleTab, setAuthRoleTab] = useState('student');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [eventDetailModalOpen, setEventDetailModalOpen] = useState(false);
  const [selectedEventForModal, setSelectedEventForModal] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const openRegisterModal = (event) => {
    setSelectedEventForModal(event);
    setRegisterModalOpen(true);
  };

  const openTicketModal = (ticketOrReg) => {
    setSelectedTicket(ticketOrReg);
    setTicketModalOpen(true);
  };

  const openEventDetailModal = (event) => {
    setSelectedEventForModal(event);
    setEventDetailModalOpen(true);
  };

  // Sync state to local storage
  useEffect(() => setStored('eventhub_users', users), [users]);
  useEffect(() => setStored('eventhub_current_user', currentUser), [currentUser]);
  useEffect(() => setStored('eventhub_events', events), [events]);
  useEffect(() => setStored('eventhub_registrations', registrations), [registrations]);
  useEffect(() => setStored('eventhub_notifications', notifications), [notifications]);
  useEffect(() => setStored('eventhub_bookmarks', bookmarks), [bookmarks]);
  useEffect(() => setStored('eventhub_categories', categories), [categories]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // 1. Initial Load: Fetch Live Events, Categories & Validate Token
  const fetchLiveEvents = async () => {
    try {
      const res = await api.get('/events');
      if (res.data && res.data.events && res.data.events.length > 0) {
        // Map _id to id for seamless component compatibility
        const liveEvents = res.data.events.map(e => ({
          ...e,
          id: e._id || e.id
        }));
        setEvents(liveEvents);
      }
    } catch (err) {
      console.warn('Events API Notice (using local cache):', err.message);
    }
  };

  const fetchLiveCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data && res.data.categories && res.data.categories.length > 0) {
        setCategories(res.data.categories.map(c => ({ ...c, id: c._id || c.id })));
      }
    } catch (err) {
      // Fallback to local
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const token = localStorage.getItem('eventhub_token');
      if (!token) return;
      const res = await api.get('/registrations/me');
      if (res.data && res.data.registrations) {
        setRegistrations(res.data.registrations.map(r => ({
          ...r,
          id: r._id || r.id,
          eventId: r.event?._id || r.eventId || r.event
        })));
      }
    } catch (err) {
      console.warn('Registrations API Notice:', err.message);
    }
  };

  const checkAuthSession = async () => {
    const token = localStorage.getItem('eventhub_token');
    if (!token) return;

    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
        fetchMyRegistrations();
      }
    } catch (err) {
      console.warn('Session verification notice:', err.message);
    }
  };

  useEffect(() => {
    fetchLiveEvents();
    fetchLiveCategories();
    checkAuthSession();
  }, []);

  // 2. Auth Functions
  const login = async (email, password, role = 'student') => {
    setIsLoading(true);
    try {
      // Try Backend API Login first
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.token) {
        const loggedUser = res.data.user;
        localStorage.setItem('eventhub_token', res.data.token);
        setCurrentUser(loggedUser);
        setAuthModalOpen(false);
        showToast(`Welcome back, ${loggedUser.name}! Logged in as ${loggedUser.role.toUpperCase()}`);
        
        // Fetch user's registered tickets
        await fetchMyRegistrations();
        setIsLoading(false);
        return { success: true, user: loggedUser };
      }
    } catch (apiErr) {
      // Fallback for mock users if backend is unreachable or user is mock
      const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setCurrentUser(existing);
        setAuthModalOpen(false);
        showToast(`Welcome back, ${existing.name}! Logged in as ${existing.role.toUpperCase()}`);
        setIsLoading(false);
        return { success: true, user: existing };
      }

      const errMsg = apiErr.response?.data?.message || 'Invalid email or password';
      showToast(errMsg, 'error');
      setIsLoading(false);
      return { success: false, message: errMsg };
    }
    setIsLoading(false);
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data && res.data.token) {
        const newUser = res.data.user;
        localStorage.setItem('eventhub_token', res.data.token);
        setUsers(prev => [newUser, ...prev]);
        setCurrentUser(newUser);
        setAuthModalOpen(false);
        showToast(`Welcome to EventHub, ${newUser.name}!`);
        setIsLoading(false);
        return { success: true, user: newUser };
      }
    } catch (apiErr) {
      const errMsg = apiErr.response?.data?.message || 'Registration failed';
      showToast(errMsg, 'error');
      setIsLoading(false);
      return { success: false, error: errMsg };
    }
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_current_user');
    setActiveTab('explore');
    showToast('You have been logged out.');
  };

  // Demo user fast switcher
  const switchDemoUser = async (role) => {
    const roleCredentials = {
      student: { email: 'student@campus.edu', password: 'student123' },
      employee: { email: 'engineer@techcorp.com', password: 'attendee123' },
      attendee: { email: 'student@campus.edu', password: 'student123' },
      host: { email: 'organizer@techpulse.org', password: 'host123' },
      organizer: { email: 'organizer@techpulse.org', password: 'host123' },
      admin: { email: 'admin@eventhub.com', password: 'admin123' }
    };

    const creds = roleCredentials[role];
    if (creds) {
      await login(creds.email, creds.password, role);
    }
  };

  // 3. Registration & Capacity Management (Connected to Atlas API)
  const registerForEvent = async (event, registrationDetails) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      showToast('Please login or register to participate in events.', 'info');
      return { success: false, reason: 'auth_required' };
    }

    const eventId = event._id || event.id || event.slug;

    // Check if already registered locally
    const alreadyRegistered = registrations.find(
      r => (r.eventId === eventId || r.eventId === event.id || r.eventId === event._id) &&
           (r.userId === currentUser.id || r.userId === currentUser._id) &&
           r.status !== 'cancelled'
    );
    if (alreadyRegistered) {
      showToast('You are already registered for this event!', 'warning');
      setSelectedTicket(alreadyRegistered);
      setTicketModalOpen(true);
      return { success: false, reason: 'already_registered' };
    }

    try {
      // Call Backend API
      const res = await api.post(`/registrations/${eventId}`, {
        teamName: registrationDetails.teamName || (registrationDetails.isTeam ? 'Team Alpha' : 'Individual'),
        teamMembers: registrationDetails.isTeam ? registrationDetails.teamMembers : [currentUser.name],
        customNotes: registrationDetails.notes || '',
        ticketType: event.isFree ? 'General Pass (Free)' : `Premium Delegate Pass (₹${event.price})`
      });

      if (res.data && res.data.registration) {
        const newRegistration = {
          ...res.data.registration,
          id: res.data.registration._id || res.data.registration.id,
          eventId: event._id || event.id
        };

        setRegistrations(prev => [newRegistration, ...prev]);

        // Celebration Confetti
        if (newRegistration.status === 'confirmed' || newRegistration.status === 'registered') {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Confetti animation
          }
        }

        setRegisterModalOpen(false);
        setSelectedTicket(newRegistration);
        setTicketModalOpen(true);
        showToast(res.data.message || 'Registration successful! Here is your ticket pass.');
        
        // Refresh live event capacity counts
        fetchLiveEvents();
        return { success: true, registration: newRegistration };
      }
    } catch (apiErr) {
      // Fallback local registration if offline
      const isFull = (event.registeredCount || 0) >= (event.maxCapacity || 100);
      const isWaitlist = isFull && event.allowWaitlist;
      const ticketId = `EH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const newRegistration = {
        id: `reg-${Date.now()}`,
        ticketId,
        eventId: event.id || event._id,
        eventTitle: event.title,
        userId: currentUser.id || currentUser._id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userRole: currentUser.role,
        teamName: registrationDetails.teamName || 'Individual',
        teamMembers: registrationDetails.isTeam ? registrationDetails.teamMembers : [currentUser.name],
        registrationDate: new Date().toISOString(),
        status: isWaitlist ? 'waitlisted' : 'confirmed',
        checkedIn: false,
        qrValue: `EH-${event.title.substring(0, 3).toUpperCase()}-${ticketId}`,
        ticketType: event.isFree ? 'General Pass (Free)' : `Premium Delegate Pass (₹${event.price})`,
        amountPaid: event.isFree ? 0 : event.price
      };

      setRegistrations(prev => [newRegistration, ...prev]);
      setRegisterModalOpen(false);
      setSelectedTicket(newRegistration);
      setTicketModalOpen(true);
      showToast(isWaitlist ? 'Added to waitlist queue.' : 'Registration confirmed!');
      return { success: true, registration: newRegistration };
    }
  };

  // 4. Cancellation & Promotion
  const cancelRegistration = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/cancel`);
      showToast('Registration cancelled. Your slot has been made available.');
      fetchMyRegistrations();
      fetchLiveEvents();
    } catch (err) {
      // Local fallback
      setRegistrations(prev => prev.map(r => (r.id === registrationId || r._id === registrationId) ? { ...r, status: 'cancelled' } : r));
      showToast('Registration cancelled.');
    }
  };

  // 5. Organizer: Check-in Participant
  const checkInAttendee = async (registrationIdOrTicketId) => {
    try {
      const res = await api.put(`/registrations/${registrationIdOrTicketId}/attend`);
      showToast(res.data?.message || 'Attendee attendance status updated.');
      fetchMyRegistrations();
    } catch (err) {
      // Local fallback
      setRegistrations(prev => prev.map(r => {
        if (r.id === registrationIdOrTicketId || r.ticketId === registrationIdOrTicketId || r._id === registrationIdOrTicketId) {
          const isNowChecked = !r.checkedIn;
          return {
            ...r,
            checkedIn: isNowChecked,
            attended: isNowChecked,
            checkInTime: isNowChecked ? new Date().toISOString() : null
          };
        }
        return r;
      }));
      showToast('Attendee attendance status updated.');
    }
  };

  // 6. Organizer: Create Event
  const createEvent = async (eventData) => {
    try {
      const res = await api.post('/events', eventData);
      if (res.data && res.data.event) {
        const created = {
          ...res.data.event,
          id: res.data.event._id || res.data.event.id
        };
        setEvents(prev => [created, ...prev]);
        showToast('🎉 Event successfully created and published to catalog!');
        return created;
      }
    } catch (err) {
      // Fallback
      const newId = `evt-${Date.now()}`;
      const newEvent = {
        id: newId,
        _id: newId,
        slug: eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        registeredCount: 0,
        waitlistCount: 0,
        status: 'published',
        createdAt: new Date().toISOString(),
        ...eventData
      };
      setEvents(prev => [newEvent, ...prev]);
      showToast('Event created successfully.');
      return newEvent;
    }
  };

  // 7. Organizer / Admin: Cancel Event
  const cancelEvent = async (eventId, reason = 'Administrative cancellation') => {
    try {
      await api.put(`/events/${eventId}/status`, { status: 'cancelled' });
      showToast('Event marked as cancelled.');
      fetchLiveEvents();
    } catch (err) {
      setEvents(prev => prev.map(evt => (evt.id === eventId || evt._id === eventId) ? { ...evt, status: 'cancelled' } : evt));
      showToast('Event cancelled.');
    }
  };

  const toggleBookmark = (eventId) => {
    setBookmarks(prev => {
      const isBookmarked = prev.includes(eventId);
      const updated = isBookmarked ? prev.filter(id => id !== eventId) : [...prev, eventId];
      showToast(isBookmarked ? 'Event removed from saved list.' : 'Event bookmarked to your wishlist!');
      return updated;
    });
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.id && n.userId !== currentUser._id));
    showToast('Notifications cleared.');
  };

  return (
    <EventHubContext.Provider
      value={{
        // Data
        users,
        currentUser,
        events,
        registrations,
        notifications,
        bookmarks,
        categories,
        activeTab,
        selectedEventId,
        toastMessage,
        isLoading,

        // Modal states
        authModalOpen,
        authMode,
        authRoleTab,
        registerModalOpen,
        ticketModalOpen,
        eventDetailModalOpen,
        selectedEventForModal,
        selectedTicket,

        // Setters & Modals
        setActiveTab,
        setSelectedEventId,
        setAuthModalOpen,
        setAuthMode,
        setAuthRoleTab,
        setRegisterModalOpen,
        setTicketModalOpen,
        setEventDetailModalOpen,
        setSelectedEventForModal,
        setSelectedTicket,
        openRegisterModal,
        openTicketModal,
        openEventDetailModal,
        showToast,

        // Actions (wired to MongoDB Atlas)
        login,
        signup,
        logout,
        switchDemoUser,
        registerForEvent,
        cancelRegistration,
        checkInAttendee,
        createEvent,
        cancelEvent,
        toggleBookmark,
        markNotificationRead,
        clearAllNotifications,
        fetchLiveEvents,
        fetchMyRegistrations
      }}
    >
      {children}
    </EventHubContext.Provider>
  );
};

export const useEventHub = () => {
  const context = useContext(EventHubContext);
  if (!context) {
    throw new Error('useEventHub must be used within an EventHubProvider');
  }
  return context;
};

export default EventHubContext;
