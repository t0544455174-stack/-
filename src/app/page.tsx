"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Rocket, Target, BookOpen, Wallet, Sparkles, GraduationCap, Shield, HandHeart, Briefcase } from "lucide-react";
import { createGameState, saveGameState, type Dream, type LifePath } from "@/lib/game/engine";

const DREAMS: Dream[] = [
  { id: "travel", label: "טיול גדול בעולם", icon: "🌍", target: 30000 },
  { id: "car", label: "קניית רכב", icon: "🚗", target: 80000 },
  { id: "apartment", label: "דירה ראשונה", icon: "🏠", target: 200000 },
  { id: "education", label: "לימודים גבוהים", icon: "🎓", target: 50000 },
  { id: "business", label: "פתיחת עסק", icon: "💼", target: 100000 },
  { id: "tech", label: "מכשירים וגאדג'טים", icon: "📱", target: 20000 },
];

const KNOWLEDGE = [
  { id: "beginner", label: "מתחיל", desc: "אני בקושי יודע/ה מה זה חיסכון" },
  { id: "intermediate", label: "בינוני", desc: "אני יודע/ה קצת על כסף וחיסכון" },
  { id: "advanced", label: "מתקדם", desc: "אני מבין/ה פיננסים די טוב" },
];

const PATHS: { id: LifePath; label: string; desc: string; icon: typeof Shield }[] = [
  { id: "army", label: "צבא", desc: "שכר חייל נמוך, אבל מענק שחרור נאה בסוף השירות", icon: Shield },
  { id: "national_service", label: "שירות לאומי", desc: "מלגה חודשית, שירות קצר יותר ומענק סיום קטן יותר", icon: HandHeart },
  { id: "civilian", label: "ישר לעבודה/לימודים", desc: "בלי הפסקת שירות — ההכנסה עולה לפי גיל כרגיל", icon: Briefcase },
];

function defaultIncomeForAge(age: number): number {
  return 2000 + (age - 16) * 1000;
}

