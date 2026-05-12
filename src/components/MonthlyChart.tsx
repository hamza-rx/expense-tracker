"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface MonthlyChartProps {
  data: {
    month: string;
    totalAmount: number;
  }[];
  currency?: string;
}

export default function MonthlyChart({ data, currency = "USD" }: MonthlyChartProps) {
  // Format the month for display (e.g., 2024-05 -> May)
  const formattedData = data.map(item => {
    const [year, month] = item.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return {
      ...item,
      displayMonth: date.toLocaleString('default', { month: 'short' })
    };
  });

  return (
    <div className="h-[200px] sm:h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="displayMonth" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }}
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
            tickFormatter={(value) => {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                maximumFractionDigits: 0,
              }).format(value);
            }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
            formatter={(value: any) => [
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
              }).format(Number(value)),
              "Total Spent"
            ]}
          />
          <Bar 
            dataKey="totalAmount" 
            radius={[6, 6, 0, 0]}
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === formattedData.length - 1 ? '#7c3aed' : '#ddd6fe'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
