import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import { getSpendingByCategory } from "@/db/queries/reports";
import { getUserSettings } from "@/db/queries/user";
import TransactionList from "@/components/TransactionList";
import CategoryPieChart from "@/components/CategoryPieChart";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatCurrency, convertFromPKR } from "@/lib/currencies";

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [expenses, categories, spendingByCategory, settings] = await Promise.all([
    getExpenses(userId),
    getCategories(userId),
    getSpendingByCategory(userId),
    getUserSettings(userId)
  ]);

  const currency = settings.currency;

  const convertedSpending = spendingByCategory.map(item => ({
    ...item,
    totalAmount: convertFromPKR(item.totalAmount, currency)
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-5 sm:space-y-8">

      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-0.5">Transactions</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium text-xs sm:text-sm">
            Search, filter, and manage your spending history.
          </p>
        </div>
        <Link
          href="/dashboard/expenses/new"
          className="bg-violet-600 hover:bg-violet-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </header>

      {/* Main grid — list full width on mobile, sidebar on lg+ */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-5 sm:gap-8">

        {/* Transaction list */}
        <div className="lg:col-span-2">
          <TransactionList expenses={expenses} categories={categories} currency={currency} />
        </div>

        {/* Category breakdown — below list on mobile, sidebar on lg+ */}
        <div>
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm lg:sticky lg:top-6">
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6">Spending by Category</h3>
            {spendingByCategory.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">No data to display</p>
              </div>
            ) : (
              <>
                <CategoryPieChart data={convertedSpending} currency={currency} />
                <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">
                  {convertedSpending.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.categoryColor || '#94a3b8' }} />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 truncate">{item.categoryName || "General"}</span>
                      </div>
                      <span className="text-sm font-black dark:text-white shrink-0">
                        {formatCurrency(convertFromPKR(item.totalAmount, currency), currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
