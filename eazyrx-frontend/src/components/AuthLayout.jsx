export default function AuthLayout({ title, subtitle, children, rightTop }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter text-teal-700">
              EazyRX <span className="font-normal text-slate-400">Portal</span>
            </span>
          </div>
          {rightTop}
        </div>
      </header>

      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-6 bg-slate-50">
  <div className="w-full max-w-5xl">
    <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 min-h-[600px] flex flex-col md:flex-row relative">
      
      <div className="md:w-5/12 bg-teal-700 p-10 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Operations <br /> Refined.
          </h2>
          <p className="text-teal-100 text-xs leading-relaxed opacity-80">
            Pakistan&apos;s pharmacies managed through secure, reliable technology.
          </p>
        </div>

        <div className="z-10 bg-teal-800/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-100">
              Live Compliance Sync
            </span>
          </div>
        </div>

        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-600 rounded-full blur-[70px] opacity-40"></div>
      </div>

      <div className="md:w-7/12 p-10 flex flex-col justify-center bg-white relative overflow-hidden">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-400 text-sm font-medium">{subtitle}</p>
        </div>
        {children}
      </div>

    </div>
  </div>
</main>
    </div>
  );
}
