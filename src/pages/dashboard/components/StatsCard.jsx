import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, subtext, icon, trend }) {
  const trendUp = trend && trend > 0;
  const trendDown = trend && trend < 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary-200">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full blur-2xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {title}
            </p>
          </div>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 border border-primary-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-lg">{icon}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>

        {/* Trend & Subtext */}
        <div className="flex items-center justify-between">
          {trend !== undefined ? (
            <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-600' : trendDown ? 'text-red-600' : 'text-slate-500'}`}>
              {trendUp && <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {trendDown && <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          ) : (
            <div></div>
          )}
          {subtext && (
            <p className="text-xs font-medium text-slate-400">
              {subtext}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 group-hover:w-full"></div>
    </div>
  );
}
