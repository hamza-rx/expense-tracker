import { auth } from "@/auth";
import { getCategories } from "@/db/queries/categories";
import { getBudgetById } from "@/db/queries/budgets";
import BudgetForm from "@/components/BudgetForm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [categories, budget] = await Promise.all([
    getCategories(session.user.id),
    getBudgetById(id, session.user.id)
  ]);

  if (!budget) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <Link 
        href="/dashboard/budgets" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 font-bold text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Budgets
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Edit Budget</h1>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">Update your spending limit.</p>
      </div>

      <BudgetForm 
        categories={categories} 
        initialData={{
          ...budget,
          period: (budget.period as "monthly" | "yearly") || "monthly"
        }} 
      />
    </div>
  );
}
