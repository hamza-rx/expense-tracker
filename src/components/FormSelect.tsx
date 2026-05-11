"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  highlight?: boolean; // violet ring when auto-suggested
}

export default function FormSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  highlight = false,
}: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

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
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between bg-white dark:bg-zinc-900 border rounded-2xl py-3.5 px-4 text-sm font-bold text-left shadow-sm transition-all
          ${open ? "ring-2 ring-violet-500/40 border-violet-400" : highlight ? "ring-2 ring-violet-500/50 border-violet-400" : "border-gray-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-700"}`}
      >
        <span className={selected ? "text-zinc-800 dark:text-white" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
          {placeholder && (
            <div className="px-4 py-2.5 text-sm text-gray-400 font-medium border-b border-gray-100 dark:border-zinc-800">
              {placeholder}
            </div>
          )}
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
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800"
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
