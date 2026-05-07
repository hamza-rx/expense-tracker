import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Settings, 
  LogOut,
  Wallet
} from "lucide-react";
import { signOut } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Expenses", href: "/dashboard/expenses", icon: Receipt },
    { label: "Budgets", href: "/dashboard/budgets", icon: Wallet },
    { label: "Reports", href: "/dashboard/reports", icon: PieChart },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-black flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight dark:text-white">ExpenseTracker</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 rounded-xl transition-all"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-4 mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Account</p>
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img src={session.user.image} className="w-8 h-8 rounded-full" alt="User" />
              )}
              <div className="truncate">
                <p className="text-xs font-bold dark:text-white truncate">{session.user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{session.user?.email}</p>
              </div>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-violet-600 rounded-md flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm dark:text-white">ExpenseTracker</span>
          </div>
          <button className="p-2 text-gray-500">
             <Settings className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
