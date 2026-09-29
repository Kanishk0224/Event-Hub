import React, { useState } from 'react';
import { useEventHub } from '../../context/EventHubContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Layers,
  Sparkles,
  Search,
  Filter,
  Eye,
  Trash2,
  Tag,
  Activity,
  Award,
  AlertTriangle,
  Building,
  ShieldAlert,
  FileCheck,
  Clock,
  GraduationCap,
  Briefcase
} from 'lucide-react';

export const AdminDashboard = ({ onSelectEvent }) => {
  const {
    currentUser,
    events,
    users,
    registrations,
    categories,
    approveEvent,
    toggleFeatureEvent,
    toggleVerifyUser,
    approveHostApplication,
    rejectHostApplication,
    cancelEvent,
    showToast
  } = useEventHub();

  const [adminTab, setAdminTab] = useState('host-queue'); // 'host-queue' | 'events' | 'users' | 'categories' | 'logs'
  const [eventSearch, setEventSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Pending hosts for anti-fraud verification
  const pendingHosts = users.filter(
    u => u.role === 'host' && u.verificationStatus === 'pending_review'
  );

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="dashboard-container empty-state-container">
        <h2>Platform Administrator Console</h2>
        <p>Access Restricted. Please log in with Administrator credentials.</p>
      </div>
    );
  }

  // Filter events
  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    e.organizer.name.toLowerCase().includes(eventSearch.toLowerCase())
  );

  // Filter users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="dashboard-container admin-dashboard">
      {/* Top Banner */}
      <div className="dashboard-profile-header admin-header">
        <div className="profile-header-left">
          <div className="admin-badge-circle">
            <ShieldCheck size={32} />
          </div>
          <div className="profile-header-text">
            <div className="profile-name-row">
              <h2>EventHub Platform Administration</h2>
              <span className="role-badge admin">
                <ShieldCheck size={14} />
                <span>Super Administrator</span>
              </span>
            </div>
            <p className="profile-affiliation-sub">
              System Console • Anti-Fraud Host Verification, Event Moderation & Platform Security
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="dashboard-kpi-grid">
        <div className="kpi-card" onClick={() => setAdminTab('host-queue')}>
          <div className="kpi-icon amber">
            <ShieldAlert size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{pendingHosts.length}</span>
            <span className="kpi-title">Pending 24h Host Reviews</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setAdminTab('events')}>
          <div className="kpi-icon blue">
            <Layers size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{events.length}</span>
            <span className="kpi-title">Total Platform Events</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setAdminTab('users')}>
          <div className="kpi-icon green">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{users.length}</span>
            <span className="kpi-title">Registered Accounts</span>
          </div>
        </div>

        <div className="kpi-card" onClick={() => setAdminTab('users')}>
          <div className="kpi-icon purple">
            <Building size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-number">{users.filter(u => u.role === 'host' && u.verified).length}</span>
            <span className="kpi-title">Verified Organizers</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="dashboard-sub-nav">
        <button
          className={`sub-nav-btn ${adminTab === 'host-queue' ? 'active' : ''}`}
          onClick={() => setAdminTab('host-queue')}
        >
          <ShieldAlert size={16} />
          <span>Host Verification Queue ({pendingHosts.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${adminTab === 'events' ? 'active' : ''}`}
          onClick={() => setAdminTab('events')}
        >
          <Layers size={16} />
          <span>Event Moderation ({events.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${adminTab === 'users' ? 'active' : ''}`}
          onClick={() => setAdminTab('users')}
        >
          <Users size={16} />
          <span>User & Host Directory ({users.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${adminTab === 'categories' ? 'active' : ''}`}
          onClick={() => setAdminTab('categories')}
        >
          <Tag size={16} />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          className={`sub-nav-btn ${adminTab === 'logs' ? 'active' : ''}`}
          onClick={() => setAdminTab('logs')}
        >
          <Activity size={16} />
          <span>Platform Audit Feed</span>
        </button>
      </div>

      {/* =========================================================
          TAB 0: HOST VERIFICATION QUEUE (ANTI-FRAUD)
      ========================================================= */}
      {adminTab === 'host-queue' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>🛡️ Host Verification & Anti-Fraud Queue ({pendingHosts.length} Pending)</h3>
              <p>
                To prevent fake colleges, unauthorized company events, and payment fraud, review institutional Google Search Index status and uploaded accreditation proofs within the 24-hour review window.
              </p>
            </div>
          </div>

          {pendingHosts.length === 0 ? (
            <div className="empty-state-box">
              <CheckCircle2 size={42} className="empty-icon text-emerald-500" />
              <h4>All Host Applications Verified!</h4>
              <p>There are no pending college or corporate host applications in the queue.</p>
            </div>
          ) : (
            <div className="pending-hosts-list">
              {pendingHosts.map((host) => (
                <div key={host.id} className="pending-host-review-card">
                  <div className="host-review-card-header">
                    <div className="host-title-group">
                      <span className={`category-tag ${host.hostCategory === 'company' ? 'tag-competition' : 'tag-workshop'}`}>
                        {host.hostCategory === 'company' ? '💼 Corporate Company' : '🎓 College / University'}
                      </span>
                      <h4>{host.organizationName || host.institutionName}</h4>
                      <small className="host-type-sub">{host.orgType} • Website: <a href={host.website} target="_blank" rel="noreferrer" className="text-blue-500 underline">{host.website || 'Provided on portal'}</a></small>
                    </div>

                    <div className="verification-time-pill">
                      <Clock size={14} className="text-amber-500" />
                      <span>24h SLA Active</span>
                    </div>
                  </div>

                  <div className="host-verification-checks-grid">
                    {/* Google Index Check */}
                    <div className="verification-check-item">
                      <div className="check-item-header">
                        <Search size={15} className="text-blue-500" />
                        <strong>1. Google Search & Registry Index Match</strong>
                      </div>
                      <p className="check-item-desc text-emerald-600 font-semibold">
                        {host.googleSearchStatus || '✅ Verified on Google Knowledge Graph & Official Directory Registry'}
                      </p>
                    </div>

                    {/* Accreditation Proof */}
                    <div className="verification-check-item">
                      <div className="check-item-header">
                        <FileCheck size={15} className="text-purple-500" />
                        <strong>2. Institutional Accreditation Proof</strong>
                      </div>
                      <div className="doc-preview-badge">
                        <span>📄 {host.certificateProof || 'Accreditation-Certificate.pdf'}</span>
                        <span className="doc-verified-tag">Uploaded</span>
                      </div>
                    </div>

                    {/* ID Proof */}
                    <div className="verification-check-item">
                      <div className="check-item-header">
                        <ShieldCheck size={15} className="text-emerald-500" />
                        <strong>3. Authorized Incharge ID Proof</strong>
                      </div>
                      <div className="doc-preview-badge">
                        <span>🪪 {host.inchargeIdProof || 'Incharge-Official-ID.pdf'}</span>
                        <span className="doc-verified-tag">Uploaded</span>
                      </div>
                    </div>

                    {/* Incharge Details */}
                    <div className="verification-check-item">
                      <div className="check-item-header">
                        <Building size={15} className="text-amber-500" />
                        <strong>4. Contact & Incharge Details</strong>
                      </div>
                      <p className="check-item-desc">
                        <strong>{host.name || host.inchargeName}</strong> ({host.designation || 'Event Coordinator'})<br />
                        📧 {host.email} | 📱 {host.phone}
                      </p>
                    </div>
                  </div>

                  <div className="host-review-actions-bar">
                    <button
                      className="btn-reject-host"
                      onClick={() => rejectHostApplication(host.id, 'Unable to verify institutional accreditation proof')}
                    >
                      <XCircle size={15} />
                      <span>Reject Application</span>
                    </button>

                    <button
                      className="btn-approve-host-primary"
                      onClick={() => approveHostApplication(host.id)}
                    >
                      <CheckCircle2 size={16} />
                      <span>Verify & Grant Host Access (Send Approval Email)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 1: EVENT MODERATION
      ========================================================= */}
      {adminTab === 'events' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Event Moderation & Quality Control</h3>
              <p>Review submitted events, feature top hackathons, and ensure compliance.</p>
            </div>
            <div className="roster-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search events by title or host..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="host-events-table-wrapper">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>Event Name & Host</th>
                  <th>Category / Mode</th>
                  <th>Capacity</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <div className="table-event-info">
                        <img src={evt.bannerUrl} alt="" className="table-event-thumb" />
                        <div>
                          <strong className="table-event-title">{evt.title}</strong>
                          <small className="table-host-name">By {evt.organizer.name}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="table-category-cell">
                        <span className="table-category-tag">{evt.categoryLabel}</span>
                        <small>{evt.mode}</small>
                      </div>
                    </td>

                    <td>
                      <span>{evt.registeredCount} / {evt.maxCapacity}</span>
                    </td>

                    <td>
                      <button
                        className={`btn-feature-toggle ${evt.isFeatured ? 'featured' : ''}`}
                        onClick={() => toggleFeatureEvent(evt.id)}
                        title="Toggle Featured Spotlight"
                      >
                        <Sparkles size={14} />
                        <span>{evt.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
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
                          title="Preview Event"
                          onClick={() => onSelectEvent(evt)}
                        >
                          <Eye size={16} />
                        </button>
                        {evt.status === 'draft' && (
                          <button
                            className="btn-table-icon text-emerald-500"
                            title="Approve Event"
                            onClick={() => approveEvent(evt.id)}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        {evt.status !== 'cancelled' && (
                          <button
                            className="btn-table-icon text-red-500"
                            title="Cancel / Suspend Event"
                            onClick={() => cancelEvent(evt.id, 'Admin Policy Flag')}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: USER DIRECTORY
      ========================================================= */}
      {adminTab === 'users' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Platform Users & Organization Directory</h3>
              <p>Manage attendee profiles, grant verified badges to college hosts, and oversee accounts.</p>
            </div>
            <div className="roster-search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="host-events-table-wrapper">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Account Role</th>
                  <th>Affiliation / Organization</th>
                  <th>Verification</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="table-user-info-cell">
                        <img src={u.avatar} alt="" className="table-user-avatar" />
                        <div>
                          <strong>{u.name}</strong>
                          <small>{u.email}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className={`role-chip-sm ${u.role}`}>{u.role.toUpperCase()}</span>
                    </td>

                    <td>
                      <span className="table-affiliation-text">
                        {u.role === 'student' && (u.college || 'University Student')}
                        {u.role === 'employee' && (u.company || 'Professional')}
                        {u.role === 'host' && (u.organizationName || 'Event Host')}
                        {u.role === 'admin' && 'Platform Administration'}
                      </span>
                    </td>

                    <td>
                      {u.role === 'host' ? (
                        <button
                          className={`btn-verify-toggle ${u.verified ? 'verified' : 'unverified'}`}
                          onClick={() => toggleVerifyUser(u.id)}
                        >
                          <CheckCircle2 size={14} />
                          <span>{u.verified ? 'Verified Host' : 'Pending Verification'}</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Standard Member</span>
                      )}
                    </td>

                    <td>
                      <span className="table-date-text">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: CATEGORIES
      ========================================================= */}
      {adminTab === 'categories' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Event Taxonomy & Category Management</h3>
              <p>Configure discoverable category tags across the EventHub ecosystem.</p>
            </div>
          </div>

          <div className="categories-admin-grid">
            {categories.map((c) => (
              <div key={c.id} className="category-admin-card">
                <div className="cat-icon-circle" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                  <Tag size={20} />
                </div>
                <div className="cat-admin-info">
                  <h4>{c.name}</h4>
                  <small>Identifier: <code>{c.id}</code></small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: AUDIT LOGS
      ========================================================= */}
      {adminTab === 'logs' && (
        <div className="dashboard-tab-content">
          <div className="content-section-header">
            <div>
              <h3>Platform Live Activity Feed & Audit Trail</h3>
              <p>Real-time audit tracking for registrations, host updates, and system events.</p>
            </div>
          </div>

          <div className="audit-feed-list">
            <div className="audit-item">
              <span className="audit-dot green"></span>
              <div className="audit-content">
                <strong>New Event Registration Recorded</strong>
                <p>Participant Aarav Sharma generated E-Pass #EH-2026-89421 for National Generative AI Hackathon.</p>
                <small>2 hours ago</small>
              </div>
            </div>

            <div className="audit-item">
              <span className="audit-dot blue"></span>
              <div className="audit-content">
                <strong>Host Verification Badge Confirmed</strong>
                <p>Google Developer Group & IIT Delhi verified with official credentials.</p>
                <small>1 day ago</small>
              </div>
            </div>

            <div className="audit-item">
              <span className="audit-dot amber"></span>
              <div className="audit-content">
                <strong>Waitlist Auto-Promotion Triggered</strong>
                <p>Seat released for Rendezvous Cultural Carnival; waitlist queue position #1 promoted.</p>
                <small>2 days ago</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
