import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://54.174.181.192';

const SYMBOL_MAP = { 'S': '⬛', 'T': '🔺', 'C': '🟢' };

function formatAnswer(answerStr) {
  if (!answerStr) return 'N/A';
  return answerStr.split(',').map(char => SYMBOL_MAP[char] || char).join(' ');
}

const AnswerGrid = ({ q }) => {
  const gridKeys = ['answer_nw', 'answer_up', 'answer_ne', 'answer_left', null, 'answer_right', 'answer_sw', 'answer_down', 'answer_se'];
  return (
    <div className="grid grid-cols-3 gap-2 bg-cornsilk p-2 rounded-lg aspect-square w-full">
      {gridKeys.map((key, index) => (
        <div 
          key={index} 
          className="bg-papaya-whip rounded-md flex justify-center items-center aspect-square text-center overflow-hidden"
          title={key ? key.replace('answer_', '') : 'Center'}
          style={{ fontSize: 'min(1.5rem, 8cqw)' }}
        >
          <span className="leading-none">
            {key && q[key] ? formatAnswer(q[key]) : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function QuestionList({ setPage, setEditingId }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}:5000/api/admin/questions`);
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError('無法載入問題列表，請稍後再試。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm(`您確定要刪除問題 #${id} 嗎？此操作無法復原。`)) {
      try {
        await axios.delete(`${API_BASE_URL}:5000/api/admin/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        alert('刪除失敗，請查看主控台錯誤訊息。');
        console.error(err);
      }
    }
  };
  
  // --- 新增 ---
  const handleEdit = (id) => {
    setEditingId(id); // 設定要編輯的 ID
    setPage('form');   // 切換到表單頁面
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'active') return q.is_active;
    if (filter === 'inactive') return !q.is_active;
    return true;
  });

  const activeCount = questions.filter(q => q.is_active).length;
  const totalCount = questions.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)));
    } else {
      setSelectedQuestions(new Set());
    }
  };

  const handleBatchToggle = async (isActive) => {
    if (selectedQuestions.size === 0) {
      alert('請先選擇要操作的題目');
      return;
    }

    const action = isActive ? '啟用' : '停用';
    if (!window.confirm(`確定要${action}選中的 ${selectedQuestions.size} 道題目嗎？`)) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}:5000/api/admin/questions/batch-toggle`, {
        question_ids: Array.from(selectedQuestions),
        is_active: isActive
      });
      
      setSelectedQuestions(new Set());
      fetchQuestions();
      alert(`成功${action} ${selectedQuestions.size} 道題目`);
    } catch (err) {
      alert('批量操作失敗');
      console.error(err);
    }
  };

  const handleSingleToggle = async (id, currentStatus) => {
    try {
      await axios.post(`${API_BASE_URL}:5000/api/admin/questions/${id}/toggle`);
      fetchQuestions();
    } catch (err) {
      alert('操作失敗');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-10">載入中...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="bg-papaya-whip p-6 rounded-xl shadow-md border border-beige">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">題目管理</h2>
            <div className="text-lg text-gray-600">
              啟用: <span className="font-bold text-green-600">{activeCount}</span> / 
              總計: <span className="font-bold">{totalCount}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-beige rounded-lg bg-cornsilk"
            >
              <option value="all">全部題目</option>
              <option value="active">已啟用</option>
              <option value="inactive">已停用</option>
            </select>
          </div>
        </div>

        {/* 批量操作 */}
        <div className="mt-4 pt-4 border-t border-beige">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedQuestions.size === filteredQuestions.length && filteredQuestions.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">全選</span>
            </label>
            
            <span className="text-sm text-gray-500">
              已選擇 {selectedQuestions.size} 道題目
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleBatchToggle(true)}
                disabled={selectedQuestions.size === 0}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
              >
                批量啟用
              </button>
              <button
                onClick={() => handleBatchToggle(false)}
                disabled={selectedQuestions.size === 0}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white text-sm rounded-lg transition-colors"
              >
                批量停用
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 題目列表 - 改為 Grid 佈局，每行三張卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredQuestions.map((q) => (
          <div key={q.id} className={`p-3 rounded-xl shadow-md border ${
            q.is_active ? 'bg-papaya-whip border-beige' : 'bg-gray-100 border-gray-300 opacity-75'
          }`}>
            
            {/* 簡化的卡片內容 */}
            <div className="space-y-3">
              
              {/* 頂部：選擇框 + 標題 + 狀態 */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedQuestions.has(q.id)}
                  onChange={(e) => {
                    const newSelected = new Set(selectedQuestions);
                    if (e.target.checked) {
                      newSelected.add(q.id);
                    } else {
                      newSelected.delete(q.id);
                    }
                    setSelectedQuestions(newSelected);
                  }}
                  className="w-4 h-4 flex-shrink-0"
                />
                
                <h3 className="font-bold text-base text-gray-800">問題 #{q.id}</h3>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ml-auto ${
                  q.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {q.is_active ? '已啟用' : '已停用'}
                </span>
              </div>
              
              {/* 圖片 */}
              <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-beige overflow-hidden">
                <img 
                  src={`${API_BASE_URL}:5000/static/${q.image_path}`} 
                  alt={`問題 ${q.id} 的圖片`} 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
              
              {/* 按鈕區域 */}
              <div className="flex justify-end gap-1">
                <button
                  onClick={() => handleSingleToggle(q.id, q.is_active)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    q.is_active
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {q.is_active ? '停用' : '啟用'}
                </button>
                
                <button 
                  onClick={() => handleEdit(q.id)} 
                  className="bg-tea-green hover:bg-beige text-buff font-medium py-1 px-2 rounded-md text-xs transition-colors"
                >
                  編輯
                </button>
                
                <button 
                  onClick={() => handleDelete(q.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded-md text-xs transition-colors"
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
