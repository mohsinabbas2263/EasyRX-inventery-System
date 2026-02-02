// src/components/AuthLayout.jsx
import React from "react";

export default function AuthLayout({
  title,
  subtitle,
  rightTop, // e.g. <Link ...>Go POS Login</Link>
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="w-full bg-white border-b">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-teal-700 font-extrabold text-lg">EazyRX</span>
            <span className="text-slate-400 font-medium">Portal</span>
          </div>

          {/* Right top area (Go POS Login / Go Web Login etc.) */}
          <div className="text-sm">{rightTop}</div>
        </div>
      </header>

      {/* Main Center Wrapper */}
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
        {/* Outer width controller (prevents right blank space feeling) */}
        <div className="w-full max-w-6xl">
          {/* Card shell */}
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Panel */}
              <div className="bg-teal-700 p-10 md:p-12 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                    Operations
                    <br />
                    Refined.
                  </h2>
                  <p className="mt-5 text-teal-100 text-sm leading-relaxed max-w-sm">
                    Pakistan&apos;s pharmacies managed through secure, reliable technology.
                  </p>
                </div>

                <div className="mt-10">
                  <div className="inline-flex items-center gap-2 bg-teal-800/40 border border-teal-600/30 rounded-full px-5 py-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold tracking-wider uppercase text-teal-100">
                      Live Compliance Sync
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Panel (Form Area) */}
              <div className="p-8 md:p-12 flex">
                {/* IMPORTANT: same height for both Web + POS */}
                <div className="w-full min-h-[520px] flex flex-col justify-between">
                  {/* Title */}
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                      {title}
                    </h1>
                    {subtitle ? (
                      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
                    ) : null}

                    {/* Form Content */}
                    <div className="mt-8">{children}</div>
                  </div>

                  {/* Bottom spacing (keeps layout stable) */}
                  <div />
                </div>
              </div>
            </div>
          </div>

          {/* Optional bottom spacing */}
          <div className="h-6" />
        </div>
      </main>
    </div>
  );
}
