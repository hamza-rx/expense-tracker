"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CustomSelect({ options, value, onChange, className = "" }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm font-bold text-zinc-800 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm min-w-[140px] justify-between"
      >
        <span>{selected.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 min-w-[160px] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors
                  ${isSelected
                    ? "bg-violet-600 text-white"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
