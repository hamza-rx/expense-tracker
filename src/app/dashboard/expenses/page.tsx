import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import { format } from "date-fns";
import Link from "next/link";
import { Plus, Receipt, Search, Filter } from "lucide-react";

export default async function ExpensesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const [expenses, categories] = await Promise.all([
    getExpenses(userId),
    getCategories(userId)
  ]);

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Transactions</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">A complete history of your spending.</p>
        </div>
        <Link 
          href="/dashboard/expenses/new" 
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </Link>
      </header>

      {/* Filters/Search Placeholder */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Search transactions..." 
            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-zinc-800/50">
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Receipt className="w-10 h-10 text-gray-200" />
                    <p className="text-gray-400 font-medium">No transactions found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm dark:text-white">{exp.note || "Expense"}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest sm:hidden">
                      {format(new Date(exp.date), "MMM dd, yyyy")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400"
                      style={{ 
                        backgroundColor: exp.categoryId ? `${categoryMap.get(exp.categoryId)?.color}10` : undefined,
                        color: categoryMap.get(exp.categoryId)?.color || undefined
                      }}
                    >
                      {exp.categoryId ? categoryMap.get(exp.categoryId)?.name : "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <p className="text-sm font-medium text-gray-500">
                      {format(new Date(exp.date), "MMM dd, yyyy")}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-sm text-rose-500">
                      -${parseFloat(exp.amount).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
