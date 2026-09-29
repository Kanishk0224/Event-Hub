import React from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  Flame,
  Ticket,
  AlertCircle
} from 'lucide-react';

export const EventCard = ({ event, onSelectEvent, onRegisterClick }) => {
  const { bookmarks, toggleBookmark, registrations, currentUser, setSelectedTicket, setTicketModalOpen } = useEventHub();

  const isBookmarked = bookmarks.includes(event.id);

  // Check if current user is registered for this event
  const userRegistration = registrations.find(
    r => r.eventId === event.id && currentUser && r.userId === currentUser.id && r.status !== 'cancelled'
  );

  const isFull = event.registeredCount >= event.maxCapacity;
  const capacityPercent = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

  // Determine progress bar color
  let progressColor = '#10b981'; // green
  if (capacityPercent >= 90) progressColor = '#ef4444'; // red
  else if (capacityPercent >= 70) progressColor = '#f59e0b'; // amber

  // Days left calculation
  const deadline = new Date(event.registrationDeadline);
  const now = new Date();
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let deadlineLabel = `${diffDays} days left`;
  let isClosingSoon = diffDays <= 3 && diffDays > 0;
  if (diffDays <= 0) deadlineLabel = 'Deadline passed';
  else if (diffDays === 1) deadlineLabel = 'Closes tomorrow!';

  const handlePassClick = (e) => {
    e.stopPropagation();
    setSelectedTicket(userRegistration);
    setTicketModalOpen(true);
  };

  return (
    <div className="event-card-wrapper" onClick={() => onSelectEvent(event)}>
      {/* Banner Image Container */}
      <div className="event-card-image-wrap">
        <img src={event.bannerUrl} alt={event.title} className="event-card-image" loading="lazy" />
        <div className="event-card-overlay"></div>

        {/* Category & Mode Badges */}
        <div className="event-card-badges-top">
          <span className={`category-tag tag-${event.category}`}>
            {event.categoryLabel || event.category}
          </span>
          <span className="mode-tag">
            {event.mode === 'Online' ? '🌐 Online' : event.mode === 'Hybrid' ? '⚡ Hybrid' : '📍 In-Person'}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          className={`bookmark-btn ${isBookmarked ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(event.id);
          }}
          title={isBookmarked ? 'Remove Bookmark' : 'Save Event'}
        >
          <Bookmark size={16} fill={isBookmarked ? '#0073e6' : 'none'} color={isBookmarked ? '#0073e6' : '#fff'} />
        </button>

        {/* Featured Tag if applicable */}
        {event.isFeatured && (
          <div className="featured-badge">
            <Sparkles size={12} />
            <span>Featured Spotlight</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="event-card-body">
        {/* Organizer Header */}
        <div className="organizer-header-row">
          <img src={event.organizer.logo} alt={event.organizer.name} className="organizer-logo-thumb" />
          <div className="organizer-info-text">
            <div className="organizer-name-line">
              <span className="organizer-name">{event.organizer.name}</span>
              {event.organizer.verified && (
                <CheckCircle2 size={14} className="verified-badge-icon" title="Verified Organizer" />
              )}
            </div>
            <span className="organizer-type-sub">{event.organizer.type}</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-tagline">{event.tagline}</p>

        {/* Metric Badges Row */}
        <div className="event-metrics-row">
          <div className="metric-chip">
            <Award size={14} className="text-amber-500" />
            <span>
              {event.prizes && event.prizes.length > 0
                ? event.prizes[0].prize.split('+')[0]
                : 'Verified Certificate'}
            </span>
          </div>

          <div className="metric-chip">
            <Users size={14} className="text-indigo-500" />
            <span>{event.teamSize}</span>
          </div>

          <div className={`metric-chip price-chip ${event.isFree ? 'free' : 'paid'}`}>
            <span>{event.isFree ? 'FREE' : `₹${event.price}`}</span>
          </div>
        </div>

        {/* Registration Deadline Pill */}
        <div className="deadline-pill-row">
          <div className={`deadline-pill ${isClosingSoon ? 'urgent' : ''}`}>
            <Flame size={13} className="deadline-icon" />
            <span>{deadlineLabel}</span>
          </div>
          <span className="event-date-text">
            Starts {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Capacity Tracking Bar */}
        <div className="capacity-container">
          <div className="capacity-label-row">
            <span className="capacity-text">
              Capacity: <strong>{event.registeredCount} / {event.maxCapacity}</strong> registered
            </span>
            <span className="capacity-percent" style={{ color: progressColor }}>
              {isFull ? 'FULL' : `${capacityPercent}%`}
            </span>
          </div>
          <div className="capacity-track">
            <div
              className="capacity-fill"
              style={{
                width: `${capacityPercent}%`,
                backgroundColor: progressColor
              }}
            ></div>
          </div>
          {isFull && event.allowWaitlist && (
            <div className="waitlist-indicator">
              <AlertCircle size={12} />
              <span>Waitlist Active: {event.waitlistCount || 0} participants waiting</span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="event-card-footer">
          {userRegistration ? (
            <button
              className={`registered-status-btn ${userRegistration.status === 'waitlist' ? 'waitlist' : 'confirmed'}`}
              onClick={handlePassClick}
            >
              <Ticket size={15} />
              <span>
                {userRegistration.status === 'waitlist'
                  ? `Waitlist #${userRegistration.waitlistPosition}`
                  : 'View My E-Ticket Pass'}
              </span>
            </button>
          ) : (
            <>
              <button
                className="view-details-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(event);
                }}
              >
                Details
              </button>
              <button
                className={`register-action-btn ${isFull ? 'waitlist-btn' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRegisterClick(event);
                }}
              >
                <span>{isFull ? (event.allowWaitlist ? 'Join Waitlist' : 'Seats Full') : 'Register'}</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
