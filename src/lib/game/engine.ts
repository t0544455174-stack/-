export const STORAGE_KEY = "finlit_game_state";
const SAVINGS_INTEREST = 0.003;
const DEBT_INTEREST = 0.015;

export interface Dream {
  id: string;
  label: string;
  icon: string;
  target: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  completed: boolean;
  progress: number;
  target: number;
  type: "savings" | "streak" | "debt" | "crypto" | "networth";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
}

export interface Investments {
  index: number;
  btc: number;
  eth: number;
}

export interface Prices {
  index: number;
  btc: number;
  eth: number;
}

export interface NetWorthPoint {
  month: number;
  age: number;
  netWorth: number;
  cash: number;
  savings: number;
  investments: number;
  noSaveNetWorth: number;
}

export interface LifeEvent {
  description: string;
  amount: number;
  type: string;
}

export interface CashFlowPoint {
  month: number;
  income: number;
  fixedExpenses: number;
  lifeEventAmount: number;
  spendAmount: number;
  saveAmount: number;
  investAmount: number;
  availableBudget: number;
  savingsInterest: number;
  investmentGain: number;
}

export interface CurrentFlow {
  income: number;
  fixedExpenses: number;
  lifeEvent: LifeEvent | null;
  availableBudget: number;
  spendAmount: number;
  saveAmount: number;
  investAmount: number;
  returns: Investments;
  netWorth: number;
  savingsInterest: number;
  investmentGain: number;
  totalInvestments: number;
}

export type LifePath = "army" | "national_service" | "civilian";

export interface GameState {
  startAge: number;
  currentAge: number;
  currentMonth: number;
  dream: Dream | null;
  knowledgeLevel: string | null;
  path: LifePath;
  monthlyIncome: number;
  cash: number;
  savings: number;
  investments: Investments;
  prices: Prices;
  noSaveNetWorth: number;
  netWorthHistory: NetWorthPoint[];
  cashFlowHistory: CashFlowPoint[];
  quests: Quest[];
  xp: number;
  badges: Badge[];
  consecutiveInvestmentMonths: number;
  monthsWithoutDebt: number;
  isGameOver: boolean;
  inArmy: boolean;
  armyMonthsLeft: number;
  armyTriggered: boolean;
  lastToast: string | null;
  currentFlow: CurrentFlow | null;
}

export interface Allocation {
  spending: number;
  saving: number;
  investing: number;
  investmentChoice: "index" | "btc" | "eth" | null;
}

export const INITIAL_QUESTS: Quest[] = [
  { id: "save_5000", name: "חיסכון ראשון", description: "חסוך 5,000 ₪", icon: "piggy-bank", xp: 100, completed: false, progress: 0, target: 5000, type: "savings" },
  { id: "emergency_fund", name: "קרן חירום", description: "בנה קרן חירום של 10,000 ₪", icon: "shield", xp: 200, completed: false, progress: 0, target: 10000, type: "savings" },
  { id: "invest_6_months", name: "משקיע עקבי", description: "השקע 6 חודשים ברצף", icon: "trending-up", xp: 150, completed: false, progress: 0, target: 6, type: "streak" },
  { id: "no_debt_year", name: "נקי מחובות", description: "שנה שלמה בלי חוב", icon: "check-circle", xp: 200, completed: false, progress: 0, target: 12, type: "debt" },
  { id: "invest_crypto", name: "צולל לקריפטו", description: "השקע בקריפטו לראשונה", icon: "bitcoin", xp: 50, completed: false, progress: 0, target: 1, type: "crypto" },
  { id: "reach_50000", name: "יעד 50K", description: "הגע לשווי נטו של 50,000 ₪", icon: "trophy", xp: 300, completed: false, progress: 0, target: 50000, type: "networth" },
];

