"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryFormValues } from "@/lib/validations";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/category.actions";
import { useState } from "react";
import { Loader2, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
  initialData?: CategoryFormValues & { id: string };
  onSuccess?: () => void;
}

const PRESET_COLORS = [
  "#7c3aed", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#ec4899", 
  "#06b6d4", "#8b5cf6", "#f43f5e", "#14b8a6", "#f97316", "#6366f1"
];

export default function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: "",
      color: "#7c3aed",
      icon: "tag",
    },
  });

  const selectedColor = form.watch("color");

  async function onSubmit(values: CategoryFormValues) {
    setIsPending(true);
    setError(null);

    try {
      const result = initialData 
        ? await updateCategoryAction(initialData.id, values)
        : await createCategoryAction(values);

      if (result.error) {
        setError(result.error);
      } else {
        form.reset();
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/categories");
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
            Category Name
          </label>
          <input
            {...form.register("name")}
            placeholder="e.g. Groceries, Rent, Gym..."
            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl py-4 px-4 font-bold outline-none focus:ring-2 ring-violet-500/20 transition-all dark:text-white"
          />
          {form.formState.errors.name && (
            <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{form.formState.errors.name.message}</p>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">
            Select Color
          </label>
          <div className="grid grid-cols-6 gap-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => form.setValue("color", color)}
                className="w-full aspect-square rounded-xl transition-all hover:scale-110 flex items-center justify-center border-2 border-transparent"
                style={{ backgroundColor: color }}
              >
                {selectedColor === color && (
                  <Check className="w-5 h-5 text-white stroke-[4px]" />
                )}
              </button>
            ))}
          </div>
          {form.formState.errors.color && (
            <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{form.formState.errors.color.message}</p>
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
          "Save Category"
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Create Category
          </>
        )}
      </button>
    </form>
  );
}
