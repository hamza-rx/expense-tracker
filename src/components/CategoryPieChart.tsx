"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CategoryPieChartProps {
  data: {
    categoryName: string | null;
    totalAmount: number;
    categoryColor: string | null;
  }[];
  currency?: string;
}

export default function CategoryPieChart({ data, currency = "USD" }: CategoryPieChartProps) {
  const chartData = data.map(item => ({
    name: item.categoryName || "Uncategorized",
    value: item.totalAmount,
    color: item.categoryColor || "#94a3b8"
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            formatter={(value: any) => [
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
              }).format(Number(value)),
              "Spent"
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
