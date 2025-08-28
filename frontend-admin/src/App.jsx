import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import Results from './components/Results';

function Navigation() {
  const location = useLocation();
  const isListPage = location.pathname === '/';
  const isCreatePage = location.pathname === '/create';
  const isResultsPage = location.pathname === '/results';

  return (
    <nav className="flex items-center gap-4">
      <Link 
        to="/" 
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isListPage ? 'bg-buff text-white' : 'bg-papaya-whip text-buff hover:bg-beige'}`}
      >
        管理題目
      </Link>
      <Link 
        to="/create"
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isCreatePage ? 'bg-buff text-white' : 'bg-papaya-whip text-buff hover:bg-beige'}`}
      >
        建立新題目
      </Link>
      <Link 
        to="/results"
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isResultsPage ? 'bg-buff text-white' : 'bg-papaya-whip text-buff hover:bg-beige'}`}
      >
        測試結果
      </Link>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="bg-cornsilk min-h-screen p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b-2 border-beige pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">後台管理系統</h1>
          <Navigation />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<QuestionList />} />
            <Route path="/create" element={<QuestionForm />} />
            <Route path="/edit/:id" element={<QuestionForm />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
