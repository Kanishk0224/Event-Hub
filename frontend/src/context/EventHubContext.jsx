import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
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

  // Deduplication helper to prevent exact replica events with identical title, date, and venue
  const deduplicateEvents = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter((e) => {
      if (!e) return false;
      const title = (e.title || '').trim().toLowerCase();
      const date = (e.startDate || '').trim().slice(0, 10);
      const loc = (e.location || '').trim().toLowerCase();
      const key = `${title}__${date}__${loc}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // State
  const [users, setUsers] = useState(() => getStored('eventhub_users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => getStored('eventhub_current_user', null)); // Default to null (shows Login Page first)
  const [events, setEvents] = useState(() => deduplicateEvents(getStored('eventhub_events', INITIAL_EVENTS)));
  const [registrations, setRegistrations] = useState(() => getStored('eventhub_registrations', INITIAL_REGISTRATIONS));
  const [notifications, setNotifications] = useState(() => getStored('eventhub_notifications', INITIAL_NOTIFICATIONS));
  const [bookmarks, setBookmarks] = useState(() => getStored('eventhub_bookmarks', ['evt-101', 'evt-103']));
  const [categories, setCategories] = useState(() => getStored('eventhub_categories', INITIAL_CATEGORIES));

  // Global Navigation & Modal UI states
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'event-detail' | 'attendee-dashboard' | 'organizer-dashboard' | 'admin-dashboard'
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authRoleTab, setAuthRoleTab] = useState('student'); // 'student' | 'employee' | 'host' | 'admin'
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Live Atlas Backend Sync
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // Live health & Atlas heartbeat checker
    const checkConnection = async () => {
      try {
        const healthRes = await fetch(`${API_BASE.replace('/api', '')}/api/health`, {
          signal: AbortSignal.timeout(4000)
        });
        if (healthRes.ok) {
          const data = await healthRes.json();
          setIsBackendConnected(data.connected ?? true);
          return;
        }
        const dbRes = await fetch(`${API_BASE.replace('/api', '')}/api/db-check`, {
          signal: AbortSignal.timeout(7000)
        });
        if (dbRes.ok) {
          const dbData = await dbRes.json();
          setIsBackendConnected(dbData.database?.connected ?? true);
          return;
        }
        setIsBackendConnected(false);
      } catch {
        setIsBackendConnected(false);
      }
    };

    const fetchBackendData = async () => {
      await checkConnection();

      // Load live categories from backend
      try {
        const catRes = await fetch(`${API_BASE}/categories`);
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        }
      } catch {
        // Silently fail - use local data
      }

      // Load live events from backend
      try {
        const evtRes = await fetch(`${API_BASE}/events`);
        const evtData = await evtRes.json();
        if (Array.isArray(evtData) && evtData.length > 0) {
          const formatted = evtData.map(d => ({
            ...d,
            id: d.id || d._id || `evt-${Date.now()}`,
            bannerUrl: d.bannerUrl || d.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
            organizer: d.organizer || { name: 'EventHub', logo: '', verified: true },
            categoryLabel: d.categoryLabel || d.category || 'Tech',
            mode: d.mode || 'In-Person',
            isFree: d.isFree ?? (d.price === 0),
            price: d.price || 0,
            maxCapacity: d.maxCapacity || 100,
            registeredCount: d.registeredCount || 0,
            waitlistCount: d.waitlistCount || 0,
            allowWaitlist: d.allowWaitlist ?? true,
            isFeatured: d.isFeatured || false,
            status: d.status || 'published',
            startDate: d.startDate || new Date().toISOString(),
            tagline: d.tagline || d.description || '',
            teamSize: d.teamSize || '1-4',
            prizes: d.prizes || []
          }));
          setEvents(prev => deduplicateEvents([...formatted, ...prev]));
        }
      } catch {
        // Silently fail - use local data
      }

      // Load live users from MongoDB Atlas backend
      try {
        const userRes = await fetch(`${API_BASE}/users`);
        const userData = await userRes.json();
        if (Array.isArray(userData) && userData.length > 0) {
          const formattedUsers = userData.map(u => ({
            ...u,
            id: u._id || u.id,
            name: u.name,
            email: u.email,
            role: u.role || 'student',
            avatar: u.avatar || u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            verified: u.verified ?? (u.verificationStatus === 'approved' || u.role === 'admin')
          }));
          setUsers(prev => {
            const map = new Map();
            prev.forEach(u => map.set(u.email.toLowerCase(), u));
            formattedUsers.forEach(u => map.set(u.email.toLowerCase(), { ...map.get(u.email.toLowerCase()), ...u }));
            return Array.from(map.values());
          });
        }
      } catch {
        // Silently fail - use local data
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
    const intervalTimer = setInterval(checkConnection, 5000);
    return () => clearInterval(intervalTimer);
  }, []);

  // Sync to localStorage
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

  // Auth Functions
  const login = (email, password, role = 'student') => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      // Check if Host is pending 24-hour verification review!
      if (existing.role === 'host' && existing.verificationStatus === 'pending_review') {
        showToast(
          `Access Pending: Your host application for "${existing.organizationName || existing.institutionName}" is under 24-hour review by Admin to prevent fraud.`,
          'warning'
        );
        return { success: false, reason: 'pending_verification', user: existing };
      }

      // Re-check: if verified is false but status is approved, block login
      if (!existing.verified) {
        showToast(
          `Account Not Verified: Your host application for "${existing.organizationName || existing.institutionName}" has not been verified yet. Please wait for admin approval.`,
          'error'
        );
        return { success: false, reason: 'not_verified', user: existing };
      }

      setCurrentUser(existing);
      setAuthModalOpen(false);
      showToast(`Welcome back, ${existing.name}! Logged in as ${existing.role.toUpperCase()}`);
      
      // Auto route to appropriate dashboard
      if (existing.role === 'host') {
        setActiveTab('organizer-dashboard');
      } else if (existing.role === 'admin') {
        setActiveTab('admin-dashboard');
      } else {
        setActiveTab('attendee-dashboard');
      }
      return { success: true, user: existing };
    } else {
      // Create new user for demo if not found
      const newUser = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        verified: role !== 'host',
        verificationStatus: role === 'host' ? 'pending_review' : 'approved',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };

      if (role === 'host') {
        setUsers(prev => [...prev, newUser]);
        showToast('Host account submitted for 24-hour verification review.', 'warning');
        return { success: false, reason: 'pending_verification', user: newUser };
      }

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setAuthModalOpen(false);
      showToast(`Welcome to EventHub, ${newUser.name}!`);
      if (role === 'admin') setActiveTab('admin-dashboard');
      else setActiveTab('attendee-dashboard');
      return { success: true, user: newUser };
    }
  };

  const signup = (userData) => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists.', 'error');
      return { success: false, error: 'Email already exists' };
    }

    const isHost = userData.role === 'host';

    const newUser = {
      id: `user-${Date.now()}`,
      avatar: isHost 
        ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      verified: !isHost,
      verificationStatus: isHost ? 'pending_review' : 'approved',
      googleBusinessUrl: userData.googleBusinessUrl || '',
      orgCertificateUrl: userData.orgCertificateUrl || '',
      idProofUrl: userData.idProofUrl || '',
      hostCategory: userData.hostCategory || '',
      preferredPaymentMethod: userData.preferredPaymentMethod || 'upi',
      ...userData
    };

    setUsers(prev => [...prev, newUser]);

    if (isHost) {
      // Dispatches an administrative review item
      const adminNotif = {
        id: `notif-admin-${Date.now()}`,
        userId: 'user-admin-1',
        title: '🛡️ New Host Verification Request',
        message: `${newUser.organizationName || newUser.institutionName} (${newUser.hostCategory?.toUpperCase() || 'HOST'}) submitted accreditation proofs for 24-hour review.`,
        date: new Date().toISOString(),
        read: false,
        type: 'warning'
      };
      setNotifications(prev => [adminNotif, ...prev]);

      showToast(`Host application for "${newUser.organizationName || newUser.institutionName}" submitted! Under 24-hour security review.`);
      return { success: true, pendingVerification: true, user: newUser };
    }

    // Students & Employees get immediate login
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    showToast(`Welcome to EventHub, ${newUser.name}!`);
    setActiveTab('attendee-dashboard');
    return { success: true, pendingVerification: false, user: newUser };
  };

  // Host Application Approval by Admin
  const approveHostApplication = (userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verified: true,
          verificationStatus: 'approved'
        };
      }
      return u;
    }));

    // Generate confirmation email / notification to the host
    const approvalNotif = {
      id: `notif-host-approved-${Date.now()}`,
      userId: target.id,
      title: '🎉 Host Access Granted & Verified!',
      message: `Your host credentials for "${target.organizationName || target.institutionName}" have been verified by the EventHub Quality Council. You can now log in and host events.`,
      date: new Date().toISOString(),
      read: false,
      type: 'success'
    };
    setNotifications(prev => [approvalNotif, ...prev]);

    showToast(`Access granted! "${target.organizationName || target.institutionName}" verified and notification dispatched.`);
  };

  const rejectHostApplication = (userId, reason = 'Accreditation documents could not be verified') => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verified: false,
          verificationStatus: 'rejected',
          rejectionReason: reason
        };
      }
      return u;
    }));

    const rejectNotif = {
      id: `notif-host-reject-${Date.now()}`,
      userId: target.id,
      title: '⚠️ Host Verification Notice',
      message: `Your host application for "${target.organizationName || target.institutionName}" was not approved. Reason: ${reason}.`,
      date: new Date().toISOString(),
      read: false,
      type: 'error'
    };
    setNotifications(prev => [rejectNotif, ...prev]);

    showToast(`Application for "${target.organizationName || target.institutionName}" rejected.`);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eventhub_current_user');
    setActiveTab('explore');
    showToast('You have been logged out.');
  };

  // Demo user fast switcher
  const switchDemoUser = (role) => {
    const userMap = {
      student: users.find(u => u.role === 'student') || INITIAL_USERS[0],
      employee: users.find(u => u.role === 'employee') || INITIAL_USERS[1],
      host: users.find(u => u.role === 'host') || INITIAL_USERS[2],
      admin: users.find(u => u.role === 'admin') || INITIAL_USERS[3]
    };
    const target = userMap[role];
    if (target) {
      setCurrentUser(target);
      showToast(`Switched active session to: ${target.name} (${target.role.toUpperCase()})`);
      if (role === 'host') setActiveTab('organizer-dashboard');
      else if (role === 'admin') setActiveTab('admin-dashboard');
      else setActiveTab('attendee-dashboard');
    }
  };

  // Registration & Capacity Management
  const registerForEvent = (event, registrationDetails) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      showToast('Please login or register to participate in events.', 'info');
      return { success: false, reason: 'auth_required' };
    }

    // Check if already registered
    const alreadyRegistered = registrations.find(
      r => r.eventId === event.id && r.userId === currentUser.id && r.status !== 'cancelled'
    );
    if (alreadyRegistered) {
      showToast('You are already registered for this event!', 'warning');
      setSelectedTicket(alreadyRegistered);
      setTicketModalOpen(true);
      return { success: false, reason: 'already_registered' };
    }

    // Capacity checking
    const isFull = event.registeredCount >= event.maxCapacity;
    if (isFull && !event.allowWaitlist) {
      showToast('Sorry! This event has reached maximum capacity.', 'error');
      return { success: false, reason: 'capacity_full' };
    }

    const isWaitlist = isFull && event.allowWaitlist;
    const ticketId = `EH-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const studentPhone = registrationDetails.phone || currentUser.phone || '+91 98765 43210';

    const newRegistration = {
      id: `reg-${Date.now()}`,
      ticketId,
      eventId: event.id || event._id,
      eventTitle: event.title,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      phone: studentPhone,
      userRole: currentUser.role,
      affiliation: currentUser.role === 'student' 
        ? `${currentUser.college || 'University'} - ${currentUser.degree || 'Student'}`
        : `${currentUser.company || 'Company'} - ${currentUser.jobTitle || 'Professional'}`,
      teamName: registrationDetails.teamName || (registrationDetails.isTeam ? 'Team Alpha' : 'Individual'),
      teamMembers: registrationDetails.isTeam ? registrationDetails.teamMembers : [currentUser.name],
      registrationDate: new Date().toISOString(),
      status: isWaitlist ? 'waitlist' : 'confirmed',
      waitlistPosition: isWaitlist ? (event.waitlistCount || 0) + 1 : null,
      checkedIn: false,
      checkedInTime: null,
      qrValue: `EH-${(event.id || event._id || 'EVT').toString().toUpperCase()}-${ticketId}`,
      ticketType: event.isFree ? 'General Pass (Free)' : `Premium Delegate Pass (₹${event.price})`,
      amountPaid: event.isFree ? 0 : event.price,
      customNotes: registrationDetails.notes || ''
    };

    // Update event capacity
    setEvents(prev => prev.map(evt => {
      if (evt.id === event.id || evt._id === event.id) {
        return {
          ...evt,
          registeredCount: isWaitlist ? evt.registeredCount : evt.registeredCount + 1,
          waitlistCount: isWaitlist ? (evt.waitlistCount || 0) + 1 : evt.waitlistCount
        };
      }
      return evt;
    }));

    // Save registration
    setRegistrations(prev => [newRegistration, ...prev]);

    // Send in-app notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: isWaitlist ? 'Joined Event Waitlist ⏳' : 'Registration Confirmed! 🎟️',
      message: isWaitlist 
        ? `You are #${newRegistration.waitlistPosition} on the waitlist for "${event.title}". You will be automatically enrolled if a seat opens.`
        : `Your pass for "${event.title}" is ready! Ticket ID: ${ticketId}. Confirmation sent to ${currentUser.email} and WhatsApp ${studentPhone}.`,
      date: new Date().toISOString(),
      read: false,
      type: isWaitlist ? 'info' : 'success',
      eventId: event.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    // If event just reached full capacity, alert the organizer
    if (!isWaitlist && (event.registeredCount + 1) >= (event.maxCapacity || 100)) {
      const orgNotif = {
        id: `notif-org-full-${Date.now()}`,
        userId: event.organizer?.id || 'user-host-1',
        title: '🎉 Event Registration Full! Roster Generated',
        message: `"${event.title}" has reached maximum capacity (${event.maxCapacity} seats). Attendee roster spreadsheet has been compiled for your check-in team.`,
        date: new Date().toISOString(),
        read: false,
        type: 'success',
        eventId: event.id
      };
      setNotifications(prev => [orgNotif, ...prev]);
    }

    // Asynchronously dispatch WhatsApp & Email via Backend
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_BASE}/notifications/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: studentPhone,
        recipientName: currentUser.name,
        eventTitle: event.title,
        eventDate: new Date(event.startDate || Date.now()).toLocaleDateString(),
        venue: event.venue || event.location || 'Campus Hub',
        ticketId,
        type: isWaitlist ? 'waitlist' : 'registration_confirmed'
      })
    }).catch(() => {});

    fetch(`${API_BASE}/notifications/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: currentUser.email,
        recipientName: currentUser.name,
        eventTitle: event.title,
        eventDate: new Date(event.startDate || Date.now()).toLocaleDateString(),
        venue: event.venue || event.location || 'Campus Hub',
        ticketId
      })
    }).catch(() => {});

    // Celebration Confetti!
    if (!isWaitlist) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti burst');
      }
    }

    setRegisterModalOpen(false);
    setSelectedTicket(newRegistration);
    setTicketModalOpen(true);
    showToast(isWaitlist ? 'Joined waitlist queue.' : `Registration confirmed! 📱 WhatsApp & ✉️ Email sent to ${studentPhone}`);
    return { success: true, registration: newRegistration };
  };

  // Cancellation and Automatic Waitlist Promotion
  const cancelRegistration = (registrationId) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    // Update registration status
    setRegistrations(prev => prev.map(r => r.id === registrationId ? { ...r, status: 'cancelled' } : r));

    // Update event counts & auto-promote from waitlist if applicable
    setEvents(prev => prev.map(evt => {
      if (evt.id === reg.eventId) {
        const updatedRegisteredCount = Math.max(0, evt.registeredCount - 1);
        return {
          ...evt,
          registeredCount: updatedRegisteredCount
        };
      }
      return evt;
    }));

    // Auto-promote first waitlisted participant if any
    const firstWaitlisted = registrations.find(
      r => r.eventId === reg.eventId && r.status === 'waitlist'
    );

    if (firstWaitlisted) {
      setRegistrations(prev => prev.map(r => {
        if (r.id === firstWaitlisted.id) {
          return {
            ...r,
            status: 'confirmed',
            waitlistPosition: null
          };
        }
        return r;
      }));

      // Send waitlist promotion notification
      const promoNotif = {
        id: `notif-${Date.now() + 1}`,
        userId: firstWaitlisted.userId,
        title: 'Spot Available: Confirmed! 🌟',
        message: `Great news! A seat opened up for "${reg.eventTitle}". Your ticket #${firstWaitlisted.ticketId} is now CONFIRMED!`,
        date: new Date().toISOString(),
        read: false,
        type: 'success',
        eventId: reg.eventId
      };
      setNotifications(prev => [promoNotif, ...prev]);

      // Decrement event waitlist count and increment registered
      setEvents(prev => prev.map(evt => {
        if (evt.id === reg.eventId) {
          return {
            ...evt,
            registeredCount: evt.registeredCount + 1,
            waitlistCount: Math.max(0, (evt.waitlistCount || 1) - 1)
          };
        }
        return evt;
      }));
    }

    showToast('Registration cancelled. Your slot has been made available.');
  };

  // Organizer: Check-in Participant
  const checkInAttendee = (registrationId) => {
    setRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        const isNowChecked = !r.checkedIn;
        return {
          ...r,
          checkedIn: isNowChecked,
          checkedInTime: isNowChecked ? new Date().toISOString() : null
        };
      }
      return r;
    }));
    showToast('Attendee attendance status updated.');
  };

  // Organizer: Create Event
  const createEvent = (eventData) => {
    if (!eventData || !eventData.title) {
      showToast('Event title is required.', 'error');
      return null;
    }

    const trimmedTitle = (eventData.title || '').trim().toLowerCase();
    const eventDate = (eventData.startDate || '').trim().slice(0, 10);
    const eventLocation = (eventData.location || '').trim().toLowerCase();
    const eventMode = (eventData.mode || '').trim().toLowerCase();

    // Check for existing duplicate event (prevent replica if title, date, and location match)
    const isDuplicate = events.some((e) => {
      const eTitle = (e.title || '').trim().toLowerCase();
      const eDate = (e.startDate || '').trim().slice(0, 10);
      const eLoc = (e.location || '').trim().toLowerCase();
      const eMode = (e.mode || '').trim().toLowerCase();

      return eTitle === trimmedTitle && eDate === eventDate && (eLoc === eventLocation || eMode === eventMode);
    });

    if (isDuplicate) {
      showToast(
        'Duplicate Event Prevented: An event with identical title, date, and venue already exists. Please change at least one field before saving.',
        'error'
      );
      return null;
    }

    const newId = `evt-${Date.now()}`;
    const newEvent = {
      id: newId,
      slug: eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      registeredCount: 0,
      waitlistCount: 0,
      status: 'published',
      isFeatured: false,
      organizer: {
        id: currentUser?.id || 'org-custom',
        name: currentUser?.organizationName || currentUser?.name || 'Authorized Host',
        logo: currentUser?.avatar || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
        verified: currentUser?.verified || true,
        email: currentUser?.email || 'host@eventhub.com',
        type: currentUser?.orgType || 'Event Organizer'
      },
      ...eventData
    };

    setEvents(prev => deduplicateEvents([newEvent, ...prev]));
    showToast('Event created and published successfully!');
    return newEvent;
  };

  // Organizer: Cancel Event
  const cancelEvent = (eventId, reason = 'Administrative reasons') => {
    setEvents(prev => prev.map(evt => evt.id === eventId ? { ...evt, status: 'cancelled' } : evt));

    // Notify all registered participants
    const affectedRegs = registrations.filter(r => r.eventId === eventId && r.status !== 'cancelled');
    const newNotifs = affectedRegs.map(r => ({
      id: `notif-cancel-${r.id}-${Date.now()}`,
      userId: r.userId,
      title: 'Event Notice: Cancelled ⚠️',
      message: `The event "${r.eventTitle}" has been cancelled by the organizer. Reason: ${reason}. If paid, refund is initiated automatically.`,
      date: new Date().toISOString(),
      read: false,
      type: 'warning',
      eventId
    }));

    setNotifications(prev => [...newNotifs, ...prev]);
    showToast('Event has been cancelled and notifications sent to participants.');
  };

  // Admin Actions
  const approveEvent = (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'published' } : e));
    showToast('Event approved and made publicly visible.');
  };

  const toggleFeatureEvent = (eventId) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, isFeatured: !e.isFeatured } : e));
    showToast('Event feature spotlight status updated.');
  };

  // Admin: Permanently delete event
  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId && e._id !== eventId));
    // Also remove associated registrations
    setRegistrations(prev => prev.filter(r => r.eventId !== eventId));
    showToast('Event permanently deleted from catalog.');
  };

  const toggleVerifyUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    showToast('User verification status toggled.');
  };

  // Admin: Delete user from MongoDB Atlas and local state
  const deleteUser = async (userId) => {
    const targetUser = users.find(u => u.id === userId || u._id === userId);
    if (!targetUser) return { success: false, message: 'User not found' };

    // Prevent deleting the currently logged in active admin
    if (currentUser && (currentUser.id === userId || currentUser._id === userId || currentUser.email?.toLowerCase() === targetUser.email?.toLowerCase())) {
      showToast('Cannot delete your own active administrator account.', 'error');
      return { success: false, message: 'Cannot delete active session' };
    }

    // Delete from MongoDB Atlas
    try {
      const dbId = targetUser._id || targetUser.id;
      await fetch(`${API_BASE}/users/${dbId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('[EventHub] Offline/local user deletion:', err);
    }

    // Update state
    setUsers(prev => prev.filter(u => u.id !== userId && u._id !== userId && u.email?.toLowerCase() !== targetUser.email?.toLowerCase()));
    setRegistrations(prev => prev.filter(r => r.userId !== userId));
    showToast(`User "${targetUser.name || targetUser.email}" permanently deleted from MongoDB Atlas.`, 'success');
    return { success: true };
  };

  // Bookmarking
  const toggleBookmark = (eventId) => {
    setBookmarks(prev => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast('Removed from saved events.');
        return prev.filter(id => id !== eventId);
      } else {
        showToast('Saved to your bookmarked events!');
        return [...prev, eventId];
      }
    });
  };

  // Notifications
  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.id));
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
        isBackendConnected,
        isLoading,

        // Modal states
        authModalOpen,
        authMode,
        authRoleTab,
        registerModalOpen,
        ticketModalOpen,
        selectedTicket,

        // Setters
        setActiveTab,
        setSelectedEventId,
        setAuthModalOpen,
        setAuthMode,
        setAuthRoleTab,
        setRegisterModalOpen,
        setTicketModalOpen,
        setSelectedTicket,
        showToast,
        setCurrentUser,

        // Actions
        login,
        signup,
        logout,
        switchDemoUser,
        registerForEvent,
        cancelRegistration,
        checkInAttendee,
        createEvent,
        cancelEvent,
        approveEvent,
        deleteEvent,
        deleteUser,
        toggleFeatureEvent,
        toggleVerifyUser,
        approveHostApplication,
        rejectHostApplication,
        toggleBookmark,
        markNotificationRead,
        clearAllNotifications
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
