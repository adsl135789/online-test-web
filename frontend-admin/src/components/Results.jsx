import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://54.174.181.192:5000';

// const API_BASE_URL = 'http://localhost:5000'; // 本地開發環境

const Results = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const sessionsPerPage = 10;

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/test-sessions`);
      const data = await response.json();
      if (response.ok) {
        setSessions(data.sessions);
        setTotalSessions(data.total_sessions);
      }
    } catch (error) {
      console.error('獲取測試紀錄失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '未完成';
    return new Date(dateString).toLocaleString('zh-TW');
  };

  const formatAccuracy = (accuracy) => {
    if (accuracy === null || accuracy === undefined) return 'N/A';
    return `${(accuracy * 100).toFixed(1)}%`;
  };

  const formatReactionTime = (time) => {
    if (!time) return 'N/A';
    return `${time}ms`;
  };

  // 分頁邏輯
  const totalPages = Math.ceil(totalSessions / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const currentSessions = sessions.slice(startIndex, endIndex);

  // 勾選邏輯
  const handleSelectSession = (sessionId) => {
    const newSelected = new Set(selectedSessions);
    if (newSelected.has(sessionId)) {
      newSelected.delete(sessionId);
    } else {
      newSelected.add(sessionId);
    }
    setSelectedSessions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSessions.size === currentSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(currentSessions.map(s => s.id)));
    }
  };

  // 批量刪除
  const handleBatchDelete = async () => {
    if (selectedSessions.size === 0) {
      alert('請先選擇要刪除的測試紀錄');
      return;
    }

    if (!confirm(`確定要刪除 ${selectedSessions.size} 個測驗紀錄嗎？`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/test-sessions/batch-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_ids: Array.from(selectedSessions)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedSessions(new Set());
        fetchSessions(); // 重新加載數據
      } else {
        alert(data.error || '刪除失敗');
      }
    } catch (error) {
      console.error('刪除失敗:', error);
      alert('刪除失敗');
    }
  };

  // CSV下載
  const handleDownloadCSV = async () => {
    if (selectedSessions.size === 0) {
      alert('請先選擇要下載的測驗紀錄');
      return;
    }

    try {
      // 獲取選中紀錄的完整數據
      const selectedData = sessions.filter(s => selectedSessions.has(s.id));
      
      // 準備CSV數據
      const csvRows = [];
      
      // 輔助函數：處理包含逗點的文字
      const sanitizeForCSV = (value) => {
        if (value === null || value === undefined) return '';
        return String(value).replace(/,/g, ' '); // 將逗點替換為空白符號
      };
      
      // CSV標題行 - 包含八個方向的詳細欄位
      const headers = [
        'Session ID', 'Question ID', 'Tester Name', 'Age Group', 'Gender', 
        'Education', 'Vision Status', 'Injury Age', 'Braille Ability', 
        'Mobility Ability', 'Drawing Frequency', 'Museum Experience',
        'Overall Accuracy', 'Average Reaction Time', 'Finished At',
        // UP方向
        'UP User Answer', 'UP Correct Answer', 'UP Is Correct', 'UP Reaction Time',
        // DOWN方向
        'DOWN User Answer', 'DOWN Correct Answer', 'DOWN Is Correct', 'DOWN Reaction Time',
        // LEFT方向
        'LEFT User Answer', 'LEFT Correct Answer', 'LEFT Is Correct', 'LEFT Reaction Time',
        // RIGHT方向
        'RIGHT User Answer', 'RIGHT Correct Answer', 'RIGHT Is Correct', 'RIGHT Reaction Time',
        // NE方向
        'NE User Answer', 'NE Correct Answer', 'NE Is Correct', 'NE Reaction Time',
        // NW方向
        'NW User Answer', 'NW Correct Answer', 'NW Is Correct', 'NW Reaction Time',
        // SE方向
        'SE User Answer', 'SE Correct Answer', 'SE Is Correct', 'SE Reaction Time',
        // SW方向
        'SW User Answer', 'SW Correct Answer', 'SW Is Correct', 'SW Reaction Time'
      ];
      csvRows.push(headers.join(','));

      // 為每個選中的紀錄添加一行
      selectedData.forEach(session => {
        const baseInfo = [
          session.id,
          session.question_id,
          sanitizeForCSV(session.tester_name),
          sanitizeForCSV(session.tester_age_group),
          sanitizeForCSV(session.tester_gender),
          sanitizeForCSV(session.tester_education),
          sanitizeForCSV(session.tester_vision_status),
          sanitizeForCSV(session.tester_injury_age),
          sanitizeForCSV(session.tester_braille_ability),
          sanitizeForCSV(session.tester_mobility_ability),
          sanitizeForCSV(session.tester_drawing_frequency),
          sanitizeForCSV(session.tester_museum_experience),
          session.overall_accuracy ? session.overall_accuracy.toFixed(2) : '',
          session.average_reaction_time,
          sanitizeForCSV(session.finished_at)
        ];

        // 準備八個方向的資料
        const directions = ['up', 'down', 'left', 'right', 'ne', 'nw', 'se', 'sw'];
        const directionsData = [];
        
        directions.forEach(direction => {
          const response = session.responses?.[direction];
          if (response) {
            directionsData.push(
              sanitizeForCSV(response.user_answer),
              sanitizeForCSV(response.correct_answer),
              response.is_correct,
              response.reaction_time_ms || ''
            );
          } else {
            // 如果沒有該方向的資料，填入空值
            directionsData.push('', '', '', '');
          }
        });

        // 組合成一行
        const row = [...baseInfo, ...directionsData];
        csvRows.push(row.join(','));
      });

      // 創建並下載CSV文件
      const csvContent = csvRows.join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `test_sessions_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('下載CSV失敗:', error);
      alert('下載失敗');
    }
  };

  if (loading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">測試結果管理</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCSV}
            disabled={selectedSessions.size === 0}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            下載CSV ({selectedSessions.size})
          </button>
          <button
            onClick={handleBatchDelete}
            disabled={selectedSessions.size === 0}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            刪除 ({selectedSessions.size})
          </button>
        </div>
      </div>

      {/* 測試紀錄表格 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={currentSessions.length > 0 && selectedSessions.size === currentSessions.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                整體準確率
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                平均反應時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                完成時間
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedSessions.has(session.id)}
                    onChange={() => handleSelectSession(session.id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {session.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session.question_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatAccuracy(session.overall_accuracy)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatReactionTime(session.average_reaction_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(session.finished_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁控制 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          顯示 {startIndex + 1} 到 {Math.min(endIndex, totalSessions)} 筆，共 {totalSessions} 筆
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            上一頁
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            第 {currentPage} 頁，共 {totalPages} 頁
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
