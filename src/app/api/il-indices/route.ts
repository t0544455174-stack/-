import { NextResponse } from "next/server";

const SYMBOLS = {
  ta125: "%5ETA125.TA",
  ta90: "TA90.TA",
  banks5: "TA-BANKS.TA",
} as const;

type SymbolKey = keyof typeof SYMBOLS;

interface IndexQuote {
  price: number | null;
  previousClose: number | null;
  changePct: number | null;
}

async function fetchYahooChart(symbol: string): Promise<IndexQuote> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`Yahoo fetch failed for ${symbol}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  const price: number | null = meta?.regularMarketPrice ?? null;
  const previousClose: number | null = meta?.chartPreviousClose ?? meta?.previousClose ?? null;
  const changePct = price != null && previousClose ? ((price - previousClose) / previousClose) * 100 : null;
  return { price, previousClose, changePct };
}

export async function GET() {
  try {
    const entries = await Promise.all(
      (Object.keys(SYMBOLS) as SymbolKey[]).map(async (key) => {
        try {
          const quote = await fetchYahooChart(SYMBOLS[key]);
          return [key, quote] as const;
        } catch {
          return [key, { price: null, previousClose: null, changePct: null }] as const;
        }
      })
    );
    const data = Object.fromEntries(entries);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "failed to fetch Israeli indices" }, { status: 502 });
  }
}
