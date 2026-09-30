import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export const PageHeader = ({ title, subtitle, breadcrumbs = [], actions, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* Back Button Row */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.label || idx}>
                  {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
