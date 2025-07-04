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

export interface Transaction {
  id: string, 
  amount: number;
  description?: string;
  mode: 'UPI' | 'Cash';
  timestamp: Timestamp;
  type: 'Saving' | 'Spent'; 
  cash?: number,
  upi?: number,
  day:string
}

export interface DailyStat {
  date: string;
  added: number;
  spent: number;
  balance: number;
  upi: number;
  cash: number;
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

  const dailyStatsMap = new Map<string, DailyStat>();

  try {

    // Get all entries from last 30 days
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
        upi: data.upi,
        cash: data.cash
      });
    });

    // 3. Fill in missing days, pad to today
    var dailyStats: DailyStat[] = [];
    let lastBalance = 0;
    let lastCash = 0;
    let lastUPI = 0;

    for (let i = 30; i >= 0; i--) {
      const dateStr = formatDate(getDateNDaysAgo(i));
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
        });
      }
    }

    // 4. latestBalance = today's balance (last in list)
    const latestBalance = dailyStats[dailyStats.length - 1]?.balance ?? 0;
    const latestCash = dailyStats[dailyStats.length - 1]?.cash ?? 0;
    const latestUPI = dailyStats[dailyStats.length - 1]?.upi ?? 0;
    dailyStats = dailyStats.slice(1); // removes the oldest, keeps last 30

    // const userRef = doc(db, 'users', uid);
    //   const docSnap = await getDoc(userRef);
    
    // if (docSnap.exists()) {
    //   const data = docSnap.data();
    // }
    

    return {
      // transactions,
      dailyStats,
      latestBalance,
      latestCash,
      latestUPI
    };

  } catch (error) {
    console.error('Error fetching user summary:', error);
    throw error;
  }
}

export async function transactionDetails(uid: string) {
  const transactions: Transaction[] = [];

  try {

    // 1. Last 30 transactions
    const txnRef = collection(db, 'users', uid, 'transactions');
    const txnQuery = query(txnRef, orderBy('timestamp', 'desc'), limit(30));
    const txnSnap = await getDocs(txnQuery);
    txnSnap.forEach(doc => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        amount: data.amount,
        timestamp: data.timestamp,
        type: data.type, // 'Saving' or 'Spent'
        mode: data.mode, // 'UPI' or 'Cash'
        description: data.description || '',
        day: data.day
      });
    });

  return transactions;
  }
  catch (error) {
    console.error('Error fetching transaction details:', error);
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
    cash: number[];
    upi: number[];
  } {
    // Sort by date ASC
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
