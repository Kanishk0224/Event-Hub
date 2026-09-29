import React, { useState, useMemo } from 'react';
import { useEventHub } from './context/EventHubContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { RegistrationModal } from './components/RegistrationModal';
import { TicketPassModal } from './components/TicketPassModal';
import { AuthModal } from './components/AuthModal';
import { AttendeeDashboard } from './components/dashboards/AttendeeDashboard';
import { OrganizerDashboard } from './components/dashboards/OrganizerDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import './App.css';

export function App() {
  const {
    currentUser,
    events,
    activeTab,
    setActiveTab,
    authModalOpen,
    setAuthModalOpen,
    registerModalOpen,
    setRegisterModalOpen,
    ticketModalOpen,
    setTicketModalOpen,
    selectedTicket,
    toastMessage
  } = useEventHub();

  // Guest view toggle
  const [exploreAsGuest, setExploreAsGuest] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'Online' | 'In-Person'
  const [filterPrice, setFilterPrice] = useState('all'); // 'all' | 'free' | 'paid'
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState(null);

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Status check (only published events on explore page)
      if (evt.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
        return false;
      }

      // Mode filter
      if (filterMode === 'Online' && evt.mode !== 'Online' && evt.mode !== 'Hybrid') {
        return false;
      }
      if (filterMode === 'In-Person' && evt.mode !== 'In-Person' && evt.mode !== 'Hybrid') {
        return false;
      }

      // Price filter
      if (filterPrice === 'free' && !evt.isFree) return false;
      if (filterPrice === 'paid' && evt.isFree) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesTagline = evt.tagline?.toLowerCase().includes(q);
        const matchesOrganizer = evt.organizer?.name.toLowerCase().includes(q);
        const matchesCategory = evt.categoryLabel?.toLowerCase().includes(q);
        const matchesLocation = evt.location?.toLowerCase().includes(q);
        return matchesTitle || matchesTagline || matchesOrganizer || matchesCategory || matchesLocation;
      }

      return true;
    });
  }, [events, selectedCategory, filterMode, filterPrice, searchQuery]);

  const handleSelectEvent = (event) => {
    setSelectedEventForDetail(event);
  };

  const handleRegisterClick = (event) => {
    setSelectedEventForRegister(event);
    setRegisterModalOpen(true);
  };

  if (!currentUser && !exploreAsGuest) {
    return (
      <div className="eventhub-app-root">
        {toastMessage && (
          <div className={`global-toast-banner ${toastMessage.type}`}>
            {toastMessage.type === 'error' || toastMessage.type === 'warning' ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            <span>{toastMessage.message}</span>
          </div>
        )}
        <LoginPage onGuestExplore={() => setExploreAsGuest(true)} />
      </div>
    );
  }

  return (
    <div className="eventhub-app-root">
      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div className={`global-toast-banner ${toastMessage.type}`}>
          {toastMessage.type === 'error' || toastMessage.type === 'warning' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Main Top Navigation Header */}
      <Navbar onSearchChange={setSearchQuery} searchQuery={searchQuery} />

      {/* Primary Page Content Router */}
      <main className="main-content-flow">
        {/* =======================================================
            VIEW 1: EXPLORE EVENTS & CATALOG (UNSTOP HOMEPAGE)
        ======================================================= */}
        {activeTab === 'explore' && (
          <div className="explore-view-wrapper">
            {/* Unstop Hero Section with Live Stats & Categories */}
            <HeroSection
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              filterMode={filterMode}
              onSelectFilterMode={setFilterMode}
              filterPrice={filterPrice}
              onSelectFilterPrice={setFilterPrice}
            />

            {/* Catalog Container */}
            <section className="events-catalog-section">
              <div className="catalog-header-bar">
                <div className="catalog-title-group">
                  <h2>
                    Explore Opportunities & Hackathons
                    <span className="results-count-chip">({filteredEvents.length} Available)</span>
                  </h2>
                  <p>Discover live hackathons, certified workshops, campus carnivals, and case challenges.</p>
                </div>

                {/* Filter resets if active */}
                {(selectedCategory !== 'all' || filterMode !== 'all' || filterPrice !== 'all' || searchQuery) && (
                  <button
                    className="btn-reset-filters"
                    onClick={() => {
                      setSelectedCategory('all');
                      setFilterMode('all');
                      setFilterPrice('all');
                      setSearchQuery('');
                    }}
                  >
                    <X size={14} />
                    <span>Clear All Filters</span>
                  </button>
                )}
              </div>

              {/* Event Cards Grid */}
              {filteredEvents.length === 0 ? (
                <div className="no-events-found-box">
                  <Search size={48} className="text-gray-400 mb-3" />
                  <h3>No Events Match Your Filters</h3>
                  <p>Try adjusting your search keywords, category, or event mode filters.</p>
                  <button
                    className="primary-action-btn"
                    onClick={() => {
                      setSelectedCategory('all');
                      setFilterMode('all');
                      setFilterPrice('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="events-cards-grid">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onSelectEvent={handleSelectEvent}
                      onRegisterClick={handleRegisterClick}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* =======================================================
            VIEW 2: ATTENDEE DASHBOARD (STUDENT & PROFESSIONAL)
        ======================================================= */}
        {activeTab === 'attendee-dashboard' && (
          <AttendeeDashboard
            onSelectEvent={handleSelectEvent}
            onRegisterClick={handleRegisterClick}
          />
        )}

        {/* =======================================================
            VIEW 3: ORGANIZER DASHBOARD (EVENT HOST)
        ======================================================= */}
        {activeTab === 'organizer-dashboard' && (
          <OrganizerDashboard onSelectEvent={handleSelectEvent} />
        )}

        {/* =======================================================
            VIEW 4: ADMINISTRATOR CONSOLE
        ======================================================= */}
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard onSelectEvent={handleSelectEvent} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* =======================================================
          MODALS
      ======================================================= */}

      {/* Auth Modal (Login / Sign Up for Student, Employee, Host, Admin) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Event Detail Modal (Full overview, schedule, speakers, FAQs, capacity) */}
      {selectedEventForDetail && (
        <EventDetailModal
          event={selectedEventForDetail}
          onClose={() => setSelectedEventForDetail(null)}
          onRegisterClick={(evt) => {
            setSelectedEventForDetail(null);
            handleRegisterClick(evt);
          }}
        />
      )}

      {/* Registration Modal (Solo/Team form, auto waitlist, instant pass) */}
      {registerModalOpen && selectedEventForRegister && (
        <RegistrationModal
          event={selectedEventForRegister}
          onClose={() => {
            setRegisterModalOpen(false);
            setSelectedEventForRegister(null);
          }}
        />
      )}

      {/* Ticket Pass Modal (Digital entry badge with QR code, print, calendar) */}
      {ticketModalOpen && selectedTicket && (
        <TicketPassModal
          ticket={selectedTicket}
          onClose={() => {
            setTicketModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
