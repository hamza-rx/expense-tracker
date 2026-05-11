"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden"
      >
        <header className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tightest dark:text-white uppercase">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
