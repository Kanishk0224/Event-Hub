import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const AttendeeCalendarPage = () => {
  const { events, registrations, currentUser, showToast } = useEventHub();
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  const userRegs = registrations.filter((r) => r.userId === currentUser?.id && r.status === 'confirmed');
  const registeredEventIds = userRegs.map((r) => r.eventId);
  const myEvents = events.filter((e) => registeredEventIds.includes(e.id));

  // Calendar days grid for October 2026
  const daysInMonth = 31;
  const startDayOffset = 4; // Thursday start

  const exportAllToIcs = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EventHub//Attendee Schedule//EN\n`;
    myEvents.forEach((evt) => {
      icsContent += `BEGIN:VEVENT\nSUMMARY:${evt.title}\nLOCATION:${evt.location}\nDESCRIPTION:${evt.tagline || ''}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'eventhub-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported entire schedule to .ics calendar!');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Event Schedule"
        subtitle="View timeline and scheduled sessions for your confirmed registrations."
        breadcrumbs={[
          { label: 'Attendee Hub', to: '/app/attendee/overview' },
          { label: 'Calendar' }
        ]}
        actions={
          <button
            onClick={exportAllToIcs}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Schedule (.ics)</span>
          </button>
        }
      />

      {/* Calendar Header & Month Navigation */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-500" />
            <span>{currentMonth}</span>
          </h2>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Month Day Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`offset-${i}`} className="min-h-[85px] rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 p-2" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            // Matches: Oct 15, Oct 22, Oct 28
            const hasEvent15 = dayNum === 15;
            const hasEvent22 = dayNum === 22;

            return (
              <div
                key={dayNum}
                className={`min-h-[95px] rounded-2xl border p-2 flex flex-col justify-between transition-colors ${
                  hasEvent15 || hasEvent22
                    ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : 'border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900/40'
                }`}
              >
                <span className={`text-xs font-bold ${hasEvent15 || hasEvent22 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                  {dayNum}
                </span>

                {hasEvent15 && (
                  <div className="rounded-lg bg-indigo-600 p-1 text-[10px] font-semibold text-white truncate shadow-sm">
                    AI & LLM Hackathon
                  </div>
                )}
                {hasEvent22 && (
                  <div className="rounded-lg bg-emerald-600 p-1 text-[10px] font-semibold text-white truncate shadow-sm">
                    System Design Bootcamp
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Events Summary List */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Scheduled Dates & Check-in Reminders
        </h3>
        <div className="space-y-3">
          {myEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {evt.startDate} • {evt.location}
                </p>
              </div>
              <Link
                to={`/events/${evt.id}`}
                className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
              >
                Event Page
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendeeCalendarPage;
