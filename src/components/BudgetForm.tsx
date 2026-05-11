"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, BudgetFormValues } from "@/lib/validations";
import { createBudgetAction, updateBudgetAction } from "@/lib/actions/budget.actions";
import { Category } from "@/types";
import { useState } from "react";
import { Loader2, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import FormSelect from "@/components/FormSelect";

interface BudgetFormProps {
  categories: Category[];
  initialData?: BudgetFormValues & { id: string };
  currency?: string;
  onSuccess?: () => void;
}

export default function BudgetForm({ categories, initialData, currency = "USD", onSuccess }: BudgetFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || "$";

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initialData || {
      limitAmount: "",
      categoryId: categories[0]?.id || "",
      period: "monthly",
    },
  });

  async function onSubmit(values: BudgetFormValues) {
    setIsPending(true);
    setError(null);

    try {
      const result = initialData 
        ? await updateBudgetAction(initialData.id, values)
        : await createBudgetAction(values);

      if (result.error) {
        setError(result.error);
      } else {
        form.reset();
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/budgets");
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
            Budget Limit
          </label>
          <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl overflow-hidden focus-within:ring-2 ring-violet-500/20 transition-all">
            <span className="pl-4 pr-2 font-medium text-gray-400 text-xl shrink-0">{currencySymbol}</span>
            <input
              {...form.register("limitAmount")}
              placeholder="0.00"
              className="flex-1 bg-transparent py-4 pr-4 font-medium text-xl outline-none dark:text-white"
            />
          </div>
          {form.formState.errors.limitAmount && (
            <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{form.formState.errors.limitAmount.message}</p>
          )}
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
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Category"
                />
              )}
            />
            {form.formState.errors.categoryId && (
              <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{form.formState.errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Period
            </label>
            <Controller
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormSelect
                  options={[
                    { label: "Monthly", value: "monthly" },
                    { label: "Yearly",  value: "yearly" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
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
          "Update Budget"
        ) : (
          <>
            <Target className="w-5 h-5" />
            Set Budget Limit
          </>
        )}
      </button>
    </form>
  );
}
