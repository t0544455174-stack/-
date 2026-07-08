"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle, BookOpen } from "lucide-react";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,ils&include_24hr_change=true&include_7d_change=true";

interface CoinData {
  usd?: number;
  ils?: number;
  change24h?: number;
  change7d?: number;
}

function ChangeTag({ value }: { value?: number }) {
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

function getLesson(btcChange24h?: number, ethChange24h?: number) {
  const avgChange = ((btcChange24h ?? 0) + (ethChange24h ?? 0)) / 2;
  const absAvg = Math.abs(avgChange);

  if (absAvg > 8) {
    return {
      emoji: "🌊",
      title: "יום תנודתי מאוד",
      text: `השוק זז ב-${absAvg.toFixed(1)}% בממוצע היום - זה הרבה! תנודתיות גבוהה היא הסיכון הכי ברור בקריפטו. במשחק אנחנו מדמים בדיוק את זה - ב-BTC ו-ETH יש סיכוי לרווח גדול, אבל גם להפסד גדול בפרק זמן קצר.`,
    };
  }
  if (avgChange > 3) {
    return {
      emoji: "📈",
      title: "שבוע ירוק לקריפטו",
      text: `מחירי הקריפטו עלו יפה היום. כשהשוק עולה, המשקיעים שהחזיקו מרוויחים. אבל זכרו: עליות כאלה לא מובטחות ולא קבועות. לכן חשוב לפזר - לא לשים הכל בקריפטו אלא גם לחסוך ולהשקיע במדד.`,
    };
  }
  if (avgChange < -3) {
    return {
      emoji: "📉",
      title: "ירידות בשוק הקריפטו",
      text: `מחירי הקריפטו ירדו היום. כשזה קורה בעולם האמיתי, הרבה אנשים נכנסים לפאניקה ומוכרים. אבל משקיעים לטווח ארוך יודעים: ירידות הן חלק מהמשחק. קרן חירום ומדד יציב הם "כרית ביטחון" בדיוק לרגעים כאלה.`,
    };
  }
  return {
    emoji: "😌",
    title: "שוק יחסית רגוע",
    text: `שינויים קטנים הם חלק מהיום-יום בשוק. גם ימים "משעממים" חשובים - הם מזכירים לנו שהשקעה לטווח ארוך היא מרתון, לא ספרינט. ריבית דריבית עובדת לאט ובשקט, בין אם השוק סוער ובין אם לא.`,
  };
}

export default function MarketReport() {
  const [data, setData] = useState<{ btc: CoinData; eth: CoinData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) throw new Error("שגיאת רשת");
      const json = await res.json();
      setData({
        btc: {
          usd: json.bitcoin?.usd,
          ils: json.bitcoin?.ils,
          change24h: json.bitcoin?.usd_24h_change,
          change7d: json.bitcoin?.usd_7d_change,
        },
        eth: {
          usd: json.ethereum?.usd,
          ils: json.ethereum?.ils,
          change24h: json.ethereum?.usd_24h_change,
          change7d: json.ethereum?.usd_7d_change,
        },
      });
      setFetchedAt(new Date());
    } catch {
      setError("לא הצלחנו לטעון נתוני שוק. בדוק חיבור לאינטרנט.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lesson = data ? getLesson(data.btc.change24h, data.eth.change24h) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-white rounded-3xl shadow-lg p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">דוח שוק</h2>
            <p className="text-[11px] text-slate-400">נתונים אמיתיים לצורך לימוד</p>
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
          <div className="w-5 h-5 border-2 border-slate-200 border-t-sky-400 rounded-full animate-spin" />
          <span className="text-sm">טוען נתוני שוק...</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-6 text-sm text-rose-500 bg-rose-50 rounded-2xl">{error}</div>
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">₿</span>
                <span className="font-bold text-slate-800 text-sm">ביטקוין</span>
              </div>
              <div className="text-xl font-bold text-orange-600">
                ${data.btc.usd?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
              {data.btc.ils && (
                <div className="text-xs text-slate-500">
                  ₪{data.btc.ils?.toLocaleString("he-IL", { maximumFractionDigits: 0 })}
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                <div className="text-[10px] text-slate-400">24 שעות:</div>
                <ChangeTag value={data.btc.change24h} />
              </div>
              {data.btc.change7d != null && (
                <div className="flex gap-1.5 flex-wrap">
                  <div className="text-[10px] text-slate-400">7 ימים:</div>
                  <ChangeTag value={data.btc.change7d} />
                </div>
              )}
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">Ξ</span>
                <span className="font-bold text-slate-800 text-sm">את&apos;ריום</span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                ${data.eth.usd?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </div>
              {data.eth.ils && (
                <div className="text-xs text-slate-500">
                  ₪{data.eth.ils?.toLocaleString("he-IL", { maximumFractionDigits: 0 })}
                </div>
              )}
              <div className="flex gap-1.5 flex-wrap">
                <div className="text-[10px] text-slate-400">24 שעות:</div>
                <ChangeTag value={data.eth.change24h} />
              </div>
              {data.eth.change7d != null && (
                <div className="flex gap-1.5 flex-wrap">
                  <div className="text-[10px] text-slate-400">7 ימים:</div>
                  <ChangeTag value={data.eth.change7d} />
                </div>
              )}
            </div>
          </div>

          {lesson && (
            <div className="bg-indigo-50 rounded-2xl p-4 space-y-1.5 border border-indigo-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="font-semibold text-indigo-800 text-sm">
                  {lesson.emoji} {lesson.title}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{lesson.text}</p>
            </div>
          )}

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-3 py-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-snug">
              <strong>מידע חינוכי בלבד</strong> — הנתונים האלה הם אמיתיים, אבל הם לא ייעוץ השקעות. אל
              תקבל/י החלטות פיננסיות אמיתיות על בסיס מה שאתה/את לומד/ת במשחק.
            </p>
          </div>

          {fetchedAt && (
            <div className="text-[10px] text-slate-400 text-center">
              עודכן: {fetchedAt.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })} · מקור: CoinGecko
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
