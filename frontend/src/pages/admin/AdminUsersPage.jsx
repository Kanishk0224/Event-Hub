import React, { useState } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, UserCheck } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const AdminUsersPage = () => {
  const { users, toggleVerifyUser, showToast } = useEventHub();
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="User & Organization Directory"
        subtitle={`Managing ${users.length} registered attendees, organizers, and platform administrators.`}
        breadcrumbs={[
          { label: 'Admin Portal', to: '/app/admin/overview' },
          { label: 'Users' }
        ]}
      />

      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="relative max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-6">User / Profile</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Verification</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-4 px-6 flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold capitalize text-indigo-600 dark:text-indigo-400">
                  {u.role}
                </td>
                <td className="py-4 px-4">
                  <span className={`badge-chip text-[10px] ${u.verified ? 'badge-success' : 'badge-warning'}`}>
                    {u.verified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => toggleVerifyUser(u.id)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {u.verified ? 'Revoke Badge' : 'Grant Verified'}
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

export default AdminUsersPage;
