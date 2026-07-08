"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, Landmark, BookOpen } from "lucide-react";

interface IndexQuote {
  price: number | null;
  previousClose: number | null;
  changePct: number | null;
}

interface IndicesResponse {
  ta125: IndexQuote;
  ta90: IndexQuote;
  banks5: IndexQuote;
}

const LABELS: Record<keyof IndicesResponse, string> = {
  ta125: 'ת"א 125',
  ta90: 'ת"א 90',
  banks5: "מדד הבנקים (5)",
};

function ChangeTag({ value }: { value: number | null }) {
  if (value == null) return null;
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
      }`}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

export default function IsraeliIndicesReport() {
  const [data, setData] = useState<IndicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/il-indices");
      if (!res.ok) throw new Error("שגיאת רשת");
      const json = (await res.json()) as IndicesResponse;
      setData(json);
      setFetchedAt(new Date());
    } catch {
      setError("לא הצלחנו לטעון את מדדי הבורסה. נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.58 }}
      className="bg-white rounded-3xl shadow-lg p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">הבורסה בתל אביב</h2>
            <p className="text-[11px] text-slate-400">מדדים ישראליים אמיתיים בזמן אמת</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-400 rounded-full animate-spin" />
          <span className="text-sm">טוען נתוני בורסה...</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-6 text-sm text-rose-500 bg-rose-50 rounded-2xl">{error}</div>
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(LABELS) as (keyof IndicesResponse)[]).map((key) => {
              const q = data[key];
              return (
                <div key={key} className="bg-blue-50 rounded-2xl p-3 space-y-1.5 text-center">
                  <div className="text-xs font-bold text-slate-700">{LABELS[key]}</div>
                  <div className="text-lg font-bold text-blue-700">
                    {q.price != null ? q.price.toLocaleString("he-IL", { maximumFractionDigits: 0 }) : "—"}
                  </div>
                  <ChangeTag value={q.changePct} />
                </div>
              );
            })}
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4 space-y-1.5 border border-indigo-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="font-semibold text-indigo-800 text-sm">איך זה קשור למשחק?</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              כשאתה בוחר להשקיע ב&quot;מדד&quot; במשחק, זה בדיוק מדדים כאלה — סל של המניות הגדולות בבורסה הישראלית.
              ת&quot;א 125 הוא המדד הרחב ביותר, ומדד הבנקים עוקב רק אחרי חמשת הבנקים הגדולים. ההבדל בין 3 המדדים
              מראה למה &quot;פיזור&quot; חשוב: ככל שסל ההשקעה רחב יותר, סיכון הריכוז בענף בודד קטן יותר.
            </p>
          </div>

          {fetchedAt && (
            <div className="text-[10px] text-slate-400 text-center">
              עודכן: {fetchedAt.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })} · מקור: Yahoo
              Finance / הבורסה לניירות ערך בתל אביב
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
