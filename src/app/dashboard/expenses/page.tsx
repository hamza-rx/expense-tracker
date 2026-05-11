import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import { getSpendingByCategory } from "@/db/queries/reports";
import TransactionList from "@/components/TransactionList";
import CategoryPieChart from "@/components/CategoryPieChart";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [expenses, categories, spendingByCategory] = await Promise.all([
    getExpenses(userId),
    getCategories(userId),
    getSpendingByCategory(userId)
  ]);

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Transactions</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">
            Search, filter, and analyze your spending history.
          </p>
        </div>
        <Link 
          href="/dashboard/expenses/new"
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Transaction
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Transaction List & Filters (Wide) */}
        <div className="lg:col-span-2 space-y-6">
          <TransactionList expenses={expenses} categories={categories} />
        </div>

        {/* Right: Insights (Narrow) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-6">Spending by Category</h3>
            {spendingByCategory.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">No data to display</p>
              </div>
            ) : (
              <>
                <CategoryPieChart data={spendingByCategory} />
                <div className="mt-8 space-y-4">
                  {spendingByCategory.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.categoryColor || '#94a3b8' }} />
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{item.categoryName || "General"}</span>
                      </div>
                      <span className="text-sm font-black dark:text-white">${item.totalAmount.toFixed(2)}</span>
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
