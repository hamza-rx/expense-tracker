import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-black px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
             <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Expense Tracker</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{session.user?.name}</p>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{session.user?.email}</p>
          </div>
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt={session.user.name || "User"} 
              className="w-10 h-10 rounded-full border-2 border-violet-500/20 p-0.5"
            />
          )}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">Welcome back, {session.user?.name?.split(' ')[0]}. Here's what's happening with your money.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Balance", value: "$4,250.00", color: "text-emerald-500" },
            { label: "Monthly Expenses", value: "$1,120.40", color: "text-rose-500" },
            { label: "Savings Goal", value: "75%", color: "text-violet-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className={`text-3xl font-black ${stat.color}`}>{stat.value}</h2>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold">Recent Transactions</h3>
            <button className="text-xs font-bold text-violet-600 hover:text-violet-700">View All</button>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {[
              { desc: "Grocery Store", category: "Food", amount: "-$85.00", date: "Today" },
              { desc: "Monthly Rent", category: "Housing", amount: "-$1,200.00", date: "Yesterday" },
              { desc: "Freelance Payment", category: "Income", amount: "+$2,500.00", date: "Oct 24" }
            ].map((tx, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div>
                  <p className="font-bold text-sm">{tx.desc}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{tx.category} • {tx.date}</p>
                </div>
                <span className={`font-black text-sm ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
