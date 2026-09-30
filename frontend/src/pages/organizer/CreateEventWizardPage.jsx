import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Image,
  CheckCircle,
  Plus,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const CreateEventWizardPage = () => {
  const navigate = useNavigate();
  const { categories, createEvent, showToast } = useEventHub();

  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'hackathon',
    categoryLabel: 'Hackathon',
    mode: 'Hybrid',
    location: '',
    startDate: '',
    endDate: '',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    isFree: true,
    price: 0,
    maxCapacity: 100,
    allowWaitlist: true,
    teamSize: '1 - 4 Members',
    eligibility: 'Open to all students & professionals',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
    description: '',
    perks: ['Official Certificate of Attendance', 'Mentorship Sessions', 'Cloud Credits Access'],
    schedule: [
      {
        day: 'Day 1',
        sessions: [
          { time: '09:00 AM - 10:30 AM', title: 'Opening Keynote & Introductions', speaker: 'Lead Architect', room: 'Main Hall' }
        ]
      }
    ],
    speakers: [
      { name: 'Dr. Jane Doe', role: 'Staff AI Researcher', company: 'Deep Tech Labs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }
    ]
  });

  const updateField = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handlePublish = async () => {
    // Validate required fields
    if (!formData.title || !formData.description) {
      showToast('Please provide an event title and description.', 'error');
      setStep(1);
      return;
    }

    // Ensure price is not negative - clamp to 0 if negative
    let price = formData.price;
    if (price < 0) {
      price = 0;
      showToast('Fee cannot be negative. Set to ₹0.', 'warning');
    }

    // Ensure maxCapacity is valid (at least 1)
    let maxCapacity = formData.maxCapacity;
    if (maxCapacity < 1) {
      maxCapacity = 1;
    }

    // Create event data with proper values
    const eventData = {
      ...formData,
      price: price,
      maxCapacity: maxCapacity,
      registeredCount: 0,
      waitlistCount: 0,
      status: 'published',
      isFeatured: false
    };

    const created = await createEvent(eventData);
    showToast('🎉 Event successfully created and published to catalog!');
    navigate(created?.id ? `/events/${created.id}` : '/app/organizer/events');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
          showBack
          title="Create New Event Program"
        subtitle="Configure ticketing, schedules, keynote speakers, and eligibility criteria."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Create Event' }
        ]}
      />


      {/* 5-Step Stepper Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Basics' },
            { num: 2, label: 'Schedule' },
            { num: 3, label: 'Tickets' },
            { num: 4, label: 'Media' },
            { num: 5, label: 'Preview' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              {idx > 0 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    step > idx ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              )}
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                  step === s.num
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : step > s.num
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                    step === s.num
                      ? 'bg-indigo-600 text-white'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              1. Event Basics & Overview
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Next-Gen Autonomous AI Agents Summit 2026"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Short Tagline / Catchphrase
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                placeholder="e.g. 48 hours of rapid prototyping, mentorship, and pitches"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id === e.target.value);
                    updateField('category', e.target.value);
                    updateField('categoryLabel', cat?.name || 'Hackathon');
                  }}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                >
                  {categories.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Event Format
                </label>
                <select
                  value={formData.mode}
                  onChange={(e) => updateField('mode', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                >
                  <option value="Online">Online / Virtual</option>
                  <option value="In-Person">In-Person Campus</option>
                  <option value="Hybrid">Hybrid (Both)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Venue / Streaming Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g. IIT Delhi Campus & Discord Stream"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe problem statements, perks, guidelines, eligibility..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Schedule & Sessions */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              2. Agenda & Keynote Sessions
            </h3>
            <p className="text-xs text-slate-500">Add timeline intervals and speaker assignments.</p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Session 1</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Time (e.g. 09:00 AM - 10:30 AM)"
                  defaultValue="09:00 AM - 10:30 AM"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="Session Title"
                  defaultValue="Opening Keynote: Frontier AI Architectures"
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tickets & Capacity */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              3. Ticketing Tiers & Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Maximum Seating Capacity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('maxCapacity', Math.max(1, formData.maxCapacity - 10))}
                    className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold text-lg flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxCapacity}
                    onChange={(e) => updateField('maxCapacity', Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none text-center"
                  />
                  <button
                    type="button"
                    onClick={() => updateField('maxCapacity', formData.maxCapacity + 10)}
                    className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold text-lg flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Registered: {formData.maxCapacity} seats • Use +/- or type directly
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Ticket Fee (₹)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateField('isFree', true);
                      updateField('price', 0);
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.isFree
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('isFree', false);
                      if (!formData.price || formData.price === 0) {
                        updateField('price', 499);
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      !formData.isFree
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    Paid
                  </button>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData.isFree ? 0 : formData.price}
                      disabled={formData.isFree}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value) || 0);
                        updateField('isFree', val === 0);
                        updateField('price', val);
                      }}
                      placeholder="Enter ticket price"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 pl-7 pr-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {formData.isFree ? 'Event admission is completely free for all attendees.' : `Attendees pay ₹${formData.price} per pass during registration.`}
                </p>
              </div>
            </div>

            {/* UPI Payment QR Code Preview - shown when event is paid */}
            {!formData.isFree && formData.price > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-200 dark:border-indigo-900/50">
                <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">📱 UPI Payment QR Code Preview</p>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(`upi://pay?pa=events@eventhub&pn=${encodeURIComponent(formData.title || 'EventHub')}&am=${formData.price}&cu=INR&tn=${encodeURIComponent(formData.title || 'EventHub Registration')}`)}`}
                      alt="UPI QR Code"
                      className="w-28 h-28 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-white"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Attendees scan this QR at checkout to pay ₹{formData.price}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">Supported: PhonePe · GPay · Paytm · BHIM · Amazon Pay</p>
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400 break-all">
                        upi://pay?pa=events@eventhub&am={formData.price}&cu=INR
                      </p>
                    </div>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                      ✅ This QR will be displayed on the event page for all attendees
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Enable Automated Waitlist</p>
                <p className="text-[11px] text-slate-400">Allow participants to queue when full</p>
              </div>
              <input
                type="checkbox"
                checked={formData.allowWaitlist}
                onChange={(e) => updateField('allowWaitlist', e.target.checked)}
                className="h-4 w-4 rounded text-indigo-600"
              />
            </div>
          </div>
        )}

        {/* Step 4: Media & Perks */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              4. Media & Participant Perks
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Cover Banner Image
              </label>
              {/* File Upload Option */}
              <div className="mb-3">
                <label
                  htmlFor="bannerFileUpload"
                  className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all"
                >
                  <Image className="h-6 w-6 text-slate-400" />
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Click to upload image</p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, WebP up to 10MB</p>
                  </div>
                  <input
                    id="bannerFileUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const objectUrl = URL.createObjectURL(file);
                        updateField('bannerUrl', objectUrl);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <span className="text-[10px] text-slate-400 font-medium">OR paste URL</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>
              <input
                type="text"
                value={formData.bannerUrl}
                onChange={(e) => updateField('bannerUrl', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>

            {formData.bannerUrl && (
              <div className="relative">
                <img
                  src={formData.bannerUrl}
                  alt="Banner preview"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="h-40 w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => updateField('bannerUrl', '')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Preview & Publish */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              5. Ready to Publish
            </h3>

            <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-2">
              <span className="badge-chip badge-primary text-[10px]">
                {formData.categoryLabel} • {formData.mode}
              </span>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {formData.title || 'Untitled Event'}
              </h4>
              <p className="text-xs text-slate-500">
                {formData.startDate || 'Date TBD'} • {formData.location || 'Location TBD'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 pt-2">
                {formData.tagline}
              </p>
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Publish Event to Catalog</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventWizardPage;
