import Dexie from 'dexie';

export const db = new Dexie('HabitTrackerDB');

db.version(1).stores({
  habits: 'id, createdAt', // options are inside the object, not indexed
  records: 'id, habitId, date, completedAt', 
});

// Auto-backup utility: serialize DB to JSON and store in localStorage
export async function backupToLocalStorage() {
  try {
    const habits = await db.habits.toArray();
    const records = await db.records.toArray();
    const backup = JSON.stringify({ habits, records, timestamp: Date.now() });
    localStorage.setItem('habitTrackerBackup', backup);
    console.log('Auto-backup successful');
  } catch (error) {
    console.error('Auto-backup failed:', error);
  }
}

// Restore from localStorage if DB is empty
export async function restoreFromLocalStorageIfEmpty() {
  try {
    const habitCount = await db.habits.count();
    const recordCount = await db.records.count();
    
    if (habitCount === 0 && recordCount === 0) {
      const backupStr = localStorage.getItem('habitTrackerBackup');
      if (backupStr) {
        const backup = JSON.parse(backupStr);
        if (backup.habits && backup.habits.length > 0) {
          await db.habits.bulkAdd(backup.habits);
        }
        if (backup.records && backup.records.length > 0) {
          await db.records.bulkAdd(backup.records);
        }
        console.log('Restored from localStorage backup');
      }
    }
  } catch (error) {
    console.error('Restore failed:', error);
  }
}
