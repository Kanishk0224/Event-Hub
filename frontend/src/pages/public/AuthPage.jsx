import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Eye,
  EyeOff,
  Shield,
  GraduationCap,
  Briefcase,
  Building2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  User,
  Phone,
  Globe
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';

export const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup, switchDemoUser } = useEventHub();

  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'signup' : 'login');
  const [roleTab, setRoleTab] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech Computer Science');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [hostCategory, setHostCategory] = useState('tech_community');
  const [googleBusinessUrl, setGoogleBusinessUrl] = useState('');
  const [orgCertificateUrl, setOrgCertificateUrl] = useState('');
  const [idProofUrl, setIdProofUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = login(email, password, roleTab);
        if (result.success) {
          if (result.user.role === 'host' || result.user.role === 'organizer') {
            navigate('/app/organizer/overview');
          } else if (result.user.role === 'admin') {
            navigate('/app/admin/overview');
          } else {
            navigate('/app/attendee/overview');
          }
        } else if (result.reason === 'pending_verification') {
          setError('Host account is currently under 24-hour verification review by Admin.');
        } else {
          setError('Invalid login credentials.');
        }
      } else {
        const userData = {
          name: name || email.split('@')[0],
          email,
          phone: phone || '+91 98765 43210',
          password,
          role: roleTab,
          ...(roleTab === 'student' && { college, degree }),
          ...(roleTab === 'employee' && { company, jobTitle }),
          ...(roleTab === 'host' && { organizationName, hostCategory, googleBusinessUrl, orgCertificateUrl, idProofUrl })
        };

        const result = signup(userData);
        if (result.success) {
          if (result.pendingVerification) {
            navigate('/login');
          } else {
            navigate('/app/attendee/overview');
          }
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-mesh-glow">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col md:flex-row min-h-[85vh] max-h-[95vh]">
        {/* Left Side: Brand Showcase */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden order-2 md:order-1">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">EventHub</span>
            </Link>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              The Platform for Flagship Tech Events & Summits
            </h2>
            <p className="mt-4 text-sm text-indigo-200 leading-relaxed">
              Join 50,000+ engineers, researchers, and innovators discovering world-class hackathons, bootcamps, and verified certificates.
            </p>

            <div className="mt-8 space-y-3">
              {[
                '1-Click instant QR ticketing pass',
                'Automated waitlist promotion engine',
                '24-hour host accreditation review',
                'Post-event verified certificates'
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-indigo-100">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Demo Switcher Capsule */}
          <div className="relative z-10 mt-10 pt-6 border-t border-indigo-800/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2">
              ⚡ Instant 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('student');
                  navigate('/app/attendee/overview');
                }}
                className="p-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-xs font-semibold text-center transition-colors"
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('host');
                  navigate('/app/organizer/overview');
                }}
                className="p-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-xs font-semibold text-center transition-colors"
              >
                Organizer
              </button>
              <button
                type="button"
                onClick={() => {
                  switchDemoUser('admin');
                  navigate('/app/admin/overview');
                }}
                className="p-2 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/50 text-xs font-semibold text-center transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-start order-1 md:order-2 overflow-y-auto max-h-screen">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 mb-8">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Tabs for Registration */}
          {mode === 'signup' && (
            <div className="mb-6 space-y-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Select your primary role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', label: 'Student', icon: GraduationCap },
                  { id: 'employee', label: 'Professional', icon: Briefcase },
                  { id: 'host', label: 'Event Host', icon: Building2 }
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoleTab(r.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        roleTab === r.id
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px]">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    WhatsApp / Phone Number
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    📱 Alerts Enabled
                  </span>
                </div>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Role specific signup details */}
            {mode === 'signup' && roleTab === 'student' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && roleTab === 'host' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Organization / Community Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Tech Founders Guild"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-2">🛡️ 3-Document Host Verification Required</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500">All 3 documents are reviewed by Admin within 24 hours before login access is granted.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    1. Google Business Profile URL *
                  </label>
                  <div className="relative">
                    <Globe className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      value={googleBusinessUrl}
                      onChange={(e) => setGoogleBusinessUrl(e.target.value)}
                      placeholder="https://business.google.com/..."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Your verified Google Business Profile or Maps listing URL</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    2. College / Company Registration Certificate URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={orgCertificateUrl}
                    onChange={(e) => setOrgCertificateUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or Dropbox link"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Upload certificate to Google Drive/Dropbox and paste the share link</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    3. Personal ID Proof (Employee/Founder ID) URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={idProofUrl}
                    onChange={(e) => setIdProofUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or Dropbox link"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Company/college ID card, Aadhaar, or official employment letter</p>
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In to EventHub' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            By continuing, you agree to EventHub's Terms of Service & Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
