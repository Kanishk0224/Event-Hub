import { useState, useEffect } from 'react';
import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  X,
  Users,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Ticket,
  Loader2
} from 'lucide-react';

export const RegistrationModal = ({ event, onClose, isOpen = true }) => {
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
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen || !event) return null;

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

    // Validate payment for paid events
    if (!event.isFree && !paymentDone) {
      showToast('Please complete the payment to register.', 'error');
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
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {event.categoryLabel || event.category}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1.5">
              Confirm Event Registration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
              {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Capacity Alert Banner */}
        <div className="px-5 sm:px-6 pt-4">
          {isFull ? (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs">
              <AlertCircle size={18} className="flex-shrink-0" />
              <div>
                <strong>Event Capacity Full!</strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  You are joining the automated waitlist (Position #{(event.waitlistCount || 0) + 1}). You will be automatically enrolled if a slot opens.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs">
              <CheckCircle2 size={18} className="flex-shrink-0" />
              <div>
                <strong>Guaranteed Immediate Admission!</strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Instant QR entry ticket generated upon completion.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* User Confirmation Card */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                alt=""
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Guest User'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || 'Please sign in to register'}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {currentUser?.role || 'GUEST'}
            </span>
          </div>

          {/* Solo vs Team Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Registration Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => setIsTeam(false)}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  !isTeam
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <User size={14} />
                <span>Solo Participant</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTeam(true)}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isTeam
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Users size={14} />
                <span>Team Roster</span>
              </button>
            </div>
          </div>

          {/* Team Fields */}
          {isTeam && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 animate-fade-in">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ApexInnovators, CyberSquad"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required={isTeam}
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Teammate Email IDs
                  </label>
                  {teamMembers.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddTeammate}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Member
                    </button>
                  )}
                </div>
                {teamMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="email"
                      placeholder={`Member #${idx + 2} Email address`}
                      value={member}
                      onChange={(e) => handleTeammateChange(idx, e.target.value)}
                      className="input-field"
                    />
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeammate(idx)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  WhatsApp Phone Number *
                </label>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  📱 Twilio WhatsApp Ready
                </span>
              </div>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="input-field"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Instant digital pass confirmation & reminders will be sent via WhatsApp.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {currentUser?.role === 'student' ? 'College / University *' : 'Company / Organization *'}
              </label>
              <input
                type="text"
                placeholder={currentUser?.role === 'student' ? 'e.g. IIT Delhi' : 'e.g. Google'}
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Custom Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Special Requests or Accessibility Requirements (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any dietary restrictions, special software tools, or accommodations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Event Pass Price</span>
              <strong className="text-slate-900 dark:text-white">
                {event.isFree ? 'FREE' : `₹${event.price}`}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Processing Fee</span>
              <strong className="text-emerald-500">₹0 (Waived)</strong>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Total Payable</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-black text-base">
                {event.isFree ? '₹0 (FREE)' : `₹${event.price}`}
              </span>
            </div>
          </div>

          {/* Payment Section - only for paid events */}
          {!event.isFree && (
            <div className="space-y-3 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
              <p className="text-xs font-bold text-slate-900 dark:text-white">💳 Payment Method</p>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI', emoji: '📱' },
                  { id: 'card', label: 'Card', emoji: '💳' },
                  { id: 'netbanking', label: 'Net Banking', emoji: '🏦' }
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => { setPaymentMethod(pm.id); setPaymentDone(false); }}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition-all ${
                      paymentMethod === pm.id
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-400'
                    }`}
                  >
                    {pm.emoji} {pm.label}
                  </button>
                ))}
              </div>

              {/* UPI Input */}
              {paymentMethod === 'upi' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="yourname@upi (e.g. 9876543210@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input-field text-xs"
                  />
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Supported: PhonePe, GPay, Paytm, BHIM, Amazon Pay
                  </div>
                </div>
              )}

              {/* Card Placeholder */}
              {paymentMethod === 'card' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number (Debit / Credit)"
                    maxLength={19}
                    className="input-field text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="MM / YY" className="input-field text-xs" />
                    <input type="text" placeholder="CVV" maxLength={4} className="input-field text-xs" />
                  </div>
                </div>
              )}

              {/* Net Banking placeholder */}
              {paymentMethod === 'netbanking' && (
                <select className="input-field text-xs">
                  <option value="">Select Your Bank</option>
                  <option>SBI</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra</option>
                  <option>Punjab National Bank</option>
                </select>
              )}

              {/* Pay Now button */}
              {!paymentDone ? (
                <button
                  type="button"
                  onClick={() => {
                    if (paymentMethod === 'upi' && !upiId.trim()) {
                      showToast('Please enter your UPI ID.', 'error');
                      return;
                    }
                    setIsSubmitting(true);
                    // Simulate payment processing
                    setTimeout(() => {
                      setPaymentDone(true);
                      setIsSubmitting(false);
                      showToast(`Payment of ₹${event.price} confirmed! ✅`, 'success');
                    }, 1500);
                  }}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Pay ₹{event.price} Now</span>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <span>✅ Payment of ₹{event.price} Confirmed!</span>
                </div>
              )}
            </div>
          )}

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              I accept the EventHub code of conduct, host participation rules, and attendee policies.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
              isFull
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                : 'btn-primary'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Issuing Digital Pass...</span>
              </>
            ) : isFull ? (
              <span>Confirm & Join Waitlist #{ (event.waitlistCount || 0) + 1 }</span>
            ) : (
              <>
                <Ticket size={16} />
                <span>Confirm Registration & Generate E-Pass</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationModal;

