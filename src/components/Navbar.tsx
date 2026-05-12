import { auth } from "@/auth";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth.actions";

export default async function Navbar() {
  const session = await auth();

  return (
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
              <form action={signOutAction}>
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
  );
}
