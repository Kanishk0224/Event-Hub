# EventHub – Event Planning & Management Platform

**EventHub** is a web-based event planning and management platform designed with an **Unstop-inspired UI**. It allows students, working professionals, colleges, and enterprise organizers to discover, register for, host, and manage hackathons, bootcamps, cultural fests, and conferences from a unified platform.

---

## 🌟 Key Features

### 1. Unstop-Inspired Discovery & Catalog
- **Hero Banner with Live Ticker:** Displays real-time metrics (650+ Live Events, 1.8 Lakh+ Registrations, ₹2.8 Cr+ Prizes).
- **Category Pills Carousel:** Quick filter across Hackathons, Workshops, Conferences, Cultural Fests, and Business Contests.
- **Segmented Filter Controls:** Toggle between Online/Virtual and On-Campus/Offline events, plus Free vs Paid pricing.
- **Rich Event Cards:** Category & mode badges, organizer avatar with blue verified checkmark, deadline countdown chip (`🔥 4 days left`), prize pool badges, and real-time **capacity progress bar** with color-coded fill rate.

### 2. Multi-Role Authentication & Signup Flow
The platform supports specialized user flows:
- **Event Register (Attendee / Participant):**
  - **Student Registration:** Full Name, Email, Phone, College/University Name, Degree & Branch, Graduation Year, Password.
  - **Employee / Professional Registration:** Full Name, Work Email, Phone, Company/Organization Name, Job Title, Industry, Password.
- **Event Host (Organizer):**
  - Host Incharge Name, Organization / College Name, Organization Type, Official Email, Phone, Website, Password.
- **Platform Administrator:**
  - Administrative credentials to moderate events, verify hosts, and monitor system activities.
- **1-Click Demo Auto-Fill:** Switch between demo users (Student: Aarav, Professional: Priya, Host: GDG, Admin: System) with one click from the top demo bar or the sign-in modal.

### 3. Dedicated Dashboards for Every Role
- **Attendee Dashboard:**
  - **My Passes & Tickets:** View digital entry passes, access Google Calendar sync, and cancel registrations (which automatically frees up capacity).
  - **Automated Waitlist Queue:** Track real-time position in line with auto-promotion notifications when a seat opens up.
  - **Certificates & Badges:** Downloadable PDF participation certificates for attended events.
  - **Saved Events:** Quick access to bookmarked opportunities.
- **Organizer Dashboard (Host Studio):**
  - **Host Metrics:** Total events created, registration count, average capacity fill rate, and check-in velocity.
  - **Manage Events Table:** Track live status, edit schedules, view registered rosters, and cancel events with automated participant notifications.
  - **4-Step Event Creation Wizard:** Step-by-step wizard (Basic Info -> Schedule & Speakers -> Capacity & Pricing -> Preview & Publish).
  - **Participant Management & Attendance Check-In:** Filter by event, search by name/email/ticket ID, one-click attendee Check-In, and export participant roster to CSV.
  - **Analytics & Demographic Breakdown:** Visual ratio of Students vs Working Professionals and check-in conversion gauge.
- **Admin Dashboard:**
  - **Event Moderation:** Review submitted events, approve/reject, toggle Homepage Featured Spotlight, and manage compliance.
  - **User & Organizer Directory:** Verify organizations with official blue badges.
  - **Category & Taxonomy Management:** Manage categories and tags.
  - **Platform Audit Trail:** Live audit log of platform registrations, approvals, and system activities.

### 4. Interactive Event Details & Registration Flow
- **Detailed Event Modal:** Tabbed interface for Overview & Perks, Day-by-Day Agenda & Timeline, Keynote Speakers & Mentors, and FAQs.
- **Smart Registration Modal:** Supports solo or team registration (up to 4 members), custom dietary/skill notes, automated capacity check, and instant waitlist allocation when full.
- **Confetti Celebration:** Triggers confetti on successful registration.
- **Digital E-Ticket Pass:** Flight-boarding-pass aesthetic featuring SVG QR code mockup, unique Ticket ID (`EH-2026-XXXXX`), attendee affiliation, print/PDF download, and Google Calendar integration.

---

## 🛠️ Technologies & Tools

- **Frontend Library:** React.js (React 19, JSX)
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Celebrations:** Canvas Confetti
- **Typography:** Inter & Plus Jakarta Sans (Google Fonts)
- **State & Storage:** Centralized React Context API with persistent `localStorage` synchronization

---

## 🚀 Running the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

Visit the application at: `http://localhost:5173/`

---

## 👤 Quick Demo Credentials

| Role | Name | Email | Default Dashboard |
| :--- | :--- | :--- | :--- |
| **Student Attendee** | Aarav Sharma (IIT Delhi) | `aarav@iitd.ac.in` | Attendee Dashboard |
| **Professional Attendee** | Priya Patel (Google) | `priya.patel@techcorp.com` | Attendee Dashboard |
| **Event Host** | Vikramaditya Roy (GDG & IIT Delhi) | `host@gdg.org` | Organizer Dashboard |
| **Platform Administrator** | Admin Supervisor | `admin@eventhub.com` | Admin Dashboard |
