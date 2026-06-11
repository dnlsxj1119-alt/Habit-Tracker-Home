import React, { useState, useEffect } from 'react';
import { db, backupToLocalStorage } from '../db/dexie';
import { format } from 'date-fns';
import { Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import './Home.css';

const Home = () => {
  const [habits, setHabits] = useState([]);
  const [records, setRecords] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOptions, setNewOptions] = useState(['']);
  
  const [showOptionModal, setShowOptionModal] = useState(null); // Habit object

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allHabits = await db.habits.toArray();
    setHabits(allHabits);
    
    const todayRecords = await db.records.where('date').equals(today).toArray();
    setRecords(todayRecords);
  };

  const handleAddOptionField = () => {
    setNewOptions([...newOptions, '']);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const handleSaveHabit = async () => {
    if (!newTitle.trim()) return;
    const validOptions = newOptions.filter(o => o.trim() !== '');
    if (validOptions.length === 0) return;

    await db.habits.add({
      id: uuidv4(),
      title: newTitle,
      options: validOptions,
      createdAt: Date.now()
    });
    
    await backupToLocalStorage();
    
    setNewTitle('');
    setNewOptions(['']);
    setShowAddModal(false);
    loadData();
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('이 습관을 삭제하시겠습니까?')) {
      if (window.confirm('정말 삭제하시겠습니까? 관련 기록도 모두 삭제됩니다.')) {
        await db.habits.delete(habitId);
        // Delete related records
        const relatedRecords = await db.records.where('habitId').equals(habitId).toArray();
        const recordIds = relatedRecords.map(r => r.id);
        if (recordIds.length > 0) {
          await db.records.bulkDelete(recordIds);
        }
        await backupToLocalStorage();
        loadData();
      }
    }
  };

  const handleCompleteOption = async (habit, option) => {
    // Check if already completed today
    const existing = records.find(r => r.habitId === habit.id);
    if (existing) {
      // update
      await db.records.update(existing.id, {
        selectedOption: option,
        completedAt: Date.now()
      });
    } else {
      // insert
      await db.records.add({
        id: uuidv4(),
        habitId: habit.id,
        date: today,
        selectedOption: option,
        completedAt: Date.now()
      });
    }
    await backupToLocalStorage();
    setShowOptionModal(null);
    loadData();
  };

  const handleUndoComplete = async (habitId) => {
    const existing = records.find(r => r.habitId === habitId);
    if (existing) {
      await db.records.delete(existing.id);
      await backupToLocalStorage();
      setShowOptionModal(null);
      loadData();
    }
  };

  return (
    <div className="page-container home-page">
      <div className="header">
        <div>
          <p className="date-subtitle">{format(new Date(), 'yyyy년 MM월 dd일')}</p>
          <h1 className="title">오늘의 습관</h1>
        </div>
        <button className="icon-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={24} />
        </button>
      </div>

      <div className="habit-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>등록된 습관이 없습니다.<br/>우측 상단의 + 버튼을 눌러 추가해보세요!</p>
          </div>
        ) : (
          habits.map(habit => {
            const isCompleted = records.find(r => r.habitId === habit.id);
            return (
              <div key={habit.id} className={`card habit-card ${isCompleted ? 'completed' : ''}`} onClick={() => setShowOptionModal(habit)}>
                <div className="habit-info">
                  <h3>{habit.title}</h3>
                  {isCompleted && <p className="completed-option">완료: {isCompleted.selectedOption}</p>}
                </div>
                <div className="habit-status">
                  {isCompleted ? <CheckCircle2 size={28} className="text-success" /> : <Circle size={28} className="text-muted" />}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>새 습관 추가</h2>
            <div className="form-group">
              <label>상위 습관 이름</label>
              <input 
                type="text" 
                placeholder="예) 산업·신문 스터디" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>대체 선택지</label>
              {newOptions.map((opt, i) => (
                <input 
                  key={i}
                  type="text" 
                  placeholder="예) 신문읽기" 
                  value={opt} 
                  onChange={e => handleOptionChange(i, e.target.value)} 
                  className="mb-2"
                />
              ))}
              <button className="text-btn" onClick={handleAddOptionField}>+ 선택지 추가</button>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" style={{flex:1}} onClick={() => setShowAddModal(false)}>취소</button>
              <button className="btn btn-primary" style={{flex:1}} onClick={handleSaveHabit}>저장</button>
            </div>
          </div>
        </div>
      )}

      {/* Option Select Modal */}
      {showOptionModal && (
        <div className="modal-overlay" onClick={() => setShowOptionModal(null)}>
          <div className="modal-content bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-header">
              <h2>어떤 활동을 완료했나요?</h2>
              <p className="sheet-subtitle">{showOptionModal.title}</p>
            </div>
            <div className="option-list">
              {showOptionModal.options.map((opt, i) => {
                const currentRecord = records.find(r => r.habitId === showOptionModal.id);
                const isSelected = currentRecord && currentRecord.selectedOption === opt;
                return (
                  <button 
                    key={i} 
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCompleteOption(showOptionModal, opt)}
                  >
                    {opt}
                    {isSelected && <CheckCircle2 size={20} />}
                  </button>
                )
              })}
            </div>
            <div className="modal-actions mt-4" style={{justifyContent: 'space-between'}}>
              {records.find(r => r.habitId === showOptionModal.id) && (
                <button className="btn btn-danger" style={{width: 'auto'}} onClick={() => handleUndoComplete(showOptionModal.id)}>완료 취소</button>
              )}
              <div style={{display:'flex', gap:'12px', marginLeft: 'auto'}}>
                 <button className="icon-btn" style={{borderColor: 'var(--color-danger)', color: 'var(--color-danger)'}} onClick={() => {
                  setShowOptionModal(null);
                  handleDeleteHabit(showOptionModal.id);
                }}>
                  <Trash2 size={20} />
                </button>
                <button className="btn btn-outline" style={{width: 'auto', marginBottom: 0}} onClick={() => setShowOptionModal(null)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
