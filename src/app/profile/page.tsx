"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircle, Briefcase, Target, GraduationCap, Rocket, Award } from "lucide-react";
import { loadGameState, clearGameState, formatCurrency, getNetWorth, type GameState } from "@/lib/game/engine";

const PATH_LABELS: Record<string, string> = {
  army: "צבא",
  national_service: "שירות לאומי",
  civilian: "ישר לעבודה/לימודים",
};

const KNOWLEDGE_LABELS: Record<string, string> = {
  beginner: "מתחיל",
  intermediate: "בינוני",
  advanced: "מתקדם",
};

export default function Profile() {
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
  const dreamProgress = state.dream ? Math.min(100, (netWorth / state.dream.target) * 100) : 0;

  const handleRestart = () => {
    clearGameState();
    router.push("/");
  };

  return (
    <div className="space-y-5 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 text-center"
      >
        <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-3">
          <UserCircle className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold">הפרופיל שלי</h1>
        <p className="text-indigo-100 text-sm mt-1">
          גיל {Math.floor(state.currentAge)} · {state.jobLabel}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center mb-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-xs text-slate-500 mb-0.5">עבודה</div>
          <div className="font-bold text-slate-800 text-sm">{state.jobLabel}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-2">
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-xs text-slate-500 mb-0.5">מסלול</div>
          <div className="font-bold text-slate-800 text-sm">{PATH_LABELS[state.path]}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-xs text-slate-500 mb-0.5">רמת ידע</div>
          <div className="font-bold text-slate-800 text-sm">
            {state.knowledgeLevel ? KNOWLEDGE_LABELS[state.knowledgeLevel] : "-"}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
            <Rocket className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-xs text-slate-500 mb-0.5">הכנסה נוכחית</div>
          <div className="font-bold text-slate-800 text-sm">{formatCurrency(state.monthlyIncome)}</div>
        </div>
      </motion.div>

      {state.dream && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center">
              <Target className="w-4 h-4 text-rose-600" />
            </div>
            <h2 className="font-bold text-slate-800">החלום שלי</h2>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{state.dream.icon}</span>
            <div>
              <div className="font-bold text-slate-800">{state.dream.label}</div>
              <div className="text-xs text-slate-500">יעד: {formatCurrency(state.dream.target)}</div>
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${dreamProgress}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1.5">{dreamProgress.toFixed(0)}% מהיעד</div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl shadow-lg p-5"
      >
        <h2 className="font-bold text-slate-800 mb-3">סיכום פיננסי נוכחי</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between bg-slate-50 rounded-xl px-3 py-2">
            <span className="text-slate-500">שווי נטו</span>
            <span className="font-bold">{formatCurrency(netWorth)}</span>
          </div>
          <div className="flex justify-between bg-slate-50 rounded-xl px-3 py-2">
            <span className="text-slate-500">XP</span>
            <span className="font-bold">{state.xp}</span>
          </div>
          <div className="flex justify-between bg-slate-50 rounded-xl px-3 py-2">
            <span className="text-slate-500">תגים</span>
            <span className="font-bold">{state.badges.length}/6</span>
          </div>
          <div className="flex justify-between bg-slate-50 rounded-xl px-3 py-2">
            <span className="text-slate-500">חודש נוכחי</span>
            <span className="font-bold">{state.currentMonth}</span>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={handleRestart}
        className="w-full py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
      >
        להתחיל פרופיל חדש
      </motion.button>
    </div>
  );
}
