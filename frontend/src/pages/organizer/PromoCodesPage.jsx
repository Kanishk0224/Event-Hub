import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const PromoCodesPage = () => {
  const { showToast } = useEventHub();
  const [promoCodes, setPromoCodes] = useState([
    { id: '1', code: 'EARLYBIRD50', discount: '50% OFF', maxUses: 100, used: 64, active: true, expiry: '2026-10-15' },
    { id: '2', code: 'DEVCOMMUNITY', discount: '₹200 Flat', maxUses: 50, used: 28, active: true, expiry: '2026-10-20' },
    { id: '3', code: 'CAMPUSVIP', discount: '100% Free Pass', maxUses: 20, used: 20, active: false, expiry: '2026-10-01' }
  ]);

  const [newCode, setNewCode] = useState('');
  const [discountVal, setDiscountVal] = useState('20');
  const [discountType, setDiscountType] = useState('percentage');
  const [maxUses, setMaxUses] = useState('100');

  const handleAddCode = (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created = {
      id: `pc-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discount: discountType === 'percentage' ? `${discountVal}% OFF` : `₹${discountVal} Flat`,
      maxUses: Number(maxUses),
      used: 0,
      active: true,
      expiry: '2026-11-30'
    };

    setPromoCodes([created, ...promoCodes]);
    setNewCode('');
    showToast(`Promo code "${created.code}" is now active!`);
  };

  const toggleStatus = (id) => {
    setPromoCodes(promoCodes.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
    showToast('Promo code status toggled.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Promo & Discount Codes"
        subtitle="Offer custom discounts, sponsor coupons, and track campaign redemptions."
        breadcrumbs={[
          { label: 'Host Center', to: '/app/organizer/overview' },
          { label: 'Promo Codes' }
        ]}
      />

      {/* Create New Promo Code Form */}
      <form onSubmit={handleAddCode} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Tag className="h-4 w-4 text-indigo-500" />
          <span>Create New Promo Code</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Coupon Code</label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. GDG2026"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs uppercase text-slate-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Discount Type</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Discount Value</label>
            <input
              type="number"
              required
              value={discountVal}
              onChange={(e) => setDiscountVal(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Usage Limit</label>
            <input
              type="number"
              required
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Save & Activate Code</span>
          </button>
        </div>
      </form>

      {/* Codes Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-6">Coupon Code</th>
              <th className="py-3.5 px-4">Discount</th>
              <th className="py-3.5 px-4">Usage (Redeemed / Max)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {promoCodes.map((pc) => (
              <tr key={pc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-4 px-6 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {pc.code}
                </td>
                <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                  {pc.discount}
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                  {pc.used} / {pc.maxUses}
                </td>
                <td className="py-4 px-4">
                  <span className={`badge-chip text-[10px] ${pc.active ? 'badge-success' : 'badge-danger'}`}>
                    {pc.active ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => toggleStatus(pc.id)}
                    className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    {pc.active ? 'Deactivate' : 'Reactivate'}
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

export default PromoCodesPage;
