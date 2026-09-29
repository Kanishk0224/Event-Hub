import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export const RegistrationModal = ({ event, isOpen, onClose }) => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (isOpen !== undefined && !isOpen) return null;
  if (!event) return null;

  const isFull = (event.registeredCount || 0) >= (event.maxCapacity || 100);

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
      if (onClose) onClose();
      navigate('/login');
      showToast('Please sign in or create an account to claim your pass.', 'info');
      return;
    }

    if (!agreedTerms) {
      showToast('Please accept the event guidelines to proceed.', 'error');
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
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Capacity Alert */}
          {isFull && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                <strong>Event is at Max Capacity ({event.maxCapacity} seats).</strong> Submitting this form will place you on the live waitlist queue. If a confirmed attendee drops, you will be automatically promoted!
              </div>
            </div>
          )}

          {/* Solo vs Team Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Participation Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsTeam(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  !isTeam
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <User size={15} />
                <span>Individual / Solo</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTeam(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isTeam
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Users size={15} />
                <span>Team Entry (1 - 4)</span>
              </button>
            </div>
          </div>

          {/* Team Fields */}
          {isTeam && (
            <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 block">
                  Team Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CodeWarriors Alpha"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  required={isTeam}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Team Members Roster
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTeammate}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={13} />
                    <span>Add Member</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950">Lead</span>
                    <span className="text-slate-900 dark:text-white font-medium truncate">{currentUser?.name || 'You (Leader)'}</span>
                    <span className="ml-auto text-[11px] text-slate-400 truncate">{currentUser?.email}</span>
                  </div>

                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Member #${idx + 2} Full Name or Email`}
                        value={member}
                        onChange={(e) => handleTeammateChange(idx, e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTeammate(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Affiliation / Institution
              </label>
              <input
                type="text"
                placeholder="e.g. IIT Delhi"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Admission Tier</p>
              <p className="text-[11px] text-slate-500">Includes verified badge + certificate</p>
            </div>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {event.isFree ? 'FREE' : `₹${event.price}`}
            </span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isFull
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 shadow-indigo-600/25'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Generating Digital Pass...</span>
              </>
            ) : isFull ? (
              <span>Confirm & Join Waitlist Queue</span>
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
