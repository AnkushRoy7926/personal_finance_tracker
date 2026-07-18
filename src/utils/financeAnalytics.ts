import { DailyStat, Transaction } from './fetchDataFB';

export interface DayOfWeekSpending {
  day: string;
  totalSpent: number;
  totalAdded: number;
  txnCount: number;
}

export function computeSpendingByDayOfWeek(
  transactions: Transaction[]
): DayOfWeekSpending[] {
  const dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const map = new Map<
    string,
    { totalSpent: number; totalAdded: number; txnCount: number }
  >();

  for (const d of dayOrder) {
    map.set(d, { totalSpent: 0, totalAdded: 0, txnCount: 0 });
  }

  for (const txn of transactions) {
    const entry = map.get(txn.day) ?? {
      totalSpent: 0,
      totalAdded: 0,
      txnCount: 0,
    };
    if (txn.type === 'Spent') {
      entry.totalSpent += txn.amount;
    } else {
      entry.totalAdded += txn.amount;
    }
    entry.txnCount += 1;
    map.set(txn.day, entry);
  }

  return dayOrder.map((day) => ({
    day: day.slice(0, 3),
    ...map.get(day)!,
  }));
}

export interface MonthComparison {
  currentMonth: {
    label: string;
    totalSpent: number;
    totalAdded: number;
    balance: number;
  };
  previousMonth: {
    label: string;
    totalSpent: number;
    totalAdded: number;
    balance: number;
  };
  change: {
    spentPct: number;
    addedPct: number;
  };
}

export function computeMonthlyComparison(
  stats: DailyStat[]
): MonthComparison | null {
  if (stats.length < 2) return null;

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  let curSpent = 0,
    curAdded = 0,
    prevSpent = 0,
    prevAdded = 0;

  for (const s of stats) {
    const monthPrefix = s.date.slice(0, 7);
    if (monthPrefix === currentMonthStr) {
      curSpent += s.spent;
      curAdded += s.added;
    } else if (monthPrefix === prevMonthStr) {
      prevSpent += s.spent;
      prevAdded += s.added;
    }
  }

  const curLabel = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const prevLabel = prevDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return {
    currentMonth: {
      label: curLabel,
      totalSpent: curSpent,
      totalAdded: curAdded,
      balance: curAdded - curSpent,
    },
    previousMonth: {
      label: prevLabel,
      totalSpent: prevSpent,
      totalAdded: prevAdded,
      balance: prevAdded - prevSpent,
    },
    change: {
      spentPct:
        prevSpent > 0
          ? ((curSpent - prevSpent) / prevSpent) * 100
          : curSpent > 0
            ? 100
            : 0,
      addedPct:
        prevAdded > 0
          ? ((curAdded - prevAdded) / prevAdded) * 100
          : curAdded > 0
            ? 100
            : 0,
    },
  };
}

export interface SpendingVelocity {
  dailyAvg: number;
  weeklyAvg: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendPct: number;
  projectedMonthly: number;
  projectedBalance: number;
  daysUntilZero: number | null;
}

export function computeSpendingVelocity(
  stats: DailyStat[],
  currentBalance: number
): SpendingVelocity | null {
  if (stats.length < 7) return null;

  const sorted = [...stats].sort((a, b) => a.date.localeCompare(b.date));
  const totalSpent = sorted.reduce((s, d) => s + d.spent, 0);
  const dailyAvg = totalSpent / sorted.length;
  const weeklyAvg = dailyAvg * 7;

  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid);
  const secondHalf = sorted.slice(mid);
  const firstAvg =
    firstHalf.reduce((s, d) => s + d.spent, 0) / firstHalf.length;
  const secondAvg =
    secondHalf.reduce((s, d) => s + d.spent, 0) / secondHalf.length;

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  let trendPct = 0;
  if (firstAvg > 0) {
    trendPct = ((secondAvg - firstAvg) / firstAvg) * 100;
    if (trendPct > 10) trend = 'increasing';
    else if (trendPct < -10) trend = 'decreasing';
  }

  const projectedMonthly = dailyAvg * 30;
  const projectedBalance = currentBalance - projectedMonthly;
  const daysUntilZero =
    dailyAvg > 0 ? Math.floor(currentBalance / dailyAvg) : null;

  return {
    dailyAvg,
    weeklyAvg,
    trend,
    trendPct,
    projectedMonthly,
    projectedBalance,
    daysUntilZero,
  };
}

