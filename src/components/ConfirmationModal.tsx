"use client";

import Modal from "./Modal";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-6 py-4 ${
              isDestructive 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20" 
                : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20"
            } text-sm font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