const LIFE_EVENTS = [
  { id: "phone_break", description: "📱 הטלפון שלך נשבר! צריך לתקן או להחליף", min: 1500, max: 3000, type: "expense" },
  { id: "bonus", description: "🎉 בונוס מהעבודה! קיבלת תוספת למשכורת", min: 1000, max: 3000, type: "income" },
  { id: "car_repair", description: "🚗 הרכב זקוק לתיקון יקר", min: 800, max: 2000, type: "expense" },
  { id: "medical", description: "🏥 הוצאה רפואית בלתי צפויה", min: 400, max: 1500, type: "expense" },
  { id: "gift", description: "🎁 מתנה מבני המשפחה!", min: 500, max: 2000, type: "income" },
  { id: "wedding", description: "💍 חתונה של חבר - מתנה והוצאות", min: 500, max: 1000, type: "expense" },
  { id: "tax_refund", description: "💰 החזר מס מפתיע!", min: 500, max: 1500, type: "income" },
  { id: "course", description: "📚 קורס מקצועי שיכול לקדם אותך", min: 1000, max: 2000, type: "expense" },
  { id: "scholarship", description: "🎓 קיבלת מלגה!", min: 1500, max: 3000, type: "income" },
  { id: "fine", description: "⚠️ קנס תעבורה", min: 250, max: 750, type: "expense" },
];

function gaussianRandom(mean: number, std: number): number {
  const u1 = Math.max(Math.random(), 0.0001);
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * std;
}

function getInvestmentReturns(): Investments {
  return {
    index: gaussianRandom(0.007, 0.04),
    btc: gaussianRandom(0.015, 0.18),
    eth: gaussianRandom(0.015, 0.22),
  };
}

function getFixedExpenses(age: number, inArmy: boolean): number {
  if (inArmy) return 200;
  if (age < 18) return 600;
  if (age < 21) return 1000;
  if (age < 24) return 3500;
  return 4500;
}

function getBaseIncome(age: number, startIncome: number, inArmy: boolean): number {
  if (inArmy) return 1200;
  if (age < 18) return Math.round(startIncome * 0.3);
  if (age < 21) return startIncome;
  if (age < 24) return Math.round(startIncome * 1.3);
  return Math.round(startIncome * 1.6);
}

export function createGameState(profile: {
  age: number;
  dream: Dream | null;
  knowledgeLevel: string | null;
  startIncome: number;
  path: LifePath;
}): GameState {
  const startAge = Math.max(16, Math.min(20, profile.age));
  return {
    startAge,
    currentAge: startAge,
    currentMonth: 0,
    dream: profile.dream,
    knowledgeLevel: profile.knowledgeLevel,
    path: profile.path,
    monthlyIncome: profile.startIncome,
    cash: 0,
    savings: 0,
    investments: { index: 0, btc: 0, eth: 0 },
    prices: { index: 1000, btc: 40000, eth: 2000 },
    noSaveNetWorth: 0,
    netWorthHistory: [
      { month: 0, age: startAge, netWorth: 0, cash: 0, savings: 0, investments: 0, noSaveNetWorth: 0 },
    ],
    cashFlowHistory: [],
    quests: JSON.parse(JSON.stringify(INITIAL_QUESTS)),
    xp: 0,
    badges: [],
    consecutiveInvestmentMonths: 0,
    monthsWithoutDebt: 0,
    isGameOver: false,
    inArmy: false,
    armyMonthsLeft: 0,
    armyTriggered: false,
    lastToast: null,
    currentFlow: null,
  };
}

function generateLifeEvent(state: GameState): LifeEvent | null {
  const serviceStartMonth = Math.ceil((18 - state.startAge) * 12);
  const goesToService = state.path === "army" || state.path === "national_service";

  if (
    goesToService &&
    state.startAge < 18 &&
    state.currentMonth === serviceStartMonth &&
    !state.armyTriggered
  ) {
    state.armyTriggered = true;
    state.inArmy = true;
    if (state.path === "army") {
      state.armyMonthsLeft = 24;
      return { description: "🎖️ גיוס לצבא! שכר חייל: ₪1,200 לחודש, הוצאות נמוכות", amount: 0, type: "army" };
    }
    state.armyMonthsLeft = 12;
    return { description: "🤝 יציאה לשנת שירות לאומי! מלגה חודשית, הוצאות נמוכות", amount: 0, type: "army" };
  }

  if (state.inArmy) {
    state.armyMonthsLeft--;
    if (state.armyMonthsLeft <= 0) {
      state.inArmy = false;
      const grant = state.path === "army" ? 15000 : 5000;
      const label = state.path === "army" ? "שוחררת מהצבא" : "סיימת את השירות הלאומי";
      return {
        description: `🎖️ ${label}! מקבל מענק סיום של ₪${grant.toLocaleString()}`,
        amount: grant,
        type: "release",
      };
    }
  }

  if (Math.random() < 0.4) {
    const event = LIFE_EVENTS[Math.floor(Math.random() * LIFE_EVENTS.length)];
    const amount = event.min + Math.floor(Math.random() * (event.max - event.min + 1));
    return {
      description: event.description,
      amount: event.type === "expense" ? -amount : amount,
      type: event.type,
    };
  }

  return null;
}

