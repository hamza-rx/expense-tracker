import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-violet-100 dark:selection:bg-violet-900/30">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">ExpenseTracker</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Security", "About"].map((item) => (
              <a key={item} href="#" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-xl active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-gray-900 dark:text-white px-4 py-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-full transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-full hover:bg-violet-700 transition-all shadow-xl shadow-violet-500/20 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">New: Smart Categorization</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-linear-to-b from-gray-900 via-gray-900 to-gray-500 dark:from-white dark:via-white dark:to-gray-500 leading-[1.1]">
            Master your money with <br className="hidden md:block" /> absolute precision.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-zinc-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            The minimal expense tracker designed for people who value speed, privacy, and gorgeous design. No bloat, just insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={session ? "/dashboard" : "/login"}
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-base font-black rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95"
            >
              {session ? "Go to Dashboard" : "Start Tracking for Free"}
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white text-base font-black rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all active:scale-95">
              Watch Demo
            </button>
          </div>

          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-linear-to-t from-white dark:from-black via-transparent to-transparent z-10" />
            <div className="p-4 rounded-3xl bg-linear-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 border border-violet-200/50 dark:border-violet-800/50 shadow-3xl">
              <div className="aspect-video rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-inner flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/40 cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preview Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 dark:border-zinc-900 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-sm text-gray-500 font-medium">© 2026 ExpenseTracker. All rights reserved.</p>
          <div className="flex items-center gap-8">
            {["Terms", "Privacy", "Security", "GitHub"].map((item) => (
              <a key={item} href="#" className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

