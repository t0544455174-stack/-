"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, PiggyBank, ShoppingBag, ChevronLeft } from "lucide-react";
import type { Allocation } from "@/lib/game/engine";

export default function BudgetSlider({
  availableBudget,
  onConfirm,
}: {
  availableBudget: number;
  onConfirm: (allocation: Allocation) => void;
}) {
  const [saving, setSaving] = useState(33);
  const [investing, setInvesting] = useState(33);
  const [investmentChoice, setInvestmentChoice] = useState<"index" | "btc" | "eth">("index");
  const spending = Math.max(0, 100 - saving - investing);

  const saveAmount = (availableBudget * saving) / 100;
  const investAmount = (availableBudget * investing) / 100;
  const spendAmount = (availableBudget * spending) / 100;

  const investmentOptions: { id: "index" | "btc" | "eth"; label: string; desc: string; color: string; volatility: string }[] = [
    { id: "index", label: "מדד", desc: "בטוח יחסית", color: "from-blue-400 to-indigo-500", volatility: "נמוכה" },
    { id: "btc", label: "ביטקוין", desc: "תנודתי מאוד", color: "from-amber-400 to-orange-500", volatility: "גבוהה" },
    { id: "eth", label: "את'ריום", desc: "תנודתי מאוד", color: "from-purple-400 to-violet-500", volatility: "גבוהה" },
  ];

  return (
    <div className="space-y-5">
      <div className="h-10 rounded-2xl overflow-hidden flex shadow-inner bg-slate-100">
        <motion.div
          className="bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold"
          animate={{ width: `${spending}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {spending > 10 && `${Math.round(spending)}%`}
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold"
          animate={{ width: `${saving}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {saving > 10 && `${saving}%`}
        </motion.div>
        <motion.div
          className="bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
          animate={{ width: `${investing}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {investing > 10 && `${investing}%`}
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 rounded-2xl bg-orange-50 border border-orange-100">
          <ShoppingBag className="w-5 h-5 mx-auto text-orange-500 mb-1" />
          <div className="text-xs text-slate-500">הוצאה</div>
          <div className="font-bold text-orange-600 text-sm">₪{Math.round(spendAmount).toLocaleString()}</div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
          <PiggyBank className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
          <div className="text-xs text-slate-500">חיסכון</div>
          <div className="font-bold text-emerald-600 text-sm">₪{Math.round(saveAmount).toLocaleString()}</div>
        </div>
        <div className="text-center p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
          <TrendingUp className="w-5 h-5 mx-auto text-indigo-500 mb-1" />
          <div className="text-xs text-slate-500">השקעה</div>
          <div className="font-bold text-indigo-600 text-sm">₪{Math.round(investAmount).toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">חיסכון</label>
            <span className="text-sm font-bold text-emerald-600">{saving}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={saving}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              setSaving(Math.min(v, 100 - investing));
            }}
            className="w-full"
            style={{
              accentColor: "#10b981",
              background: `linear-gradient(to left, #10b981, #10b981 ${saving}%, #e2e8f0 ${saving}%)`,
            }}
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">השקעה</label>
            <span className="text-sm font-bold text-indigo-600">{investing}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={investing}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              setInvesting(Math.min(v, 100 - saving));
            }}
            className="w-full"
            style={{
              accentColor: "#6366f1",
              background: `linear-gradient(to left, #6366f1, #6366f1 ${investing}%, #e2e8f0 ${investing}%)`,
            }}
          />
        </div>
      </div>

      {investing > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2 overflow-hidden"
        >
          <div className="text-sm font-medium text-slate-700">במה להשקיע?</div>
          <div className="grid grid-cols-3 gap-2">
            {investmentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setInvestmentChoice(opt.id)}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  investmentChoice === opt.id
                    ? "border-indigo-500 bg-indigo-50 scale-105"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`w-8 h-8 mx-auto rounded-xl bg-gradient-to-br ${opt.color} mb-1`} />
                <div className="text-xs font-bold text-slate-700">{opt.label}</div>
                <div className="text-[10px] text-slate-400">תנודתיות {opt.volatility}</div>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
            ⚠️ כסף וירטואלי בלבד - אין זה ייעוץ פיננסי אמיתי
          </div>
        </motion.div>
      )}

      <button
        onClick={() => onConfirm({ spending, saving, investing, investmentChoice })}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        אישור ומעבר לחודש הבא
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
