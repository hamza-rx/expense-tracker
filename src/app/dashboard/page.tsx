import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import { getMonthlyTrends, getBudgetStatus } from "@/db/queries/reports";
import { getUserSettings } from "@/db/queries/user";
import { format } from "date-fns";
import SpendingTrendCard from "@/components/SpendingTrendCard";
import { ArrowUpRight, ArrowDownRight, Zap, Target } from "lucide-react";
import Link from "next/link";
import { processRecurringExpenses } from "@/lib/recurring-processor";
import { formatCurrency, convertFromPKR } from "@/lib/currencies";
import CurrencySelector from "@/components/CurrencySelector";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Process recurring expenses before fetching data
  await processRecurringExpenses(userId);

  const [expenses, categories, monthlyTrends, budgetStatus, settings] = await Promise.all([
    getExpenses(userId),
    getCategories(userId),
    getMonthlyTrends(userId),
    getBudgetStatus(userId),
    getUserSettings(userId)
  ]);
    console.log("expenses", expenses)
    console.log("categories", categories)
    console.log("monthlyTrends", monthlyTrends)
    console.log("budgetStatus", budgetStatus)
    console.log("settings", settings)
  const currency = settings.currency;
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  console.log("categoryMap", categoryMap) 
  // Expenses are stored in PKR. Convert totals to the selected display currency.
  const totalExpensesPKR = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  console.log("totalExpensesPKR", totalExpensesPKR) 
  const currentMonthExpensesPKR = expenses
    .filter(exp => {
      const date = new Date(exp.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
   console.log("currentMonthExpensesPKR", currentMonthExpensesPKR) 
  const totalExpenses = convertFromPKR(totalExpensesPKR, currency);
  const currentMonthExpenses = convertFromPKR(currentMonthExpensesPKR, currency);
  
  const convertedTrends = monthlyTrends.map(t => ({
    ...t, 
    totalAmount: convertFromPKR(t.totalAmount, currency)
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-8">
      {/* Header — title left, actions right. On very small screens stack, on md+ always row */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-0.5">Overview</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium text-xs sm:text-sm truncate">
            Welcome back, {session.user?.name?.split(' ')[0]}. Here&apos;s your spending summary.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CurrencySelector currentCurrency={currency} />
          <Link 
            href="/api/reports/export"
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 whitespace-nowrap"
          >
            Export
          </Link>
          <Link 
            href="/dashboard/expenses/new"
            className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 whitespace-nowrap"
          >
            + Add
          </Link>
        </div>
      </header>

      {/* Stats Grid — 1 col on mobile, 3 on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {[
          { 
            label: "Total Spent", 
            value: formatCurrency(totalExpenses, currency), 
            icon: Zap,
            color: "text-violet-500",
            bg: "bg-violet-500/10"
          },
          { 
            label: "This Month", 
            value: formatCurrency(currentMonthExpenses, currency), 
            icon: ArrowDownRight,
            color: "text-rose-500",
            bg: "bg-rose-500/10"
          },
          { 
            label: "Active Budgets", 
            value: budgetStatus.length.toString(), 
            icon: Target,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.icon === Zap ? 'w-5 h-5' : 'w-5 h-5'} ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Data</span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h2 className="text-xl sm:text-2xl font-black dark:text-white">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chart Section */}
        <SpendingTrendCard data={convertedTrends} currency={currency} />

        {/* Budget Overview Widget */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold">Budget Status</h3>
            <Link href="/dashboard/budgets" className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">Manage</Link>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {budgetStatus.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm font-medium mb-4">No budgets set.</p>
                <Link href="/dashboard/budgets/new" className="text-xs font-bold bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Set Goal</Link>
              </div>
            ) : (
              budgetStatus.slice(0, 4).map((status) => (
                <div key={status.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold dark:text-white">{status.categoryName}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{Math.round(status.percentUsed)}%</p>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${status.percentUsed > 100 ? 'bg-rose-500' : 'bg-violet-500'}`}
                      style={{ width: `${Math.min(status.percentUsed, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold">Recent Activity</h3>
            <Link href="/dashboard/expenses" className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-50 dark:divide-zinc-800/50">
            {expenses.length === 0 ? (
              <div className="px-6 py-20 text-center col-span-2">
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
                      <p className="font-bold text-sm dark:text-white truncate max-w-[100px] sm:max-w-[160px]">{exp.note || "Expense"}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {exp.categoryId ? categoryMap.get(exp.categoryId)?.name : "General"} • {format(new Date(exp.date), "MMM dd")}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-sm text-rose-500">
                    -{formatCurrency(convertFromPKR(parseFloat(exp.amount), currency), currency)}
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
