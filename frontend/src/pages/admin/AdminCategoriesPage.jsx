import React, { useState } from 'react';
import { FolderKanban, Plus, Sparkles, Trash2, Edit } from 'lucide-react';
import { useEventHub } from '../../context/EventHubContext';
import PageHeader from '../../components/ui/PageHeader';

export const AdminCategoriesPage = () => {
  const { categories, showToast } = useEventHub();
  const [catList, setCatList] = useState(categories);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#6366F1');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat = {
      id: newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: newCatName.trim(),
      icon: 'Sparkles',
      color: newCatColor
    };

    setCatList([...catList, newCat]);
    setNewCatName('');
    showToast(`Category "${newCat.name}" added successfully.`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Event Categories & Taxonomies"
        subtitle="Configure event genres, badges, and catalog filter classifications."
        breadcrumbs={[
          { label: 'Admin Portal', to: '/app/admin/overview' },
          { label: 'Categories' }
        ]}
      />

      {/* Add category form */}
      <form onSubmit={handleAddCategory} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-500" />
          <span>Add New Event Category</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Category Label</label>
            <input
              type="text"
              required
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. AI Masterclasses & Summits"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Theme Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="h-9 w-12 rounded-lg cursor-pointer bg-transparent"
              />
              <span className="text-xs font-mono text-slate-500">{newCatColor}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Save Category</span>
          </button>
        </div>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {catList.filter((c) => c.id !== 'all').map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center font-bold"
                style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                <p className="text-[11px] font-mono text-slate-400">/{cat.id}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setCatList(catList.filter((c) => c.id !== cat.id));
                showToast(`Category "${cat.name}" removed.`);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
