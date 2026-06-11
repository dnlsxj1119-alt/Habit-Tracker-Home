import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import { restoreFromLocalStorageIfEmpty } from './db/dexie';

import Settings from './pages/Settings';

import Home from './pages/Home';
import Calendar from './pages/Calendar';
import History from './pages/History';
import Statistics from './pages/Statistics';

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
