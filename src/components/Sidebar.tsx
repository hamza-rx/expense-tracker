"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  LogOut,
  Wallet,
  Tag,
  Home,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth.actions";

const navItems = [
  { label: "Overview",   href: "/dashboard",            icon: LayoutDashboard },
  { label: "Expenses",   href: "/dashboard/expenses",   icon: Receipt },
  { label: "Budgets",    href: "/dashboard/budgets",    icon: Wallet },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Reports",    href: "/dashboard/reports",    icon: PieChart },
  { label: "Home",       href: "/",                     icon: Home },
];

interface SidebarProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ userName, userEmail, userImage, isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-black transition-all duration-300 ease-in-out md:relative md:shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-[72px]" : "md:w-64"} w-64`}
      >
        {/* Toggle button — Desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-1/3 -translate-y-1/2 z-10 w-8 h-8 bg-violet-50 dark:bg-zinc-900 border-2 border-violet-300 dark:border-violet-700 rounded-full hidden md:flex items-center justify-center shadow-md hover:bg-violet-100 dark:hover:bg-violet-500/20 hover:border-violet-500 transition-all"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4 text-violet-500" />
            : <ChevronLeft  className="w-4 h-4 text-violet-500" />
          }
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-500 md:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className={`flex items-center gap-3 p-5 overflow-hidden ${collapsed ? "md:justify-center md:px-0" : ""}`}>
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight dark:text-white whitespace-nowrap md:block hidden">
              ExpenseTracker
            </span>
          )}
          <span className="font-bold text-lg tracking-tight dark:text-white whitespace-nowrap md:hidden block">
            ExpenseTracker
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all
                  ${collapsed ? "md:justify-center" : ""}
                  ${isActive
                    ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    : "text-gray-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10"
                  }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`${collapsed ? "md:hidden" : "block"}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account + Sign out */}
        <div className={`p-3 border-t border-gray-100 dark:border-zinc-800 ${collapsed ? "md:flex md:flex-col md:items-center md:gap-2" : ""}`}>
          <div className={`bg-gray-50 dark:bg-zinc-900 rounded-2xl p-3 mb-3 ${collapsed ? "md:hidden" : "block"}`}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account</p>
            <div className="flex items-center gap-3">
              {userImage ? (
                <img src={userImage} className="w-8 h-8 rounded-full shrink-0" alt="User" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-violet-600">{userName?.[0]?.toUpperCase()}</span>
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-bold dark:text-white truncate">{userName}</p>
                <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {collapsed && userImage && (
            <img src={userImage} className="w-8 h-8 rounded-full mb-1 hidden md:block" alt="User" title={userName ?? ""} />
          )}

          <form action={signOutAction}>
            <button
              type="submit"
              title={collapsed ? "Sign Out" : undefined}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all
                ${collapsed ? "md:justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={`${collapsed ? "md:hidden" : "block"}`}>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
