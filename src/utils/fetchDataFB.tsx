import { db } from '@src/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';

export const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Health',
  'Education',
  'Shopping',
  'Other',
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

export interface Transaction {
  id: string;
  amount: number;
  description?: string;
  mode: 'UPI' | 'Cash';
  timestamp: Timestamp;
  type: 'Saving' | 'Spent';
  category: TransactionCategory;
  cash?: number;
  upi?: number;
  day: string;
}

export interface DailyStat {
  date: string;
  added: number;
  spent: number;
  balance: number;
  upi: number;
  cash: number;
  upiSpent: number;
  cashSpent: number;
}

function getDateNDaysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export async function fetchUserSummary(
  uid: string,
  options?: { startDate?: string; endDate?: string }
) {
  const dailyStatsMap = new Map<string, DailyStat>();

  try {
    const endDate = options?.endDate ?? formatDate(new Date());
    const startDate =
      options?.startDate ?? formatDate(getDateNDaysAgo(30));
    const totalDays = daysBetween(new Date(startDate), new Date(endDate));

    const statsRef = collection(db, 'users', uid, 'dailyStats');
    const statsQuery = query(
      statsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );
    const statsSnap = await getDocs(statsQuery);
    statsSnap.forEach((doc) => {
      const data = doc.data();
      dailyStatsMap.set(data.date, {
        date: data.date,
        added: data.added,
        spent: data.spent,
        balance: data.balance,
        upi: data.upi,
        cash: data.cash,
        upiSpent: data.upiSpent ?? 0,
        cashSpent: data.cashSpent ?? 0,
      });
    });

    var dailyStats: DailyStat[] = [];
    let lastBalance = 0;
    let lastCash = 0;
    let lastUPI = 0;

    const start = new Date(startDate);
    for (let i = 0; i <= totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = formatDate(d);
      const stat = dailyStatsMap.get(dateStr);
      if (stat) {
        lastBalance = stat.balance;
        lastCash = stat.cash;
        lastUPI = stat.upi;
        dailyStats.push(stat);
      } else {
        dailyStats.push({
          date: dateStr,
          added: 0,
          spent: 0,
          balance: lastBalance,
          upi: lastUPI,
          cash: lastCash,
          upiSpent: 0,
          cashSpent: 0,
        });
      }
    }

    const latestBalance =
      dailyStats[dailyStats.length - 1]?.balance ?? 0;
    const latestCash = dailyStats[dailyStats.length - 1]?.cash ?? 0;
    const latestUPI = dailyStats[dailyStats.length - 1]?.upi ?? 0;
    dailyStats = dailyStats.slice(1);

    return {
      dailyStats,
      latestBalance,
      latestCash,
      latestUPI,
    };
  } catch (error) {
    console.error('Error fetching user summary:', error);
    throw error;
  }
}

export async function transactionDetails(
  uid: string,
  options?: { startDate?: string; endDate?: string }
) {
  const transactions: Transaction[] = [];

  try {
    const txnRef = collection(db, 'users', uid, 'transactions');
    let txnQuery;
    if (options?.startDate || options?.endDate) {
      const constraints: ReturnType<typeof where>[] = [];
      if (options.startDate) {
        const startDoc = await getDoc(
          doc(db, 'users', uid)
        );
        constraints.push(
          where(
            'timestamp',
            '>=',
            Timestamp.fromDate(new Date(options.startDate))
          )
        );
      }
      if (options.endDate) {
        const end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
        constraints.push(
          where('timestamp', '<=', Timestamp.fromDate(end))
        );
      }
      txnQuery = query(
        txnRef,
        ...constraints,
        orderBy('timestamp', 'desc'),
        limit(200)
      );
    } else {
      txnQuery = query(txnRef, orderBy('timestamp', 'desc'), limit(200));
    }

    const txnSnap = await getDocs(txnQuery);
    txnSnap.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        amount: data.amount,
        timestamp: data.timestamp,
        type: data.type,
        mode: data.mode,
        description: data.description || '',
        category: data.category || 'Other',
        day: data.day,
      });
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    throw error;
  }
}

export function extractStatsAscending(dailyStats: DailyStat[]) {
  const sorted = [...dailyStats].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const dates: string[] = [];
  const added: number[] = [];
  const spent: number[] = [];
  const balance: number[] = [];
  const cash: number[] = [];
  const upi: number[] = [];

  for (const stat of sorted) {
    dates.push(stat.date);
    added.push(stat.added);
    spent.push(stat.spent);
    balance.push(stat.balance);
    cash.push(stat.cash);
    upi.push(stat.upi);
  }

  return { added, spent, balance, cash, upi };
}
