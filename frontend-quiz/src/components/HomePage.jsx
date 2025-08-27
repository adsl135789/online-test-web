import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cornsilk p-8">
      {/* 語言選擇器 */}
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      
      <div className="text-center bg-papaya-whip p-12 rounded-2xl shadow-lg border-2 border-beige">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          {t('description')}
        </p>
        <p className="text-md text-gray-700 font-bold mb-8">
          {t('projectLeader')} <a href="mailto:chy@nchu.edu.tw" className="text-blue-600 hover:text-blue-800 underline">chy@nchu.edu.tw</a>
        </p>
        <button
          onClick={() => navigate('/user-info')}
          className="bg-buff hover:bg-opacity-90 text-white text-2xl font-bold py-4 px-10 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {t('startTest')}
        </button>
      </div>
    </div>
  );
}