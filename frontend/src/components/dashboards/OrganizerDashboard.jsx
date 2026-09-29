import React, { useState } from 'react';
import { useEventHub } from '../../context/EventHubContext';
import {
  Layers,
  PlusCircle,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  QrCode,
  Building,
  Check,
  Globe2
} from 'lucide-react';

export const OrganizerDashboard = ({ onSelectEvent }) => {
  const {
    currentUser,
    events,
    registrations,
    createEvent,
    cancelEvent,
    checkInAttendee,
    showToast
  } = useEventHub();

  const [activeSubTab, setActiveSubTab] = useState('manage-events'); // 'manage-events' | 'create-event' | 'participants' | 'analytics'
  const [eventFilterStatus, setEventFilterStatus] = useState('all');
  const [selectedEventForRoster, setSelectedEventForRoster] = useState('all');
  const [rosterSearch, setRosterSearch] = useState('');
  const [cancelModalEventId, setCancelModalEventId] = useState(null);

  // Wizard state for Create Event
  const [wizardStep, setWizardStep] = useState(1);
  const [newEventData, setNewEventData] = useState({
    title: '',
    category: 'hackathon',
    categoryLabel: 'Hackathon',
    tagline: '',
    description: '',
    mode: 'Hybrid',
    location: '',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxCapacity: 300,
    allowWaitlist: true,
    isFree: true,
    price: 0,
    teamSize: '1 - 4 Members',
    eligibility: 'Open for all students and professionals',
    schedule: [
      {
        day: 'Day 1',
        sessions: [
          { time: '10:00 AM - 11:30 AM', title: 'Keynote & Kickoff', speaker: 'Lead Architect', room: 'Main Hall' },
          { time: '02:00 PM - 04:00 PM', title: 'Hands-on Technical Session', speaker: 'Industry Specialist', room: 'Lab 1' }
        ]
      }
    ],
    prizes: [
      { rank: '1st Prize', prize: '₹1,00,000 Cash + Certificates' }
    ],
    perks: ['Official Certificate', 'Networking with Mentors', 'Goodies & Swag Kit']
  });

  if (!currentUser) {
    return (
      <div className="dashboard-container empty-state-container">
        <h2>Organizer Studio</h2>
        <p>Please log in as an Event Host or Organizer to manage your events.</p>
      </div>
    );
  }

  // Events belonging to or managed by host
  const hostEvents = events.filter(
    e => e.organizer?.email === currentUser.email || currentUser.role === 'host' || currentUser.role === 'admin'
  );

  const filteredEvents = hostEvents.filter(e => {
    if (eventFilterStatus === 'all') return true;
    return e.status === eventFilterStatus;
  });

  // Calculate Host Metrics
  const totalHostRegistrations = registrations.filter(
    r => hostEvents.some(e => e.id === r.eventId) && r.status !== 'cancelled'
  );
  const totalCheckedIn = totalHostRegistrations.filter(r => r.checkedIn).length;
  const totalRevenue = totalHostRegistrations.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
  const avgFillRate = hostEvents.length > 0
    ? Math.round(
        (hostEvents.reduce((acc, e) => acc + (e.registeredCount / e.maxCapacity), 0) / hostEvents.length) * 100
      )
    : 0;

  // Participant roster filtering
  const rosterParticipants = registrations.filter(r => {
    const matchesEvent = selectedEventForRoster === 'all' || r.eventId === selectedEventForRoster;
    const matchesSearch = rosterSearch === '' ||
      r.userName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      r.ticketId.toLowerCase().includes(rosterSearch.toLowerCase());
    return matchesEvent && matchesSearch;
  });

  const handleExportCSV = () => {
    if (rosterParticipants.length === 0) {
      showToast('No participants to export.', 'warning');
      return;
    }
    const headers = 'Ticket ID,Name,Email,Role,Affiliation,Event,Status,Checked In\n';
    const rows = rosterParticipants.map(r =>
      `"${r.ticketId}","${r.userName}","${r.userEmail}","${r.userRole}","${r.affiliation}","${r.eventTitle}","${r.status}","${r.checkedIn ? 'Yes' : 'No'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EventHub-Participants-${Date.now()}.csv`;
    a.click();
    showToast('Participant roster exported to CSV successfully!');
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createEvent(newEventData);
    setActiveSubTab('manage-events');
    setWizardStep(1);
  };

  const handleConfirmCancelEvent = (eventId) => {
    cancelEvent(eventId, 'Host administrative schedule revision');
    setCancelModalEventId(null);
  };

  return (
    <div className="dashboard-container organizer-dashboard">
      {/* Top Organizer Banner */}
      <div className="dashboard-profile-header host-header">
        <div className="profile-header-left">
          <div className="host-logo-box">
            <Building size={32} />
          </div>
          <div className="profile-header-text">
            <div className="profile-name-row">
              <h2>{currentUser.organizationName || currentUser.name}</h2>
              <span className="role-badge host">
                <CheckCircle2 size={14} />
                <span>Verified Event Host</span>
              </span>
            </div>
            <p className="profile-affiliation-sub">
              🏛️ {currentUser.orgType || 'University / Community'} • Host Lead: {currentUser.name}
            </p>
            <div className="profile-contact-chips">
              <span>📧 {currentUser.email}</span>
              <span>🌐 {currentUser.website || 'https://eventhub.com'}</span>
            </div>
          </div>
        </div>

        <div className="profile-header-right">
          <button
            className="btn-create-event-top"
            onClick={() => {
              setActiveSubTab('create-event');
              setWizardStep(1);
            }}
          >
            <PlusCircle size={16} />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card" onClick={() => setActiveSubTab('manage-events')}>
          <div className="kpi-icon blue">
            <Layers size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{hostEvents.length}</span>
            <span className="kpi-title">Events Hosted</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveSubTab('participants')}>
          <div className="kpi-icon green">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{totalHostRegistrations.length}</span>
            <span className="kpi-title">Total Registrations</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveSubTab('analytics')}>
          <div className="kpi-icon amber">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{avgFillRate}%</span>
            <span className="kpi-title">Avg Seat Capacity Fill</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setActiveSubTab('participants')}>
          <div className="kpi-icon purple">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{totalCheckedIn}</span>
            <span className="kpi-title">Verified Check-Ins</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="dashboard-sub-nav">
        <button
          className={`sub-nav-btn ${activeSubTab === 'manage-events' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('manage-events')}
        >
          <Layers size={16} />
          <span>Manage Events ({hostEvents.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${activeSubTab === 'create-event' ? 'active' : ''}`}
          onClick={() => {
            setActiveSubTab('create-event');
            setWizardStep(1);
          }}
        >
          <PlusCircle size={16} />
          <span>Create New Event</span>
        </button>
        <button
          className={`sub-nav-btn ${activeSubTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('participants')}
        >
          <Users size={16} />
          <span>Participants & Check-in ({totalHostRegistrations.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${activeSubTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('analytics')}
        >
          <TrendingUp size={16} />
          <span>Analytics & Reports</span>
        </button>
      </div>

      {/* =========================================================
          SUB-TAB 1: MANAGE EVENTS
      ========================================================= */}
      {activeSubTab === 'manage-events' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Hosted Events Directory</h3>
              <p>Monitor registrations, track seat capacity, and manage published schedules.</p>
            </div>
            {/* Filter buttons */}
            <div className="table-filter-pills">
              <button
                className={`filter-pill-btn ${eventFilterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setEventFilterStatus('all')}
              >
                All ({hostEvents.length})
              </button>
              <button
                className={`filter-pill-btn ${eventFilterStatus === 'published' ? 'active' : ''}`}
                onClick={() => setEventFilterStatus('published')}
              >
                Published
              </button>
              <button
                className={`filter-pill-btn ${eventFilterStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => setEventFilterStatus('cancelled')}
              >
                Cancelled
              </button>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="empty-state-box">
              <Layers size={40} className="empty-icon text-gray-400" />
              <h4>No Events Found</h4>
              <p>Create your first hackathon or workshop with our simple wizard.</p>
              <button
                className="primary-action-btn"
                onClick={() => setActiveSubTab('create-event')}
              >
                Create Event Now
              </button>
            </div>
          ) : (
            <div className="host-events-table-wrapper">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Date & Mode</th>
                    <th>Capacity & Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((evt) => {
                    const capPercent = Math.min(100, Math.round((evt.registeredCount / evt.maxCapacity) * 100));
                    return (
                      <tr key={evt.id}>
                        <td>
                          <div className="table-event-info">
                            <img src={evt.bannerUrl} alt="" className="table-event-thumb" />
                            <div>
                              <strong className="table-event-title">{evt.title}</strong>
                              <span className="table-category-tag">{evt.categoryLabel}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="table-date-cell">
                            <span>{new Date(evt.startDate).toLocaleDateString()}</span>
                            <small>{evt.mode} ({evt.location})</small>
                          </div>
                        </td>

                        <td>
                          <div className="table-capacity-cell">
                            <div className="cap-progress-header">
                              <strong>{evt.registeredCount} / {evt.maxCapacity}</strong>
                              <span>{capPercent}%</span>
                            </div>
                            <div className="table-cap-track">
                              <div
                                className="table-cap-fill"
                                style={{ width: `${capPercent}%` }}
                              ></div>
                            </div>
                            {evt.waitlistCount > 0 && (
                              <span className="waitlist-tag">Waitlist: {evt.waitlistCount}</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className={`status-badge-pill ${evt.status}`}>
                            {evt.status.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          <div className="table-actions-cell">
                            <button
                              className="btn-table-icon"
                              title="View Event Details"
                              onClick={() => onSelectEvent(evt)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn-table-icon"
                              title="View Registered Participants"
                              onClick={() => {
                                setSelectedEventForRoster(evt.id);
                                setActiveSubTab('participants');
                              }}
                            >
                              <Users size={16} />
                            </button>
                            {evt.status !== 'cancelled' && (
                              <button
                                className="btn-table-icon text-red-500"
                                title="Cancel Event"
                                onClick={() => setCancelModalEventId(evt.id)}
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 2: CREATE EVENT WIZARD
      ========================================================= */}
      {activeSubTab === 'create-event' && (
        <div className="dashboard-tab-content">
          <div className="wizard-container">
            {/* Wizard Steps Header */}
            <div className="wizard-steps-header">
              <div className={`wizard-step-node ${wizardStep >= 1 ? 'active' : ''}`}>
                <div className="step-circle">1</div>
                <span>Basic Info</span>
              </div>
              <div className="step-connector"></div>
              <div className={`wizard-step-node ${wizardStep >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span>Schedule & Speakers</span>
              </div>
              <div className="step-connector"></div>
              <div className={`wizard-step-node ${wizardStep >= 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Capacity & Pricing</span>
              </div>
              <div className="step-connector"></div>
              <div className={`wizard-step-node ${wizardStep >= 4 ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <span>Preview & Publish</span>
              </div>
            </div>

            {/* STEP 1: BASIC INFO */}
            {wizardStep === 1 && (
              <div className="wizard-panel">
                <h3>Step 1: Event Fundamentals</h3>
                <p className="wizard-sub">Define the title, format, category, and core description.</p>

                <div className="wizard-form-grid">
                  <div className="auth-field col-span-2">
                    <label>Event Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. NextGen Web3 & AI Hackathon 2026"
                      value={newEventData.title}
                      onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Category *</label>
                    <select
                      value={newEventData.category}
                      onChange={(e) => {
                        const labels = {
                          hackathon: 'Hackathon',
                          workshop: 'Workshop',
                          conference: 'Conference',
                          cultural: 'Cultural Fest',
                          competition: 'Business Competition',
                          webinar: 'Webinar'
                        };
                        setNewEventData({
                          ...newEventData,
                          category: e.target.value,
                          categoryLabel: labels[e.target.value] || 'Event'
                        });
                      }}
                    >
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop & Bootcamp</option>
                      <option value="conference">Conference & Summit</option>
                      <option value="cultural">Cultural Fest</option>
                      <option value="competition">Business Competition</option>
                      <option value="webinar">Webinar</option>
                    </select>
                  </div>

                  <div className="auth-field">
                    <label>Event Mode *</label>
                    <select
                      value={newEventData.mode}
                      onChange={(e) => setNewEventData({ ...newEventData, mode: e.target.value })}
                    >
                      <option value="Online">Online / Virtual</option>
                      <option value="In-Person">In-Person / On Campus</option>
                      <option value="Hybrid">Hybrid (Both)</option>
                    </select>
                  </div>

                  <div className="auth-field col-span-2">
                    <label>Venue / Streaming Platform *</label>
                    <input
                      type="text"
                      placeholder="e.g. Campus Auditorium / Live Zoom & Discord"
                      value={newEventData.location}
                      onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field col-span-2">
                    <label>Catchy Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Build innovative solutions and compete for prizes"
                      value={newEventData.tagline}
                      onChange={(e) => setNewEventData({ ...newEventData, tagline: e.target.value })}
                    />
                  </div>

                  <div className="auth-field col-span-2">
                    <label>Banner Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newEventData.bannerUrl}
                      onChange={(e) => setNewEventData({ ...newEventData, bannerUrl: e.target.value })}
                    />
                  </div>

                  <div className="auth-field col-span-2">
                    <label>Full Event Description *</label>
                    <textarea
                      rows="4"
                      placeholder="Describe the opportunity, key rounds, guidelines, and benefits..."
                      value={newEventData.description}
                      onChange={(e) => setNewEventData({ ...newEventData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="wizard-actions">
                  <div></div>
                  <button
                    className="wizard-next-btn"
                    onClick={() => {
                      if (!newEventData.title || !newEventData.location || !newEventData.description) {
                        showToast('Please fill out all required fields in Step 1.', 'warning');
                        return;
                      }
                      setWizardStep(2);
                    }}
                  >
                    <span>Next: Schedule & Agenda</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SCHEDULE & SPEAKERS */}
            {wizardStep === 2 && (
              <div className="wizard-panel">
                <h3>Step 2: Dates, Schedule & Speakers</h3>
                <p className="wizard-sub">Define the event timeline and keynote sessions.</p>

                <div className="wizard-form-grid">
                  <div className="auth-field">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={newEventData.startDate}
                      onChange={(e) => setNewEventData({ ...newEventData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>End Date *</label>
                    <input
                      type="date"
                      value={newEventData.endDate}
                      onChange={(e) => setNewEventData({ ...newEventData, endDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="auth-field col-span-2">
                    <label>Registration Deadline *</label>
                    <input
                      type="datetime-local"
                      value={newEventData.registrationDeadline}
                      onChange={(e) => setNewEventData({ ...newEventData, registrationDeadline: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Preconfigured schedule preview */}
                <div className="wizard-schedule-preview">
                  <h4>Structured Day 1 Agenda Sample:</h4>
                  <div className="schedule-preview-box">
                    <div className="preview-session-row">
                      <span>10:00 AM - 11:30 AM</span>
                      <strong>Opening Keynote & Challenge Unveiling</strong>
                    </div>
                    <div className="preview-session-row">
                      <span>02:00 PM - 04:00 PM</span>
                      <strong>Technical Hands-on Mentorship</strong>
                    </div>
                  </div>
                </div>

                <div className="wizard-actions">
                  <button className="wizard-back-btn" onClick={() => setWizardStep(1)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    className="wizard-next-btn"
                    onClick={() => {
                      if (!newEventData.startDate || !newEventData.endDate || !newEventData.registrationDeadline) {
                        showToast('Please set event dates and registration deadline.', 'warning');
                        return;
                      }
                      setWizardStep(3);
                    }}
                  >
                    <span>Next: Capacity & Pricing</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CAPACITY & PRICING */}
            {wizardStep === 3 && (
              <div className="wizard-panel">
                <h3>Step 3: Participant Capacity & Pricing Rules</h3>
                <p className="wizard-sub">Control seat limits, waitlists, and tickets.</p>

                <div className="wizard-form-grid">
                  <div className="auth-field">
                    <label>Maximum Participant Capacity *</label>
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={newEventData.maxCapacity}
                      onChange={(e) => setNewEventData({ ...newEventData, maxCapacity: parseInt(e.target.value) || 100 })}
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Team Format</label>
                    <select
                      value={newEventData.teamSize}
                      onChange={(e) => setNewEventData({ ...newEventData, teamSize: e.target.value })}
                    >
                      <option value="Individual">Individual (1 Person)</option>
                      <option value="1 - 3 Members">1 - 3 Members</option>
                      <option value="1 - 4 Members">1 - 4 Members</option>
                      <option value="1 - 5 Members">1 - 5 Members</option>
                    </select>
                  </div>

                  <div className="auth-field col-span-2">
                    <label className="checkbox-toggle-label">
                      <input
                        type="checkbox"
                        checked={newEventData.allowWaitlist}
                        onChange={(e) => setNewEventData({ ...newEventData, allowWaitlist: e.target.checked })}
                      />
                      <span>Enable Automated Waitlist when maximum capacity is reached</span>
                    </label>
                  </div>

                  <div className="auth-field col-span-2">
                    <label>Registration Fee</label>
                    <div className="fee-toggle-row">
                      <button
                        type="button"
                        className={`fee-choice-btn ${newEventData.isFree ? 'active' : ''}`}
                        onClick={() => setNewEventData({ ...newEventData, isFree: true, price: 0 })}
                      >
                        Free Registration (₹0)
                      </button>
                      <button
                        type="button"
                        className={`fee-choice-btn ${!newEventData.isFree ? 'active' : ''}`}
                        onClick={() => setNewEventData({ ...newEventData, isFree: false, price: 199 })}
                      >
                        Paid Ticket Pass
                      </button>
                    </div>
                  </div>

                  {!newEventData.isFree && (
                    <div className="auth-field col-span-2">
                      <label>Ticket Price (INR ₹) *</label>
                      <input
                        type="number"
                        min="50"
                        value={newEventData.price}
                        onChange={(e) => setNewEventData({ ...newEventData, price: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="wizard-actions">
                  <button className="wizard-back-btn" onClick={() => setWizardStep(2)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="wizard-next-btn" onClick={() => setWizardStep(4)}>
                    <span>Next: Review & Publish</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PREVIEW & PUBLISH */}
            {wizardStep === 4 && (
              <div className="wizard-panel">
                <h3>Step 4: Final Review & Publish</h3>
                <p className="wizard-sub">Verify event details before publishing to the platform catalog.</p>

                <div className="publish-preview-card">
                  <img src={newEventData.bannerUrl} alt="" className="preview-banner" />
                  <div className="preview-body">
                    <span className="category-tag">{newEventData.categoryLabel}</span>
                    <h4>{newEventData.title}</h4>
                    <p className="preview-tagline">{newEventData.tagline}</p>
                    <div className="preview-specs-grid">
                      <div>📍 {newEventData.location} ({newEventData.mode})</div>
                      <div>📅 {newEventData.startDate} to {newEventData.endDate}</div>
                      <div>👥 Capacity: {newEventData.maxCapacity} participants</div>
                      <div>💰 Price: {newEventData.isFree ? 'FREE' : `₹${newEventData.price}`}</div>
                    </div>
                  </div>
                </div>

                <div className="wizard-actions">
                  <button className="wizard-back-btn" onClick={() => setWizardStep(3)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="wizard-publish-btn" onClick={handleCreateSubmit}>
                    <Sparkles size={16} />
                    <span>Publish Event Live to EventHub</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: PARTICIPANT MANAGEMENT & ROSTER
      ========================================================= */}
      {activeSubTab === 'participants' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Participant Roster & Entry Check-in</h3>
              <p>Monitor registrations, verify digital pass QR tickets, and check-in attendees.</p>
            </div>
            <button className="btn-export-csv" onClick={handleExportCSV}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Roster Filters */}
          <div className="roster-filters-bar">
            <div className="roster-select-group">
              <label>Filter by Event:</label>
              <select
                value={selectedEventForRoster}
                onChange={(e) => setSelectedEventForRoster(e.target.value)}
              >
                <option value="all">All Hosted Events</option>
                {hostEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>{evt.title}</option>
                ))}
              </select>
            </div>

            <div className="roster-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by participant name, email, or ticket ID..."
                value={rosterSearch}
                onChange={(e) => setRosterSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {rosterParticipants.length === 0 ? (
            <div className="empty-state-box">
              <Users size={40} className="empty-icon text-gray-400" />
              <h4>No Registered Participants Found</h4>
              <p>There are no registrations matching your selected filters.</p>
            </div>
          ) : (
            <div className="host-events-table-wrapper">
              <table className="custom-data-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Ticket / Role</th>
                    <th>Event</th>
                    <th>Registration Date</th>
                    <th>Attendance Check-In</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterParticipants.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <div className="table-participant-info">
                          <strong>{reg.userName}</strong>
                          <small>{reg.userEmail}</small>
                          <span className="participant-affiliation">{reg.affiliation}</span>
                        </div>
                      </td>

                      <td>
                        <div className="table-ticket-cell">
                          <span className="ticket-code-tag">#{reg.ticketId}</span>
                          <span className={`role-chip-sm ${reg.userRole}`}>{reg.userRole}</span>
                        </div>
                      </td>

                      <td>
                        <div className="table-event-cell">
                          <span>{reg.eventTitle}</span>
                        </div>
                      </td>

                      <td>
                        <span className="table-date-text">
                          {new Date(reg.registrationDate).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <button
                          className={`btn-checkin-toggle ${reg.checkedIn ? 'checked' : 'pending'}`}
                          onClick={() => checkInAttendee(reg.id)}
                        >
                          {reg.checkedIn ? (
                            <>
                              <Check size={14} />
                              <span>Checked In</span>
                            </>
                          ) : (
                            <>
                              <QrCode size={14} />
                              <span>Check In Pass</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 4: ANALYTICS & INSIGHTS
      ========================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Event Engagement Analytics & Insights</h3>
              <p>Real-time analytics on attendance, demographic distributions, and capacity velocity.</p>
            </div>
          </div>

          <div className="analytics-grid">
            {/* Demographic Distribution Card */}
            <div className="analytics-widget-card">
              <h4>Participant Demographics</h4>
              <p className="widget-sub">Ratio of College Students vs Working Professionals</p>

              <div className="demographic-bar-wrapper">
                <div className="demo-metric-row">
                  <span>🎓 Students</span>
                  <strong>
                    {totalHostRegistrations.filter(r => r.userRole === 'student').length} (
                    {totalHostRegistrations.length > 0
                      ? Math.round(
                          (totalHostRegistrations.filter(r => r.userRole === 'student').length /
                            totalHostRegistrations.length) *
                            100
                        )
                      : 0}
                    %)
                  </strong>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill blue"
                    style={{
                      width: `${
                        totalHostRegistrations.length > 0
                          ? (totalHostRegistrations.filter(r => r.userRole === 'student').length /
                              totalHostRegistrations.length) *
                            100
                          : 50
                      }%`
                    }}
                  ></div>
                </div>

                <div className="demo-metric-row mt-4">
                  <span>💼 Working Professionals</span>
                  <strong>
                    {totalHostRegistrations.filter(r => r.userRole === 'employee').length} (
                    {totalHostRegistrations.length > 0
                      ? Math.round(
                          (totalHostRegistrations.filter(r => r.userRole === 'employee').length /
                            totalHostRegistrations.length) *
                            100
                        )
                      : 0}
                    %)
                  </strong>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill purple"
                    style={{
                      width: `${
                        totalHostRegistrations.length > 0
                          ? (totalHostRegistrations.filter(r => r.userRole === 'employee').length /
                              totalHostRegistrations.length) *
                            100
                          : 50
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Attendance Check-in Rate Card */}
            <div className="analytics-widget-card">
              <h4>Attendance Check-In Velocity</h4>
              <p className="widget-sub">Conversion of registered tickets to live verified check-ins</p>

              <div className="attendance-gauge-box">
                <div className="gauge-number">
                  {totalHostRegistrations.length > 0
                    ? Math.round((totalCheckedIn / totalHostRegistrations.length) * 100)
                    : 0}
                  %
                </div>
                <span className="gauge-label">Check-in Rate</span>
                <p className="gauge-sub">
                  {totalCheckedIn} of {totalHostRegistrations.length} attendees verified at entry
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Event Modal */}
      {cancelModalEventId && (
        <div className="modal-backdrop-overlay" onClick={() => setCancelModalEventId(null)}>
          <div className="confirmation-modal-box" onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={36} className="text-red-500 mb-2" />
            <h3>Cancel Hosted Event?</h3>
            <p>
              Cancelling this event will immediately notify all registered participants,
              cancel all issued tickets, and archive the public listing.
            </p>
            <div className="confirm-modal-actions">
              <button className="btn-cancel-modal-back" onClick={() => setCancelModalEventId(null)}>
                Keep Event Active
              </button>
              <button
                className="btn-cancel-modal-confirm"
                onClick={() => handleConfirmCancelEvent(cancelModalEventId)}
              >
                Yes, Cancel Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