export function processTurn(state: GameState, allocation: Allocation): GameState {
  const age = state.currentAge;

  const lifeEvent = generateLifeEvent(state);
  const lifeEventAmount = lifeEvent ? lifeEvent.amount : 0;

  const income = getBaseIncome(age, state.monthlyIncome, state.inArmy);
  const fixedExpenses = getFixedExpenses(age, state.inArmy);
  const availableBudget = income - fixedExpenses + lifeEventAmount;

  let spendAmount = 0,
    saveAmount = 0,
    investAmount = 0;

  if (availableBudget > 0) {
    spendAmount = (availableBudget * allocation.spending) / 100;
    saveAmount = (availableBudget * allocation.saving) / 100;
    investAmount = (availableBudget * allocation.investing) / 100;

    state.cash += spendAmount;
    state.savings += saveAmount;
    if (investAmount > 0 && allocation.investmentChoice) {
      state.investments[allocation.investmentChoice] += investAmount;
      state.consecutiveInvestmentMonths++;
    } else {
      state.consecutiveInvestmentMonths = 0;
    }
  } else {
    state.consecutiveInvestmentMonths = 0;
    const deficit = -availableBudget;
    if (state.cash >= deficit) {
      state.cash -= deficit;
    } else if (state.cash + state.savings >= deficit) {
      const fromCash = state.cash;
      state.cash = 0;
      state.savings -= deficit - fromCash;
    } else {
      const totalAvailable = state.cash + state.savings;
      state.cash = -(deficit - totalAvailable);
      state.savings = 0;
    }
  }

  let savingsInterest = 0;
  if (state.savings > 0) {
    savingsInterest = state.savings * SAVINGS_INTEREST;
    state.savings += savingsInterest;
  }

  if (state.cash < 0) {
    state.cash *= 1 + DEBT_INTEREST;
  }

  const returns = getInvestmentReturns();
  const preInvestments = { ...state.investments };
  (Object.keys(state.investments) as (keyof Investments)[]).forEach((key) => {
    if (state.investments[key] > 0) {
      state.investments[key] *= 1 + returns[key];
    }
    state.prices[key] *= 1 + returns[key];
  });

  const investmentGain = (Object.keys(state.investments) as (keyof Investments)[]).reduce((sum, key) => {
    return sum + (state.investments[key] - preInvestments[key]);
  }, 0);

  if (availableBudget > 0) {
    state.noSaveNetWorth += availableBudget;
    if (state.noSaveNetWorth > 0) state.noSaveNetWorth = 0;
  } else {
    state.noSaveNetWorth += availableBudget;
    if (state.noSaveNetWorth < 0) {
      state.noSaveNetWorth *= 1 + DEBT_INTEREST;
    }
  }

  const totalInvestments = state.investments.index + state.investments.btc + state.investments.eth;
  const netWorth = state.cash + state.savings + totalInvestments;

  state.netWorthHistory.push({
    month: state.currentMonth + 1,
    age: state.startAge + (state.currentMonth + 1) / 12,
    netWorth,
    cash: state.cash,
    savings: state.savings,
    investments: totalInvestments,
    noSaveNetWorth: state.noSaveNetWorth,
  });

  state.cashFlowHistory.push({
    month: state.currentMonth,
    income,
    fixedExpenses,
    lifeEventAmount,
    spendAmount,
    saveAmount,
    investAmount,
    availableBudget,
    savingsInterest,
    investmentGain,
  });

  state.currentFlow = {
    income,
    fixedExpenses,
    lifeEvent,
    availableBudget,
    spendAmount,
    saveAmount,
    investAmount,
    returns,
    netWorth,
    savingsInterest,
    investmentGain,
    totalInvestments,
  };

  if (state.cash >= 0) {
    state.monthsWithoutDebt++;
  } else {
    state.monthsWithoutDebt = 0;
  }

  updateQuests(state, { investAmount, allocation, netWorth });
  state.lastToast = generateToast(state);

  state.currentMonth++;
  state.currentAge = state.startAge + state.currentMonth / 12;

  if (state.currentAge >= state.startAge + 10) {
    state.isGameOver = true;
  }

  return state;
}

