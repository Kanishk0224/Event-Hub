import { useState, useEffect } from 'react';
import { useEventHub } from '../context/EventHubContext';
import { motion } from 'framer-motion';
import {
  X,
  Building,
  GraduationCap,
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const {
    authMode,
    setAuthMode,
    authRoleTab,
    login,
    signup,
    showToast
  } = useEventHub();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState(authRoleTab || 'student');

  // Signup flow state
  const [signupType, setSignupType] = useState('student');

  // Forms
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    gradYear: '2026',
    password: ''
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    company: '',
    jobTitle: '',
    industry: '',
    email: '',
    phone: '',
    password: ''
  });

  const [hostForm, setHostForm] = useState({
    name: '',
    organizationName: '',
    orgType: 'University / College',
    email: '',
    phone: '',
    website: '',
    password: ''
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const fillDemo = (role) => {
    if (role === 'student') {
      setLoginEmail('aarav@iitd.ac.in');
      setLoginPassword('password123');
      setLoginRole('student');
    } else if (role === 'employee') {
      setLoginEmail('priya.patel@techcorp.com');
      setLoginPassword('password123');
      setLoginRole('employee');
    } else if (role === 'host') {
      setLoginEmail('host@gdg.org');
      setLoginPassword('password123');
      setLoginRole('host');
    } else if (role === 'admin') {
      setLoginEmail('admin@eventhub.com');
      setLoginPassword('password123');
      setLoginRole('admin');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    login(loginEmail, loginPassword, loginRole);
  };

  const handleStudentSignup = (e) => {
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

  const handleEmployeeSignup = (e) => {
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

  const handleHostSignup = (e) => {
    e.preventDefault();
    signup({
      name: hostForm.name,
      organizationName: hostForm.organizationName,
      orgType: hostForm.orgType,
      email: hostForm.email,
      phone: hostForm.phone,
      website: hostForm.website,
      role: 'host',
      verified: true,
      password: hostForm.password
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto grid grid-cols-1 md:grid-cols-5"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Left Side: Illustration / Brand Panel (2 cols) */}
        <div className="hidden md:flex md:col-span-2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 font-black text-xl flex items-center justify-center shadow-lg">
                E
              </div>
              <span className="text-xl font-bold tracking-tight">EventHub</span>
            </div>

            <h3 className="text-2xl font-black leading-tight tracking-tight">
              Unlock Premier Opportunities & Global Tech Conclaves.
            </h3>
            <p className="mt-3 text-xs text-indigo-100/90 leading-relaxed">
              Connect directly with verified organizers, participate in nationwide hackathons, and manage dynamic delegate passes.
            </p>
          </div>

          {/* Quick Demo Selector */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles size={14} />
              <span>1-Click Fast Demo Login:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-semibold text-left transition-colors truncate"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('employee')}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-semibold text-left transition-colors truncate"
              >
                💼 Professional
              </button>
              <button
                type="button"
                onClick={() => fillDemo('host')}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-semibold text-left transition-colors truncate"
              >
                🏛️ Host / Org
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-semibold text-left transition-colors truncate"
              >
                🛡️ Super Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Forms (3 cols) */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          <div>
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6 max-w-xs">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  authMode === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* VIEW 1: SIGN IN */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Welcome back
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select your user role and enter your credentials.
                  </p>
                </div>

                {/* Role Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setLoginRole('student')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      loginRole === 'student'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('employee')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      loginRole === 'employee'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('host')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      loginRole === 'host'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Host
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      loginRole === 'admin'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Admin
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="input-field !pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="input-field !pl-9 !pr-9"
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

                <button type="submit" className="w-full btn-primary !py-2.5 mt-2">
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}

            {/* VIEW 2: SIGN UP */}
            {authMode === 'signup' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Create your account
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select your profile type to customize your EventHub portal.
                  </p>
                </div>

                {/* Signup Role Selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupType('student')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      signupType === 'student'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap size={16} className="mb-1" />
                    <div className="font-bold text-xs">Student</div>
                    <div className="text-[10px] text-slate-400">College & Univ</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupType('employee')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      signupType === 'employee'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Briefcase size={16} className="mb-1" />
                    <div className="font-bold text-xs">Professional</div>
                    <div className="text-[10px] text-slate-400">Industry Expert</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupType('host')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      signupType === 'host'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building size={16} className="mb-1" />
                    <div className="font-bold text-xs">Event Host</div>
                    <div className="text-[10px] text-slate-400">Organizer</div>
                  </button>
                </div>

                {/* Sub-Form: Student */}
                {signupType === 'student' && (
                  <form onSubmit={handleStudentSignup} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={studentForm.phone}
                        onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="College / University"
                        value={studentForm.college}
                        onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech CS)"
                        value={studentForm.degree}
                        onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Student Email ID"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      required
                      className="input-field text-xs"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      required
                      className="input-field text-xs"
                    />
                    <button type="submit" className="w-full btn-primary !py-2 text-xs">
                      Complete Registration
                    </button>
                  </form>
                )}

                {/* Sub-Form: Professional */}
                {signupType === 'employee' && (
                  <form onSubmit={handleEmployeeSignup} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={employeeForm.phone}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Company / Org"
                        value={employeeForm.company}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, company: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Job Designation"
                        value={employeeForm.jobTitle}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, jobTitle: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Work Email ID"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                      className="input-field text-xs"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={employeeForm.password}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                      required
                      className="input-field text-xs"
                    />
                    <button type="submit" className="w-full btn-primary !py-2 text-xs">
                      Join as Professional
                    </button>
                  </form>
                )}

                {/* Sub-Form: Host */}
                {signupType === 'host' && (
                  <form onSubmit={handleHostSignup} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Contact Person Name"
                        value={hostForm.name}
                        onChange={(e) => setHostForm({ ...hostForm, name: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Organization / College Name"
                        value={hostForm.organizationName}
                        onChange={(e) => setHostForm({ ...hostForm, organizationName: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        placeholder="Official Host Email"
                        value={hostForm.email}
                        onChange={(e) => setHostForm({ ...hostForm, email: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Official Phone"
                        value={hostForm.phone}
                        onChange={(e) => setHostForm({ ...hostForm, phone: e.target.value })}
                        required
                        className="input-field text-xs"
                      />
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={hostForm.password}
                      onChange={(e) => setHostForm({ ...hostForm, password: e.target.value })}
                      required
                      className="input-field text-xs"
                    />
                    <button type="submit" className="w-full btn-primary !py-2 text-xs">
                      Register as Event Host
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;

