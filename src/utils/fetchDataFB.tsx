import { db } from '@src/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
  where,
} from 'firebase/firestore';

export interface Transaction {
  amount: number;
  timestamp: Timestamp;
}

export interface DailyStat {
  date: string;
  added: number;
  spent: number;
  balance: number;
}

function getDateNDaysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export async function fetchUserSummary(uid: string) {
  const transactions: Transaction[] = [];
  const dailyStatsMap = new Map<string, DailyStat>();

  try {
    // 1. Last 30 transactions
    const txnRef = collection(db, 'users', uid, 'transactions');
    const txnQuery = query(txnRef, orderBy('timestamp', 'desc'), limit(30));
    const txnSnap = await getDocs(txnQuery);
    txnSnap.forEach(doc => {
      const data = doc.data();
      transactions.push({
        amount: data.amount,
        timestamp: data.timestamp,
      });
    });

    // 2. Get all entries from last 30 days
    const thresholdDate = formatDate(getDateNDaysAgo(30));
    const statsRef = collection(db, 'users', uid, 'dailyStats');
    const statsQuery = query(
      statsRef,
      where('date', '>=', thresholdDate),
      orderBy('date', 'asc')
    );
    const statsSnap = await getDocs(statsQuery);
    statsSnap.forEach(doc => {
      const data = doc.data();
      dailyStatsMap.set(data.date, {
        date: data.date,
        added: data.added,
        spent: data.spent,
        balance: data.balance,
      });
    });

    // 3. Fill in missing days, pad to today
    var dailyStats: DailyStat[] = [];
    let lastBalance = 0;

    for (let i = 30; i >= 0; i--) {
      const dateStr = formatDate(getDateNDaysAgo(i));
      const stat = dailyStatsMap.get(dateStr);
      if (stat) {
        lastBalance = stat.balance;
        dailyStats.push(stat);
      } else {
        dailyStats.push({
          date: dateStr,
          added: 0,
          spent: 0,
          balance: lastBalance,
        });
      }
    }

    // 4. latestBalance = today's balance (last in list)
    const latestBalance = dailyStats[dailyStats.length - 1]?.balance ?? 0;
    dailyStats = dailyStats.slice(1); // removes the oldest, keeps last 30


    return {
      transactions,
      dailyStats,
      latestBalance,
    };

  } catch (error) {
    console.error('Error fetching user summary:', error);
    throw error;
  }
}


export function extractStatsAscending(
    dailyStats: DailyStat[]
  ): {
    // dates: string[];
    added: number[];
    spent: number[];
    balance: number[];
  } {
    // Sort by date ASC
    const sorted = [...dailyStats].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  
    const dates: string[] = [];
    const added: number[] = [];
    const spent: number[] = [];
    const balance: number[] = [];
  
    for (const stat of sorted) {
      dates.push(stat.date);
      added.push(stat.added);
      spent.push(stat.spent);
      balance.push(stat.balance);
    }
  
    return { added, spent, balance };
  }
  