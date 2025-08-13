import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

export default function ResultPage({ sessionData }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 路由保護 - 如果沒有 sessionData 則跳轉到首頁
  useEffect(() => {
    if (!sessionData) {
      navigate('/');
      return;
    }
  }, [sessionData, navigate]);

  useEffect(() => {
    if (!sessionData) return;
    
    const fetchResult = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quiz/${sessionData.session_id}/result`);
        setResult(response.data);
      } catch (err) {
        setError(t('resultError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [sessionData, t]);

  if (!sessionData) return null; // 路由保護

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-cornsilk">{t('calculatingResults')}</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-cornsilk text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cornsilk p-8">
      <div className="text-center bg-papaya-whip p-12 rounded-2xl shadow-lg border-2 border-beige">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          {t('testResult')}
        </h1>
        <div className="space-y-4 text-2xl text-gray-700 mb-8">
          <p>{t('accuracy', { value: result.accuracy })}</p>
          <p>{t('averageTime', { value: result.average_reaction_time }, 'timeUnit')}</p>
        </div>
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => navigate('/user-info')}
            className="bg-buff hover:bg-opacity-90 text-white text-xl font-bold py-3 px-8 rounded-lg transition-all"
          >
            {t('retakeTest')}
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-tea-green hover:bg-beige text-buff text-xl font-bold py-3 px-8 rounded-lg transition-all"
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
}