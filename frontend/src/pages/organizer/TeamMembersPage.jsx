import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Mail, CheckCircle } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const TeamMembersPage = () => {
  const { showToast } = useEventHub();
  const [members, setMembers] = useState([
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya@gdg.org',
      role: 'Co-Host (Full Admin)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Rohan Mehra',
      email: 'rohan@gdg.org',
      role: 'Check-in Desk Staff',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      status: 'Active'
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMem = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      status: 'Invite Sent'
    };

    setMembers([...members, newMem]);
    setInviteEmail('');
    showToast(`Team invitation sent to ${newMem.email}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Co-Organizers & Staff Team"
        subtitle="Invite collaborators, assign check-in desk permissions, and manage organization roles."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Team' }
        ]}
      />

      {/* Invite Member Box */}
      <form onSubmit={handleInvite} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-indigo-500" />
          <span>Invite Co-Organizer / Staff</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Collaborator Email</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@university.edu"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Staff Role & Access</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
            >
              <option value="Co-Host (Full Admin)">Co-Host (Full Admin)</option>
              <option value="Editor (Schedule & Agenda)">Editor (Schedule & Agenda)</option>
              <option value="Check-in Desk Staff">Check-in Desk Staff</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>Send Team Invite</span>
          </button>
        </div>
      </form>

      {/* Member list */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-6">Member & Email</th>
              <th className="py-3.5 px-4">Role & Permissions</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {members.map((mem) => (
              <tr key={mem.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-4 px-6 flex items-center gap-3">
                  <img src={mem.avatar} alt={mem.name} className="h-9 w-9 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{mem.name}</p>
                    <p className="text-[11px] text-slate-400">{mem.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-indigo-600 dark:text-indigo-400">
                  {mem.role}
                </td>
                <td className="py-4 px-4">
                  <span className="badge-chip badge-success text-[10px]">
                    {mem.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => {
                      setMembers(members.filter((m) => m.id !== mem.id));
                      showToast('Member removed from organization.');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersPage;
