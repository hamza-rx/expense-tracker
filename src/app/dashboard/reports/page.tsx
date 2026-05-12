import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSpendingByCategory, getMonthlyTrends } from "@/db/queries/reports";
import { getUserSettings } from "@/db/queries/user";
import MonthlyChart from "@/components/MonthlyChart";
import { PieChart, TrendingUp, BarChart3, Download } from "lucide-react";
import { formatCurrency, convertFromPKR } from "@/lib/currencies";

export default async function ReportsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [spendingByCategory, monthlyTrends, settings] = await Promise.all([
    getSpendingByCategory(userId),
    getMonthlyTrends(userId),
    getUserSettings(userId),
  ]);

  const currency = settings.currency;

  const convertedTrends = monthlyTrends.map(t => ({
    ...t,
    totalAmount: convertFromPKR(t.totalAmount, currency)
  }));

  const totalPeriodAmount = monthlyTrends.reduce((a, b) => a + b.totalAmount, 0);
  const averageMonthlyAmount = totalPeriodAmount / (monthlyTrends.length || 1);

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-1 sm:mb-2">Financial Reports</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium text-sm sm:text-base">Deep dive into your spending habits and patterns.</p>
        </div>
        <a 
          href="/api/reports/export" 
          className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5 sm:mb-8">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <PieChart className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl">Spending by Category</h3>
          </div>
          
          <div className="space-y-6">
            {spendingByCategory.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No category data available.</p>
            ) : (
              spendingByCategory.map((item) => (
                <div key={item.categoryId} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-sm dark:text-white">{item.categoryName || "Uncategorized"}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        {((item.totalAmount / spendingByCategory.reduce((a, b) => a + b.totalAmount, 0)) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <span className="font-black text-sm">{formatCurrency(convertFromPKR(item.totalAmount, currency), currency)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full"
                      style={{ 
                        width: `${(item.totalAmount / spendingByCategory.reduce((a, b) => a + b.totalAmount, 0)) * 100}%`,
                        backgroundColor: item.categoryColor || '#7c3aed'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-5 sm:mb-8">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl">Monthly Trends</h3>
          </div>
          <MonthlyChart data={convertedTrends} currency={currency} />
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Avg. Monthly</p>
              <p className="text-xl font-black">
                {formatCurrency(convertFromPKR(averageMonthlyAmount, currency), currency)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Period</p>
              <p className="text-xl font-black">
                {formatCurrency(convertFromPKR(totalPeriodAmount, currency), currency)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Card */}
      <div className="bg-violet-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-xl shadow-violet-500/20">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black mb-1">Smart Insights</h3>
            <p className="text-violet-100 font-medium text-sm sm:text-base">Your spending has decreased by 12% compared to last month. Keep it up!</p>
          </div>
        </div>
        <button className="bg-white text-violet-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-sm hover:bg-violet-50 transition-colors shrink-0 w-full md:w-auto">
          View Suggestions
        </button>
      </div>
    </div>
  );
}