function updateQuests(
  state: GameState,
  context: { investAmount: number; allocation: Allocation; netWorth: number }
) {
  const { investAmount, allocation, netWorth } = context;
  state.quests.forEach((quest) => {
    if (quest.completed) return;
    let done = false;
    switch (quest.type) {
      case "savings":
        quest.progress = Math.min(quest.target, state.savings);
        if (state.savings >= quest.target) done = true;
        break;
      case "streak":
        quest.progress = Math.min(quest.target, state.consecutiveInvestmentMonths);
        if (state.consecutiveInvestmentMonths >= quest.target) done = true;
        break;
      case "debt":
        quest.progress = Math.min(quest.target, state.monthsWithoutDebt);
        if (state.monthsWithoutDebt >= quest.target) done = true;
        break;
      case "crypto":
        if (
          allocation &&
          allocation.investmentChoice &&
          (allocation.investmentChoice === "btc" || allocation.investmentChoice === "eth") &&
          investAmount > 0
        ) {
          quest.progress = 1;
          done = true;
        }
        break;
      case "networth":
        quest.progress = Math.min(quest.target, netWorth);
        if (netWorth >= quest.target) done = true;
        break;
    }
    if (done) {
      quest.completed = true;
      state.xp += quest.xp;
      state.badges.push({ id: quest.id, name: quest.name, icon: quest.icon });
    }
  });
}

function generateToast(state: GameState): string {
  const flow = state.currentFlow!;
  const messages: string[] = [];

  if (flow.lifeEvent) {
    messages.push(flow.lifeEvent.description);
  }

  if (flow.savingsInterest > 0) {
    messages.push(`💰 הרווחת ₪${Math.round(flow.savingsInterest)} ריבית על החיסכון! הכסף שלך מרוויח בעצמו.`);
  }

  if (flow.totalInvestments > 0) {
    if (flow.investmentGain > 0) {
      messages.push(`📈 ההשקעות שלך עלו ₪${Math.round(flow.investmentGain)} החודש!`);
    } else if (flow.investmentGain < 0) {
      messages.push(
        `📉 ההשקעות שלך ירדו ₪${Math.abs(Math.round(flow.investmentGain))} החודש. זה טבעי - לטווח ארוך השוק נוטה לעלות.`
      );
    }
  }

  if (state.currentMonth > 0 && (state.currentMonth + 1) % 6 === 0 && state.savings > 1000) {
    messages.push(
      `✨ ריבית דריבית: הריבית שהרווחת נוספה לקרן, וחודש הבא תרוויח ריבית גם עליה! ככה הכסף גדל מהר יותר עם הזמן.`
    );
  }

  if (state.cash < 0) {
    messages.push(`⚠️ אתה בחוב של ₪${Math.abs(Math.round(state.cash))}. החוב גדל מדי חודש בריבית! נסה לחסוך יותר.`);
  }

  if (flow.lifeEvent && flow.lifeEvent.type === "army") {
    messages.push(`בצבא ההוצאות נמוכות, אבל גם ההכנסה. זו הזדמנות מצוינת להתחיל לחסוך!`);
  }

  if (flow.lifeEvent && flow.lifeEvent.type === "release") {
    messages.push(`מענק השחרור הוא סכום נאה! כדאי לחשוב על חיסכון או השקעה חכמה.`);
  }

  if (messages.length === 0) {
    if (flow.availableBudget > 0) {
      messages.push(`חודש רגיל - הרווחת ₪${Math.round(flow.availableBudget)} פנויים. חלקת אותם בין הוצאה, חיסכון והשקעה.`);
    } else {
      messages.push(`החודש ההוצאות עלו על ההכנסה. נסה לחסוך יותר בחודשים הקרובים.`);
    }
  }

  return messages.join("\n");
}

export function saveGameState(state: GameState) {
  if (typeof window === "undefined") return;
  if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  const data = window.localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as GameState;
  } catch {
    return null;
  }
}

export function clearGameState() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded < 0) return `-₪${Math.abs(rounded).toLocaleString("he-IL")}`;
  return `₪${rounded.toLocaleString("he-IL")}`;
}

export function getNetWorth(state: GameState): number {
  return state.cash + state.savings + getTotalInvestments(state);
}

export function getTotalInvestments(state: GameState): number {
  return state.investments.index + state.investments.btc + state.investments.eth;
}
