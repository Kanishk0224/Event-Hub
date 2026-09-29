import { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useEventHub } from '../context/EventHubContext';

export const Footer = () => {
  const { showToast } = useEventHub();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Subscribed! You will receive weekly opportunity digests.');
    setNewsletterEmail('');
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                E
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Event<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              India's premier modern event planning & management platform. Connecting students, developers, and organizers with hackathons, certified bootcamps, and cultural conclaves.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 max-w-sm">
              <ShieldCheck size={16} className="flex-shrink-0" />
              <span>Verified Host Quality Accreditation</span>
            </div>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-2 max-w-sm">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Subscribe to Opportunity Digest
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="input-field text-xs !py-2"
                  required
                />
                <button type="submit" className="btn-primary !py-2 !px-3 text-xs flex-shrink-0">
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>

          {/* Links Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#hackathons" className="hover:text-indigo-600 transition-colors">Coding Hackathons</a></li>
              <li><a href="#workshops" className="hover:text-indigo-600 transition-colors">Technical Bootcamps</a></li>
              <li><a href="#summits" className="hover:text-indigo-600 transition-colors">Tech Conclaves</a></li>
              <li><a href="#cultural" className="hover:text-indigo-600 transition-colors">Campus Festivals</a></li>
              <li><a href="#competitions" className="hover:text-indigo-600 transition-colors">Startup Pitch Contests</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              For Attendees
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#student" className="hover:text-indigo-600 transition-colors">Student Passes</a></li>
              <li><a href="#pro" className="hover:text-indigo-600 transition-colors">Professional Passes</a></li>
              <li><a href="#tickets" className="hover:text-indigo-600 transition-colors">Digital QR E-Tickets</a></li>
              <li><a href="#certificates" className="hover:text-indigo-600 transition-colors">Skill Certificates</a></li>
              <li><a href="#waitlist" className="hover:text-indigo-600 transition-colors">Auto Waitlist Policy</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              For Organizers
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="#host" className="hover:text-indigo-600 transition-colors">Host an Event</a></li>
              <li><a href="#desk" className="hover:text-indigo-600 transition-colors">QR Desk Check-In</a></li>
              <li><a href="#capacity" className="hover:text-indigo-600 transition-colors">Real-time Capacity Engine</a></li>
              <li><a href="#analytics" className="hover:text-indigo-600 transition-colors">Attendee Analytics</a></li>
              <li><a href="#export" className="hover:text-indigo-600 transition-colors">Export Rosters</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 EventHub Inc. Designed with modern Luma and Eventbrite design principles.</p>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <a href="#github" className="hover:text-indigo-600 transition-colors">GitHub</a>
            <a href="#linkedin" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
            <a href="#discord" className="hover:text-indigo-600 transition-colors">Discord</a>
            <a href="#twitter" className="hover:text-indigo-600 transition-colors">Twitter / X</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
