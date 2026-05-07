import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getExpenseById } from "@/db/queries/expenses";
import { getCategories } from "@/db/queries/categories";
import ExpenseForm from "@/components/ExpenseForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [expense, categories] = await Promise.all([
    getExpenseById(id, session.user.id),
    getCategories(session.user.id),
  ]);

  if (!expense) {
    notFound();
  }

  // Transform database model to form values
  const initialData = {
    ...expense,
    date: new Date(expense.date).toISOString().split("T")[0],
    amount: expense.amount.toString(),
  };

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <header className="mb-10">
        <Link
          href="/dashboard/expenses"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-violet-600 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Transactions
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Edit Expense</h1>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">Update the details of your transaction.</p>
      </header>

      <ExpenseForm categories={categories} initialData={initialData} />
    </div>
  );
}
