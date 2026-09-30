import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm animate-pulse">
      <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-6 w-3/4 rounded-md bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTableRow = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-48 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
      <div className="flex items-end gap-6 px-4 -mt-16">
        <div className="h-28 w-28 rounded-2xl bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900" />
        <div className="space-y-2 pb-2">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default { SkeletonCard, SkeletonTableRow, SkeletonProfile };
