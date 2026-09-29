import { useState } from 'react';
import { useEventHub } from '../../context/EventHubContext';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Ticket,
  Clock,
  Award,
  Bookmark,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Download,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Trash2
} from 'lucide-react';

export const AttendeeDashboard = ({ onSelectEvent, onRegisterClick }) => {
  const {
    currentUser,
    events,
    registrations,
    bookmarks,
    cancelRegistration,
    setSelectedTicket,
    setTicketModalOpen,
    setActiveTab,
    showToast
  } = useEventHub();

  const [activeSubTab, setActiveSubTab] = useState('passes'); // 'passes' | 'waitlist' | 'certificates' | 'bookmarks'
  const [cancelModalId, setCancelModalId] = useState(null);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <Ticket size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Participant Portal
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Please log in as a Student or Working Professional to access your registered event passes and verified credentials.
        </p>
      </div>
    );
  }

  // Filter registrations for current user
  const userRegs = registrations.filter(
    r => r.userId === currentUser.id && r.status !== 'cancelled'
  );

  const confirmedPasses = userRegs.filter(r => r.status === 'confirmed');
  const waitlistPasses = userRegs.filter(r => r.status === 'waitlist');
  const attendedPasses = userRegs.filter(r => r.checkedIn);
  const bookmarkedEvents = events.filter(e => bookmarks.includes(e.id));

  const handleOpenTicket = (reg) => {
    setSelectedTicket(reg);
    setTicketModalOpen(true);
  };

  const handleConfirmCancel = (regId) => {
    cancelRegistration(regId);
    setCancelModalId(null);
  };

  const handleDownloadCert = (eventTitle) => {
    showToast(`Downloading Official Certificate of Participation for "${eventTitle}"...`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                {currentUser.role === 'student' ? <GraduationCap size={13} /> : <Briefcase size={13} />}
                <span>{currentUser.role === 'student' ? 'Student Participant' : 'Working Professional'}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {currentUser.role === 'student' ? (
                <>🏛️ {currentUser.college} • {currentUser.degree} (Class of '{currentUser.gradYear || '2026'})</>
              ) : (
                <>💼 {currentUser.company} • {currentUser.jobTitle} • {currentUser.industry}</>
              )}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span>📧 {currentUser.email}</span>
              <span>📱 {currentUser.phone || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="btn-primary flex-shrink-0"
        >
          <span>Explore More Events</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveSubTab('passes')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeSubTab === 'passes'
              ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Ticket size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {confirmedPasses.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Confirmed Passes
          </p>
        </div>

        <div
          onClick={() => setActiveSubTab('waitlist')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeSubTab === 'waitlist'
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <Clock size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {waitlistPasses.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Waitlist Queue
          </p>
        </div>

        <div
          onClick={() => setActiveSubTab('certificates')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeSubTab === 'certificates'
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Award size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {attendedPasses.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Attended / Certified
          </p>
        </div>

        <div
          onClick={() => setActiveSubTab('bookmarks')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            activeSubTab === 'bookmarks'
              ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-500 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Bookmark size={20} />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {bookmarkedEvents.length}
          </span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            Saved Opportunities
          </p>
        </div>
      </div>

      {/* Main Tabbed Content */}
      <div className="space-y-6">
        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('passes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'passes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Ticket size={16} />
            <span>Confirmed E-Tickets ({confirmedPasses.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('waitlist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'waitlist'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock size={16} />
            <span>Waitlisted ({waitlistPasses.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'certificates'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award size={16} />
            <span>Certificates & History ({attendedPasses.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'bookmarks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark size={16} />
            <span>Saved Events ({bookmarkedEvents.length})</span>
          </button>
        </div>

        {/* TAB 1: CONFIRMED PASSES */}
        {activeSubTab === 'passes' && (
          <div className="space-y-4">
            {confirmedPasses.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <Ticket size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Confirmed Passes Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse upcoming hackathons and summits to register and secure your instant QR pass.
                </p>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="btn-primary text-xs !py-2 !px-4 mt-2"
                >
                  Explore Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {confirmedPasses.map((reg) => {
                  const evt = events.find(e => e.id === reg.eventId);
                  return (
                    <div
                      key={reg.id}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Confirmed Pass
                          </span>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                            {reg.eventTitle}
                          </h3>
                          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            Ticket #{reg.ticketId}
                          </span>
                        </div>

                        {evt && (
                          <img
                            src={evt.bannerUrl}
                            alt=""
                            className="w-16 h-12 rounded-xl object-cover flex-shrink-0"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-indigo-500" />
                          <span>{evt ? new Date(evt.startDate).toLocaleDateString() : 'Upcoming'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin size={13} className="text-rose-500" />
                          <span className="truncate">{evt?.location || 'Campus'}</span>
                        </div>
                      </div>

                      {reg.teamMembers && reg.teamMembers.length > 1 && (
                        <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                          Team: <strong>{reg.teamName}</strong> ({reg.teamMembers.length} members)
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => handleOpenTicket(reg)}
                          className="flex-1 btn-primary !py-2 text-xs"
                        >
                          <Ticket size={14} />
                          <span>View E-Ticket</span>
                        </button>
                        <button
                          onClick={() => setCancelModalId(reg.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Cancel Registration"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WAITLIST */}
        {activeSubTab === 'waitlist' && (
          <div className="space-y-4">
            {waitlistPasses.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Clock size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Active Waitlist Queue Entries
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you register for high-demand capacity-filled events, your queue position will show here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {waitlistPasses.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        Queue Position #{reg.waitlistPosition}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Registered {new Date(reg.registrationDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {reg.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      You are in queue. When any participant cancels, your pass is promoted automatically to confirmed status.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleOpenTicket(reg)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View Queue Pass
                      </button>
                      <button
                        onClick={() => setCancelModalId(reg.id)}
                        className="text-xs font-semibold text-rose-500 hover:underline"
                      >
                        Leave Waitlist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CERTIFICATES & HISTORY */}
        {activeSubTab === 'certificates' && (
          <div className="space-y-4">
            {attendedPasses.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Award size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Completed Events Yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Attend events and check in at the organizer desk to unlock verified digital certificates of completion.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attendedPasses.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-slate-50 to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border border-emerald-500/30 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                        <span>Verified Attendance</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(reg.checkedInTime || reg.registrationDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {reg.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Accredited by EventHub Verified Organizer Network.
                    </p>

                    <button
                      onClick={() => handleDownloadCert(reg.eventTitle)}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Download size={14} />
                      <span>Download Verifiable Certificate (PDF)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BOOKMARKS */}
        {activeSubTab === 'bookmarks' && (
          <div className="space-y-4">
            {bookmarkedEvents.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
                <Bookmark size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Saved Events
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the bookmark ribbon on any event card to save it for later review.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarkedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className="group p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-indigo-500/40 space-y-3 transition-all"
                  >
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full aspect-[16/9] rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {evt.tagline}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {evt.isFree ? 'FREE' : `₹${evt.price}`}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRegisterClick(evt);
                        }}
                        className="btn-primary !py-1 !px-3 text-xs"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Dialog Modal */}
      <AnimatePresence>
        {cancelModalId && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Cancel Registration?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Your seat will be immediately released and allocated to the next person in the automated waitlist queue.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCancelModalId(null)}
                  className="flex-1 btn-secondary !py-2 text-xs"
                >
                  Keep Registration
                </button>
                <button
                  onClick={() => handleConfirmCancel(cancelModalId)}
                  className="flex-1 btn-danger !py-2 text-xs"
                >
                  Confirm Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
