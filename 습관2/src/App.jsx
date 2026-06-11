import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import { restoreFromLocalStorageIfEmpty } from './db/dexie';

import Settings from './pages/Settings';

// Placeholders for pages
const Home = () => <div className="page-container"><h1 className="title">홈</h1><div className="card">오늘의 습관을 체크하세요.</div></div>;
const Calendar = () => <div className="page-container"><h1 className="title">달력</h1><div className="card">날짜별 완료 기록입니다.</div></div>;
const History = () => <div className="page-container"><h1 className="title">기록</h1><div className="card">수행한 활동 내역입니다.</div></div>;
const Statistics = () => <div className="page-container"><h1 className="title">통계</h1><div className="card">완료 횟수 및 통계입니다.</div></div>;

function App() {
  useEffect(() => {
    // Attempt to restore data if DB is completely empty on app start
    restoreFromLocalStorageIfEmpty();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/history" element={<History />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
