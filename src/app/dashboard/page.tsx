"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Wallet, PiggyBank, Coins, ArrowRight } from "lucide-react";
import { loadGameState, formatCurrency, getNetWorth, getTotalInvestments, type GameState } from "@/lib/game/engine";
import NetWorthChart from "@/components/charts/NetWorthChart";
import CashFlowChart from "@/components/charts/CashFlowChart";
import AssetAllocationChart from "@/components/charts/AssetAllocationChart";
import MarketReport from "@/components/game/MarketReport";
import IsraeliIndicesReport from "@/components/game/IsraeliIndicesReport";

export default function Dashboard() {
  const router = useRouter();
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const loaded = loadGameState();
    if (!loaded) {
      router.replace("/");
      return;
    }
    setState(loaded);
  }, [router]);

  if (!state) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const netWorth = getNetWorth(state);
  const totalInvestments = getTotalInvestments(state);

  const stats = [
    { icon: Wallet, label: "מזומן", value: formatCurrency(state.cash), color: "text-amber-600", bg: "bg-amber-50" },
    { icon: PiggyBank, label: "חיסכון", value: formatCurrency(state.savings), color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Coins, label: "השקעות", value: formatCurrency(totalInvestments), color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: TrendingUp, label: "שווי נטו", value: formatCurrency(netWorth), color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">דשבורד</h1>
        {!state.isGameOver && (
          <button
            onClick={() => router.push("/game")}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            חזרה למשחק
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-xs text-slate-500 mb-0.5">{stat.label}</div>
            <div className="font-bold text-slate-800 text-sm">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl shadow-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="font-bold text-slate-800">שווי נטו לאורך זמן</h2>
        </div>
        <p className="text-xs text-slate-500 mb-3">השווי הכולל של הנכסים שלך מול תרחיש שבו הוצאת הכל בלי לחסוך</p>
        <NetWorthChart data={state.netWorthHistory} showNoSave />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="font-bold text-slate-800">תזרים החודש</h2>
          </div>
          <CashFlowChart flow={state.currentFlow} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <PieChartIcon className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-bold text-slate-800">פילוח נכסים</h2>
          </div>
          <AssetAllocationChart state={state} />
        </motion.div>
      </div>

      <IsraeliIndicesReport />

      <MarketReport />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-5"
      >
        <h2 className="font-bold text-slate-800 mb-3">מחירי נכסים נוכחיים</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-2xl bg-blue-50">
            <div className="text-xs text-slate-500">מדד</div>
            <div className="font-bold text-blue-600">₪{Math.round(state.prices.index).toLocaleString()}</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-orange-50">
            <div className="text-xs text-slate-500">ביטקוין</div>
            <div className="font-bold text-orange-600">₪{Math.round(state.prices.btc).toLocaleString()}</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-purple-50">
            <div className="text-xs text-slate-500">את&apos;ריום</div>
            <div className="font-bold text-purple-600">₪{Math.round(state.prices.eth).toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
          ⚠️ מחירים וירטואליים למטרות לימוד בלבד. אין זה ייעוץ פיננסי אמיתי.
        </div>
      </motion.div>
    </div>
  );
}
