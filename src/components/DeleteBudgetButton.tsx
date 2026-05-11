"use client";

import { deleteBudgetAction } from "@/lib/actions/budget.actions";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function DeleteBudgetButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleDelete() {
    setIsPending(true);
    try {
      await deleteBudgetAction(id);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to delete budget");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget limit? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
        isLoading={isPending}
      />
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="text-gray-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}

