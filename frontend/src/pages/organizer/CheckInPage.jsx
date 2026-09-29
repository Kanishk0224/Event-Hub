import React, { useState } from 'react';
import {
  QrCode,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  Sparkles,
  Camera
} from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const CheckInPage = () => {
  const { registrations, checkInAttendee, showToast } = useEventHub();
  const [ticketInput, setTicketInput] = useState('');
  const [scannedResult, setScannedResult] = useState(null);

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    const query = ticketInput.trim().toUpperCase().replace('#', '');
    const match = registrations.find(
      (r) => r.ticketId?.toUpperCase() === query || r.id?.toUpperCase() === query || r.userName?.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      if (!match.checkedIn) {
        checkInAttendee(match.id);
      }
      setScannedResult({ ...match, checkedIn: true, justVerified: true });
      showToast(`Verified & Checked In: ${match.userName} (#${match.ticketId})`);
    } else {
      setScannedResult({ notFound: true, query: ticketInput });
      showToast('No matching registered pass found', 'error');
    }
    setTicketInput('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader
        title="Live QR Check-in Desk"
        subtitle="Fast attendee verification, barcode scanning, and instant admission clearance."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Check-in Desk' }
        ]}
      />

      {/* Camera / Manual Scanner Simulation Box */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl text-center space-y-6">
        <div className="relative mx-auto h-48 w-48 rounded-3xl border-2 border-dashed border-indigo-500/60 bg-indigo-50/30 dark:bg-indigo-950/20 flex flex-col items-center justify-center p-4">
          <div className="absolute inset-x-2 top-0 h-0.5 bg-indigo-500 animate-pulse shadow-glow" />
          <Camera className="h-10 w-10 text-indigo-500 mb-2" />
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Camera Ready
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            Point camera at attendee QR pass
          </p>
        </div>

        {/* Input fallback */}
        <form onSubmit={handleScanSubmit} className="max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="Or enter Ticket ID (e.g. EH-2026-101)..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Verify
          </button>
        </form>

        {/* Scan Result Card */}
        {scannedResult && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            {scannedResult.notFound ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs">
                <AlertCircle className="h-6 w-6 mx-auto mb-1 text-rose-500" />
                <p className="font-bold">Invalid Ticket / No Match</p>
                <p className="text-[11px] mt-0.5">"{scannedResult.query}" is not registered in this program roster.</p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 space-y-3">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                <div>
                  <h4 className="text-base font-bold">{scannedResult.userName}</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Ticket ID: #{scannedResult.ticketId} • {scannedResult.ticketType || 'Standard Entry'}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">
                    Event: {scannedResult.eventTitle}
                  </p>
                </div>
                <div className="inline-block rounded-full bg-emerald-600 text-white px-3 py-1 text-[11px] font-bold">
                  ✓ Verified & Admitted
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInPage;
