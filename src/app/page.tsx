import { auth, signOut } from "@/auth";
import Link from "next/link";
import {
  Wallet, TrendingUp, Target, ShieldCheck, Zap,
  BarChart3, ArrowRight, CheckCircle2, Receipt,
  PieChart, Bell, RefreshCw,
} from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Spending Trends", description: "Visualize monthly spending with interactive charts. Spot patterns and make smarter financial decisions at a glance.", color: "text-violet-500", bg: "bg-violet-500/10", span: "md:col-span-2" },
  { icon: Target, title: "Budget Goals", description: "Set per-category limits and get alerted before you overspend.", color: "text-emerald-500", bg: "bg-emerald-500/10", span: "md:col-span-1" },
  { icon: ShieldCheck, title: "Secure & Private", description: "Your data stays yours. Bank-grade encryption on every request.", color: "text-sky-500", bg: "bg-sky-500/10", span: "md:col-span-1" },
  { icon: Zap, title: "Smart Categorization", description: "AI-powered engine learns from your habits to automatically categorize expenses with high accuracy.", color: "text-amber-500", bg: "bg-amber-500/10", span: "md:col-span-2" },
];

const highlights = [
  { icon: Receipt, label: "Expense Tracking" },
  { icon: PieChart, label: "Visual Reports" },
  { icon: Bell, label: "Budget Alerts" },
  { icon: RefreshCw, label: "Recurring Expenses" },
  { icon: BarChart3, label: "Monthly Trends" },
  { icon: ShieldCheck, label: "Secure Auth" },
];

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "6+", label: "Report types" },
  { value: "∞", label: "Categories" },
  { value: "Real-time", label: "Budget tracking" },
];

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans selection:bg-violet-100 dark:selection:bg-violet-900/30">

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-base tracking-tight dark:text-white">
              ExpenseTracker
            </span>
          </Link>

          {/* Nav links — desktop center */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {[
              { label: "Features",     href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Dashboard",    href: "#dashboard" },
            ].map((item) => (
              <a key={item.href} href={item.href}
                className="px-3 py-2 text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-xl transition-all">
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTAs — always right */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {session ? (
              <>
                <Link href="/dashboard"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-500/20 active:scale-95 transition-all">
                  Dashboard
                </Link>
                <form action={async () => { "use server"; await signOut(); }}>
                  <button type="submit"
                    className="px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login"
                  className="px-3 py-2 text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-xl transition-all">
                  Login
                </Link>
                <Link href="/signup"
                  className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-500/20 active:scale-95 transition-all">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-14">

        {/* ── Hero ── */}
        <section className="px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50 mb-6 sm:mb-8">
              <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse shrink-0" />
              <span className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-[0.15em]">
                Smart Finance Management
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-5 dark:text-white">
              Take control of{" "}
              <span className="text-violet-600">your money.</span>
            </h1>

            <p className="max-w-lg text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mb-8 px-2">
              Track expenses, set budgets, and understand your spending — all in
              one clean, fast dashboard built for real people.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-12 sm:mb-16 px-2 sm:px-0">
              <Link href={session ? "/dashboard" : "/signup"}
                className="flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-500/25 active:scale-95 transition-all">
                {session ? "Go to Dashboard" : "Start for Free"}
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              {!session && (
                <Link href="/login"
                  className="flex items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 active:scale-95 transition-all">
                  Sign In
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden w-full border border-zinc-100 dark:border-zinc-800">
              {stats.map((s, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 px-4 py-4 sm:px-6 sm:py-5 flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-violet-600 mb-1">{s.value}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-center">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Highlights ticker ── */}
        <section className="border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-3 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-4">
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <h.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500 shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest whitespace-nowrap">{h.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-600 mb-3">Everything you need</p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight dark:text-white mb-3">Built for clarity.</h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm sm:max-w-md text-sm sm:text-base">
                Every feature is designed to give you a clearer picture of where your money goes.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {features.map((f, i) => (
                <div key={i}
                  className={`group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 ${f.span}`}>
                  <div className="relative z-10 flex flex-col items-start text-left h-full">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${f.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color}`} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight mb-2 sm:mb-3 dark:text-white">{f.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{f.description}</p>
                  </div>
                  <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-violet-500/5 blur-[80px] group-hover:bg-violet-500/10 transition-colors duration-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Dashboard Preview ── */}
        <section id="dashboard" className="px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16 bg-zinc-50 dark:bg-zinc-900/40 border-y border-zinc-100 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10 sm:gap-16">

              {/* Copy */}
              <div className="flex-1 text-center md:text-left w-full">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-600 mb-3">The dashboard</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black dark:text-white tracking-tight mb-4 sm:mb-6">
                  Your finances, at a glance.
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base max-w-sm mx-auto md:mx-0">
                  One screen. All your spending, budgets, and trends — no clutter, no confusion.
                </p>
                <ul className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-10 text-left max-w-xs mx-auto md:mx-0">
                  {["Monthly spending overview", "Budget progress bars", "Recent transactions", "Category breakdown"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href={session ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-violet-500/20 active:scale-95 transition-all">
                  Open Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mockup */}
              <div className="flex-1 w-full max-w-lg mx-auto md:mx-0">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] blur opacity-20 group-hover:opacity-35 transition duration-700" />
                  <div className="relative bg-white dark:bg-zinc-800 rounded-[1.5rem] p-3 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
                    <div className="flex items-center gap-1.5 px-3 pb-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                    </div>
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                        <div className="h-6 w-20 bg-violet-600 rounded-lg" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ color: "bg-violet-500/20" }, { color: "bg-rose-500/20" }, { color: "bg-emerald-500/20" }].map((c, i) => (
                          <div key={i} className="bg-white dark:bg-zinc-800 rounded-lg p-2.5 border border-zinc-100 dark:border-zinc-700">
                            <div className={`w-6 h-6 ${c.color} rounded-md mb-1.5`} />
                            <div className="h-1.5 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-1" />
                            <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-600 rounded-full" />
                          </div>
                        ))}
                      </div>
                      <div className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-zinc-100 dark:border-zinc-700">
                        <div className="h-1.5 w-16 bg-zinc-200 dark:bg-zinc-600 rounded-full mb-3" />
                        <div className="flex items-end gap-1.5 h-12">
                          {[40, 65, 45, 80, 55, 70, 50, 90, 60, 75].map((h, i) => (
                            <div key={i} className="flex-1 bg-violet-500/40 rounded-t-sm" style={{ height: `${h}%` }} />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between bg-white dark:bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-100 dark:border-zinc-700">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-700 rounded-md" />
                              <div className="space-y-1">
                                <div className="h-1.5 w-14 bg-zinc-200 dark:bg-zinc-600 rounded-full" />
                                <div className="h-1 w-10 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
                              </div>
                            </div>
                            <div className="h-2.5 w-10 bg-rose-400/50 rounded-full" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="px-4 sm:px-6 py-16 sm:py-24 scroll-mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-10 sm:mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-600 mb-3">Simple by design</p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight dark:text-white">
                Up and running in minutes.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {[
                { step: "01", title: "Create your account", desc: "Sign up in seconds. No credit card, no setup fees.", icon: Wallet, color: "text-violet-500", bg: "bg-violet-500/10" },
                { step: "02", title: "Add your expenses", desc: "Log transactions manually or let smart categorization do the work.", icon: Receipt, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { step: "03", title: "Track & optimize", desc: "Review reports, set budgets, and make better financial decisions.", icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/10" },
              ].map((s, i) => (
                <div key={i} className="relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <span className="absolute top-5 right-5 text-4xl sm:text-5xl font-black text-zinc-100 dark:text-zinc-800 select-none">{s.step}</span>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${s.bg} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                    <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${s.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight mb-2 dark:text-white">{s.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl bg-violet-600 p-8 sm:p-12 text-center overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/40 rounded-full blur-3xl" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-200 mb-3">Get started today</p>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-3 sm:mb-4">
                  Ready to take control?
                </h2>
                <p className="text-violet-200 font-medium mb-7 sm:mb-10 max-w-sm mx-auto text-sm sm:text-base">
                  Join thousands of people who track smarter and spend better with ExpenseTracker.
                </p>
                <Link href={session ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-white text-violet-700 text-sm font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-violet-50 shadow-xl active:scale-95 transition-all">
                  {session ? "Go to Dashboard" : "Create Free Account"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-4 sm:px-6 py-10 sm:py-16 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-10 mb-8 sm:mb-10">

            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-base tracking-tight dark:text-white">
                  Expense<span className="text-violet-600">Tracker</span>
                </span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                A precision tool for tracking your finances. Minimal, fast, and private.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full sm:w-auto">
              {[
                { cat: "Product", links: ["Features", "Pricing", "Changelog"] },
                { cat: "Legal",   links: ["Privacy", "Terms", "Security"] },
                { cat: "Company", links: ["About", "Blog", "Contact"] },
              ].map((col) => (
                <div key={col.cat} className="flex flex-col gap-2.5 sm:gap-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{col.cat}</h4>
                  {col.links.map((link) => (
                    <a key={link} href="#"
                      className="text-xs sm:text-sm text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">
                      {link}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 sm:pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest text-center sm:text-left">
              © 2026 ExpenseTracker. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-6">
              {["GitHub", "Twitter", "LinkedIn"].map((social) => (
                <a key={social} href="#"
                  className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
