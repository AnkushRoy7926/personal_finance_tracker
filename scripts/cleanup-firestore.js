#!/usr/bin/env node

/**
 * Firestore Cleanup Script
 * 
 * Deletes ALL user data from Firestore (dailyStats, transactions, user docs)
 * and optionally deletes Firebase Auth accounts.
 *
 * USAGE:
 *   1. Download your service account key from Firebase Console:
 *      Project Settings > Service Accounts > Generate New Private Key
 *   2. Save it as ./serviceAccountKey.json (already in .gitignore)
 *   3. Run: node scripts/cleanup-firestore.js [--delete-auth]
 *
 * FLAGS:
 *   --delete-auth    Also delete Firebase Auth user accounts
 *   --dry-run        Preview what would be deleted without actually deleting
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const deleteAuth = args.includes('--delete-auth');
const dryRun = args.includes('--dry-run');

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('ERROR: serviceAccountKey.json not found.');
  console.error('');
  console.error('To get one:');
  console.error('  1. Go to Firebase Console > Project Settings > Service Accounts');
  console.error('  2. Click "Generate New Private Key"');
  console.error('  3. Save the file as serviceAccountKey.json in the project root');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

async function deleteCollection(collRef) {
  const snapshot = await collRef.limit(500).get();
  if (snapshot.empty) return 0;

  const batch = db.batch();
  let count = 0;
  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
    count++;
  }
  await batch.commit();

  // Recurse if there are more
  if (count === 500) {
    return count + await deleteCollection(collRef);
  }
  return count;
}

async function main() {
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE DELETION'}`);
  console.log(`Delete Auth accounts: ${deleteAuth}`);
  console.log('');

  // 1. Get all users
  const usersSnapshot = await db.collection('users').get();
  const userIds = usersSnapshot.docs.map((doc) => doc.id);

  console.log(`Found ${userIds.length} user(s) in Firestore.`);

  let totalDocsDeleted = 0;

  for (const uid of userIds) {
    console.log(`\nUser: ${uid}`);

    // Delete dailyStats subcollection
    const dailyStatsRef = db.collection('users').doc(uid).collection('dailyStats');
    if (dryRun) {
      const dsSnap = await dailyStatsRef.get();
      console.log(`  dailyStats: ${dsSnap.size} documents (skipped)`);
    } else {
      const dsCount = await deleteCollection(dailyStatsRef);
      console.log(`  dailyStats: deleted ${dsCount} documents`);
      totalDocsDeleted += dsCount;
    }

    // Delete transactions subcollection
    const txnsRef = db.collection('users').doc(uid).collection('transactions');
    if (dryRun) {
      const txSnap = await txnsRef.get();
      console.log(`  transactions: ${txSnap.size} documents (skipped)`);
    } else {
      const txCount = await deleteCollection(txnsRef);
      console.log(`  transactions: deleted ${txCount} documents`);
      totalDocsDeleted += txCount;
    }

    // Delete user document itself
    if (dryRun) {
      console.log(`  user doc: skipped`);
    } else {
      await db.collection('users').doc(uid).delete();
      console.log(`  user doc: deleted`);
      totalDocsDeleted++;
    }
  }

  // 2. Delete Auth accounts
  if (deleteAuth) {
    console.log('\n--- Deleting Firebase Auth accounts ---');
    let nextPageToken;
    let authCount = 0;

    do {
      const listResult = await auth.listUsers(100, nextPageToken);
      for (const userRecord of listResult.users) {
        if (dryRun) {
          console.log(`  Auth user ${userRecord.uid} (${userRecord.email || 'no email'}): skipped`);
        } else {
          await auth.deleteUser(userRecord.uid);
          console.log(`  Auth user ${userRecord.uid} (${userRecord.email || 'no email'}): deleted`);
        }
        authCount++;
      }
      nextPageToken = listResult.pageToken;
    } while (nextPageToken);

    console.log(`Total auth accounts: ${authCount}`);
  }

  console.log(`\n${dryRun ? 'DRY RUN complete — no data was deleted.' : `Done. ${totalDocsDeleted} Firestore documents deleted.`}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
