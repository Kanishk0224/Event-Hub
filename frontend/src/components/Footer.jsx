import React from 'react';
import { Sparkles, Heart, ShieldCheck, Mail, Globe2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="platform-footer">
      <div className="footer-top-wrap">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div className="footer-col brand-col">
            <div className="brand-logo footer-brand">
              <div className="logo-icon">
                <span>E</span>
              </div>
              <div className="logo-text-group">
                <span className="logo-brand">Event<span>Hub</span></span>
                <span className="logo-sub">EVENT PLANNING & MANAGEMENT</span>
              </div>
            </div>
            <p className="footer-about">
              EventHub is a centralized platform connecting students, working professionals,
              and university hosts with premier hackathons, tech bootcamps, and cultural festivals.
            </p>
            <div className="footer-compliance">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Enterprise Grade Security & Verified Host Verification</span>
            </div>
          </div>

          {/* Col 2: Opportunities */}
          <div className="footer-col">
            <h4>Explore Opportunities</h4>
            <ul>
              <li><a href="#hackathons">AI & Coding Hackathons</a></li>
              <li><a href="#workshops">System Design Workshops</a></li>
              <li><a href="#conferences">Tech Summits & Conferences</a></li>
              <li><a href="#cultural">College Cultural Fests</a></li>
              <li><a href="#competitions">Startup & B-Plan Contests</a></li>
            </ul>
          </div>

          {/* Col 3: For Participants */}
          <div className="footer-col">
            <h4>For Participants</h4>
            <ul>
              <li><a href="#student">Student Registration</a></li>
              <li><a href="#professional">Working Professional Access</a></li>
              <li><a href="#tickets">Digital E-Ticket Passes</a></li>
              <li><a href="#certificates">Verified Skill Certificates</a></li>
              <li><a href="#waitlist">Automated Waitlist Policy</a></li>
            </ul>
          </div>

          {/* Col 4: For Event Hosts */}
          <div className="footer-col">
            <h4>For Organizers</h4>
            <ul>
              <li><a href="#host">Host an Event Portal</a></li>
              <li><a href="#capacity">Automated Capacity Tracking</a></li>
              <li><a href="#qr">QR Ticket Desk Check-In</a></li>
              <li><a href="#analytics">Real-time Analytics Dashboard</a></li>
              <li><a href="#export">Export Attendee Rosters</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p>© 2026 EventHub Inc. Designed with Unstop-inspired modern UI architecture.</p>
          <div className="footer-social-links">
            <a href="#github">GitHub</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#discord">Discord</a>
            <a href="#twitter">Twitter / X</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
