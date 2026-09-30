import React, { useState } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, UserCheck, Trash2, Mail, Phone, Building2, GraduationCap, Briefcase } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const AdminUsersPage = () => {
  const { users, currentUser, toggleVerifyUser, deleteUser, showToast } = useEventHub();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch = !search || 
      u.name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase()) || 
      u.role?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-3.5 w-3.5 text-rose-500" />;
      case 'host': return <Building2 className="h-3.5 w-3.5 text-indigo-500" />;
      case 'employee': return <Briefcase className="h-3.5 w-3.5 text-violet-500" />;
      default: return <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  const handleDeleteUser = async (user) => {
    const isCurrent = currentUser && (currentUser.id === user.id || currentUser._id === user.id || currentUser.email?.toLowerCase() === user.email?.toLowerCase());
    if (isCurrent) {
      showToast('You cannot delete your own currently active administrator login.', 'error');
      return;
    }

    const confirmed = window.confirm(
      `⚠️ PERMANENT DELETION\n\nAre you sure you want to delete user "${user.name || user.email}" (${user.role.toUpperCase()}) from MongoDB Atlas?\n\nThis will remove their login access, profile, and associated event registrations.`
    );

    if (confirmed) {
      await deleteUser(user.id || user._id);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="User & Login Directory"
        subtitle={`Managing ${users.length} registered accounts stored in MongoDB Atlas database.`}
        breadcrumbs={[
          { label: 'Admin Portal', to: '/app/admin/overview' },
          { label: 'Users & Logins' }
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All (${users.length})` },
            { id: 'student', label: `Students (${users.filter(u => u.role === 'student').length})` },
            { id: 'host', label: `Hosts (${users.filter(u => u.role === 'host').length})` },
            { id: 'employee', label: `Pros (${users.filter(u => u.role === 'employee').length})` },
            { id: 'admin', label: `Admins (${users.filter(u => u.role === 'admin').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-6">User / Login</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Verification</th>
              <th className="py-3.5 px-6 text-right">Actions (Manage & Delete)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isCurrentAdmin = currentUser && (currentUser.id === u.id || currentUser._id === u.id || currentUser.email?.toLowerCase() === u.email?.toLowerCase());

                return (
                  <tr key={u.id || u._id || u.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={u.avatar || u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'} 
                          alt={u.name} 
                          className="h-10 w-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 dark:text-white">{u.name || 'Unnamed User'}</p>
                            {isCurrentAdmin && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                                YOU
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
                          {u.organizationName && (
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{u.organizationName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-semibold capitalize text-slate-700 dark:text-slate-300">
                        {getRoleIcon(u.role)}
                        <span>{u.role || 'student'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge-chip text-[10px] ${u.verified ? 'badge-success' : 'badge-warning'}`}>
                        {u.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Verification */}
                        <button
                          onClick={() => toggleVerifyUser(u.id || u._id)}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          {u.verified ? 'Revoke' : 'Verify'}
                        </button>

                        {/* Delete User Button */}
                        {isCurrentAdmin ? (
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            Protected
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-sm"
                            title="Delete this login and account from MongoDB Atlas"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Login</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