export interface SpendingAnomaly {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  avgAmount: number;
  multiplier: number;
}

export function detectSpendingAnomalies(
  transactions: Transaction[]
): SpendingAnomaly[] {
  const spending = transactions.filter((t) => t.type === 'Spent');
  if (spending.length < 5) return [];

  const avg = spending.reduce((s, t) => s + t.amount, 0) / spending.length;
  const anomalies: SpendingAnomaly[] = [];

  for (const txn of spending) {
    if (avg > 0 && txn.amount > avg * 3) {
      anomalies.push({
        id: txn.id,
        amount: txn.amount,
        description: txn.description || 'No description',
        category: txn.category || 'Other',
        date: txn.timestamp.toDate().toISOString().split('T')[0],
        avgAmount: avg,
        multiplier: txn.amount / avg,
      });
    }
  }

  return anomalies.sort((a, b) => b.multiplier - a.multiplier);
}

export interface RecurringPayment {
  description: string;
  avgAmount: number;
  frequency: string;
  occurrences: number;
  lastDate: string;
  totalSpent: number;
}

export function detectRecurringPayments(
  transactions: Transaction[]
): RecurringPayment[] {
  const spending = transactions.filter(
    (t) => t.type === 'Spent' && t.description
  );

  const descMap = new Map<
    string,
    { amounts: number[]; dates: string[] }
  >();

  for (const txn of spending) {
    const key = txn.description!.trim().toLowerCase();
    const entry = descMap.get(key) ?? { amounts: [], dates: [] };
    entry.amounts.push(txn.amount);
    entry.dates.push(txn.timestamp.toDate().toISOString().split('T')[0]);
    descMap.set(key, entry);
  }

  const recurring: RecurringPayment[] = [];

  for (const [desc, data] of descMap) {
    if (data.amounts.length < 2) continue;

    const avg = data.amounts.reduce((s, a) => s + a, 0) / data.amounts.length;
    const allClose = data.amounts.every(
      (a) => Math.abs(a - avg) / avg < 0.15
    );
    if (!allClose) continue;

    const sortedDates = [...data.dates].sort();
    const intervals: number[] = [];
    for (let i = 1; i < sortedDates.length; i++) {
      const diff =
        (new Date(sortedDates[i]).getTime() -
          new Date(sortedDates[i - 1]).getTime()) /
        86400000;
      intervals.push(diff);
    }

    const avgInterval =
      intervals.reduce((s, i) => s + i, 0) / intervals.length;

    let frequency = 'irregular';
    if (avgInterval >= 25 && avgInterval <= 35) frequency = 'monthly';
    else if (avgInterval >= 6 && avgInterval <= 8) frequency = 'weekly';
    else if (avgInterval >= 85 && avgInterval <= 95) frequency = 'quarterly';

    if (frequency !== 'irregular') {
      recurring.push({
        description:
          desc.charAt(0).toUpperCase() + desc.slice(1),
        avgAmount: Math.round(avg),
        frequency,
        occurrences: data.amounts.length,
        lastDate: sortedDates[sortedDates.length - 1],
        totalSpent: data.amounts.reduce((s, a) => s + a, 0),
      });
    }
  }

  return recurring.sort((a, b) => b.totalSpent - a.totalSpent);
}

export function exportTransactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    'Date',
    'Day',
    'Type',
    'Amount',
    'Mode',
    'Category',
    'Description',
  ];
  const rows = transactions.map((t) => [
    t.timestamp.toDate().toISOString().split('T')[0],
    t.day,
    t.type,
    t.amount.toString(),
    t.mode,
    t.category || 'Other',
    `"${(t.description || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export function computeCategoryBreakdown(
  transactions: Transaction[]
): CategoryBreakdown[] {
  const spending = transactions.filter((t) => t.type === 'Spent');
  if (spending.length === 0) return [];

  const map = new Map<string, { total: number; count: number }>();
  for (const txn of spending) {
    const cat = txn.category || 'Other';
    const entry = map.get(cat) ?? { total: 0, count: 0 };
    entry.total += txn.amount;
    entry.count += 1;
    map.set(cat, entry);
  }

  const totalAll = spending.reduce((s, t) => s + t.amount, 0);
  const result: CategoryBreakdown[] = [];

  for (const [category, data] of map) {
    result.push({
      category,
      total: data.total,
      count: data.count,
      percentage: totalAll > 0 ? (data.total / totalAll) * 100 : 0,
    });
  }

  return result.sort((a, b) => b.total - a.total);
}
