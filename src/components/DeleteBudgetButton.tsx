"use client";

import { deleteBudgetAction } from "@/lib/actions/budget.actions";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteBudgetButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this budget limit?")) return;
    
    setIsPending(true);
    try {
      await deleteBudgetAction(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete budget");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray-400 hover:text-rose-500 transition-colors"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