const TOTAL_STEPS = 7;

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState(16);
  const [path, setPath] = useState<LifePath>("army");
  const [dream, setDream] = useState<Dream | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<string | null>(null);
  const [startIncome, setStartIncome] = useState(defaultIncomeForAge(16));
  const [incomeTouched, setIncomeTouched] = useState(false);

  useEffect(() => {
    if (!incomeTouched) setStartIncome(defaultIncomeForAge(age));
  }, [age, incomeTouched]);

  const steps = [
    { title: "ברוכים הבאים לסימולציית החיים!", subtitle: "תלמד/י פיננסים בכיף - בלי סיכון, בלי לחץ" },
    { title: "מה הגיל שלך?", subtitle: "תבחר/י גיל התחלה — המשחק ילווה אותך 10 שנים קדימה, עד גיל " + (age + 10) },
    { title: "מה המסלול שלך?", subtitle: age < 18 ? "זה ישפיע על ההכנסה וההוצאות שלך בשנים הקרובות" : "בגיל הזה השירות כבר מאחוריך — זה רק לצורך הסיפור" },
    { title: "מה החלום שלך?", subtitle: "בחר/י יעד - נראה אם תגיע/י אליו!" },
    { title: "מה רמת הידע שלך?", subtitle: "נתאים את החוויה אליך" },
    { title: "מה ההכנסה החודשית?", subtitle: "ברירת המחדל מותאמת לגיל שבחרת — אפשר לשנות בחופשיות" },
    { title: "מוכנ/ה להתחיל?", subtitle: "הכל מוכן - בוא/י נתחיל לשחק!" },
  ];

  const handleStart = () => {
    const state = createGameState({ age, dream, knowledgeLevel, startIncome, path });
    saveGameState(state);
    router.push("/game");
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <div className="max-w-2xl w-full mx-auto px-4 py-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i <= step ? "w-8 bg-indigo-500" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
          {step > 0 && (
            <button onClick={prev} className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4 rotate-180" />
              חזרה
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-balance">
                {steps[step].title}
              </h1>
              <p className="text-slate-500">{steps[step].subtitle}</p>
            </div>

            {step === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40"
                >
                  <Rocket className="w-12 h-12 text-white" />
                </motion.div>
                <div className="space-y-3 max-w-md">
                  {[
                    { icon: Target, text: "חלוקת תקציב בין הוצאה, חיסכון והשקעה" },
                    { icon: Sparkles, text: "אירועי חיים אקראיים - בונוסים, קנסות, גיוס" },
                    { icon: BookOpen, text: "הסברים פשוטים על ריבית דריבית והשקעות" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-slate-100"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-sm text-slate-700">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="text-xs text-amber-600 bg-amber-50 rounded-xl px-4 py-2 border border-amber-100 max-w-md text-center">
                  ⚠️ כל הכסף במשחק הוא וירטואלי בלבד. אין זה ייעוץ פיננסי אמיתי.
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[16, 17, 18, 19, 20].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={`aspect-square rounded-3xl border-2 font-bold text-2xl transition-all ${
                      age === a
                        ? "border-indigo-500 bg-indigo-500 text-white scale-105 shadow-lg shadow-indigo-500/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {PATHS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPath(p.id)}
                    className={`w-full p-4 rounded-3xl border-2 text-right transition-all flex items-center gap-3 ${
                      path === p.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        path === p.id ? "bg-indigo-500" : "bg-slate-100"
                      }`}
                    >
                      <p.icon className={`w-6 h-6 ${path === p.id ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{p.label}</div>
                      <div className="text-xs text-slate-500">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DREAMS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDream(d)}
                    className={`p-4 rounded-3xl border-2 text-right transition-all flex items-center gap-3 ${
                      dream?.id === d.id
                        ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
                        : "border-slate-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <span className="text-3xl">{d.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800">{d.label}</div>
                      <div className="text-xs text-slate-500">יעד: ₪{d.target.toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                {KNOWLEDGE.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => setKnowledgeLevel(k.id)}
                    className={`w-full p-4 rounded-3xl border-2 text-right transition-all flex items-center gap-3 ${
                      knowledgeLevel === k.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-indigo-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        knowledgeLevel === k.id ? "bg-indigo-500" : "bg-slate-100"
                      }`}
                    >
                      <GraduationCap className={`w-6 h-6 ${knowledgeLevel === k.id ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{k.label}</div>
                      <div className="text-xs text-slate-500">{k.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    ₪{startIncome.toLocaleString()}
                  </div>
                  <div className="text-slate-500 mt-1">לחודש</div>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="15000"
                  step="500"
                  value={startIncome}
                  onChange={(e) => {
                    setIncomeTouched(true);
                    setStartIncome(parseInt(e.target.value));
                  }}
                  className="w-full max-w-md"
                  style={{ accentColor: "#6366f1" }}
                />
                {age < 18 && path !== "civilian" && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wallet className="w-4 h-4" />
                    <span>
                      בגיל 18 {path === "army" ? "תתגייס/י לצבא עם שכר ₪1,200" : "תצא/י לשירות לאומי"}. אחרי זה ההכנסה תעלה.
                    </span>
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 border border-slate-100 max-w-md w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">גיל התחלתי</span>
                    <span className="font-bold text-slate-800">{age}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">מסלול</span>
                    <span className="font-bold text-slate-800">{PATHS.find((p) => p.id === path)?.label}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">חלום</span>
                    <span className="font-bold text-slate-800">
                      {dream?.icon} {dream?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">הכנסה חודשית</span>
                    <span className="font-bold text-slate-800">₪{startIncome.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-xs text-amber-600 bg-amber-50 rounded-xl px-4 py-2 border border-amber-100 max-w-md text-center">
                  ⚠️ כסף וירטואלי בלבד - אין זה ייעוץ פיננסי אמיתי
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6">
          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={next}
              disabled={(step === 3 && !dream) || (step === 4 && !knowledgeLevel)}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              המשך
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              התחל את המשחק!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
