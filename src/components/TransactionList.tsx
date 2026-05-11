"use client";

import { Expense, Category } from "@/types";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Filter, X, ChevronDown, Trash2 } from "lucide-react";
import { deleteExpenseAction } from "@/lib/actions/expense.actions";
import ConfirmationModal from "./ConfirmationModal";

interface TransactionListProps {
  expenses: Expense[];
  categories: Category[];
}

export default function TransactionList({ expenses, categories }: TransactionListProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Modal State
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
    <div className="space-y-6">
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
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white font-medium"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

          <div className="flex gap-2">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-styled appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3 pl-10 pr-10 text-sm font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white shadow-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-") as [any, any];
                setSortBy(field);
                setSortOrder(order);
              }}
              className="select-styled appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl py-3 pl-4 pr-10 text-sm font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white shadow-sm"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Showing {filteredExpenses.length} transactions
        </p>
      </div>

      {/* Table/List */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
          {filteredExpenses.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No transactions match your filters.</p>
            </div>
          ) : (
            filteredExpenses.map((exp) => (
              <div key={exp.id} className="px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center font-bold text-base sm:text-lg group-hover:scale-110 transition-transform shrink-0">
                    {exp.note?.[0] || "💸"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base dark:text-white truncate">{exp.note || "Expense"}</p>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="text-[9px] sm:text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-900/20 px-1.5 py-0.5 rounded">
                        {exp.categoryId ? categoryMap.get(exp.categoryId)?.name : "General"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest whitespace-nowrap">
                        {format(new Date(exp.date), "MMM dd")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                  <span className="font-black text-sm sm:text-lg text-rose-500">
                    -${parseFloat(exp.amount).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => initiateDelete(exp.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl md:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
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
