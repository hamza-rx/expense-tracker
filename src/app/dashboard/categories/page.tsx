import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/db/queries/categories";
import Link from "next/link";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";

export default async function CategoriesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const categories = await getCategories(userId);

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Categories</h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">Organize your spending with custom categories.</p>
        </div>
        <Link 
          href="/dashboard/categories/new" 
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Category
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-20 rounded-3xl text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Tag className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium mb-6">You haven't created any categories yet.</p>
            <Link 
              href="/dashboard/categories/new" 
              className="text-violet-600 font-bold hover:underline"
            >
              Create your first category
            </Link>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm group hover:border-violet-500/20 transition-colors">
              <div className="flex items-start justify-between mb-8">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: cat.color || '#7c3aed', boxShadow: `0 8px 16px -4px ${cat.color}40` }}
                >
                  <Tag className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link 
                    href={`/dashboard/categories/${cat.id}/edit`}
                    className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-400 hover:text-violet-600 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg text-gray-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-black dark:text-white mb-1">{cat.name}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Custom Category
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
