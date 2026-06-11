import React, { useState, useEffect } from 'react';
import { db } from '../db/dexie';
import { format, parseISO, compareDesc } from 'date-fns';
import { ClipboardList } from 'lucide-react';
import './History.css';

const History = () => {
  const [groupedRecords, setGroupedRecords] = useState({});
  const [habitsMap, setHabitsMap] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allRecords = await db.records.toArray();
    const allHabits = await db.habits.toArray();
    
    const hMap = {};
    allHabits.forEach(h => hMap[h.id] = h.title);
    setHabitsMap(hMap);

    // Group records by date
    const grouped = {};
    allRecords.forEach(record => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });

    setGroupedRecords(grouped);
  };

  const sortedDates = Object.keys(groupedRecords).sort((a, b) => compareDesc(parseISO(a), parseISO(b)));

  return (
    <div className="page-container">
      <div className="header mb-4">
        <h1 className="title">기록</h1>
      </div>

      {sortedDates.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={40} className="mb-2 text-muted mx-auto" />
          <p>아직 완료한 습관이 없습니다.</p>
        </div>
      ) : (
        <div className="history-list">
          {sortedDates.map(date => (
            <div key={date} className="history-group card mb-4">
              <h3 className="history-date">{date}</h3>
              <ul className="history-items">
                {groupedRecords[date].map(record => (
                  <li key={record.id} className="history-item">
                    <span className="history-habit">{habitsMap[record.habitId] || '삭제된 습관'}</span>
                    <span className="history-option">{record.selectedOption}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
