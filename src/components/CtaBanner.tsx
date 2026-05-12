import { auth } from "@/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function CtaBanner() {
  const session = await auth();

  return (
    <section className="px-4 sm:px-6 pb-16 sm:pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-2xl sm:rounded-3xl bg-violet-600 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/40 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-200 mb-3">Get started today</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-3 sm:mb-4">
              Ready to take control?
            </h2>
            <p className="text-violet-200 font-medium mb-7 sm:mb-10 max-w-sm mx-auto text-sm sm:text-base">
              Join thousands of people who track smarter and spend better with ExpenseTracker.
            </p>
            <Link href={session ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-white text-violet-700 text-sm font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-violet-50 shadow-xl active:scale-95 transition-all">
              {session ? "Go to Dashboard" : "Create Free Account"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
