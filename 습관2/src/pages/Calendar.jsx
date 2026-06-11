import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  return (
    <div className="page-container">
      <div className="header mb-4">
        <h1 className="title">달력</h1>
      </div>
      <div className="empty-state">
        <CalendarIcon size={40} className="mb-2 text-muted mx-auto" />
        <p>달력 뷰는 곧 제공될 예정입니다.</p>
        <p className="text-muted" style={{fontSize: '0.85rem', marginTop: '8px'}}>현재는 '기록' 탭에서 일자별 활동을 확인해주세요.</p>
      </div>
    </div>
  );
};
export default Calendar;
