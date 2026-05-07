import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import { getMonthlyTrends } from "@/db/queries/reports";
import { format } from "date-fns";
import MonthlyChart from "@/components/MonthlyChart";
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [expenses, categories, monthlyTrends] = await Promise.all([
    getExpenses(userId),
    getCategories(userId),
    getMonthlyTrends(userId)
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const currentMonthExpenses = expenses
    .filter(exp => {
      const date = new Date(exp.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Overview</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">
            Welcome back, {session.user?.name?.split(' ')[0]}. Here's your spending summary.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-zinc-800">
            Export Report
          </button>
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95">
            + Add Expense
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: "Total Spent", 
            value: `$${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            icon: Zap,
            color: "text-violet-500",
            bg: "bg-violet-500/10"
          },
          { 
            label: "This Month", 
            value: `$${currentMonthExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
            icon: ArrowDownRight,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
          },
          { 
            label: "Total Transactions", 
            value: expenses.length.toString(), 
            icon: ArrowUpRight,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Data</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h2 className="text-3xl font-black dark:text-white">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-xl">Spending Trend</h3>
            <select className="bg-gray-50 dark:bg-zinc-800 border-none rounded-lg text-xs font-bold px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <MonthlyChart data={monthlyTrends} />
        </div>

        {/* Recent Transactions Section */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold">Recent Activity</h3>
            <button className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">View All</button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {expenses.length === 0 ? (
              <div className="px-6 py-20 text-center">
                <p className="text-gray-400 text-sm font-medium">No transactions found.</p>
              </div>
            ) : (
              expenses.slice(0, 6).map((exp) => (
                <div key={exp.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg">💸</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm dark:text-white truncate max-w-[120px]">{exp.note || "Expense"}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {exp.categoryId ? categoryMap.get(exp.categoryId)?.name : "General"} • {format(new Date(exp.date), "MMM dd")}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-rose-500">
                    -${parseFloat(exp.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
