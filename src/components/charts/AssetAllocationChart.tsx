"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { formatCurrency, type GameState } from "@/lib/game/engine";

export default function AssetAllocationChart({ state }: { state: GameState }) {
  const data = [
    { name: "מזומן", value: Math.max(0, Math.round(state.cash)), color: "#f59e0b" },
    { name: "חיסכון", value: Math.round(state.savings), color: "#10b981" },
    { name: "מדד", value: Math.round(state.investments.index), color: "#6366f1" },
    { name: "ביטקוין", value: Math.round(state.investments.btc), color: "#f97316" },
    { name: "את'ריום", value: Math.round(state.investments.eth), color: "#a855f7" },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-slate-400 text-sm">
        עדיין אין נכסים. התחל לחסוך ולהשקיע!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13 }}
          formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
