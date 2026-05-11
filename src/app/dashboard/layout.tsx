"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Home, Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar - Desktop relative, Mobile fixed/absolute via Sidebar component logic */}
      <Sidebar
        userName={session.user?.name}
        userEmail={session.user?.email}
        userImage={session.user?.image}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-black sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-violet-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-sm dark:text-white uppercase tracking-tighter">Expense</span>
            </div>
          </div>
          <Link href="/" className="p-2 text-gray-500 hover:text-violet-600 transition-colors">
            <Home className="w-5 h-5" />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto outline-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
