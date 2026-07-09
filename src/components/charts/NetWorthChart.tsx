"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { formatCurrency, type NetWorthPoint } from "@/lib/game/engine";

export default function NetWorthChart({ data, showNoSave }: { data: NetWorthPoint[]; showNoSave?: boolean }) {
  const chartData = data.map((d) => ({
    age: Math.round(d.age * 10) / 10,
    netWorth: Math.round(d.netWorth),
    noSave: Math.round(d.noSaveNetWorth),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorNoSave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="age" tick={{ fontSize: 12, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
        />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 13 }}
          formatter={(value, name) => [formatCurrency(Number(value)), name === "netWorth" ? "שווי נטו" : "בלי חיסכון"]}
          labelFormatter={(label) => `גיל ${label}`}
        />
        {showNoSave && (
          <Area type="monotone" dataKey="noSave" name="noSave" stroke="#f43f5e" strokeWidth={2} fill="url(#colorNoSave)" />
        )}
        <Area type="monotone" dataKey="netWorth" name="netWorth" stroke="#6366f1" strokeWidth={3} fill="url(#colorNet)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
