import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBudgets } from "@/db/queries/budgets";
import { getCategories } from "@/db/queries/categories";
import { getBudgetStatus } from "@/db/queries/reports";
import Link from "next/link";
import DeleteBudgetButton from "@/components/DeleteBudgetButton";
import { Pencil } from "lucide-react";

export default async function BudgetsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [budgets, categories, budgetStatus] = await Promise.all([
    getBudgets(userId),
    getCategories(userId),
    getBudgetStatus(userId)
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white p-6 sm:p-10">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Budgets</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">Set monthly limits to keep your spending in check.</p>
        </div>
        <Link 
          href="/dashboard/budgets/new"
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 inline-flex items-center"
        >
          + New Budget
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetStatus.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-10 rounded-2xl text-center">
            <p className="text-gray-500 font-medium mb-4">No budgets set yet.</p>
            <Link href="/dashboard/budgets/new" className="text-violet-600 font-bold hover:underline">Create your first budget limit</Link>
          </div>
        ) : (
          budgetStatus.map((status) => (
            <div key={status.id} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{status.categoryName || "Uncategorized"}</h3>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/budgets/${status.id}/edit`}
                    className="text-gray-400 hover:text-violet-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <DeleteBudgetButton id={status.id} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium">Spent: ${status.spent.toFixed(2)}</span>
                    <span className="font-bold">${parseFloat(status.limitAmount).toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${status.percentUsed > 100 ? 'bg-rose-500' : 'bg-violet-500'}`}
                      style={{ width: `${Math.min(status.percentUsed, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className={`text-xs font-bold ${status.remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {status.remaining < 0 
                      ? `${(status.percentUsed - 100).toFixed(1)}% over budget` 
                      : `$${status.remaining.toFixed(2)} remaining`}
                  </p>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Monthly
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
