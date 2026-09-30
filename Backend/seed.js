const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");
require("dotenv").config();

try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {}

const User = require("./models/User");
const Event = require("./models/Event");
const Category = require("./models/Category");
const Registration = require("./models/Registration");

const seedDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventhub";
        const isAtlas = uri.includes("mongodb+srv://") || uri.includes(".mongodb.net");
        console.log(`Connecting to ${isAtlas ? "MongoDB Atlas Cloud Cluster" : "Local MongoDB"} for seeding...`);
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("Connected successfully to MongoDB for seeding");

        await Promise.all([
            User.deleteMany({}),
            Event.deleteMany({}),
            Category.deleteMany({}),
            Registration.deleteMany({})
        ]);

        const categories = await Category.insertMany([
            { key: "all", name: "All Events", icon: "Sparkles", color: "#0073e6", description: "Explore all live opportunities" },
            { key: "hackathon", name: "Hackathons", icon: "Code", color: "#6366f1", description: "Tech buildathons & developer challenges" },
            { key: "workshop", name: "Workshops & Bootcamps", icon: "BookOpen", color: "#10b981", description: "Skill acceleration masterclasses" },
            { key: "conference", name: "Conferences & Summits", icon: "Users", color: "#8b5cf6", description: "Industry leadership forums" },
            { key: "cultural", name: "Cultural & College Fests", icon: "Music", color: "#ec4899", description: "Campus cultural festivals" },
            { key: "competition", name: "Case & Business Competitions", icon: "Trophy", color: "#f59e0b", description: "Strategy & case solve cups" },
            { key: "webinar", name: "Tech Webinars", icon: "Video", color: "#06b6d4", description: "Online tech keynotes & webinars" }
        ]);
        console.log("Seeded categories: " + categories.length);

        const passwordHash = await bcrypt.hash("password123", 10);
        const users = await User.insertMany([
            { name: "Aarav Sharma", email: "aarav.sharma@iitd.ac.in", password: passwordHash, role: "student", college: "IIT Delhi", degree: "B.Tech CS", graduationYear: "2026", verified: true, verificationStatus: "approved" },
            { name: "Pooja Iyer", email: "pooja.iyer@stripe.com", password: passwordHash, role: "employee", company: "Stripe India", jobTitle: "Senior Software Engineer", verified: true, verificationStatus: "approved" },
            { name: "Google Developer Group & IITD", email: "host@gdg.org", password: passwordHash, role: "host", organizationName: "Google Developer Group & IIT Delhi", verified: true, verificationStatus: "approved" },
            { name: "EventHub Admin", email: "admin@eventhub.io", password: passwordHash, role: "admin", organizationName: "EventHub Admin Operations", verified: true, verificationStatus: "approved" }
        ]);
        console.log("Seeded users: " + users.length);

        const host = users.find(u => u.role === "host");
        const events = await Event.insertMany([
            {
                title: "National Generative AI & LLM Hackathon 2026",
                slug: "national-generative-ai-hackathon-2026",
                tagline: "Build next-gen autonomous agents & Multimodal AI applications",
                category: "hackathon",
                categoryLabel: "Hackathon",
                mode: "Hybrid",
                location: "IIT Delhi Campus, New Delhi & Virtual Discord",
                startDate: "2026-10-15",
                endDate: "2026-10-17",
                registrationDeadline: "2026-10-10T23:59:59",
                maxCapacity: 500,
                registeredCount: 438,
                waitlistCount: 24,
                allowWaitlist: true,
                isFree: true,
                price: 0,
                teamSize: "1 - 4 Members",
                eligibility: "Students & Working Professionals",
                status: "published",
                isFeatured: true,
                createdBy: host._id,
                organizer: { name: "Google Developer Group & IIT Delhi", logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80", verified: true, email: "host@gdg.org" },
                bannerUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
                description: "Welcome to the flagship National Generative AI & LLM Hackathon 2026! Over 48 hours, developers, designers, and innovators will build cutting-edge solutions leveraging LLMs, Multimodal AI, and autonomous agent frameworks.",
                prizes: [{ rank: "1st Place Winner", prize: "₹2,50,000 Cash + Cloud Credits + GDG Swag" }, { rank: "Runner Up", prize: "₹1,25,000 Cash + Cloud Credits" }],
                perks: ["Official Certificate", "Cloud GPU Credits ($500/team)", "Direct Mentorship by Google Engineers", "Hiring Pool Access"],
                schedule: [{ day: "Day 1 - Oct 15", sessions: [{ time: "09:00 AM - 10:30 AM", title: "Opening Ceremony & Keynote", speaker: "Dr. Siddharth Sen", room: "Main Auditorium" }] }],
                speakers: [{ name: "Dr. Siddharth Sen", role: "AI Research Lead", company: "Google DeepMind", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" }]
            },
            {
                title: "Full-Stack MERN & Cloud Architecture Bootcamp",
                slug: "mern-cloud-architecture-bootcamp-2026",
                tagline: "Master scalable microservices, MongoDB aggregations, and Docker deployments",
                category: "workshop",
                categoryLabel: "Workshops & Bootcamps",
                mode: "Online",
                location: "Live Zoom & Interactive Code Sandbox",
                startDate: "2026-10-05",
                endDate: "2026-10-07",
                registrationDeadline: "2026-10-04T23:59:59",
                maxCapacity: 250,
                registeredCount: 215,
                waitlistCount: 0,
                allowWaitlist: true,
                isFree: true,
                price: 0,
                teamSize: "Individual",
                eligibility: "Open to All Developers",
                status: "published",
                isFeatured: true,
                createdBy: host._id,
                organizer: { name: "FullStack Guild India", logo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80", verified: true, email: "workshops@fullstackguild.dev" },
                bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop&q=80",
                description: "An intensive 3-day deep dive into modern MERN stack development, MongoDB optimization indexes, and cloud hosting.",
                prizes: [{ rank: "Top Capstone Project", prize: "₹50,000 + Fast-Track Job Interview" }],
                perks: ["Verified Skill Certificate", "Lifetime Course Recordings Access", "GitHub Capstone Portfolio Project"]
            },
            {
                title: "Global Tech Leaders Summit 2026",
                slug: "global-tech-leaders-summit-2026",
                tagline: "Where CTOs, Engineering VPs, and AI Visionaries shape the next decade of computing",
                category: "conference",
                categoryLabel: "Conferences & Summits",
                mode: "In-Person",
                location: "Convention Center, Bengaluru",
                startDate: "2026-11-20",
                endDate: "2026-11-22",
                registrationDeadline: "2026-11-15T23:59:59",
                maxCapacity: 1000,
                registeredCount: 890,
                waitlistCount: 45,
                allowWaitlist: true,
                isFree: false,
                price: 1499,
                teamSize: "Individual or Corporate Delegation",
                eligibility: "Engineers, Tech Leads & Founders",
                status: "published",
                isFeatured: true,
                createdBy: host._id,
                organizer: { name: "NASSCOM Tech Council", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80", verified: true, email: "summit@nasscom.in" },
                bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80",
                description: "Join over 1,000 engineering leaders and founders exploring AI systems, distributed cloud computing, and developer productivity.",
                prizes: [{ rank: "Best Startup Pitch", prize: "₹10,00,000 Seed Term Sheet" }],
                perks: ["VIP Badge Access", "Executive Networking Dinners"]
            }
        ]);
        console.log("Seeded events: " + events.length);

        const student = users.find(u => u.role === "student");
        await Registration.create({
            ticketId: "EH-2026-88219",
            user: student._id,
            userId: String(student._id),
            userName: student.name,
            userEmail: student.email,
            userRole: "student",
            affiliation: "IIT Delhi - B.Tech CS",
            event: events[0]._id,
            eventId: String(events[0]._id),
            eventTitle: events[0].title,
            teamName: "Team HyperDrive",
            teamMembers: [{ name: "Aarav Sharma (Team Lead)", email: "aarav.sharma@iitd.ac.in" }],
            status: "registered",
            checkedIn: false
        });
        console.log("Seeded sample registration");

        console.log("Database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedDatabase();
