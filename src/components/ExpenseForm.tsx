"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormValues } from "@/lib/validations";
import { createExpenseAction, updateExpenseAction } from "@/lib/actions/expense.actions";
import { Category } from "@/types";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExpenseFormProps {
  categories: Category[];
  initialData?: ExpenseFormValues & { id: string };
  onSuccess?: () => void;
}

export default function ExpenseForm({ categories, initialData, onSuccess }: ExpenseFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      amount: "",
      note: "",
      categoryId: categories[0]?.id || "",
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
    },
  });

  async function onSubmit(values: ExpenseFormValues) {
    setIsPending(true);
    setError(null);

    try {
      const result = initialData 
        ? await updateExpenseAction(initialData.id, values)
        : await createExpenseAction(values);

      if (result.error) {
        setError(result.error);
      } else {
        form.reset();
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">$</span>
            <input
              {...form.register("amount")}
              placeholder="0.00"
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 pl-8 pr-4 font-black text-xl outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white"
            />
          </div>
          {form.formState.errors.amount && (
            <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
            Note
          </label>
          <input
            {...form.register("note")}
            placeholder="What was this for?"
            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 font-medium outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Category
            </label>
            <select
              {...form.register("categoryId")}
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white appearance-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Date
            </label>
            <input
              type="date"
              {...form.register("date")}
              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 active:scale-95"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : initialData ? (
          "Save Changes"
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add Expense
          </>
        )}
      </button>
    </form>
  );
}
