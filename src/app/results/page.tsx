"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award, Target, Rocket, Sparkles } from "lucide-react";
import { loadGameState, clearGameState, formatCurrency, getNetWorth, type GameState } from "@/lib/game/engine";
import NetWorthChart from "@/components/charts/NetWorthChart";
import QuestPanel from "@/components/game/QuestPanel";

export default function Results() {
  const router = useRouter();
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    const loaded = loadGameState();
    if (!loaded || !loaded.isGameOver) {
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
  const noSaveNetWorth = state.noSaveNetWorth;
  const difference = netWorth - noSaveNetWorth;
  const dreamReached = state.dream && netWorth >= state.dream.target;

  const handleRestart = () => {
    clearGameState();
    router.push("/");
  };

  return (
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">הנקודה</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          עברת 10 שנים מגיל {state.startAge} עד {state.startAge + 10}. הנה מה שהיה לך...
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-indigo-100 text-sm mb-1">השווי שלך</div>
            <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
          </div>
          <div className="text-center">
            <div className="text-indigo-100 text-sm mb-1">אם היית מבזבז הכל</div>
            <div className="text-2xl font-bold">{formatCurrency(noSaveNetWorth)}</div>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
          <div className="text-indigo-100 text-sm mb-1">ההפרש בזכות חיסכון והשקעה</div>
          <div className="text-3xl font-bold text-white">{formatCurrency(difference)}</div>
        </div>
      </motion.div>

      {state.dream && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-3xl p-5 text-center shadow-lg ${
            dreamReached ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white" : "bg-white border-2 border-dashed border-slate-200"
          }`}
        >
          <div className="text-3xl mb-2">{state.dream.icon}</div>
          <div className="font-bold text-lg mb-1">{dreamReached ? "הגשמת את החלום! 🎉" : "לא הגעת לחלום הפעם"}</div>
          <div className={`text-sm ${dreamReached ? "text-emerald-50" : "text-slate-500"}`}>
            {state.dream.label} - יעד: {formatCurrency(state.dream.target)}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-slate-800">אתה מול תרחיש בלי חיסכון</h2>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          הקו הכחול זה השווי שלך עם חיסכון והשקעה. הקו האדום זה מה היה קורה אם היית מוציא הכל.
        </p>
        <NetWorthChart data={state.netWorthHistory} showNoSave />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl shadow-lg p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="font-bold text-slate-800">הישגים</h2>
          <div className="mr-auto flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-purple-600">{state.xp} XP</span>
          </div>
        </div>
        <QuestPanel quests={state.quests} xp={state.xp} badges={state.badges} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border border-amber-100"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 mb-1">מה למדנו?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {difference > 0
                ? `חסכת ${formatCurrency(difference)} יותר ממי שהוציא הכל! זה כוח הריבית דריבית - ככל שחוסכים מוקדם יותר ומשאירים את הכסף יותר זמן, הוא גדל מהר יותר. התחלת בגיל ${state.startAge} ובנית ${formatCurrency(netWorth)} - דמיין מה היה קורה אם היית חוסך עוד יותר!`
                : "הפעם לא הצלחת לחסוך יותר ממי שבזבז הכל. אבל למדת המון! נסה שוב - בכל פעם תשחק טוב יותר ותבין יותר איך כסף עובד."}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        onClick={handleRestart}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
      >
        <Rocket className="w-5 h-5" />
        שחק שוב
      </motion.button>
    </div>
  );
}
