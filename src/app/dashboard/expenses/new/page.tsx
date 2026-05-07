import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/db/queries/categories";
import ExpenseForm from "@/components/ExpenseForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewExpensePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const categories = await getCategories(session.user.id);

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <header className="mb-10">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-violet-600 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Add Expense</h1>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">Record a new transaction to track your spending.</p>
      </header>

      <ExpenseForm categories={categories} />
    </div>
  );
}
