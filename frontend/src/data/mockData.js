// Mock data for EventHub - Unstop inspired platform

export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Events', icon: 'Sparkles', color: '#0073e6' },
  { id: 'hackathon', name: 'Hackathons', icon: 'Code', color: '#6366f1' },
  { id: 'workshop', name: 'Workshops & Bootcamps', icon: 'BookOpen', color: '#10b981' },
  { id: 'conference', name: 'Conferences & Summits', icon: 'Users', color: '#8b5cf6' },
  { id: 'cultural', name: 'Cultural & College Fests', icon: 'Music', color: '#ec4899' },
  { id: 'competition', name: 'Case & Business Competitions', icon: 'Trophy', color: '#f59e0b' },
  { id: 'webinar', name: 'Tech Webinars', icon: 'Video', color: '#06b6d4' }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-101',
    title: 'National Generative AI & LLM Hackathon 2026',
    slug: 'national-generative-ai-hackathon-2026',
    category: 'hackathon',
    categoryLabel: 'Hackathon',
    tagline: 'Build next-gen autonomous agents & Multimodal AI applications',
    organizer: {
      id: 'org-1',
      name: 'Google Developer Group & IIT Delhi',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80',
      verified: true,
      email: 'host@gdg.org',
      type: 'Premier Tech Community'
    },
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    mode: 'Hybrid', // Online or Offline or Hybrid
    location: 'IIT Delhi Campus, New Delhi & Virtual Discord',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    registrationDeadline: '2026-10-10T23:59:59',
    maxCapacity: 500,
    registeredCount: 438,
    waitlistCount: 24,
    allowWaitlist: true,
    isFree: true,
    price: 0,
    teamSize: '1 - 4 Members',
    eligibility: 'Students & Working Professionals',
    status: 'published', // published, draft, cancelled, completed
    isFeatured: true,
    prizes: [
      { rank: '1st Place Winner', prize: '₹2,50,000 Cash + Cloud Credits + GDG Swag' },
      { rank: 'Runner Up', prize: '₹1,25,000 Cash + Cloud Credits' },
      { rank: 'Best Women-Led Team', prize: '₹50,000 Special Award' }
    ],
    perks: ['Official Certificate', 'Cloud GPU Credits ($500/team)', 'Direct Mentorship by Google Engineers', 'Hiring Pool Access'],
    description: `Welcome to the flagship National Generative AI & LLM Hackathon 2026, hosted jointly by Google Developer Group (GDG) and IIT Delhi! Over 48 hours, developers, designers, and innovators from across the country will collaborate to build cutting-edge solutions leveraging Large Language Models, Multimodal AI, and autonomous agent frameworks.

Participants can compete either on-campus at IIT Delhi's high-tech labs or remotely via our global virtual platform. Get ready for 48 hours of intense coding, insightful mentorship sessions, and thrilling pitch battles in front of top VC investors and AI leaders.`,
    schedule: [
      {
        day: 'Day 1 - Oct 15',
        sessions: [
          { time: '09:00 AM - 10:30 AM', title: 'Opening Ceremony & Keynote: The Frontier of Autonomous Agents', speaker: 'Dr. Siddharth Sen, AI Research Lead at Google DeepMind', room: 'Main Auditorium & Stream A' },
          { time: '11:00 AM', title: 'Hacking Begins & Problem Statements Unveiled', speaker: 'Hackathon Organizing Council', room: 'Hacking Arena' },
          { time: '04:00 PM - 05:30 PM', title: 'Hands-on Workshop: Scaling Vector Search & RAG Architectures', speaker: 'Ananya Roy, Principal Architect', room: 'Workshop Lab B' }
        ]
      },
      {
        day: 'Day 2 - Oct 16',
        sessions: [
          { time: '10:00 AM - 12:00 PM', title: '1-on-1 Mentor Speed Dating & Architecture Review', speaker: 'Industry Mentors Panel', room: 'Breakout Rooms' },
          { time: '08:00 PM', title: 'Midway Check-in & Prototype Health Check', speaker: 'Technical Committee', room: 'Portal Submission' }
        ]
      },
      {
        day: 'Day 3 - Oct 17',
        sessions: [
          { time: '11:00 AM', title: 'Code Freeze & Final Project Submission', speaker: 'Jury Council', room: 'GitHub & Portal' },
          { time: '02:00 PM - 05:00 PM', title: 'Top 10 Finalists Live Demo Pitches & Q&A', speaker: 'Grand Jury Panel', room: 'Main Auditorium' },
          { time: '06:00 PM', title: 'Awards Gala & Closing Networking Reception', speaker: 'Dignitaries & Sponsors', room: 'Banquet Hall' }
        ]
      }
    ],
    speakers: [
      {
        name: 'Dr. Siddharth Sen',
        role: 'AI Research Lead, Google DeepMind',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        company: 'Google DeepMind',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Ananya Roy',
        role: 'Principal System Architect',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        company: 'Stripe India',
        linkedin: 'https://linkedin.com'
      },
      {
        name: 'Vikram Malhotra',
        role: 'Partner & Seed Investor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        company: 'Matrix Partners',
        linkedin: 'https://linkedin.com'
      }
    ],
    faqs: [
      { q: 'Who is eligible to participate?', a: 'Undergraduate students, postgraduates, and working software professionals with up to 5 years experience are eligible.' },
      { q: 'Is there any registration fee?', a: 'No, this hackathon is 100% free of cost, supported by Google Developer Group.' },
      { q: 'Can I participate individually or do I need a team?', a: 'You can participate solo or in teams of up to 4 members. Teammates can be added during or after registration.' },
      { q: 'How will virtual participants submit their projects?', a: 'All submissions are handled through the EventHub project submission portal with a GitHub repo link and a 3-minute video demo.' }
    ]
  },
  {
    id: 'evt-102',
    title: 'Full-Stack System Design & Microservices Bootcamp',
    slug: 'fullstack-system-design-microservices-bootcamp',
    category: 'workshop',
    categoryLabel: 'Workshop',
    tagline: 'Master distributed caching, Kafka event streaming & Kubernetes architectures',
    organizer: {
      id: 'org-2',
      name: 'DevCraft Academy',
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&auto=format&fit=crop&q=80',
      verified: true,
      email: 'workshops@devcraft.io',
      type: 'EdTech Enterprise'
    },
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80',
    mode: 'Online',
    location: 'Interactive Live Zoom & Cloud Sandbox',
    startDate: '2026-10-22',
    endDate: '2026-10-24',
    registrationDeadline: '2026-10-20T18:00:00',
    maxCapacity: 250,
    registeredCount: 242,
    waitlistCount: 15,
    allowWaitlist: true,
    isFree: false,
    price: 499,
    teamSize: 'Individual',
    eligibility: 'Developers, Tech Leads & Engineering Students',
    status: 'published',
    isFeatured: true,
    prizes: [
      { rank: 'Capstone Project Distinction', prize: '1-on-1 Mock Interview with FAANG Staff Engineer' }
    ],
    perks: ['Verified Skill Certificate', 'Lifetime Sandbox Access', 'Production Source Code & Architecture Blueprints'],
    description: `A fast-paced, industry-standard 3-day deep dive into High-Level Design (HLD) and Low-Level Design (LLD). Learn how modern systems like Netflix, Uber, and WhatsApp handle millions of concurrent requests with low latency, fault-tolerant sharding, and message queuing.`,
    schedule: [
      {
        day: 'Day 1 - Foundations & Sharding',
        sessions: [
          { time: '06:00 PM - 08:00 PM', title: 'CAP Theorem, Sharding & Consistent Hashing in Practice', speaker: 'Rajesh Nair', room: 'Live Studio A' }
        ]
      },
      {
        day: 'Day 2 - Event-Driven Architecture',
        sessions: [
          { time: '06:00 PM - 08:30 PM', title: 'Building Real-time Pipelines with Apache Kafka & Redis Pub/Sub', speaker: 'Rajesh Nair', room: 'Live Studio A' }
        ]
      }
    ],
    speakers: [
      {
        name: 'Rajesh Nair',
        role: 'Ex-Uber Staff Engineer & Systems Author',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        company: 'DevCraft',
        linkedin: 'https://linkedin.com'
      }
    ],
    faqs: [
      { q: 'Will session recordings be provided?', a: 'Yes! All registered participants receive lifetime access to 4K recordings and architecture diagrams.' }
    ]
  },
  {
    id: 'evt-103',
    title: 'DevCon Global Tech Summit 2026: Cloud, AI & Security',
    slug: 'devcon-global-tech-summit-2026',
    category: 'conference',
    categoryLabel: 'Conference',
    tagline: 'Annual assembly of 1500+ developers, tech founders, and open-source contributors',
    organizer: {
      id: 'org-3',
      name: 'OpenSource India Foundation',
      logo: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=100&auto=format&fit=crop&q=80',
      verified: true,
      email: 'summit@opensourceindia.org',
      type: 'Non-Profit Tech Consortium'
    },
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    mode: 'In-Person',
    location: 'Bangalore International Exhibition Centre (BIEC), Bengaluru',
    startDate: '2026-11-05',
    endDate: '2026-11-06',
    registrationDeadline: '2026-11-01T23:59:59',
    maxCapacity: 1200,
    registeredCount: 890,
    waitlistCount: 0,
    allowWaitlist: false,
    isFree: true,
    price: 0,
    teamSize: 'Individual or Group',
    eligibility: 'All Tech Enthusiasts, Students & Industry Leaders',
    status: 'published',
    isFeatured: true,
    prizes: [
      { rank: 'Open Source Hackathon Track', prize: '₹1,00,000 Grant for Top Contributor' }
    ],
    perks: ['Complimentary Delegate Kit & Badge', 'Access to 4 Keynote Tracks & Sponsor Booths', 'Buffet Lunch & Networking Cocktails'],
    description: `DevCon 2026 is India's largest collaborative summit bringing together senior software architects, DevOps pioneers, AI researchers, and aspiring student innovators. Experience 30+ technical breakout tracks, hands-on labs, and recruitment lounges with 50+ hiring tech companies.`,
    schedule: [
      {
        day: 'Day 1 - Keynotes & Cloud Tracks',
        sessions: [
          { time: '09:30 AM - 11:00 AM', title: 'Keynote: The Sovereign Cloud & AI Infrastructure in 2030', speaker: 'Meera Krishnan', room: 'Grand Hall' },
          { time: '11:30 AM - 01:00 PM', title: 'Zero Trust Security in Multi-Cloud Environments', speaker: 'Kavita Menon', room: 'Hall 2' }
        ]
      }
    ],
    speakers: [
      {
        name: 'Meera Krishnan',
        role: 'VP Cloud Engineering',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        company: 'Microsoft Azure',
        linkedin: 'https://linkedin.com'
      }
    ],
    faqs: [
      { q: 'Is accommodation provided for outstation students?', a: 'Special discounted partner hotel passes are available for registered attendees.' }
    ]
  },
  {
    id: 'evt-104',
    title: 'Rendezvous 2026: Annual Inter-College Cultural Carnival',
    slug: 'rendezvous-cultural-carnival-2026',
    category: 'cultural',
    categoryLabel: 'Cultural Fest',
    tagline: 'Battle of the bands, street play, digital art, fashion showdown & celebrity night',
    organizer: {
      id: 'org-4',
      name: 'Students Activity Council, BITS Pilani',
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&auto=format&fit=crop&q=80',
      verified: true,
      email: 'fest@pilani.bits.ac.in',
      type: 'University Council'
    },
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80',
    mode: 'In-Person',
    location: 'BITS Pilani Campus, Rajasthan',
    startDate: '2026-11-14',
    endDate: '2026-11-16',
    registrationDeadline: '2026-11-08T23:59:59',
    maxCapacity: 3000,
    registeredCount: 2840,
    waitlistCount: 95,
    allowWaitlist: true,
    isFree: false,
    price: 199,
    teamSize: '1 - 15 Members',
    eligibility: 'College & University Students across India',
    status: 'published',
    isFeatured: false,
    prizes: [
      { rank: 'Battle of the Bands Winner', prize: '₹1,50,000 Cash + Studio Recording Deal' },
      { rank: 'Choreo Night Winner', prize: '₹80,000 Cash' }
    ],
    perks: ['Access to 3 Celebrity Music Nights', 'Official Merchandise T-Shirt', 'Campus Accommodation Pass'],
    description: `Join thousands of passionate artists, musicians, dancers, and performers at Rendezvous 2026! Over 3 exhilarating days, witness 40+ diverse cultural competitions, art installations, food trucks, and electrifying performances by international music artists.`,
    schedule: [
      {
        day: 'Day 1 - Rock & Fusion Night',
        sessions: [
          { time: '04:00 PM - 07:00 PM', title: 'Western Acoustic & Band Prelims', speaker: 'Judges Committee', room: 'Rock Stage' },
          { time: '08:00 PM - 11:00 PM', title: 'Headline Concert: Indian Ocean Live', speaker: 'Indian Ocean', room: 'Open Air Theatre' }
        ]
      }
    ],
    speakers: [],
    faqs: [
      { q: 'Is a valid college ID card mandatory?', a: 'Yes, physical college ID is verified at the entry gates.' }
    ]
  },
  {
    id: 'evt-105',
    title: 'VentureSprint 2026: National B-Plan & Startup Pitch',
    slug: 'venturesprint-bplan-startup-pitch-2026',
    category: 'competition',
    categoryLabel: 'Business Competition',
    tagline: 'Pitch your disruptive venture to marquee angel investors and venture capitalists',
    organizer: {
      id: 'org-5',
      name: 'E-Cell & Incubator Hub',
      logo: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&auto=format&fit=crop&q=80',
      verified: true,
      email: 'ventures@ecell-hub.org',
      type: 'Startup Incubator'
    },
    bannerUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1000&auto=format&fit=crop&q=80',
    mode: 'Hybrid',
    location: 'Auditorium Complex, Mumbai & Live Webcast',
    startDate: '2026-10-30',
    endDate: '2026-10-31',
    registrationDeadline: '2026-10-25T23:59:59',
    maxCapacity: 300,
    registeredCount: 210,
    waitlistCount: 0,
    allowWaitlist: true,
    isFree: true,
    price: 0,
    teamSize: '1 - 5 Members',
    eligibility: 'Student Startups, Early Founders & Innovators',
    status: 'published',
    isFeatured: false,
    prizes: [
      { rank: 'Grand Champion', prize: '₹10,00,000 Seed Funding Commitment + Incubation' },
      { rank: 'Best ESG / Climate Tech', prize: '₹3,00,000 Grant' }
    ],
    perks: ['Investor Meetings', 'Free Legal & Incorporation Support ($2000 value)', 'AWS Activate $10,000 Credits'],
    description: `Are you building the next unicorn? VentureSprint 2026 provides student and early-stage founders an unmatched stage to pitch in front of 20+ top-tier Venture Capitalists, Angels, and Startup Mentors. Showcase your traction, business model, and product vision to win equity-free grants and incubation space.`,
    schedule: [
      {
        day: 'Day 1 - Screening & Mentorship',
        sessions: [
          { time: '10:00 AM - 01:00 PM', title: 'Pitch Deck Clinic & Unit Economics Deep Dive', speaker: 'VC Associates', room: 'Seminar Hall 1' }
        ]
      }
    ],
    speakers: [],
    faqs: [
      { q: 'Do we need a live product / revenue to apply?', a: 'Both idea-stage with MVP prototypes and early-revenue startups are eligible across distinct tracks.' }
    ]
  },
  {
    id: 'evt-106',
    title: 'CyberDefend 2026: 24-Hour Capture The Flag (CTF)',
    slug: 'cyberdefend-24-hour-ctf-2026',
    category: 'hackathon',
    categoryLabel: 'Cybersecurity CTF',
    tagline: 'Crack cryptography, reverse engineering, web exploitation & binary challenges',
    organizer: {
      id: 'org-6',
      name: 'CyberShield InfoSec Council',
      logo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
      verified: true,
      email: 'ctf@cybershield.org',
      type: 'InfoSec Community'
    },
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80',
    mode: 'Online',
    location: 'Dedicated CTF Cloud Platform & Discord War Room',
    startDate: '2026-11-20',
    endDate: '2026-11-21',
    registrationDeadline: '2026-11-18T20:00:00',
    maxCapacity: 600,
    registeredCount: 588,
    waitlistCount: 32,
    allowWaitlist: true,
    isFree: true,
    price: 0,
    teamSize: '1 - 3 Members',
    eligibility: 'All CyberSecurity Enthusiasts & Students',
    status: 'published',
    isFeatured: false,
    prizes: [
      { rank: '1st Place Team', prize: '₹1,50,000 + OSCP Certification Vouchers' },
      { rank: '2nd Place Team', prize: '₹75,000 + Hardware Hacking Kit' }
    ],
    perks: ['Official Certificate of Merit', 'Direct Interview Shortlists for Security Analyst Roles'],
    description: `Test your ethical hacking and defensive cyber skills in CyberDefend 2026! Battle against top teams nationwide in dynamic jeopardy-style challenges spanning Web Security, Binary Exploitation, Forensics, Hardware IoT, and Cryptography.`,
    schedule: [
      {
        day: '24-Hour Non-stop Battle',
        sessions: [
          { time: '12:00 PM (Nov 20)', title: 'CTF Challenge Servers Live', speaker: 'CTF Admins', room: 'Discord & Portal' },
          { time: '12:00 PM (Nov 21)', title: 'Scoreboard Freeze & Solution Writeup Review', speaker: 'Jury', room: 'Live Stream' }
        ]
      }
    ],
    speakers: [],
    faqs: [
      { q: 'Is prior CTF experience required?', a: 'Challenges range from Beginner to Elite difficulty, so beginners are warmly encouraged!' }
    ]
  }
];

