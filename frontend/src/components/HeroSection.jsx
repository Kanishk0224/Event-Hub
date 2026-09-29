import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  Users,
  Code,
  BookOpen,
  Music,
  Video,
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
  const { categories } = useEventHub();

  const iconMap = {
    Sparkles: <Sparkles size={15} />,
    Code: <Code size={15} />,
    BookOpen: <BookOpen size={15} />,
    Users: <Users size={15} />,
    Music: <Music size={15} />,
    Trophy: <Trophy size={15} />,
    Video: <Video size={15} />
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-12 lg:pt-16 lg:pb-16 bg-mesh-glow">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-rose-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Top Tagline Pill */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 shadow-sm text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 backdrop-blur-sm">
          <Flame size={14} className="text-rose-500 animate-pulse" />
          <span>India's Premier Opportunities, Hackathons & Tech Events Platform</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]"
        >
          Discover & Manage Exceptional{' '}
          <span className="text-gradient">Tech, Campus & Career Events</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Join hackathons, immersive masterclasses, leadership conclaves, and university summits.
          Instant QR ticketing, team roster sync, and verifiable certification.
        </motion.p>

        {/* Metrics Row */}
        <motion.div
          variants={itemVariants}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          <div className="p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm shadow-sm hover:border-indigo-500/30 transition-colors">
            <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">650+</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Live Events</p>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm shadow-sm hover:border-indigo-500/30 transition-colors">
            <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">1.8 Lakh+</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Participants</p>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm shadow-sm hover:border-indigo-500/30 transition-colors">
            <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">450+</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Universities & Orgs</p>
          </div>
          <div className="p-3 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-sm shadow-sm hover:border-indigo-500/30 transition-colors">
            <span className="text-xl sm:text-2xl font-black text-amber-500 dark:text-amber-400">₹2.8 Cr+</span>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Prizes & Grants</p>
          </div>
        </motion.div>

        {/* Category Pills Slider */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1 px-1">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md shadow-slate-900/10 scale-105'
                      : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className={active ? 'text-indigo-400 dark:text-indigo-600' : 'text-slate-400'}>
                    {iconMap[cat.icon] || <Sparkles size={14} />}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Integrated Filter Segmented Controls (Mode & Pricing) */}
        <motion.div
          variants={itemVariants}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white/60 dark:bg-slate-800/60 p-2 sm:p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md max-w-3xl mx-auto shadow-sm"
        >
          {/* Mode Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Format:</span>
            <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
              <button
                onClick={() => onSelectFilterMode('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterMode === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Modes
              </button>
              <button
                onClick={() => onSelectFilterMode('Online')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterMode === 'Online'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe2 size={12} />
                <span>Online</span>
              </button>
              <button
                onClick={() => onSelectFilterMode('In-Person')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterMode === 'In-Person'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MapPin size={12} />
                <span>In-Person</span>
              </button>
            </div>
          </div>

          {/* Pricing Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Fee:</span>
            <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl">
              <button
                onClick={() => onSelectFilterPrice('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterPrice === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => onSelectFilterPrice('free')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterPrice === 'free'
                    ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Free Only
              </button>
              <button
                onClick={() => onSelectFilterPrice('paid')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  filterPrice === 'paid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Paid
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
