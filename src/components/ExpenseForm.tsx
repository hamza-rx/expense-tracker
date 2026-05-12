"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { expenseSchema } from "@/lib/validations";
import { createExpenseAction, updateExpenseAction } from "@/lib/actions/expense.actions";
import { Category } from "@/types";
import { useState, useEffect, useRef } from "react";
import { Loader2, Plus, Sparkles, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { suggestCategory } from "@/lib/categorizer";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import FormSelect from "@/components/FormSelect";

interface ExpenseFormProps {
  categories: Category[];
  initialData?: z.input<typeof expenseSchema> & { id: string };
  currency?: string;
  onSuccess?: () => void;
}

export default function ExpenseForm({ categories, initialData, currency = "USD", onSuccess }: ExpenseFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAutoSuggested, setIsAutoSuggested] = useState(false);
  const lastSuggestedId = useRef<string | null>(null);

  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || "$";

  const form = useForm<z.input<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      amount: "",
      note: "",
      categoryId: categories[0]?.id || "",
      date: new Date().toISOString().split('T')[0],
      isRecurring: false,
      frequency: "monthly",
    },
  });

  const noteValue = form.watch("note");
  const categoryIdValue = form.watch("categoryId");
  const isRecurringValue = form.watch("isRecurring");

  // Smart Categorization Logic
  useEffect(() => {
    if (initialData || !noteValue) return;

    const suggestion = suggestCategory(noteValue, categories);
    
    if (suggestion && suggestion !== categoryIdValue) {
      form.setValue("categoryId", suggestion, { shouldValidate: true });
      setIsAutoSuggested(true);
      lastSuggestedId.current = suggestion;
      
      const timer = setTimeout(() => setIsAutoSuggested(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [noteValue, categories, form, categoryIdValue, initialData]);

  useEffect(() => {
    if (isAutoSuggested && categoryIdValue !== lastSuggestedId.current) {
      setIsAutoSuggested(false);
    }
  }, [categoryIdValue, isAutoSuggested]);

  async function onSubmit(values: z.output<typeof expenseSchema>) {
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
          <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 ring-violet-500/20 transition-all">
            <span className="pl-4 pr-2 font-medium text-gray-400 text-xl shrink-0">{currencySymbol}</span>
            <input
              {...form.register("amount")}
              placeholder="0.00"
              className="flex-1 bg-transparent py-4 pr-4 font-medium text-xl outline-none dark:text-white"
            />
          </div>
          {form.formState.errors.amount && (
            <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{form.formState.errors.amount.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">
              Note
            </label>
            {isAutoSuggested && (
              <span className="flex items-center gap-1 text-[10px] font-black text-violet-600 uppercase tracking-tighter animate-bounce">
                <Sparkles className="w-3 h-3" /> Smart Matched
              </span>
            )}
          </div>
          <input
            {...form.register("note")}
            placeholder="e.g. Starbucks, Uber, Netflix..."
            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 font-medium outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Category
            </label>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormSelect
                  options={categories.map((c) => ({ label: c.name, value: c.id }))}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Select Category"
                  highlight={isAutoSuggested}
                />
              )}
            />
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

        <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isRecurringValue ? 'text-violet-500' : 'text-gray-400'}`} />
              <label className="text-sm font-bold dark:text-white cursor-pointer" htmlFor="isRecurring">
                Recurring Expense
              </label>
            </div>
            <input
              id="isRecurring"
              type="checkbox"
              {...form.register("isRecurring")}
              className="w-5 h-5 accent-violet-600 rounded-md cursor-pointer"
            />
          </div>

          {isRecurringValue && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Frequency
              </label>
              <Controller
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormSelect
                    options={[
                      { label: "Daily",   value: "daily" },
                      { label: "Weekly",  value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Yearly",  value: "yearly" },
                    ]}
                    value={field.value ?? "monthly"}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          )}
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
