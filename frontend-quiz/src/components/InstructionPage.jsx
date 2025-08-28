import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// const API_BASE_URL = 'http://localhost'; // 本地開發環境
const API_BASE_URL = 'http://54.174.181.192';

// 圖片快取對象
const imageCache = {};

export default function InstructionPage({ sessionData, currentStage, setCurrentStage, setQuestionCoordinates }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [initializationComplete, setInitializationComplete] = useState(false);

  // 路由保護 - 如果沒有 sessionData 則跳轉到首頁
  useEffect(() => {
    if (!sessionData) {
      navigate('/');
      return;
    }
    // 當 sessionData 存在時，立即開始初始化
    initializeQuizData();
  }, [sessionData, navigate]);

  // 預載入圖片的函式
  const preloadImage = async (imagePath) => {
    if (!imagePath) return null;
    
    // 檢查快取中是否已有此圖片
    if (imageCache[imagePath]) {
      return imageCache[imagePath];
    }

    try {
      const imageUrl = `${API_BASE_URL}:5000/static/${imagePath}`;
      
      // 創建圖片物件進行預載入
      const img = new Image();
      img.src = imageUrl;
      
      // 等待圖片載入完成
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // 將圖片URL存入快取
      imageCache[imagePath] = imageUrl;
      return imageUrl;
    } catch (error) {
      console.error('圖片預載入失敗:', error);
      return null;
    }
  };

  // 新增：初始化測驗資料的函式
  const initializeQuizData = async () => {
    if (!sessionData) return;

    try {
      setIsLoading(true);
      
      // 1. 先初始化座標資訊
      if (setQuestionCoordinates && sessionData.square_x !== undefined) {
        const coordinates = {
          square_x: sessionData.square_x,
          square_y: sessionData.square_y,
          triangle_x: sessionData.triangle_x,
          triangle_y: sessionData.triangle_y,
          circle_x: sessionData.circle_x,
          circle_y: sessionData.circle_y
        };
        setQuestionCoordinates(coordinates);
        console.log('座標初始化完成:', coordinates);
      }
      
      // 2. 預載入圖片並更新快取
      if (sessionData.question_image) {
        const imageUrl = await preloadImage(sessionData.question_image);
        if (imageUrl) {
          console.log('圖片預載入完成:', imageUrl);
        }
      }
      
      setInitializationComplete(true);
    } catch (error) {
      console.error('初始化失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // 確保初始化完成後才允許繼續
    if (initializationComplete) {
      navigate('/quiz');
    }
  };

  if (!sessionData) return null; // 路由保護

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cornsilk p-8">
      <div className="w-full max-w-4xl bg-papaya-whip p-12 rounded-2xl shadow-lg border-2 border-beige">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          {t('stageTitle', { stage: currentStage })}
        </h1>
        
        <div className="text-lg text-gray-700 leading-relaxed space-y-6 mb-8">
          {currentStage === 1 ? (
            <div>
              <p className="mb-4">{t('stage1Intro1')}</p>
              <p className="mb-4">{t('stage1Intro2')}</p>
              <p>{t('stage1Intro3')}</p>
            </div>
          ) : (
            <div>
              <p className="mb-4">{t('stage2Intro1')}</p>
              <p className="mb-4">{t('stage2Intro2')}</p>
              <p className="mb-4">{t('stage2Intro3')}</p>
              <p>{t('stage2Intro4')}</p>
            </div>
          )}
        </div>

        <div className="text-center">
          {isLoading ? (
            <div className="space-y-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-buff"></div>
              <p className="text-lg text-gray-600">{t('preparingImages')}</p>
              <p className="text-sm text-gray-500">正在初始化測驗資料...</p>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              disabled={!initializationComplete}
              className="bg-buff hover:bg-opacity-90 text-white text-2xl font-bold py-4 px-12 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {t('startStage')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 導出imageCache供其他組件使用
export { imageCache };
