import React, { useState } from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  Search,
  Calendar,
  PlusCircle,
  Bell,
  User,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Layers,
  Bookmark,
  Ticket
} from 'lucide-react';

export const Navbar = ({ onSearchChange, searchQuery }) => {
  const {
    currentUser,
    notifications,
    bookmarks,
    activeTab,
    setActiveTab,
    setAuthModalOpen,
    setAuthMode,
    setAuthRoleTab,
    logout,
    switchDemoUser,
    markNotificationRead,
    clearAllNotifications
  } = useEventHub();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Unread notifications for current user
  const userNotifications = notifications.filter(
    n => !currentUser || n.userId === currentUser.id
  );
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleOpenAuth = (mode, roleTab = 'student') => {
    setAuthMode(mode);
    setAuthRoleTab(roleTab);
    setAuthModalOpen(true);
  };

  const handleHostClick = () => {
    if (!currentUser) {
      handleOpenAuth('signup', 'host');
    } else if (currentUser.role === 'host') {
      setActiveTab('organizer-dashboard');
    } else {
      // Suggest switching or go to host signup
      handleOpenAuth('signup', 'host');
    }
  };

  return (
    <header className="navbar-container">
      {/* Main Navigation Bar */}
      <nav className="main-navbar">
        <div className="nav-left">
          {/* Logo */}
          <div className="brand-logo" onClick={() => setActiveTab('explore')}>
            <div className="logo-icon">
              <span>E</span>
            </div>
            <div className="logo-text-group">
              <span className="logo-brand">Event<span>Hub</span></span>
              <span className="logo-sub">UNSTOP STYLE PLATFORM</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="nav-links">
            <button
              className={`nav-link-btn ${activeTab === 'explore' ? 'active' : ''}`}
              onClick={() => setActiveTab('explore')}
            >
              Explore Events
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'attendee-dashboard' ? 'active' : ''}`}
              onClick={() => {
                if (!currentUser) handleOpenAuth('login', 'student');
                else setActiveTab('attendee-dashboard');
              }}
            >
              My Passes & Tickets
              {currentUser && bookmarks.length > 0 && (
                <span className="nav-counter-pill">{bookmarks.length}</span>
              )}
            </button>
            {currentUser?.role === 'host' && (
              <button
                className={`nav-link-btn ${activeTab === 'organizer-dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('organizer-dashboard')}
              >
                Organizer Studio
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                className={`nav-link-btn ${activeTab === 'admin-dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin-dashboard')}
              >
                Admin Console
              </button>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="nav-search-bar">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            placeholder="Search hackathons, workshops, cultural fests..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => onSearchChange('')}>
              ✕
            </button>
          )}
        </div>

        {/* Right Action buttons */}
        <div className="nav-right">
          {/* Host Event Button */}
          <button className="host-event-btn" onClick={handleHostClick}>
            <PlusCircle size={16} />
            <span>Host an Event</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="notif-wrapper">
            <button
              className="icon-btn notif-btn"
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setProfileDropdownOpen(false);
              }}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>

            {notifDropdownOpen && (
              <div className="notif-popover">
                <div className="notif-popover-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={clearAllNotifications} className="clear-notifs-btn">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="notif-list">
                  {userNotifications.length === 0 ? (
                    <div className="empty-notif">No new notifications</div>
                  ) : (
                    userNotifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.read ? 'unread' : ''}`}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <div className="notif-title">{n.title}</div>
                        <div className="notif-msg">{n.message}</div>
                        <div className="notif-time">
                          {new Date(n.date).toLocaleDateString()} at{' '}
                          {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Login/Signup buttons */}
          {currentUser ? (
            <div className="profile-wrapper">
              <button
                className="profile-btn"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotifDropdownOpen(false);
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="profile-avatar"
                />
                <div className="profile-btn-info">
                  <span className="profile-name">{currentUser.name}</span>
                  <span className="profile-role-tag">{currentUser.role.toUpperCase()}</span>
                </div>
                <ChevronDown size={14} className="profile-chevron" />
              </button>

              {profileDropdownOpen && (
                <div className="profile-popover">
                  <div className="profile-popover-user">
                    <img src={currentUser.avatar} alt="" className="user-thumb" />
                    <div>
                      <strong>{currentUser.name}</strong>
                      <p>{currentUser.email}</p>
                      <span className="role-chip">{currentUser.role}</span>
                    </div>
                  </div>

                  <div className="popover-divider"></div>

                  <div className="profile-menu-items">
                    <button
                      onClick={() => {
                        setActiveTab('attendee-dashboard');
                        setProfileDropdownOpen(false);
                      }}
                    >
                      <Ticket size={16} />
                      <span>My Passes & Registrations</span>
                    </button>
                    {currentUser.role === 'host' && (
                      <button
                        onClick={() => {
                          setActiveTab('organizer-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                      >
                        <Layers size={16} />
                        <span>Organizer Dashboard</span>
                      </button>
                    )}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setActiveTab('admin-dashboard');
                          setProfileDropdownOpen(false);
                        }}
                      >
                        <ShieldCheck size={16} />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                  </div>

                  <div className="popover-divider"></div>

                  <button className="logout-menu-item" onClick={logout}>
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                className="btn-login-outline"
                onClick={() => handleOpenAuth('login', 'student')}
              >
                Sign In
              </button>
              <button
                className="btn-signup-primary"
                onClick={() => handleOpenAuth('signup', 'student')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
