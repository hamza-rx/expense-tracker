import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getCategoryById } from "@/db/queries/categories";
import CategoryForm from "@/components/CategoryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/login");
  }

  const category = await getCategoryById(id, session.user.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <header className="mb-10">
        <Link 
          href="/dashboard/categories" 
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-violet-600 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Edit Category</h1>
        <p className="text-gray-500 dark:text-zinc-400 font-medium">Update the name and color of your category.</p>
      </header>

      <CategoryForm initialData={category} />
    </div>
  );
}
