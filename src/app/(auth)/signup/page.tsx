"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { signUpAction } from "@/lib/actions/auth.actions";
import Link from "next/link";
import { Wallet, Eye, EyeOff } from "lucide-react";

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900 p-4">
      {/* Card — stacks on mobile, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">

        {/* ── Left / Top panel (violet) ── */}
        <div className="relative md:w-[42%] bg-violet-600 flex flex-col items-center justify-between overflow-hidden shrink-0
                        py-8 px-6 md:py-10 md:px-6">
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-violet-500/40 rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-700/50 rounded-full" />

          {/* Mobile: horizontal layout */}
          <div className="relative z-10 w-full flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-sm tracking-wide">ExpenseTracker</span>
            </div>
            <Link href="/login" className="text-xs font-bold text-white/80 hover:text-white border border-white/40 px-3 py-1.5 rounded-full transition-all">
              Sign In
            </Link>
          </div>

          {/* Desktop: logo top */}
          <div className="relative z-10 hidden md:flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/80 text-xs font-bold tracking-widest uppercase">ExpenseTracker</span>
          </div>

          {/* Welcome text — desktop */}
          <div className="relative z-10 text-center hidden md:block">
            <h2 className="text-3xl font-black text-white mb-3">Join Us!</h2>
            <p className="text-violet-200 text-sm leading-relaxed max-w-[160px] mx-auto">
              Create your free account and start tracking your finances today
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block px-8 py-2.5 rounded-full border-2 border-white/60 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile: compact welcome text */}
          <div className="relative z-10 text-center mt-4 mb-2 md:hidden">
            <h2 className="text-xl font-black text-white">Join Us!</h2>
            <p className="text-violet-200 text-xs mt-1">Create your free account today</p>
          </div>

          {/* Bottom links — desktop only */}
          <div className="relative z-10 hidden md:flex gap-4 text-[10px] text-violet-300 font-bold uppercase tracking-widest">
            <Link href="/login" className="hover:text-white transition-colors">Login Here</Link>
            <span className="text-violet-400">|</span>
            <Link href="/" className="hover:text-white transition-colors">Home Here</Link>
          </div>
        </div>

        {/* ── Right / Bottom panel (form) ── */}
        <div className="flex-1 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center px-6 py-8 md:px-10 md:py-10">
          <div className="w-full max-w-xs">
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-white tracking-tight">create account</h1>
              <p className="text-zinc-400 text-sm mt-1">Sign up to get started for free</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs px-3 py-2.5 rounded-xl">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Full Name..."
                className="w-full px-4 py-3 rounded-full bg-violet-50 dark:bg-zinc-700 border-0 text-zinc-800 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              />

              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email..."
                className="w-full px-4 py-3 rounded-full bg-violet-50 dark:bg-zinc-700 border-0 text-zinc-800 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Password..."
                  className="w-full px-4 py-3 pr-11 rounded-full bg-violet-50 dark:bg-zinc-700 border-0 text-zinc-800 dark:text-white placeholder:text-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all shadow-lg shadow-violet-500/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating…
                  </span>
                ) : "SIGN UP"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-zinc-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-zinc-800 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  or sign up with
                </span>
              </div>
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-full bg-violet-50 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-zinc-600 active:scale-[0.98] transition-all"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-full bg-violet-50 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-zinc-600 active:scale-[0.98] transition-all"
              >
                <GitHubIcon /> GitHub
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-violet-600 font-bold hover:underline">
                sign in
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-600">
              <Link href="/" className="hover:text-violet-600 transition-colors">← Back to home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
