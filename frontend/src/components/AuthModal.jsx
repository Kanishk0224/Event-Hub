import React, { useState } from 'react';
import { useEventHub } from '../context/EventHubContext';
import {
  X,
  User,
  Users,
  Building,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const {
    authMode,
    setAuthMode,
    authRoleTab,
    setAuthRoleTab,
    login,
    signup,
    showToast
  } = useEventHub();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState(authRoleTab || 'student'); // 'student' | 'employee' | 'host' | 'admin'

  // Signup flow state
  // Step 1: 'select-type' (Event Register vs Event Host)
  // Step 2: 'student' | 'employee' | 'host'
  const [signupStep, setSignupStep] = useState('select-type');
  const [signupSubRole, setSignupSubRole] = useState('student'); // 'student' | 'employee' | 'host'

  // Student form
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    gradYear: '2026',
    password: ''
  });

  // Employee form
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    company: '',
    jobTitle: '',
    industry: '',
    email: '',
    phone: '',
    password: ''
  });

  // Host form
  const [hostForm, setHostForm] = useState({
    name: '',
    organizationName: '',
    orgType: 'University / College',
    email: '',
    phone: '',
    website: '',
    password: ''
  });

  if (!isOpen) return null;

  // 1-Click Demo Login fills
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
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Top Brand Bar */}
        <div className="auth-modal-header">
          <div className="auth-brand-logo">
            <span className="brand-badge-e">E</span>
            <span className="auth-brand-text">Event<span>Hub</span></span>
          </div>
          <p className="auth-modal-subtitle">
            {authMode === 'login'
              ? 'Sign in to access your registered events, tickets & organizer tools.'
              : 'Join thousands of innovators, students, professionals and hosts.'}
          </p>

          {/* Mode Switcher Tabs (Login vs Signup) */}
          <div className="auth-mode-tabs">
            <button
              className={`auth-mode-tab ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('login');
                setSignupStep('select-type');
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-mode-tab ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
                setSignupStep('select-type');
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* ========================================================
            MODE 1: LOGIN
        ======================================================== */}
        {authMode === 'login' && (
          <div className="auth-panel-body">
            {/* Role Category Tabs */}
            <div className="login-role-tabs">
              <button
                type="button"
                className={`login-role-tab ${loginRole === 'student' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('student');
                  fillDemo('student');
                }}
              >
                <GraduationCap size={15} />
                <span>Student</span>
              </button>
              <button
                type="button"
                className={`login-role-tab ${loginRole === 'employee' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('employee');
                  fillDemo('employee');
                }}
              >
                <Briefcase size={15} />
                <span>Professional</span>
              </button>
              <button
                type="button"
                className={`login-role-tab ${loginRole === 'host' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('host');
                  fillDemo('host');
                }}
              >
                <Building size={15} />
                <span>Event Host</span>
              </button>
              <button
                type="button"
                className={`login-role-tab ${loginRole === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setLoginRole('admin');
                  fillDemo('admin');
                }}
              >
                <ShieldCheck size={15} />
                <span>Admin</span>
              </button>
            </div>

            {/* Quick 1-Click Demo Fill Banner */}
            <div className="demo-fill-card">
              <div className="demo-fill-content">
                <Sparkles size={15} className="text-amber-500" />
                <span>Quick Test:</span>
                <strong>
                  {loginRole === 'student' && 'Aarav (Student @ IIT Delhi)'}
                  {loginRole === 'employee' && 'Priya (Engineer @ Google)'}
                  {loginRole === 'host' && 'Host Incharge @ GDG'}
                  {loginRole === 'admin' && 'Platform Admin'}
                </strong>
              </div>
              <button
                type="button"
                className="btn-demo-autofill"
                onClick={() => fillDemo(loginRole)}
              >
                Auto-Fill
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="auth-field">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="field-label-row">
                  <label>Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to registered email.'); }} className="forgot-link">
                    Forgot?
                  </a>
                </div>
                <div className="input-with-icon">
                  <Lock size={16} className="field-icon" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn">
                <span>Sign In to {loginRole.toUpperCase()} Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="auth-footer-prompt">
              <span>Don't have an account yet?</span>
              <button
                type="button"
                className="text-btn-link"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep('select-type');
                }}
              >
                Register Here
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            MODE 2: SIGN UP
        ======================================================== */}
        {authMode === 'signup' && (
          <div className="auth-panel-body">
            {/* STEP 1: SELECT ACCOUNT TYPE */}
            {signupStep === 'select-type' && (
              <div className="signup-select-step">
                <h3>Choose Account Type</h3>
                <p className="step-desc">Select how you want to use the EventHub platform:</p>

                {/* Option 1: Event Register */}
                <div className="signup-type-card" onClick={() => setSignupStep('select-attendee-type')}>
                  <div className="type-icon-circle blue">
                    <Users size={24} />
                  </div>
                  <div className="type-info">
                    <h4>Event Register (Attendee)</h4>
                    <p>Discover competitions, attend hackathons, participate in workshops and get certificates.</p>
                    <span className="type-subtext">For Students & Working Professionals</span>
                  </div>
                  <ArrowRight size={18} className="type-arrow" />
                </div>

                {/* Option 2: Event Host */}
                <div className="signup-type-card" onClick={() => {
                  setSignupSubRole('host');
                  setSignupStep('host-form');
                }}>
                  <div className="type-icon-circle purple">
                    <Building size={24} />
                  </div>
                  <div className="type-info">
                    <h4>Event Host (Organizer)</h4>
                    <p>Create and host events, manage participant capacity, schedules, and attendance rosters.</p>
                    <span className="type-subtext">For Colleges, Companies, Clubs & Orgs</span>
                  </div>
                  <ArrowRight size={18} className="type-arrow" />
                </div>
              </div>
            )}

            {/* STEP 1.5: SELECT ATTENDEE TYPE (STUDENT vs EMPLOYEE) */}
            {signupStep === 'select-attendee-type' && (
              <div className="signup-select-step">
                <button className="auth-back-btn" onClick={() => setSignupStep('select-type')}>
                  <ArrowLeft size={16} /> Back
                </button>

                <h3>Select Registration Category</h3>
                <p className="step-desc">Choose your participant profile category:</p>

                {/* Sub-option A: Student */}
                <div className="signup-type-card" onClick={() => {
                  setSignupSubRole('student');
                  setSignupStep('student-form');
                }}>
                  <div className="type-icon-circle green">
                    <GraduationCap size={24} />
                  </div>
                  <div className="type-info">
                    <h4>Student Registration</h4>
                    <p>Access college hackathons, student pricing, inter-university fests & internships.</p>
                  </div>
                  <ArrowRight size={18} className="type-arrow" />
                </div>

                {/* Sub-option B: Employee */}
                <div className="signup-type-card" onClick={() => {
                  setSignupSubRole('employee');
                  setSignupStep('employee-form');
                }}>
                  <div className="type-icon-circle amber">
                    <Briefcase size={24} />
                  </div>
                  <div className="type-info">
                    <h4>Employee / Professional Registration</h4>
                    <p>Access tech conferences, system design masterclasses, executive webinars & networking.</p>
                  </div>
                  <ArrowRight size={18} className="type-arrow" />
                </div>
              </div>
            )}

            {/* STEP 2A: STUDENT FORM */}
            {signupStep === 'student-form' && (
              <form onSubmit={handleStudentSignup} className="auth-form scrollable-form">
                <button type="button" className="auth-back-btn" onClick={() => setSignupStep('select-attendee-type')}>
                  <ArrowLeft size={16} /> Back
                </button>

                <h3>Student Registration</h3>
                <p className="step-desc">Fill in your academic details to create your participant profile.</p>

                <div className="auth-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-split-row">
                  <div className="auth-field flex-1">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. aarav@college.edu"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="auth-field flex-1">
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

                <div className="auth-field">
                  <label>College / University Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Delhi, BITS Pilani, NIT Trichy"
                    value={studentForm.college}
                    onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                    required
                  />
                </div>

                <div className="form-split-row">
                  <div className="auth-field flex-1">
                    <label>Degree & Branch *</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science"
                      value={studentForm.degree}
                      onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                      required
                    />
                  </div>
                  <div className="auth-field flex-1">
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

                <div className="auth-field">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create a strong password (min 6 chars)"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn">
                  <span>Complete Student Registration</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2B: EMPLOYEE FORM */}
            {signupStep === 'employee-form' && (
              <form onSubmit={handleEmployeeSignup} className="auth-form scrollable-form">
                <button type="button" className="auth-back-btn" onClick={() => setSignupStep('select-attendee-type')}>
                  <ArrowLeft size={16} /> Back
                </button>

                <h3>Employee / Professional Registration</h3>
                <p className="step-desc">Enter your professional details to access tech masterclasses & summits.</p>

                <div className="auth-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Patel"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-split-row">
                  <div className="auth-field flex-1">
                    <label>Company / Organization *</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Microsoft, Amazon"
                      value={employeeForm.company}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="auth-field flex-1">
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

                <div className="auth-field">
                  <label>Industry / Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud Computing, AI / ML, Fintech"
                    value={employeeForm.industry}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, industry: e.target.value })}
                  />
                </div>

                <div className="form-split-row">
                  <div className="auth-field flex-1">
                    <label>Work Email *</label>
                    <input
                      type="email"
                      placeholder="e.g. priya@company.com"
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="auth-field flex-1">
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

                <div className="auth-field">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create a strong password (min 6 chars)"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn">
                  <span>Complete Professional Registration</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2C: HOST FORM */}
            {signupStep === 'host-form' && (
              <form onSubmit={handleHostSignup} className="auth-form scrollable-form">
                <button type="button" className="auth-back-btn" onClick={() => setSignupStep('select-type')}>
                  <ArrowLeft size={16} /> Back
                </button>

                <h3>Event Host Registration</h3>
                <p className="step-desc">Create your host portal to publish events and manage attendees.</p>

                <div className="auth-field">
                  <label>Organizer Lead Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya Roy"
                    value={hostForm.name}
                    onChange={(e) => setHostForm({ ...hostForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="auth-field">
                  <label>Organization / College / Community Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Developer Group IIT Delhi / TechCorp"
                    value={hostForm.organizationName}
                    onChange={(e) => setHostForm({ ...hostForm, organizationName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-split-row">
                  <div className="auth-field flex-1">
                    <label>Organization Type *</label>
                    <select
                      value={hostForm.orgType}
                      onChange={(e) => setHostForm({ ...hostForm, orgType: e.target.value })}
                    >
                      <option value="University / College">University / College</option>
                      <option value="Tech Company / Enterprise">Tech Company / Enterprise</option>
                      <option value="Student Society / Club">Student Society / Club</option>
                      <option value="Non-Profit / Foundation">Non-Profit / Foundation</option>
                      <option value="Incubator / Accelerator">Incubator / Accelerator</option>
                    </select>
                  </div>
                  <div className="auth-field flex-1">
                    <label>Website or Social Link</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={hostForm.website}
                      onChange={(e) => setHostForm({ ...hostForm, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-split-row">
                  <div className="auth-field flex-1">
                    <label>Official Email ID *</label>
                    <input
                      type="email"
                      placeholder="host@organization.org"
                      value={hostForm.email}
                      onChange={(e) => setHostForm({ ...hostForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="auth-field flex-1">
                    <label>Contact Phone *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={hostForm.phone}
                      onChange={(e) => setHostForm({ ...hostForm, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create a strong password (min 6 chars)"
                    value={hostForm.password}
                    onChange={(e) => setHostForm({ ...hostForm, password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="auth-submit-btn">
                  <span>Create Event Host Account</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            <div className="auth-footer-prompt">
              <span>Already have an account?</span>
              <button
                type="button"
                className="text-btn-link"
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