export const INITIAL_USERS = [
  {
    id: 'user-student-1',
    name: 'Aarav Sharma',
    email: 'aarav@iitd.ac.in',
    role: 'student', // student | employee | host | admin
    phone: '+91 98765 43210',
    college: 'Indian Institute of Technology Delhi (IIT Delhi)',
    degree: 'B.Tech in Computer Science & Engineering',
    gradYear: '2026',
    interests: ['Artificial Intelligence', 'Full-Stack Development', 'System Design'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15'
  },
  {
    id: 'user-employee-1',
    name: 'Priya Patel',
    email: 'priya.patel@techcorp.com',
    role: 'employee',
    phone: '+91 98123 45678',
    company: 'Google Cloud India',
    jobTitle: 'Senior Software Engineer',
    industry: 'Cloud Infrastructure & Distributed Systems',
    experienceYears: '4 Years',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-02-10'
  },
  {
    id: 'user-host-1',
    name: 'Vikramaditya Roy',
    email: 'host@gdg.org',
    role: 'host',
    phone: '+91 97654 32109',
    hostCategory: 'college',
    organizationName: 'Google Developer Group & IIT Delhi',
    institutionName: 'IIT Delhi Campus & GDG Student Chapter',
    orgType: 'Premier Educational & Tech Community',
    website: 'https://gdg.community.dev',
    verified: true,
    verificationStatus: 'approved',
    googleIndexed: true,
    googleSearchStatus: 'Verified & Listed on Google Knowledge Graph (NIRF Rank #2)',
    certificateProof: 'IITD-GDG-Chapter-Authorization-2026.pdf',
    inchargeIdProof: 'IITD-Faculty-Advisor-ID.pdf',
    bio: 'Official student chapter & tech organizer running national level hackathons, workshops, and open conferences.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-11-20'
  },
  {
    id: 'user-host-pending-1',
    name: 'Dr. Ramesh Kulkarni',
    email: 'dean.events@rvce.edu.in',
    role: 'host',
    phone: '+91 94455 66778',
    hostCategory: 'college',
    organizationName: 'R.V. College of Engineering (RVCE)',
    institutionName: 'R.V. College of Engineering, Bengaluru',
    orgType: 'Autonomous Engineering Institution',
    website: 'https://rvce.edu.in',
    verified: false,
    verificationStatus: 'pending_review',
    googleIndexed: true,
    googleSearchStatus: 'Indexed on Google Search Index (AICTE Approval: 1-1029384)',
    certificateProof: 'RVCE-AICTE-Accreditation-Certificate.pdf',
    inchargeIdProof: 'Dean-Faculty-ID-Proof-RVCE.pdf',
    bio: 'Department of Computer Science & Engineering - Organizing National Tech HackFest 2026.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-09-29T10:00:00'
  },
  {
    id: 'user-host-pending-2',
    name: 'Siddharth Varma',
    email: 'events@innovatetech.io',
    role: 'host',
    phone: '+91 99887 76655',
    hostCategory: 'company',
    organizationName: 'InnovateTech Systems Pvt Ltd',
    institutionName: 'InnovateTech Cloud Solutions',
    orgType: 'Registered Technology Enterprise',
    website: 'https://innovatetech.io',
    verified: false,
    verificationStatus: 'pending_review',
    googleIndexed: true,
    googleSearchStatus: 'Verified on Google Business Registry (CIN: U72200KA2021PTC145620)',
    certificateProof: 'MCA-Certificate-of-Incorporation.pdf',
    inchargeIdProof: 'Managing-Director-Govt-ID.pdf',
    bio: 'Enterprise Cloud Architecture & Distributed Systems provider hosting national developer bootcamps.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    createdAt: '2026-09-29T12:30:00'
  },
  {
    id: 'user-admin-1',
    name: 'Admin Supervisor',
    email: 'admin@eventhub.com',
    role: 'admin',
    phone: '+91 90000 00001',
    title: 'Platform System Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    createdAt: '2025-10-01'
  }
];

export const INITIAL_REGISTRATIONS = [
  {
    id: 'reg-901',
    ticketId: 'EH-2026-89421',
    eventId: 'evt-101',
    eventTitle: 'National Generative AI & LLM Hackathon 2026',
    userId: 'user-student-1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav@iitd.ac.in',
    userRole: 'student',
    affiliation: 'IIT Delhi - B.Tech CSE',
    teamName: 'NeuralKnights',
    teamMembers: ['Aarav Sharma (Leader)', 'Rohan Verma', 'Sneha Gupta'],
    registrationDate: '2026-09-24T14:32:00',
    status: 'confirmed', // confirmed, waitlist, cancelled, attended
    checkedIn: false,
    checkedInTime: null,
    qrValue: 'EH-EVT101-USERSTU1-TICKET89421',
    ticketType: 'Hacker Pass (Hybrid)',
    amountPaid: 0
  },
  {
    id: 'reg-902',
    ticketId: 'EH-2026-44118',
    eventId: 'evt-102',
    eventTitle: 'Full-Stack System Design & Microservices Bootcamp',
    userId: 'user-employee-1',
    userName: 'Priya Patel',
    userEmail: 'priya.patel@techcorp.com',
    userRole: 'employee',
    affiliation: 'Google Cloud India - Senior Software Engineer',
    teamName: 'Individual',
    teamMembers: ['Priya Patel'],
    registrationDate: '2026-09-27T10:15:00',
    status: 'confirmed',
    checkedIn: true,
    checkedInTime: '2026-09-28T09:00:00',
    qrValue: 'EH-EVT102-USEREMP1-TICKET44118',
    ticketType: 'Professional Masterclass Pass',
    amountPaid: 499
  },
  {
    id: 'reg-903',
    ticketId: 'EH-2026-55092',
    eventId: 'evt-104',
    eventTitle: 'Rendezvous 2026: Annual Inter-College Cultural Carnival',
    userId: 'user-student-1',
    userName: 'Aarav Sharma',
    userEmail: 'aarav@iitd.ac.in',
    userRole: 'student',
    affiliation: 'IIT Delhi - B.Tech CSE',
    teamName: 'Aarav Solo Entry',
    teamMembers: ['Aarav Sharma'],
    registrationDate: '2026-09-28T16:45:00',
    status: 'waitlist',
    waitlistPosition: 3,
    checkedIn: false,
    qrValue: 'EH-EVT104-WAITLIST3-55092',
    ticketType: 'Standard Delegate Pass',
    amountPaid: 199
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Registration Confirmed! 🎉',
    message: 'You are successfully registered for National Generative AI & LLM Hackathon 2026. Your ticket ID is EH-2026-89421.',
    date: '2026-09-24T14:32:00',
    read: false,
    type: 'success',
    eventId: 'evt-101'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Schedule Announcement 📅',
    message: 'Keynote session timing for Generative AI Hackathon has been updated to 9:00 AM Oct 15.',
    date: '2026-09-26T11:00:00',
    read: true,
    type: 'info',
    eventId: 'evt-101'
  },
  {
    id: 'notif-3',
    userId: 'user-employee-1',
    title: 'Workshop Sandbox Ready 🚀',
    message: 'Your Cloud sandbox environment credentials for System Design Bootcamp are now available.',
    date: '2026-09-27T10:20:00',
    read: false,
    type: 'info',
    eventId: 'evt-102'
  }
];
