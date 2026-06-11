import React, { useState } from 'react';
import { exportDataToJson, importDataFromJson } from '../db/backup';
import { db } from '../db/dexie';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [importStatus, setImportStatus] = useState('');

  const handleExport = async () => {
    await exportDataToJson();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      await importDataFromJson(file);
      setImportStatus('데이터가 성공적으로 복원되었습니다.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setImportStatus('데이터 복원에 실패했습니다. 잘못된 파일입니다.');
    }
  };

  const handleClearData = async () => {
    if (window.confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      if (window.confirm('다시 한번 확인합니다. 모든 기록과 습관이 영구적으로 삭제됩니다. 계속하시겠습니까?')) {
        await db.habits.clear();
        await db.records.clear();
        localStorage.removeItem('habitTrackerBackup');
        alert('모든 데이터가 삭제되었습니다.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="title">설정</h1>
      
      <div className="card settings-section">
        <h2>데이터 백업 및 복원</h2>
        <p className="settings-desc">데이터 유실을 방지하기 위해 정기적으로 JSON 파일로 백업하세요. 도메인이 변경되거나 기기를 바꿀 때 백업 파일로 복원할 수 있습니다.</p>
        
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={18} />
          <span>JSON 파일로 백업 다운로드</span>
        </button>
        
        <div className="import-wrapper">
          <label className="btn btn-outline">
            <Upload size={18} />
            <span>백업 파일 복원하기 (JSON)</span>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          {importStatus && <p className="status-msg">{importStatus}</p>}
        </div>
      </div>

      <div className="card settings-section danger-zone">
        <h2><AlertTriangle size={20} /> 위험 구역</h2>
        <p className="settings-desc">앱의 모든 습관과 기록 데이터를 영구적으로 삭제합니다.</p>
        <button className="btn btn-danger" onClick={handleClearData}>
          <Trash2 size={18} />
          <span>모든 데이터 초기화</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
