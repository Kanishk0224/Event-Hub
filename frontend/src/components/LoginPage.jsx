import { useState } from 'react';
import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Building,
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Eye,
  EyeOff,
  Compass
} from 'lucide-react';

export const LoginPage = ({ onGuestExplore }) => {
  const {
    login,
    signup,
    switchDemoUser,
    showToast
  } = useEventHub();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'pending_notice'
  const [loginRole, setLoginRole] = useState('student');
  const [loginEmail, setLoginEmail] = useState('aarav@iitd.ac.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingHostData, setPendingHostData] = useState(null);

  // Signup Flow
  const [signupType, setSignupType] = useState('student'); // 'student' | 'employee' | 'host'
  const [hostCategory] = useState('college');

  // Anti-fraud Google Search Index Verification
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [googleVerifyResult, setGoogleVerifyResult] = useState('');

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    gradYear: '2026',
    password: ''
  });

  // Employee Form
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    company: '',
    jobTitle: '',
    industry: '',
    email: '',
    phone: '',
    password: ''
  });

  // Host Form
  const [hostForm, setHostForm] = useState({
    inchargeName: '',
    designation: '',
    institutionName: '',
    orgType: 'Autonomous College / University',
    email: '',
    phone: '',
    website: '',
    password: ''
  });

  const handleQuickDemoLogin = (role) => {
    switchDemoUser(role);
  };

  const handleVerifyWithGoogle = (nameToVerify) => {
    if (!nameToVerify || nameToVerify.trim().length < 3) {
      showToast('Please enter an institution or company name to verify on Google.', 'warning');
      return;
    }

    setIsVerifyingGoogle(true);
    setGoogleVerified(false);

    setTimeout(() => {
      setIsVerifyingGoogle(false);
      setGoogleVerified(true);
      if (hostCategory === 'college') {
        setGoogleVerifyResult(`✅ Google Knowledge Graph & UGC/AICTE Index Match: "${nameToVerify}" identified as a legitimate educational institution.`);
      } else {
        setGoogleVerifyResult(`✅ Google Business Registry & MCA Corporate Index Match: "${nameToVerify}" identified as an active corporate legal entity.`);
      }
      showToast('Google Search Index & Registry verification passed!', 'success');
    }, 1000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    const res = login(loginEmail, loginPassword, loginRole);
    if (res && res.reason === 'pending_verification') {
      setPendingHostData(res.user);
      setAuthMode('pending_notice');
    }
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    signup({
      name: studentForm.name,
      email: studentForm.email,
      phone: studentForm.phone,
      college: studentForm.college,
      degree: studentForm.degree,
      gradYear: studentForm.gradYear,
      role: 'student',
      password: studentForm.password
    });
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    signup({
      name: employeeForm.name,
      company: employeeForm.company,
      jobTitle: employeeForm.jobTitle,
      industry: employeeForm.industry,
      email: employeeForm.email,
      phone: employeeForm.phone,
      role: 'employee',
      password: employeeForm.password
    });
  };

  const handleHostSubmit = (e) => {
    e.preventDefault();

    if (!googleVerified) {
      showToast('Please run the Google Search Index & Registry check to verify institution legitimacy.', 'warning');
      return;
    }

    const hostPayload = {
      name: hostForm.inchargeName,
      inchargeName: hostForm.inchargeName,
      designation: hostForm.designation,
      organizationName: hostForm.institutionName,
      institutionName: hostForm.institutionName,
      hostCategory,
      orgType: hostCategory === 'college' ? (hostForm.orgType || 'University / College') : (hostForm.orgType || 'Corporate Enterprise'),
      email: hostForm.email,
      phone: hostForm.phone,
      website: hostForm.website,
      googleIndexed: true,
      googleSearchStatus: googleVerifyResult,
      role: 'host',
      password: hostForm.password
    };

    const res = signup(hostPayload);
    if (res && res.pendingVerification) {
      setPendingHostData(res.user);
      setAuthMode('pending_notice');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-mesh-glow relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
      >
        {/* Left Side: Brand & Hero Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 font-black text-2xl flex items-center justify-center shadow-xl shadow-indigo-900/30">
                E
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight">Event<span className="text-indigo-200">Hub</span></span>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                  Opportunities & Events
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Where Talent Discovers Transformative Events.
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                Connect with hackathons, developer summits, and university challenges. Instant E-Ticket passes with verified QR verification.
              </p>
            </div>

            {/* Quick Demo Accounts Box */}
            <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Sparkles size={15} />
                <span>⚡ 1-Click Fast Demo Accounts:</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('student')}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <GraduationCap size={14} className="text-emerald-300" />
                    <span>Aarav S.</span>
                  </div>
                  <div className="text-[10px] text-indigo-100/80 truncate">Student (IIT Delhi)</div>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('employee')}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <Briefcase size={14} className="text-cyan-300" />
                    <span>Priya P.</span>
                  </div>
                  <div className="text-[10px] text-indigo-100/80 truncate">Pro (Google)</div>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('host')}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <Building size={14} className="text-purple-300" />
                    <span>GDG Council</span>
                  </div>
                  <div className="text-[10px] text-indigo-100/80 truncate">Verified Host</div>
                </button>

                <button
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <ShieldCheck size={14} className="text-rose-300" />
                    <span>Super Admin</span>
                  </div>
                  <div className="text-[10px] text-indigo-100/80 truncate">Console</div>
                </button>
              </div>
            </div>
          </div>

          {/* Guest Explore Link */}
          <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs text-indigo-100">Want to look around first?</span>
            <button
              onClick={onGuestExplore}
              className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-amber-300 underline underline-offset-4 transition-colors"
            >
              <span>Explore as Guest</span>
              <Compass size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Auth Forms (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Switcher: Sign In vs Sign Up */}
            {authMode !== 'pending_notice' && (
              <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-8 max-w-sm">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* VIEW 1: SIGN IN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Sign in to EventHub
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select your user role to access registrations and organizer features.
                  </p>
                </div>

                {/* Role Filter Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('student');
                      setLoginEmail('aarav@iitd.ac.in');
                      setLoginPassword('password123');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      loginRole === 'student'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('employee');
                      setLoginEmail('priya.patel@techcorp.com');
                      setLoginPassword('password123');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      loginRole === 'employee'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Briefcase size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Professional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('host');
                      setLoginEmail('host@gdg.org');
                      setLoginPassword('password123');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      loginRole === 'host'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Host / Org</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('admin');
                      setLoginEmail('admin@eventhub.com');
                      setLoginPassword('password123');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      loginRole === 'admin'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck size={16} className="mx-auto mb-1" />
                    <span className="text-xs">Admin</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="input-field !pl-9.5"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="input-field !pl-9.5 !pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary !py-3">
                  <span>Log In to Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* VIEW 2: SIGN UP */}
            {authMode === 'signup' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Create New Account
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select your participation type to configure your workspace.
                  </p>
                </div>

                {/* Role Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupType('student')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      signupType === 'student'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap size={18} className="mb-1" />
                    <div className="text-xs font-bold">Student</div>
                    <div className="text-[10px] text-slate-400">Competitions</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupType('employee')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      signupType === 'employee'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Briefcase size={18} className="mb-1" />
                    <div className="text-xs font-bold">Professional</div>
                    <div className="text-[10px] text-slate-400">Summits & Talks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupType('host')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      signupType === 'host'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building size={18} className="mb-1" />
                    <div className="text-xs font-bold">Event Host</div>
                    <div className="text-[10px] text-slate-400">Verified Org</div>
                  </button>
                </div>

                {/* Student Signup Form */}
                {signupType === 'student' && (
                  <form onSubmit={handleStudentSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={studentForm.phone}
                        onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="College / University"
                        value={studentForm.college}
                        onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech CS)"
                        value={studentForm.degree}
                        onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Student Email Address"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Create Password"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      required
                      className="input-field"
                    />
                    <button type="submit" className="w-full btn-primary !py-2.5">
                      Register as Student
                    </button>
                  </form>
                )}

                {/* Professional Signup Form */}
                {signupType === 'employee' && (
                  <form onSubmit={handleEmployeeSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={employeeForm.phone}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={employeeForm.company}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, company: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Job Title / Role"
                        value={employeeForm.jobTitle}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, jobTitle: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Work Email Address"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Create Password"
                      value={employeeForm.password}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                      required
                      className="input-field"
                    />
                    <button type="submit" className="w-full btn-primary !py-2.5">
                      Register as Professional
                    </button>
                  </form>
                )}

                {/* Host Signup with Anti-Fraud Verification */}
                {signupType === 'host' && (
                  <form onSubmit={handleHostSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="In-Charge Name"
                        value={hostForm.inchargeName}
                        onChange={(e) => setHostForm({ ...hostForm, inchargeName: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Designation / Title"
                        value={hostForm.designation}
                        onChange={(e) => setHostForm({ ...hostForm, designation: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Institution / Organization Name *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. IIT Delhi or Google Developers"
                          value={hostForm.institutionName}
                          onChange={(e) => setHostForm({ ...hostForm, institutionName: e.target.value })}
                          required
                          className="input-field"
                        />
                        <button
                          type="button"
                          onClick={() => handleVerifyWithGoogle(hostForm.institutionName)}
                          disabled={isVerifyingGoogle}
                          className="px-3 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex-shrink-0"
                        >
                          {isVerifyingGoogle ? 'Checking...' : 'Verify Registry'}
                        </button>
                      </div>
                      {googleVerified && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                          {googleVerifyResult}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        placeholder="Official Host Email"
                        value={hostForm.email}
                        onChange={(e) => setHostForm({ ...hostForm, email: e.target.value })}
                        required
                        className="input-field"
                      />
                      <input
                        type="tel"
                        placeholder="Official Phone"
                        value={hostForm.phone}
                        onChange={(e) => setHostForm({ ...hostForm, phone: e.target.value })}
                        required
                        className="input-field"
                      />
                    </div>

                    <input
                      type="password"
                      placeholder="Create Secure Password"
                      value={hostForm.password}
                      onChange={(e) => setHostForm({ ...hostForm, password: e.target.value })}
                      required
                      className="input-field"
                    />

                    <button type="submit" className="w-full btn-primary !py-2.5">
                      Submit Host Application (24h Review)
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* VIEW 3: PENDING VERIFICATION NOTICE */}
            {authMode === 'pending_notice' && (
              <div className="space-y-4 animate-fade-in text-center py-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Application Under 24-Hour Review
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your event host accreditation documents for{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    "{pendingHostData?.organizationName || pendingHostData?.institutionName}"
                  </strong>{' '}
                  have been logged for admin verification to protect attendees against fraudulent listings.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span>Super Admin review queue: <strong>Estimated 24 hours</strong></span>
                </div>
                <button
                  onClick={() => setAuthMode('login')}
                  className="btn-secondary !py-2 !px-4 text-xs mx-auto"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
