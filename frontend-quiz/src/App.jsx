import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserInfoPage from './components/UserInfoPage';
import InstructionPage from './components/InstructionPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';
import { clearImageCache, clearQuestionCoordinates } from './components/UserInfoPage';

export default function App() {
  const [sessionData, setSessionData] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionCoordinates, setQuestionCoordinates] = useState({});

  // 完整重置應用程式
  const resetApp = () => {
    clearImageCache();
    clearQuestionCoordinates(setQuestionCoordinates);
    setSessionData(null);
    setCurrentStage(1);
    setCurrentQuestionIndex(0);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/user-info" 
        element={
          <UserInfoPage 
            setSessionData={setSessionData}
            setCurrentStage={setCurrentStage}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            setQuestionCoordinates={setQuestionCoordinates}
            resetApp={resetApp}
          />
        } 
      />
      <Route 
        path="/instruction" 
        element={
          <InstructionPage 
            sessionData={sessionData} 
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            setQuestionCoordinates={setQuestionCoordinates}
          />
        } 
      />
      <Route 
        path="/quiz" 
        element={
          <QuizPage 
            sessionData={sessionData} 
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            questionCoordinates={questionCoordinates}
          />
        } 
      />
      <Route path="/result" element={<ResultPage sessionData={sessionData} />} />
    </Routes>
  );
}