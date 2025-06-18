// firebaseFunctions.ts
import { db } from '@src/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface TransactionInput {
  amount: number;
  type: 'Saving' | 'Spent';
  mode: 'UPI' | 'Cash';
  description?: string;
}

export async function addTransaction(
  uid: string,
  { amount, type, mode, description }: TransactionInput
) {
  const docRef = collection(db, 'users', uid, 'transactions');
  const data = {
    amount,
    type,
    mode,
    timestamp: Timestamp.now(),
    ...(description && { description }),
  };
  await addDoc(docRef, data);
}
