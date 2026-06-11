import React, { useState, useEffect } from 'react';
import { db } from '../db/dexie';
import { BarChart2 } from 'lucide-react';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allRecords = await db.records.toArray();
    const allHabits = await db.habits.toArray();
    
    const hMap = {};
    allHabits.forEach(h => hMap[h.id] = { title: h.title, count: 0, options: {} });

    allRecords.forEach(r => {
      if (hMap[r.habitId]) {
        hMap[r.habitId].count += 1;
        if (!hMap[r.habitId].options[r.selectedOption]) {
          hMap[r.habitId].options[r.selectedOption] = 0;
        }
        hMap[r.habitId].options[r.selectedOption] += 1;
      }
    });

    setStats(Object.values(hMap).sort((a, b) => b.count - a.count));
  };

  return (
    <div className="page-container">
      <div className="header mb-4">
        <h1 className="title">통계</h1>
      </div>

      {stats.length === 0 ? (
        <div className="empty-state">
          <BarChart2 size={40} className="mb-2 text-muted mx-auto" />
          <p>아직 통계 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="stats-list">
          {stats.map((stat, i) => (
            <div key={i} className="card mb-4 stat-card">
              <h3 className="stat-title">{stat.title} <span className="stat-total">{stat.count}회 완료</span></h3>
              <div className="stat-options">
                {Object.entries(stat.options).map(([opt, count]) => (
                  <div key={opt} className="stat-option-row">
                    <span className="stat-opt-name">{opt}</span>
                    <span className="stat-opt-count">{count}회</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Statistics;
