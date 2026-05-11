import { auth } from "@/auth";
import { getCategories } from "@/db/queries/categories";
import BudgetForm from "@/components/BudgetForm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewBudgetPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const categories = await getCategories(session.user.id);

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
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">New Budget</h1>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">Set a spending limit for a specific category.</p>
      </div>

      <BudgetForm categories={categories} />
    </div>
  );
}
