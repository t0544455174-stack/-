"use client";

import { motion } from "framer-motion";
import { PiggyBank, Shield, TrendingUp, CheckCircle, Bitcoin, Trophy, Award } from "lucide-react";
import type { Quest, Badge } from "@/lib/game/engine";

const ICONS: Record<string, typeof PiggyBank> = {
  "piggy-bank": PiggyBank,
  shield: Shield,
  "trending-up": TrendingUp,
  "check-circle": CheckCircle,
  bitcoin: Bitcoin,
  trophy: Trophy,
};

export default function QuestPanel({
  quests,
  xp,
  badges,
  compact,
}: {
  quests: Quest[];
  xp: number;
  badges: Badge[];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl">
          <Award className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-purple-600">{xp} XP</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-600">{badges.length}/6</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">משימות ותגים</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-xl">
            <Award className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-bold text-purple-600">{xp} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quests.map((quest, i) => {
          const Icon = ICONS[quest.icon] || CheckCircle;
          const pct = Math.min(100, (quest.progress / quest.target) * 100);
          return (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                quest.completed ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    quest.completed ? "bg-emerald-500" : "bg-slate-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${quest.completed ? "text-white" : "text-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">{quest.name}</span>
                    {quest.completed && <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{quest.description}</p>
                  {!quest.completed && (
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Math.round(quest.progress).toLocaleString()} / {quest.target.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {quest.completed && (
                    <div className="text-xs text-emerald-600 font-medium">+{quest.xp} XP ✓</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
