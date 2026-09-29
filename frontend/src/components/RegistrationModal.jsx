import React, { useState } from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  X,
  Users,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Sparkles,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Plus,
  Trash2,
  Ticket
} from 'lucide-react';

export const RegistrationModal = ({ event, onClose }) => {
  const { currentUser, registerForEvent, setAuthModalOpen, setAuthMode, showToast } = useEventHub();

  const [isTeam, setIsTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState(['', '']);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [affiliation, setAffiliation] = useState(
    currentUser?.role === 'student'
      ? (currentUser.college || '')
      : (currentUser?.company || '')
  );
  const [notes, setNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const isFull = event.registeredCount >= event.maxCapacity;

  const handleAddTeammate = () => {
    if (teamMembers.length < 4) {
      setTeamMembers([...teamMembers, '']);
    } else {
      showToast('Maximum 4 members allowed for this team.', 'warning');
    }
  };

  const handleRemoveTeammate = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleTeammateChange = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (!agreedTerms) {
      showToast('Please accept the event code of conduct to proceed.', 'error');
      return;
    }

    if (isTeam && !teamName.trim()) {
      showToast('Please enter your Team Name.', 'error');
      return;
    }

    setIsSubmitting(true);

    const validMembers = isTeam
      ? [currentUser.name, ...teamMembers.filter(m => m.trim().length > 0)]
      : [currentUser.name];

    setTimeout(() => {
      registerForEvent(event, {
        isTeam,
        teamName: isTeam ? teamName : 'Individual',
        teamMembers: validMembers,
        phone,
        notes
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="registration-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="reg-modal-header">
          <div>
            <div className="reg-event-category-badge">{event.categoryLabel || event.category}</div>
            <h2>Register for Event</h2>
            <p className="reg-modal-event-title">{event.title}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Capacity status banner */}
        {isFull ? (
          <div className="reg-capacity-warning-banner">
            <AlertCircle size={18} />
            <div>
              <strong>Event Capacity Reached!</strong>
              <p>You are joining the automated waitlist (Position #{ (event.waitlistCount || 0) + 1 }). You will be confirmed if a seat frees up.</p>
            </div>
          </div>
        ) : (
          <div className="reg-capacity-success-banner">
            <CheckCircle size={18} />
            <div>
              <strong>Seats Available!</strong>
              <p>Instant confirmation pass with QR entry code upon completion.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="reg-modal-form">
          {/* User profile confirmation */}
          <div className="reg-user-summary-card">
            <div className="reg-user-avatar-group">
              <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'} alt="" />
              <div>
                <strong>{currentUser?.name || 'Guest User'}</strong>
                <p>{currentUser?.email || 'Please sign in to register'}</p>
              </div>
            </div>
            <span className="reg-role-tag">
              {currentUser?.role ? `${currentUser.role.toUpperCase()} REGISTER` : 'GUEST'}
            </span>
          </div>

          {/* Registration Type Toggle */}
          <div className="reg-form-group">
            <label>Participation Type</label>
            <div className="reg-type-toggle">
              <button
                type="button"
                className={`type-toggle-btn ${!isTeam ? 'active' : ''}`}
                onClick={() => setIsTeam(false)}
              >
                <User size={16} />
                <span>Solo / Individual</span>
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${isTeam ? 'active' : ''}`}
                onClick={() => setIsTeam(true)}
              >
                <Users size={16} />
                <span>Team Registration</span>
              </button>
            </div>
          </div>

          {/* If Team: Team Details */}
          {isTeam && (
            <div className="team-fields-block">
              <div className="reg-form-group">
                <label>Team Name *</label>
                <input
                  type="text"
                  placeholder="e.g. NeuralKnights, AlphaSquad"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required={isTeam}
                />
              </div>

              <div className="reg-form-group">
                <div className="teammates-header-row">
                  <label>Additional Teammates (Email IDs)</label>
                  {teamMembers.length < 4 && (
                    <button type="button" onClick={handleAddTeammate} className="add-teammate-btn">
                      <Plus size={14} /> Add Teammate
                    </button>
                  )}
                </div>
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="teammate-input-row">
                    <input
                      type="email"
                      placeholder={`Teammate #${idx + 2} Email ID`}
                      value={member}
                      onChange={(e) => handleTeammateChange(idx, e.target.value)}
                    />
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeammate(idx)}
                        className="remove-teammate-btn"
                        title="Remove member"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact & Affiliation Details */}
          <div className="reg-form-row">
            <div className="reg-form-group flex-1">
              <label>Phone Number *</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="reg-form-group flex-1">
              <label>{currentUser?.role === 'student' ? 'College / University *' : 'Company / Organization *'}</label>
              <input
                type="text"
                placeholder={currentUser?.role === 'student' ? 'e.g. IIT Delhi' : 'e.g. Google'}
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Custom Notes / Queries */}
          <div className="reg-form-group">
            <label>Specific Interests / Requirements / Dietary (Optional)</label>
            <textarea
              rows="2"
              placeholder="Any expectations, software skills, or accessibility requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          {/* Pricing summary */}
          <div className="reg-pricing-summary-box">
            <div className="price-line">
              <span>Event Entry Ticket</span>
              <strong>{event.isFree ? 'FREE' : `₹${event.price}`}</strong>
            </div>
            <div className="price-line">
              <span>Platform Processing Fee</span>
              <strong className="text-emerald-500">₹0 (Waived)</strong>
            </div>
            <div className="price-divider"></div>
            <div className="price-line total-line">
              <span>Total Payable</span>
              <strong className="final-price">{event.isFree ? '₹0 (FREE)' : `₹${event.price}`}</strong>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="terms-checkbox-label">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
            />
            <span>I agree to the EventHub Rules, Participant Guidelines, and Code of Conduct.</span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`reg-submit-btn ${isFull ? 'waitlist-submit' : ''}`}
          >
            {isSubmitting ? (
              <span>Processing Pass...</span>
            ) : isFull ? (
              <span>Confirm & Join Waitlist #{ (event.waitlistCount || 0) + 1 }</span>
            ) : (
              <>
                <Ticket size={18} />
                <span>Confirm Registration & Generate E-Pass</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
