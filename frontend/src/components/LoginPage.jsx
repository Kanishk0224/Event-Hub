import React, { useState } from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  Building,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Upload,
  Clock,
  ExternalLink,
  ShieldAlert,
  Globe2
} from 'lucide-react';

export const LoginPage = ({ onGuestExplore }) => {
  const {
    login,
    signup,
    switchDemoUser,
    users,
    showToast
  } = useEventHub();

  // Mode: 'login' | 'signup' | 'pending_notice'
  const [authMode, setAuthMode] = useState('login');
  
  // Login Role Tab: 'student' | 'employee' | 'host' | 'admin'
  const [loginRole, setLoginRole] = useState('student');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [pendingHostData, setPendingHostData] = useState(null);

  // Signup Flow State:
  // step: 'select_type' | 'student_form' | 'employee_form' | 'host_select_type' | 'host_form'
  const [signupStep, setSignupStep] = useState('select_type');
  
  // Host category: 'college' | 'company'
  const [hostCategory, setHostCategory] = useState('college');

  // Google Search Verification State (Simulated live check)
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const [googleVerified, setGoogleVerified] = useState(false);
  const [googleVerifyResult, setGoogleVerifyResult] = useState('');

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    gradYear: '2026',
    password: ''
  });

  // Employee Form State
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    company: '',
    jobTitle: '',
    industry: '',
    email: '',
    phone: '',
    password: ''
  });

  // Host Form State (with Fraud-prevention proofs)
  const [hostForm, setHostForm] = useState({
    inchargeName: '',
    designation: '',
    institutionName: '',
    orgType: 'Autonomous College / University',
    email: '',
    phone: '',
    website: '',
    certificateFile: 'Accreditation-Certificate-UGC-AICTE.pdf',
    idProofFile: 'Faculty-Director-Official-ID.pdf',
    password: ''
  });

  // Quick 1-Click Demo Login handler
  const handleQuickDemoLogin = (role) => {
    switchDemoUser(role);
  };

  // Google Search Index Verification Simulation
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
    }, 1200);
  };

  // Login Submit
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

  // Student Signup Submit
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

  // Employee Signup Submit
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

  // Host Signup Submit with Fraud Prevention
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
      certificateProof: hostForm.certificateProof,
      inchargeIdProof: hostForm.idProofFile,
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
    <div className="login-screen-wrapper">
      {/* Background decoration */}
      <div className="login-bg-glow"></div>

      <div className="login-screen-card">
        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="brand-logo-center">
            <div className="logo-icon-lg">E</div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">Event<span>Hub</span></h1>
              <span className="brand-tag">OPPORTUNITIES & EVENT PLATFORM</span>
            </div>
          </div>
          <p className="login-subtitle">
            Sign in to discover competitions, manage event passes, and access organizer tools.
          </p>
        </div>

        {/* ==========================================================
            SECTION 1: QUICK DEMO ACCOUNTS (IN LOGIN PAGE ITSELF)
        ========================================================== */}
        <div className="demo-accounts-login-box">
          <div className="demo-header-label">
            <Sparkles size={15} className="text-amber-500" />
            <span>⚡ 1-Click Demo Accounts (Select to Log In Instantly):</span>
          </div>

          <div className="demo-role-grid">
            {/* Student Demo */}
            <button
              type="button"
              className="demo-login-card student"
              onClick={() => handleQuickDemoLogin('student')}
              title="Log in as Student"
            >
              <div className="demo-icon-circle green">
                <GraduationCap size={16} />
              </div>
              <div className="demo-card-text">
                <strong>Aarav Sharma</strong>
                <small>Student (IIT Delhi)</small>
              </div>
              <span className="demo-click-tag">1-Click</span>
            </button>

            {/* Professional Demo */}
            <button
              type="button"
              className="demo-login-card employee"
              onClick={() => handleQuickDemoLogin('employee')}
              title="Log in as Working Professional"
            >
              <div className="demo-icon-circle blue">
                <Briefcase size={16} />
              </div>
              <div className="demo-card-text">
                <strong>Priya Patel</strong>
                <small>Professional (Google)</small>
              </div>
              <span className="demo-click-tag">1-Click</span>
            </button>

            {/* Host Demo */}
            <button
              type="button"
              className="demo-login-card host"
              onClick={() => handleQuickDemoLogin('host')}
              title="Log in as Verified Event Host"
            >
              <div className="demo-icon-circle purple">
                <Building size={16} />
              </div>
              <div className="demo-card-text">
                <strong>GDG & IIT Delhi</strong>
                <small>Verified Host Council</small>
              </div>
              <span className="demo-click-tag">1-Click</span>
            </button>

            {/* Admin Demo */}
            <button
              type="button"
              className="demo-login-card admin"
              onClick={() => handleQuickDemoLogin('admin')}
              title="Log in as Platform Admin"
            >
              <div className="demo-icon-circle red">
                <ShieldCheck size={16} />
              </div>
              <div className="demo-card-text">
                <strong>Admin Supervisor</strong>
                <small>Platform Admin</small>
              </div>
              <span className="demo-click-tag">1-Click</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs between Login and Sign Up */}
        {authMode !== 'pending_notice' && (
          <div className="auth-tab-switch-row">
            <button
              className={`auth-switch-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setSignupStep('select_type');
              }}
            >
              Sign In to Account
            </button>
            <button
              className={`auth-switch-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
                setSignupStep('select_type');
              }}
            >
              Create New Account (Sign Up)
            </button>
          </div>
        )}

        {/* ==========================================================
            VIEW A: SIGN IN FORM
        ========================================================== */}
        {authMode === 'login' && (
          <div className="login-form-wrapper">
            {/* Role Filter Selector */}
            <div className="login-role-selector">
              <button
                type="button"
                className={`role-select-pill ${loginRole === 'student' || loginRole === 'employee' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('student');
                  setLoginEmail('aarav@iitd.ac.in');
                  setLoginPassword('password123');
                }}
              >
                <GraduationCap size={15} />
                <span>Event Register (Student / Professional)</span>
              </button>
              <button
                type="button"
                className={`role-select-pill ${loginRole === 'host' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('host');
                  setLoginEmail('host@gdg.org');
                  setLoginPassword('password123');
                }}
              >
                <Building size={15} />
                <span>Event Host (College / Company)</span>
              </button>
              <button
                type="button"
                className={`role-select-pill ${loginRole === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('admin');
                  setLoginEmail('admin@eventhub.com');
                  setLoginPassword('password123');
                }}
              >
                <ShieldCheck size={15} />
                <span>Admin Console</span>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="login-actual-form">
              <div className="form-input-field">
                <label>Registered Email Address</label>
                <div className="input-icon-box">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-input-field">
                <div className="label-with-forgot">
                  <label>Password</label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Password reset link sent to your registered email.');
                    }}
                    className="forgot-text-link"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="input-icon-box">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-submit-button">
                <span>Sign In & Open Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="login-bottom-helper">
              <span>New to EventHub?</span>
              <button
                type="button"
                className="inline-link-btn"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep('select_type');
                }}
              >
                Register Here
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW B: SIGN UP FLOWS
        ========================================================== */}
        {authMode === 'signup' && (
          <div className="signup-flow-wrapper">
            {/* STEP 1: SELECT ACCOUNT TYPE (Event Register vs Event Host) */}
            {signupStep === 'select_type' && (
              <div className="signup-role-choice-panel">
                <h3 className="choice-panel-title">Choose Account Type</h3>
                <p className="choice-panel-sub">Select the account category that best fits your goals:</p>

                {/* Choice 1: Event Register */}
                <div
                  className="role-selection-card"
                  onClick={() => setSignupStep('select_attendee_type')}
                >
                  <div className="card-icon-box blue">
                    <GraduationCap size={24} />
                  </div>
                  <div className="card-info-box">
                    <h4>Event Register (Attendee / Participant)</h4>
                    <p>For college students and working professionals. Register for hackathons, seminars, bootcamps, and cultural fests.</p>
                    <span className="card-sub-tag">🎓 Student & 💼 Working Professional Options</span>
                  </div>
                  <ArrowRight size={18} className="card-arrow" />
                </div>

                {/* Choice 2: Event Host (With Anti-Fraud Verification) */}
                <div
                  className="role-selection-card"
                  onClick={() => setSignupStep('host_select_type')}
                >
                  <div className="card-icon-box purple">
                    <Building size={24} />
                  </div>
                  <div className="card-info-box">
                    <div className="title-with-badge">
                      <h4>Event Host (Organizer)</h4>
                      <span className="verification-required-badge">
                        <ShieldAlert size={12} />
                        <span>Google Index & 24h Review Required</span>
                      </span>
                    </div>
                    <p>For verified Colleges, Universities, Student Societies, and Corporate Companies. Host events, manage schedules, and track capacity.</p>
                    <span className="card-sub-tag">Anti-Fraud Protection: Google registry & accreditation verification</span>
                  </div>
                  <ArrowRight size={18} className="card-arrow" />
                </div>
              </div>
            )}

            {/* STEP 1.5: SELECT ATTENDEE TYPE (Student vs Employee) */}
            {signupStep === 'select_attendee_type' && (
              <div className="signup-role-choice-panel">
                <button
                  type="button"
                  className="back-step-btn"
                  onClick={() => setSignupStep('select_type')}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <h3 className="choice-panel-title">Select Participant Profile</h3>
                <p className="choice-panel-sub">Choose your participant category:</p>

                <div
                  className="role-selection-card"
                  onClick={() => setSignupStep('student_form')}
                >
                  <div className="card-icon-box green">
                    <GraduationCap size={24} />
                  </div>
                  <div className="card-info-box">
                    <h4>Student Registration</h4>
                    <p>Register with your university/college credentials to access student hackathons, team competitions, and discounts.</p>
                  </div>
                  <ArrowRight size={18} className="card-arrow" />
                </div>

                <div
                  className="role-selection-card"
                  onClick={() => setSignupStep('employee_form')}
                >
                  <div className="card-icon-box amber">
                    <Briefcase size={24} />
                  </div>
                  <div className="card-info-box">
                    <h4>Employee / Working Professional Registration</h4>
                    <p>Register with your corporate background to access system design summits, tech conferences, and networking masterclasses.</p>
                  </div>
                  <ArrowRight size={18} className="card-arrow" />
                </div>
              </div>
            )}

            {/* STEP 2A: STUDENT FORM */}
            {signupStep === 'student_form' && (
              <form onSubmit={handleStudentSubmit} className="signup-detail-form">
                <button
                  type="button"
                  className="back-step-btn"
                  onClick={() => setSignupStep('select_attendee_type')}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <h3>🎓 Student Registration</h3>
                <p className="form-sub-text">Enter your academic details to create your participant profile.</p>

                <div className="form-input-field">
                  <label>Full Student Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-input-field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. aarav@college.edu"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-input-field">
                  <label>College / University Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Indian Institute of Technology Delhi (IIT Delhi)"
                    value={studentForm.college}
                    onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-input-field">
                    <label>Degree & Branch *</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science"
                      value={studentForm.degree}
                      onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Graduation Year *</label>
                    <select
                      value={studentForm.gradYear}
                      onChange={(e) => setStudentForm({ ...studentForm, gradYear: e.target.value })}
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                    </select>
                  </div>
                </div>

                <div className="form-input-field">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create a strong password (min 6 characters)"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="login-submit-button">
                  <span>Complete Student Registration & Enter</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2B: EMPLOYEE FORM */}
            {signupStep === 'employee_form' && (
              <form onSubmit={handleEmployeeSubmit} className="signup-detail-form">
                <button
                  type="button"
                  className="back-step-btn"
                  onClick={() => setSignupStep('select_attendee_type')}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <h3>💼 Professional Registration</h3>
                <p className="form-sub-text">Enter your corporate details to access masterclasses & conferences.</p>

                <div className="form-input-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Patel"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-input-field">
                    <label>Company / Organization *</label>
                    <input
                      type="text"
                      placeholder="e.g. Google India, Microsoft, Infosys"
                      value={employeeForm.company}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Job Title / Role *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Software Engineer"
                      value={employeeForm.jobTitle}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, jobTitle: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-input-field">
                    <label>Work Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. priya@google.com"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-input-field">
                  <label>Industry / Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud Infrastructure, AI / ML, Cybersecurity"
                    value={employeeForm.industry}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, industry: e.target.value })}
                  />
                </div>

                <div className="form-input-field">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="login-submit-button">
                  <span>Complete Professional Registration & Enter</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2C: HOST CATEGORY SELECTION (College/University vs Company) */}
            {signupStep === 'host_select_type' && (
              <div className="signup-role-choice-panel">
                <button
                  type="button"
                  className="back-step-btn"
                  onClick={() => setSignupStep('select_type')}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <h3 className="choice-panel-title">Host Category Selection</h3>
                <p className="choice-panel-sub">
                  Select your institutional type to initiate the Google registry and accreditation anti-fraud verification:
                </p>

                <div
                  className="role-selection-card"
                  onClick={() => {
                    setHostCategory('college');
                    setGoogleVerified(false);
                    setGoogleVerifyResult('');
                    setSignupStep('host_form');
                  }}
                >
                  <div className="card-icon-box green">
                    <GraduationCap size={24} />
                  </div>
                  <div className="card-info-box">
                    <h4>🎓 College / University Host</h4>
                    <p>For accredited Universities, IITs, NITs, BITS, Engineering/Medical colleges, and approved Student Councils.</p>
                    <span className="card-sub-tag">Verification: Google Search Index + UGC/AICTE Certification + Faculty ID</span>
                  </div>
                  <ArrowRight size={18} className="card-arrow" />
                </div>

                <div
                  className="role-selection-card"
                  onClick={() => {
                    setHostCategory('company');
                    setGoogleVerified(false);
                    setGoogleVerifyResult('');
                    setSignupStep('host_form');
                  }}
                >
                  <div className="card-icon-box blue">
                    <Building size={24} />
                  </div>
                  <div className="card-info-box">
                    <h4>💼 Company / Corporate Host</h4>
                    <p>For registered Tech Enterprises, Startups, Product Companies, and Consulting Firms hosting hackathons & challenges.</p>
                    <span className="card-sub-tag">Verification: Google Business Registry + CIN/Incorporation Certificate + Incharge ID</span>
                  </div>
                  <ArrowRight size={18} className="card-arrow" />
                </div>
              </div>
            )}

            {/* STEP 2D: HOST FORM WITH GOOGLE INDEX CHECK & PROOFS (ANTI-FRAUD) */}
            {signupStep === 'host_form' && (
              <form onSubmit={handleHostSubmit} className="signup-detail-form host-verification-form">
                <button
                  type="button"
                  className="back-step-btn"
                  onClick={() => setSignupStep('host_select_type')}
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <div className="host-form-header-badge">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>
                    {hostCategory === 'college' ? 'College / University Verification' : 'Company / Corporate Verification'}
                  </span>
                </div>

                <h3>
                  {hostCategory === 'college'
                    ? '🎓 College / University Organizer Account'
                    : '💼 Corporate / Enterprise Organizer Account'}
                </h3>
                <p className="form-sub-text">
                  To prevent fake organizations, payment scams, and fake event certificates, EventHub requires Google search indexing verification and institutional ID proof.
                </p>

                {/* Institution Name */}
                <div className="form-input-field">
                  <label>
                    {hostCategory === 'college' ? 'Official College / University Name *' : 'Registered Corporate Company Name *'}
                  </label>
                  <input
                    type="text"
                    placeholder={hostCategory === 'college' ? 'e.g. R.V. College of Engineering, Bengaluru' : 'e.g. InnovateTech Solutions Pvt Ltd'}
                    value={hostForm.institutionName}
                    onChange={(e) => {
                      setHostForm({ ...hostForm, institutionName: e.target.value });
                      setGoogleVerified(false);
                    }}
                    required
                  />
                </div>

                {/* Google Search Index Check (Anti-Fraud requirement) */}
                <div className="google-verify-box">
                  <div className="google-verify-header">
                    <div className="google-verify-title">
                      <Search size={16} className="text-blue-500" />
                      <strong>1. Google Search & Registry Index Verification *</strong>
                    </div>
                    <button
                      type="button"
                      className="btn-run-google-check"
                      onClick={() => handleVerifyWithGoogle(hostForm.institutionName)}
                      disabled={isVerifyingGoogle}
                    >
                      {isVerifyingGoogle ? 'Querying Google Index...' : 'Verify on Google Index'}
                    </button>
                  </div>

                  {googleVerified ? (
                    <div className="google-check-success">
                      <CheckCircle2 size={16} />
                      <span>{googleVerifyResult}</span>
                    </div>
                  ) : (
                    <p className="google-check-hint">
                      Click the button above to verify that {hostCategory === 'college' ? 'the college' : 'the company'} is listed on the public Google knowledge graph and recognized registry index.
                    </p>
                  )}
                </div>

                {/* Certificate Proof Upload */}
                <div className="form-input-field">
                  <label>
                    {hostCategory === 'college'
                      ? '2. College Accreditation Certificate / Dean Authorization Letter *'
                      : '2. Certificate of Incorporation / GST Registration Certificate *'}
                  </label>
                  <div className="proof-upload-pill">
                    <FileCheck size={18} className="text-emerald-500" />
                    <span className="file-name">{hostForm.certificateProof}</span>
                    <span className="file-status-badge">Attached</span>
                  </div>
                  <small className="proof-subtext">Ensures authentic establishment under UGC/AICTE or Ministry of Corporate Affairs.</small>
                </div>

                {/* Person ID Proof */}
                <div className="form-input-field">
                  <label>
                    {hostCategory === 'college'
                      ? '3. Faculty Incharge / Dean Official ID Card Proof *'
                      : '3. Authorized Representative Govt / Work ID Proof *'}
                  </label>
                  <div className="proof-upload-pill">
                    <FileCheck size={18} className="text-emerald-500" />
                    <span className="file-name">{hostForm.idProofFile}</span>
                    <span className="file-status-badge">Attached</span>
                  </div>
                  <small className="proof-subtext">Ensures the person creating events is an authorized employee/officer.</small>
                </div>

                <div className="form-row-2col">
                  <div className="form-input-field">
                    <label>Organizer Incharge Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Ramesh Kulkarni"
                      value={hostForm.inchargeName}
                      onChange={(e) => setHostForm({ ...hostForm, inchargeName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Designation / Role *</label>
                    <input
                      type="text"
                      placeholder={hostCategory === 'college' ? 'e.g. Dean of Student Affairs' : 'e.g. Senior VP of Technology'}
                      value={hostForm.designation}
                      onChange={(e) => setHostForm({ ...hostForm, designation: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div className="form-input-field">
                    <label>Official Institutional Email *</label>
                    <input
                      type="email"
                      placeholder={hostCategory === 'college' ? 'dean.events@rvce.edu.in' : 'events@innovatetech.io'}
                      value={hostForm.email}
                      onChange={(e) => setHostForm({ ...hostForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-input-field">
                    <label>Official Contact Phone *</label>
                    <input
                      type="tel"
                      placeholder="+91 94455 66778"
                      value={hostForm.phone}
                      onChange={(e) => setHostForm({ ...hostForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-input-field">
                  <label>Portal / Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={hostForm.website}
                    onChange={(e) => setHostForm({ ...hostForm, website: e.target.value })}
                  />
                </div>

                <div className="form-input-field">
                  <label>Create Password *</label>
                  <input
                    type="password"
                    placeholder="Create a secure host password"
                    value={hostForm.password}
                    onChange={(e) => setHostForm({ ...hostForm, password: e.target.value })}
                    required
                  />
                </div>

                {/* 24-Hour Review Notice Banner */}
                <div className="review-notice-callout">
                  <Clock size={20} className="text-amber-500 flex-shrink-0" />
                  <div>
                    <strong>24-Hour Quality & Security Review Policy</strong>
                    <p>
                      Upon submission, your institution profile and attached certificates will be placed in the Admin Verification Queue. Once verified within 24 hours, you will receive an approval email notification, and can immediately host events!
                    </p>
                  </div>
                </div>

                <button type="submit" className="login-submit-button">
                  <ShieldCheck size={18} />
                  <span>Submit Application for 24-Hour Review</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==========================================================
            VIEW C: 24-HOUR REVIEW CONFIRMATION NOTICE
        ========================================================== */}
        {authMode === 'pending_notice' && (
          <div className="pending-review-screen">
            <div className="pending-shield-icon">
              <Clock size={48} />
            </div>

            <h2>Application Submitted for 24-Hour Review</h2>
            <p className="pending-lead-text">
              Your host registration for <strong>{pendingHostData?.organizationName || pendingHostData?.institutionName || 'your organization'}</strong> is undergoing security and anti-fraud verification.
            </p>

            <div className="pending-audit-card">
              <div className="audit-detail-line">
                <span>Institution:</span>
                <strong>{pendingHostData?.organizationName || pendingHostData?.institutionName}</strong>
              </div>
              <div className="audit-detail-line">
                <span>Account Category:</span>
                <strong>{pendingHostData?.hostCategory?.toUpperCase() || 'COLLEGE'} HOST</strong>
              </div>
              <div className="audit-detail-line">
                <span>Google Search Index:</span>
                <span className="text-emerald-600 font-semibold">Verified on Global Index</span>
              </div>
              <div className="audit-detail-line">
                <span>Certificates Submitted:</span>
                <span>Accreditation Letter & Incharge ID Proof</span>
              </div>
              <div className="audit-detail-line">
                <span>Status:</span>
                <span className="pending-pill">⏳ Pending Admin 24-Hour Review</span>
              </div>
            </div>

            <div className="pending-action-helper">
              <p>
                <strong>What happens next?</strong> Our Admin Quality Council manually verifies the institutional credentials and ID proofs to prevent fraudulent events. You will receive an official approval email notification once verified, after which you can log in and create events.
              </p>
            </div>

            <div className="pending-buttons-row">
              <button
                type="button"
                className="btn-return-login"
                onClick={() => setAuthMode('login')}
              >
                Return to Login
              </button>

              {/* Fast-track test helper so the user can test the admin approval flow instantly */}
              <button
                type="button"
                className="btn-test-admin-approval"
                onClick={() => {
                  switchDemoUser('admin');
                  showToast('Switched to Admin Console! Review pending applications in the Host Verification Queue tab.');
                }}
              >
                <ShieldCheck size={16} />
                <span>Test Flow: Open Admin Console to Verify</span>
              </button>
            </div>
          </div>
        )}

        {/* Optional Guest browse option */}
        {onGuestExplore && authMode !== 'pending_notice' && (
          <div className="guest-explore-bar">
            <span>Just looking around?</span>
            <button
              type="button"
              className="guest-browse-link"
              onClick={onGuestExplore}
            >
              Browse Event Catalog as Guest →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
