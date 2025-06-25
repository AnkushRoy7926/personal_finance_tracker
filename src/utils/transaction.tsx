import { db } from '@src/firebaseConfig';
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

interface TransactionInput {
  amount: number;
  type: 'Saving' | 'Spent';
  mode: 'UPI' | 'Cash';
  description?: string;
  day: string;

}


/**
 * Atomically adds a transaction and updates that day's stats and user summary.
 */
export async function addTransactionAndUpdateStats(
  uid: string,
  { amount, type, mode, description }: TransactionInput
) {
  const userRef = doc(db, 'users', uid);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

  await runTransaction(db, async (tx) => {
    // 1) Read user document
    const userSnap = await tx.get(userRef);
    const rawUser = userSnap.exists() ? userSnap.data() : {};

    const userData = {
      totalBalance: rawUser.totalBalance ?? 0,
      upi: rawUser.upi ?? 0,
      cash: rawUser.cash ?? 0,
    };

    // 2) Read that day’s stats BEFORE any writes
    const statsRef = doc(userRef, 'dailyStats', dateStr);
    const statsSnap = await tx.get(statsRef);
    const rawStats = statsSnap.exists() ? statsSnap.data() : {};

    const prev = {
      added: rawStats.added ?? 0,
      spent: rawStats.spent ?? 0,
      balance: rawStats.balance ?? 0,
      upi: rawStats.upi ?? 0,
      cash: rawStats.cash ?? 0,
    };

    // 3) Compute new values
    const newTotalBalance = userData.totalBalance + amount;
    const newUPI = mode === 'UPI' ? userData.upi + amount : userData.upi;
    const newCash = mode === 'Cash' ? userData.cash + amount : userData.cash;

    const added = prev.added + (amount > 0 ? amount : 0);
    const spent = prev.spent + (amount < 0 ? Math.abs(amount) : 0);
    // const balance = prev.balance + amount;
    // const newDailyUPI = mode === 'UPI' ? prev.upi + amount : prev.upi;
    // const newDailyCash = mode === 'Cash' ? prev.cash + amount : prev.cash;

    // 4) Perform writes
    tx.update(userRef, {
      totalBalance: newTotalBalance,
      upi: newUPI,
      cash: newCash,
    });

    const txnRef = doc(collection(userRef, 'transactions'));
    tx.set(txnRef, {
      amount: Math.abs(amount),
      type,
      mode,
      description: description || null,
      day: now.toLocaleDateString('en-US', { weekday: 'long' }), 
      timestamp: serverTimestamp(),
    });

    tx.set(statsRef, {
      date: dateStr,
      added,
      spent,
      balance: newTotalBalance,
      upi: newUPI,
      cash: newCash,
    });
  });
}

/**
 * Atomically deletes a transaction and updates that day's stats and user summary.
 */
export async function deleteTransactionAndUpdateStats(
  uid: string,
  txnId: string
) {
  const userRef = doc(db, 'users', uid);
  const txnRef = doc(userRef, 'transactions', txnId);

  await runTransaction(db, async (tx) => {
    // 1) Read the transaction
    const txnSnap = await tx.get(txnRef);
    if (!txnSnap.exists()) return;

    let { amount, timestamp, mode, type } = txnSnap.data() as {
      amount: number;
      timestamp: Timestamp;
      mode: 'UPI' | 'Cash';
      type: 'Saving' | 'Spent';
    };

    if (type === 'Spent') {
      amount = -Math.abs(amount); // Ensure spent amounts are negative
    } else {
      amount = Math.abs(amount); // Saving amounts are positive
    }

    const dateStr = timestamp.toDate().toISOString().split('T')[0];
    const statsRef = doc(userRef, 'dailyStats', dateStr);

    // 2) Read stats and user data
    const statsSnap = await tx.get(statsRef);
    const rawStats = statsSnap.exists() ? statsSnap.data() : {};

    const prevStats = {
      added: rawStats.added ?? 0,
      spent: rawStats.spent ?? 0,
      balance: rawStats.balance ?? 0,
      upi: rawStats.upi ?? 0,
      cash: rawStats.cash ?? 0,
    };

    const userSnap = await tx.get(userRef);
    const rawUser = userSnap.exists() ? userSnap.data() : {};

    const userData = {
      totalBalance: rawUser.totalBalance ?? 0,
      upi: rawUser.upi ?? 0,
      cash: rawUser.cash ?? 0,
    };

    // 3) Delete transaction
    tx.delete(txnRef);

    // 4) Update stats
    const newAdded = Math.max(0, prevStats.added - (amount > 0 ? amount : 0));
    const newSpent = Math.max(0, prevStats.spent - (amount < 0 ? Math.abs(amount) : 0));
    const newBalance = prevStats.balance - amount;
    const newDailyUPI = mode === 'UPI' ? prevStats.upi - amount : prevStats.upi;
    const newDailyCash = mode === 'Cash' ? prevStats.cash - amount : prevStats.cash;

    tx.set(statsRef, {
      date: dateStr,
      added: newAdded,
      spent: newSpent,
      balance: newBalance,
      upi: newDailyUPI,
      cash: newDailyCash,
    });

    // 5) Update user-level fields
    const newTotalBalance = userData.totalBalance - amount;
    const newUserUPI = mode === 'UPI' ? userData.upi - amount : userData.upi;
    const newUserCash = mode === 'Cash' ? userData.cash - amount : userData.cash;

    tx.update(userRef, {
      totalBalance: newTotalBalance,
      upi: newUserUPI,
      cash: newUserCash,
    });
  });
}
