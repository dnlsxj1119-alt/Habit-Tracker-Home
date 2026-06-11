import { db } from './dexie';

export async function exportDataToJson() {
  try {
    const habits = await db.habits.toArray();
    const records = await db.records.toArray();
    
    const data = {
      version: 1,
      timestamp: Date.now(),
      habits,
      records
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
}

export async function importDataFromJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Basic validation
        if (!data.habits || !data.records) {
          throw new Error('Invalid backup file format');
        }
        
        await db.transaction('rw', db.habits, db.records, async () => {
          // Clear existing data
          await db.habits.clear();
          await db.records.clear();
          
          // Import new data
          await db.habits.bulkAdd(data.habits);
          await db.records.bulkAdd(data.records);
        });
        
        resolve(true);
      } catch (error) {
        console.error('Import failed:', error);
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file);
  });
}
