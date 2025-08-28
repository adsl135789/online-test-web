import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { imageCache } from './UserInfoPage';

// const API_BASE_URL = 'http://localhost'; // 本地開發環境
const API_BASE_URL = 'http://54.174.181.192';

export default function InstructionPage({ sessionData, currentStage, setCurrentStage, setQuestionCoordinates }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // 路由保護 - 如果沒有 sessionData 則跳轉到首頁
  useEffect(() => {
    if (!sessionData) {
      navigate('/');
      return;
    }
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

  // 預載入圖片並存儲座標資訊
  useEffect(() => {
    const preloadStageImages = async () => {
      if (!sessionData || !sessionData.question_image) return;

      try {
        setIsLoading(true);
        
        // 直接使用 sessionData 中的 question_image 進行預載入
        await preloadImage(sessionData.question_image);
        
        // 存儲物件座標資訊
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
        }
        
      } catch (error) {
        console.error('預載入圖片失敗:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadStageImages();
  }, [sessionData, setQuestionCoordinates]);

  const handleContinue = () => {
    // 跳轉到quiz頁面，currentStage已經在App.jsx中管理
    navigate('/quiz');
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
            </div>
          ) : (
            <button
              onClick={handleContinue}
              className="bg-buff hover:bg-opacity-90 text-white text-2xl font-bold py-4 px-12 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {t('startStage')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

