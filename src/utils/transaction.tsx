// utils/firebaseFunctions.ts

import { db } from '@src/firebaseConfig';
import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';

interface TransactionInput {
  amount: number;
  type: 'Saving' | 'Spent';
  mode: 'UPI' | 'Cash';
  description?: string;
}

/**
 * Atomically adds a transaction and updates that day's stats.
 */
export async function addTransactionAndUpdateStats(
  uid: string,
  { amount, type, mode, description }: TransactionInput
) {
  const userRef = doc(db, 'users', uid);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"

  await runTransaction(db, async (tx) => {
    const statsRef = doc(userRef, 'dailyStats', dateStr);

    // 1) Read (or init) that day’s stats BEFORE any writes
    const statsSnap = await tx.get(statsRef);
    const prev = statsSnap.exists()
      ? statsSnap.data()
      : { added: 0, spent: 0, balance: 0 };

    // 2) Compute new stats
    const added = prev.added + (amount > 0 ? amount : 0);
    const spent = prev.spent + (amount < 0 ? Math.abs(amount) : 0);
    const balance = prev.balance + amount;

    // 3) Now do all your writes
    //   a) Create the new transaction
    const txnRef = doc(collection(userRef, 'transactions'));
    tx.set(txnRef, {
      amount,
      type,
      mode,
      description: description || null,
      timestamp: serverTimestamp(),
    });

    //   b) Update dailyStats
    tx.set(statsRef, { date: dateStr, added, spent, balance });
  });
}


/**
 * Atomically deletes a transaction and updates that day's stats.
 */
export async function deleteTransactionAndUpdateStats(
  uid: string,
  txnId: string
) {
  const userRef = doc(db, 'users', uid);

  await runTransaction(db, async (tx) => {
    const txnRef = doc(userRef, 'transactions', txnId);
    const statsRefBase = collection(userRef, 'dailyStats');

    // 1) Read the transaction
    const txnSnap = await tx.get(txnRef);
    if (!txnSnap.exists()) return;

    const { amount, timestamp } = txnSnap.data() as {
      amount: number;
      timestamp: Timestamp;
    };
    const dateStr = timestamp.toDate().toISOString().split('T')[0];
    const statsRef = doc(statsRefBase, dateStr);

    // 2) Read the day's stats
    const statsSnap = await tx.get(statsRef);
    const prev = statsSnap.exists()
      ? statsSnap.data()
      : { added: 0, spent: 0, balance: 0 };

    // 3) Perform writes
    tx.delete(txnRef);

    const newAdded = Math.max(0, prev.added - (amount > 0 ? amount : 0));
    const newSpent = Math.max(0, prev.spent - (amount < 0 ? Math.abs(amount) : 0));
    const newBalance = prev.balance - amount;

    tx.set(statsRef, {
      date: dateStr,
      added: newAdded,
      spent: newSpent,
      balance: newBalance,
    });
  });
}

