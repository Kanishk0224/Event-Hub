import React from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  Sparkles,
  Trophy,
  Users,
  Building2,
  Gift,
  Code,
  BookOpen,
  Music,
  Video,
  CheckCircle,
  Flame,
  Globe2,
  MapPin
} from 'lucide-react';

export const HeroSection = ({
  selectedCategory,
  onSelectCategory,
  filterMode,
  onSelectFilterMode,
  filterPrice,
  onSelectFilterPrice
}) => {
  const { categories, events, setActiveTab, currentUser, setAuthModalOpen } = useEventHub();

  const iconMap = {
    Sparkles: <Sparkles size={16} />,
    Code: <Code size={16} />,
    BookOpen: <BookOpen size={16} />,
    Users: <Users size={16} />,
    Music: <Music size={16} />,
    Trophy: <Trophy size={16} />,
    Video: <Video size={16} />
  };

  return (
    <section className="hero-section">
      <div className="hero-backdrop-gradient"></div>

      <div className="hero-inner-container">
        {/* Top Tag */}
        <div className="hero-badge">
          <Flame size={14} className="badge-flame" />
          <span>India's Leading Event Discovery & Management Platform</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-heading">
          Connecting Talent with <span>Opportunities & Events</span>
        </h1>

        <p className="hero-subheading">
          Discover hackathons, hands-on bootcamps, cultural festivals, and leadership summits.
          Register seamlessly, secure your digital entry passes, and elevate your career.
        </p>

        {/* Live Metrics Strip */}
        <div className="hero-metrics-strip">
          <div className="metric-box">
            <span className="metric-value">650+</span>
            <span className="metric-label">Live Events</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-box">
            <span className="metric-value">1.8 Lakh+</span>
            <span className="metric-label">Registered Participants</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-box">
            <span className="metric-value">450+</span>
            <span className="metric-label">Universities & Orgs</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-box">
            <span className="metric-value">₹2.8 Cr+</span>
            <span className="metric-label">Prizes & Grants</span>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="hero-categories-wrapper">
          <div className="categories-pills-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                {iconMap[cat.icon] || <Sparkles size={16} />}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filter Controls Bar (Unstop Style) */}
        <div className="quick-filter-strip">
          <div className="filter-group">
            <span className="filter-group-label">Event Mode:</span>
            <div className="filter-segmented-control">
              <button
                className={`segmented-btn ${filterMode === 'all' ? 'active' : ''}`}
                onClick={() => onSelectFilterMode('all')}
              >
                All Modes
              </button>
              <button
                className={`segmented-btn ${filterMode === 'Online' ? 'active' : ''}`}
                onClick={() => onSelectFilterMode('Online')}
              >
                <Globe2 size={13} />
                Online / Virtual
              </button>
              <button
                className={`segmented-btn ${filterMode === 'In-Person' ? 'active' : ''}`}
                onClick={() => onSelectFilterMode('In-Person')}
              >
                <MapPin size={13} />
                On-Campus / Offline
              </button>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-group-label">Pricing:</span>
            <div className="filter-segmented-control">
              <button
                className={`segmented-btn ${filterPrice === 'all' ? 'active' : ''}`}
                onClick={() => onSelectFilterPrice('all')}
              >
                All
              </button>
              <button
                className={`segmented-btn ${filterPrice === 'free' ? 'active' : ''}`}
                onClick={() => onSelectFilterPrice('free')}
              >
                Free Only
              </button>
              <button
                className={`segmented-btn ${filterPrice === 'paid' ? 'active' : ''}`}
                onClick={() => onSelectFilterPrice('paid')}
              >
                Paid
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
