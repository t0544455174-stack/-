"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

const QUESTIONS = [
  { id: "q1", text: "למה הכסף שלי ירד?" },
  { id: "q2", text: "מה זו ריבית דריבית?" },
  { id: "q3", text: "מה עדיף - לחסוך או להשקיע?" },
  { id: "q4", text: "איך בונים תקציב?" },
  { id: "q5", text: "מה זה מדד (אינדקס)?" },
];

const PRESET_ANSWERS: Record<string, string> = {
  q1: "השווי שלך יכול לרדת מכמה סיבות: הוצאות גבוהות, אירוע חיים יקר, או ירידה בערך ההשקעות. השקעות כמו קריפטו ומניות עולות ויורדות כל הזמן - זה טבעי! המפתח הוא חשיבה לטווח ארוך. אל תיכנס לפאניקה מירידות קצרות.",
  q2: "ריבית דריבית זה כשאתה מרוויח ריבית על הכסף שלך, ואז גם על הריבית שהרווחת. לדוגמה: 1,000 ₪ ב-3% ריבית שנתית → 1,030 ₪ בסוף שנה. בשנה הבאה אתה מרוויח 3% על 1,030 ₪ - כלומר יותר! ככה הכסף גדל מהר יותר ויותר עם הזמן. ככל שמתחילים מוקדם יותר - הרווח גדול יותר.",
  q3: "זה תלוי במטרות שלך! חיסכון בבנק בטוח יותר אבל הריבית נמוכה. השקעה במדד או מניות יכולה להניב תשואה גבוהה יותר לטווח ארוך, אבל יש סיכון שהערך ירד בטווח הקצר. המלצה: קודם בנה קרן חירום (3-6 חודשי הוצאות) בחיסכון בטוח, ורק אז התחל להשקיע.",
  q4: 'כלל אצבע פופולרי הוא 50-30-20: 50% מההכנסה לצרכים בסיסיים (שכר דירה, אוכל, תחבורה), 30% לרצונות (בילויים, מסעדות), ו-20% לחיסכון והשקעה. במשחק אתה מחלק את התקציב הפנוי - מה שנשאר אחרי הוצאות קבועות. ככל שתחסוך יותר עכשיו, יהיה לך יותר כסף בעתיד!',
  q5: 'מדד (כמו S&P 500 או ת"א 125) זה אוסף של מניות של החברות הגדולות בשוק. כשאתה משקיע במדד, אתה בעצם משקיע בכל החברות האלה ביחד. היתרון: פיזור - אם חברה אחת נופלת, אחרות יכולות לעלות ולאזן. זה נחשב לדרך בטוחה יחסית להשקיע לטווח ארוך.',
};

export default function MentorModal({ onClose }: { onClose: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [selectedQ, setSelectedQ] = useState<string | null>(null);

  const handleQuestion = (q: { id: string; text: string }) => {
    setSelectedQ(q.id);
    setAnswer(PRESET_ANSWERS[q.id]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">המנטור הפיננסי</h3>
              <p className="text-xs text-slate-400">שאל אותי כל שאלה</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => handleQuestion(q)}
              className={`w-full text-right p-3 rounded-2xl border-2 transition-all text-sm font-medium ${
                selectedQ === q.id
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              {q.text}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100"
            >
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed">{answer}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-indigo-100">
                <p className="text-[11px] text-amber-600">⚠️ כסף וירטואלי בלבד - אין זה ייעוץ פיננסי אמיתי</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
