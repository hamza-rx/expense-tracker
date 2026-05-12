"use client";

import { SUPPORTED_CURRENCIES } from "@/lib/currencies";
import { updateCurrencyAction } from "@/lib/actions/user.actions";
import { useState, useTransition } from "react";
import { Check, ChevronDown, Loader2, Globe } from "lucide-react";

export default function CurrencySelector({ currentCurrency }: { currentCurrency: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  async function handleSelect(code: string) {
    if (code === currentCurrency) {
      setIsOpen(false);
      return;
    }

    startTransition(async () => {
      await updateCurrencyAction(code);
      setIsOpen(false);
    });
  }

  const current = SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency) || SUPPORTED_CURRENCIES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all min-w-[120px] justify-between"
      >
        <span className="flex items-center gap-2">
          {isPending ? <Loader2 className="w-3 h-3 animate-spin text-violet-500" /> : <Globe className="w-3 h-3 text-gray-400" />}
          {current.code}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Currency</div>
            {SUPPORTED_CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleSelect(currency.code)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="w-5 text-center text-xs text-gray-400">{currency.symbol}</span>
                  {currency.code}
                </span>
                {currentCurrency === currency.code && <Check className="w-4 h-4 text-violet-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
