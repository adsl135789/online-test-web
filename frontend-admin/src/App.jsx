import React, { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';

export default function App() {
  const [page, setPage] = useState('list'); // 'list' 或 'form'
  const [editingId, setEditingId] = useState(null); // null 表示建立，有值表示編輯

  const handleCreateNew = () => {
    setEditingId(null);
    setPage('form');
  };

  return (
    <div className="bg-cornsilk min-h-screen p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b-2 border-beige pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">後台管理系統</h1>
          <nav className="flex items-center gap-4">
            <button 
              onClick={() => setPage('list')} 
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${page === 'list' ? 'bg-buff text-white' : 'bg-papaya-whip text-buff hover:bg-beige'}`}
            >
              管理題目
            </button>
            <button 
              onClick={handleCreateNew}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${page === 'form' && editingId === null ? 'bg-buff text-white' : 'bg-papaya-whip text-buff hover:bg-beige'}`}
            >
              建立新問題
            </button>
          </nav>
        </header>

        <main>
          {page === 'list' && <QuestionList setPage={setPage} setEditingId={setEditingId} />}
          {page === 'form' && <QuestionForm editingId={editingId} setPage={setPage} setEditingId={setEditingId} />}
        </main>
      </div>
    </div>
  );
}
