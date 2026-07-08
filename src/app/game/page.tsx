"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, PiggyBank, Wallet, Trophy, Calendar, ChevronLeft } from "lucide-react";
import {
  loadGameState,
  saveGameState,
  formatCurrency,
  getNetWorth,
  getTotalInvestments,
  processTurn,
  type GameState,
  type Allocation,
} from "@/lib/game/engine";
import BudgetSlider from "@/components/game/BudgetSlider";
import QuestPanel from "@/components/game/QuestPanel";
import MentorModal from "@/components/game/MentorModal";

export default function Game() {
  const router = useRouter();
  const [state, setState] = useState<GameState | null>(null);
  const [showMentor, setShowMentor] = useState(false);
  const [phase, setPhase] = useState<"budget" | "toast">("budget");

  useEffect(() => {
    const loaded = loadGameState();
    if (!loaded || loaded.isGameOver) {
      router.replace("/");
      return;
    }
    setState(loaded);
    setPhase(loaded.currentFlow ? "toast" : "budget");
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
  const ageDisplay = Math.floor(state.currentAge);
  const monthInYear = Math.round((state.currentAge - ageDisplay) * 12);

  const handleConfirm = (allocation: Allocation) => {
    const newState = processTurn({ ...state }, allocation);
    saveGameState(newState);
    setState(newState);
    setPhase("toast");
  };

  const handleNextMonth = () => {
    setPhase("budget");
  };

  const flow = state.currentFlow;

  const currentIncome = state.inArmy
    ? 1200
    : state.currentAge < 18
    ? state.monthlyIncome * 0.3
    : state.currentAge < 21
    ? state.monthlyIncome
    : state.currentAge < 24
    ? state.monthlyIncome * 1.3
    : state.monthlyIncome * 1.6;

  const currentFixedExpenses = state.inArmy
    ? 200
    : state.currentAge < 18
    ? 600
    : state.currentAge < 21
    ? 1000
    : state.currentAge < 24
    ? 3500
    : 4500;

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white shadow-sm rounded-2xl px-4 py-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <div>
              <div className="text-xs text-slate-400">גיל</div>
              <div className="font-bold text-slate-800 text-sm">
                {ageDisplay} ו-{monthInYear} חודשים
              </div>
            </div>
          </div>
        </div>
        <QuestPanel quests={state.quests} xp={state.xp} badges={state.badges} compact />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-xl shadow-indigo-500/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-indigo-100 text-sm mb-1">שווי נטו כולל</div>
            <div className="text-3xl font-bold">{formatCurrency(netWorth)}</div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-100 text-xs">
              <Wallet className="w-3.5 h-3.5" /> מזומן: {formatCurrency(state.cash)}
            </div>
            <div className="flex items-center gap-1.5 text-indigo-100 text-xs">
              <PiggyBank className="w-3.5 h-3.5" /> חיסכון: {formatCurrency(state.savings)}
            </div>
            <div className="flex items-center gap-1.5 text-indigo-100 text-xs">
              <TrendingUp className="w-3.5 h-3.5" /> השקעות: {formatCurrency(totalInvestments)}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "budget" && (
          <motion.div
            key="budget"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl shadow-lg p-5 space-y-5"
          >
            {state.inArmy && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center text-sm text-green-700 font-medium">
                🎖️ את/ה בשירות צבאי - הכנסה ₪1,200, הוצאות נמוכות. {state.armyMonthsLeft} חודשים לשחרור
              </div>
            )}

            <div className="text-center">
              <h2 className="font-bold text-slate-800 text-lg mb-1">חודש {state.currentMonth + 1}</h2>
              <p className="text-sm text-slate-500">חלק/י את התקציב הפנוי החודש</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">הכנסה חודשית</div>
                <div className="font-bold text-emerald-600">{formatCurrency(currentIncome)}</div>
              </div>
              <div className="bg-rose-50 rounded-2xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">הוצאות קבועות</div>
                <div className="font-bold text-rose-600">{formatCurrency(currentFixedExpenses)}</div>
              </div>
            </div>

            <BudgetSlider availableBudget={currentIncome - currentFixedExpenses} onConfirm={handleConfirm} />
          </motion.div>
        )}

        {phase === "toast" && flow && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {flow.lifeEvent && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`rounded-3xl p-5 text-center shadow-lg ${
                  flow.lifeEvent.type === "income" || flow.lifeEvent.type === "release"
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                    : flow.lifeEvent.type === "army"
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                    : "bg-gradient-to-br from-rose-400 to-red-500 text-white"
                }`}
              >
                <p className="text-lg font-medium">{flow.lifeEvent.description}</p>
                {flow.lifeEvent.amount !== 0 && (
                  <p className="text-2xl font-bold mt-1">
                    {flow.lifeEvent.amount > 0 ? "+" : ""}
                    {formatCurrency(flow.lifeEvent.amount)}
                  </p>
                )}
              </motion.div>
            )}

            <div className="bg-white rounded-3xl shadow-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-800">מה קרה החודש?</h3>
              </div>
              <div className="space-y-2">
                {state.lastToast?.split("\n").map((msg, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-sm text-slate-700 bg-slate-50 rounded-2xl p-3 leading-relaxed"
                  >
                    {msg}
                  </motion.p>
                ))}
              </div>

              {state.badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {state.badges.map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700">{badge.name}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-orange-50 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-500">הוצאה</div>
                <div className="font-bold text-orange-600 text-sm">{formatCurrency(flow.spendAmount)}</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-500">חיסכון</div>
                <div className="font-bold text-emerald-600 text-sm">{formatCurrency(flow.saveAmount)}</div>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-3 text-center">
                <div className="text-[10px] text-slate-500">השקעה</div>
                <div className="font-bold text-indigo-600 text-sm">{formatCurrency(flow.investAmount)}</div>
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              {state.isGameOver ? "ראה תוצאות סופיות" : "חודש הבא"}
              <ChevronLeft className="w-5 h-5" />
            </button>

            {state.isGameOver && (
              <button
                onClick={() => router.push("/results")}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                ראה את &quot;הנקודה&quot; שלך 📊
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <button
          onClick={() => setShowMentor(true)}
          className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          שאל את המנטור
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          דשבורד
        </button>
      </div>

      {showMentor && <MentorModal onClose={() => setShowMentor(false)} />}
    </div>
  );
}
