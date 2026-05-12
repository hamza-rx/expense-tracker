"use client";

import { Expense, Category } from "@/types";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Filter, X, Trash2 } from "lucide-react";
import { deleteExpenseAction } from "@/lib/actions/expense.actions";
import ConfirmationModal from "./ConfirmationModal";
import { formatCurrency, convertFromPKR } from "@/lib/currencies";

interface TransactionListProps {
  expenses: Expense[];
  categories: Category[];
  currency?: string;
}

export default function TransactionList({ expenses, categories, currency = "USD" }: TransactionListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        const matchesSearch = (exp.note || "").toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "all" || exp.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        } else {
          const amountA = parseFloat(a.amount);
          const amountB = parseFloat(b.amount);
          return sortOrder === "desc" ? amountB - amountA : amountA - amountB;
        }
      });
  }, [expenses, search, selectedCategory, sortBy, sortOrder]);

  async function handleDeleteConfirm() {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteExpenseAction(itemToDelete);
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  function initiateDelete(id: string) {
    setItemToDelete(id);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        isLoading={isDeleting}
      />

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3">
        {/* Search — full width */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-2.5 sm:py-3 pl-11 pr-10 text-sm outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white font-medium"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Category + Sort — side by side, each takes half */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-styled w-full appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-2.5 sm:py-3 pl-9 pr-8 text-xs sm:text-sm font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white shadow-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-") as [any, any];
              setSortBy(field);
              setSortOrder(order);
            }}
            className="select-styled w-full appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-2.5 sm:py-3 px-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white shadow-sm"
          >
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="amount-desc">Highest</option>
            <option value="amount-asc">Lowest</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
        {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? "s" : ""}
      </p>

      {/* ── List ── */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
          {filteredExpenses.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium text-sm">No transactions match your filters.</p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group"
              >
                {/* Left: icon + info */}
                <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-base sm:text-lg group-hover:scale-110 transition-transform shrink-0">
                    {exp.note?.[0]?.toUpperCase() || "💸"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm dark:text-white truncate leading-tight">
                      {exp.note || "Expense"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[9px] sm:text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-900/20 px-1.5 py-0.5 rounded whitespace-nowrap">
                        {exp.categoryId ? categoryMap.get(exp.categoryId)?.name : "General"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
                        {format(new Date(exp.date), "MMM dd")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: amount + delete */}
                <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2">
                  <span className="font-black text-sm sm:text-base text-rose-500 whitespace-nowrap">
                    -{formatCurrency(convertFromPKR(parseFloat(exp.amount), currency), currency)}
                  </span>
                  <button
                    onClick={() => initiateDelete(exp.id)}
                    className="p-1.5 sm:p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
