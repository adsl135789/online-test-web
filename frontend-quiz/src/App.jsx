import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserInfoPage from './components/UserInfoPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';

export default function App() {
  const [sessionData, setSessionData] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user-info" element={<UserInfoPage setSessionData={setSessionData} />} />
      <Route path="/quiz" element={<QuizPage sessionData={sessionData} />} />
      <Route path="/result" element={<ResultPage sessionData={sessionData} />} />
    </Routes>
  );
}