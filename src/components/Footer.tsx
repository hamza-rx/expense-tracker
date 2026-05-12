import { Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 py-10 sm:py-16 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-10 mb-8 sm:mb-10">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-base tracking-tight dark:text-white">
                Expense<span className="text-violet-600">Tracker</span>
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
              A precision tool for tracking your finances. Minimal, fast, and private.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full sm:w-auto">
            {[
              { cat: "Product", links: ["Features", "Pricing", "Changelog"] },
              { cat: "Legal",   links: ["Privacy", "Terms", "Security"] },
              { cat: "Company", links: ["About", "Blog", "Contact"] },
            ].map((col) => (
              <div key={col.cat} className="flex flex-col gap-2.5 sm:gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{col.cat}</h4>
                {col.links.map((link) => (
                  <a key={link} href="#"
                    className="text-xs sm:text-sm text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest text-center sm:text-left">
            © 2026 ExpenseTracker. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            {["GitHub", "Twitter", "LinkedIn"].map((social) => (
              <a key={social} href="#"
                className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
