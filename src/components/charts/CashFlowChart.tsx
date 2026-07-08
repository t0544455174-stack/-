"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { formatCurrency, type CurrentFlow } from "@/lib/game/engine";

export default function CashFlowChart({ flow }: { flow: CurrentFlow | null }) {
  if (!flow) return null;

  const data = [
    { name: "הכנסה", value: Math.round(flow.income + (flow.lifeEvent && flow.lifeEvent.amount > 0 ? flow.lifeEvent.amount : 0)), color: "#10b981" },
    { name: "הוצאות", value: Math.round(flow.fixedExpenses + (flow.lifeEvent && flow.lifeEvent.amount < 0 ? Math.abs(flow.lifeEvent.amount) : 0)), color: "#f43f5e" },
    { name: "חיסכון", value: Math.round(flow.saveAmount), color: "#06b6d4" },
    { name: "השקעה", value: Math.round(flow.investAmount), color: "#6366f1" },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#64748b" }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13 }}
          formatter={(value: number) => [formatCurrency(value), ""]}
          cursor={{ fill: "rgba(0,0,0,0.03)" }}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
