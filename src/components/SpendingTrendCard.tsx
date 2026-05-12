"use client";

import { useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import MonthlyChart from "@/components/MonthlyChart";

interface TrendData {
  month: string;
  totalAmount: number;
}

const PERIOD_OPTIONS = [
  { label: "Last 6 Months", value: "6m" },
  { label: "Last Year",     value: "1y" },
];

export default function SpendingTrendCard({ data, currency = "USD" }: { data: TrendData[], currency?: string }) {
  const [period, setPeriod] = useState("6m");

  // Filter data based on selected period
  const filtered = period === "6m" ? data.slice(-6) : data;

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
        <h3 className="font-bold text-base sm:text-xl">Spending Trend</h3>
        <CustomSelect
          options={PERIOD_OPTIONS}
          value={period}
          onChange={setPeriod}
        />
      </div>
      <MonthlyChart data={filtered} currency={currency} />
    </div>
  );
}
