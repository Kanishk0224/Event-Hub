import React from 'react';
import { FileText, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';

export const AdminReportsPage = () => {
  const auditLogs = [
    { id: '1', action: 'HOST_APPROVED', target: 'Google Developer Group & IIT Delhi', admin: 'superadmin@eventhub.com', time: '10 mins ago', status: 'SUCCESS' },
    { id: '2', action: 'EVENT_SPOTLIGHT_TOGGLED', target: 'National GenAI Hackathon', admin: 'superadmin@eventhub.com', time: '1 hour ago', status: 'SUCCESS' },
    { id: '3', action: 'FRAUD_CHECK_PASSED', target: 'DevCraft Academy', admin: 'System AI Engine', time: '3 hours ago', status: 'VERIFIED' }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Security & Platform Audit Logs"
        subtitle="Real-time compliance trail of host approvals, event spotlights, and administrative actions."
        breadcrumbs={[
          { label: 'Admin Portal', to: '/app/admin/overview' },
          { label: 'Reports & Logs' }
        ]}
      />

      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-6">Event Action</th>
              <th className="py-3.5 px-4">Entity Target</th>
              <th className="py-3.5 px-4">Initiated By</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-6 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {log.action}
                </td>
                <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                  {log.target}
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                  {log.admin}
                </td>
                <td className="py-4 px-4 text-slate-400">
                  {log.time}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="badge-chip badge-success text-[10px]">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReportsPage;
