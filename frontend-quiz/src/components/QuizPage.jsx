import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE_URL = 'http://54.174.181.192';

// 符號對應表
const SYMBOL_MAP = { 'S': '⬛', 'T': '🔺', 'C': '🟢' };

// 方向到箭頭的對應表
const DIRECTION_ARROW_MAP = {
  'up': '↓',      // 從上方看 -> 向下箭頭
  'down': '↑',    // 從下方看 -> 向上箭頭
  'left': '→',    // 從左方看 -> 向右箭頭
  'right': '←',   // 從右方看 -> 向左箭頭
  'ne': '↙',      // 從東北看 -> 向西南箭頭
  'nw': '↘',      // 從西北看 -> 向東南箭頭
  'se': '↖',      // 從東南看 -> 向西北箭頭
  'sw': '↗'       // 從西南看 -> 向東北箭頭
};

function formatOption(optionStr) {
  if (!optionStr) return ''; // 如果傳入的值是 null 或 undefined，直接回傳空字串
  return optionStr.split(',').map(char => SYMBOL_MAP[char] || char).join(' ');
}

export default function QuizPage({ sessionData }) {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const timerRef = useRef(null);

  // 路由保護 - 如果沒有 sessionData 則跳轉到首頁
  useEffect(() => {
    if (!sessionData) {
      navigate('/');
      return;
    }
  }, [sessionData, navigate]);

  // 獲取題目資料的函式
  useEffect(() => {
    if (!sessionData) return;
    
    const fetchQuestion = async () => {
      if (currentQuestionIndex >= sessionData.question_order.length) {
        // 所有題目回答完畢，跳轉到結果頁
        navigate('/result');
        return;
      }

      setLoading(true);
      setIsSubmitted(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCorrectAnswer(null);
      setTime(0);

      const direction = sessionData.question_order[currentQuestionIndex];
      
      try {
        const response = await axios.get(`${API_BASE_URL}:5000/api/quiz/${sessionData.session_id}/question/${direction}`);
        setQuestionData(response.data);
        setError(null);
      } catch (err) {
        setError(t('loadQuestionError'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [currentQuestionIndex, sessionData, navigate, t]);

  // 計時器邏輯
  useEffect(() => {
    if (!loading && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10); // 每 10ms 增加一次
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, isSubmitted]);

  // 提交答案的函式
  const handleSubmit = async () => {
    if (selectedAnswer === null) {
      alert(t('selectAnswer'));
      return;
    }
    setIsSubmitted(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}:5000/api/quiz/${sessionData.session_id}/answer`, {
        direction: sessionData.question_order[currentQuestionIndex],
        answer: selectedAnswer,
        time_ms: time,
      });
      setIsCorrect(response.data.is_correct);
      setCorrectAnswer(response.data.correct_answer);
    } catch (err) {
      setError(t('submitError'));
      console.error(err);
    }
  };
  
  // 前往下一個問題
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  if (!sessionData) return null; // 路由保護
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-cornsilk">{t('loading')}</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-cornsilk text-red-500">{error}</div>;

  const currentDirection = sessionData.question_order[currentQuestionIndex];
  const directionArrow = DIRECTION_ARROW_MAP[currentDirection] || currentDirection;

  // 根據語言選擇對應的題目描述
  const getQuestionPrompt = () => {
    const prompts = {
      zh: `從「${directionArrow}」方向觀看這三個物件從左到右的排列順序，哪一個是正確答案？`,
      en: `Which is the correct answer when you look at the order of these three objects from left to right in the "${directionArrow}" direction?`,
      ja: `「${directionArrow}」の方向からこの三つの物体を見たとき、左から右への並び順として正しいものはどれですか？`
    };
    return prompts[currentLanguage] || prompts.zh;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-cornsilk p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-papaya-whip p-8 rounded-2xl shadow-lg border-2 border-beige">
        {/* 進度條與計時器 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="font-bold text-lg">{t('progress')}</span>
            <span className="ml-2 text-lg">{currentQuestionIndex + 1} / {sessionData.question_order.length}</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">{t('time')}</span>
            <span className="ml-2 text-lg font-mono bg-tea-green px-3 py-1 rounded">
              {(time / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
        <div className="w-full bg-beige rounded-full h-4 mb-8">
          <div className="bg-buff h-4 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / sessionData.question_order.length) * 100}%` }}></div>
        </div>

        {/* 題目內容 */}
        <div className="text-center">
          
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8 mb-6">
            {/* 左側：題目圖片 */}
            <div className="flex-shrink-0">
              <img 
                src={`${API_BASE_URL}:5000/static/${questionData.image_path}`} 
                alt="測驗圖片" 
                className="max-w-full md:max-w-lg mx-auto rounded-lg border-2 border-beige" 
              />
            </div>
            
            {/* 右側：5x5 方向指引格子 */}
            <div className="flex-shrink-0">
              <div className="grid grid-cols-5 gap-1 bg-white/50 p-4 rounded-lg border border-beige">
                {/* 動態生成5x5格子 */}
                {[...Array(25)].map((_, index) => {
                  const row = Math.floor(index / 5);
                  const col = index % 5;
                  
                  // 判斷是否為中間3x3區域
                  const isObjectArea = row >= 1 && row <= 3 && col >= 1 && col <= 3;
                  
                  if (isObjectArea) {
                    // 中間3x3區域 - 顯示物件
                    const objectRow = row - 1; // 0-2
                    const objectCol = col - 1; // 0-2
                    const cartesianX = objectCol; // x座標: 0-2 (左到右)
                    const cartesianY = 2 - objectRow; // y座標: 0-2 (下到上)
                    
                    // 檢查哪個物件在這個位置
                    let objectSymbol = '';
                    
                    // 確保資料存在且為數字類型
                    if (questionData?.square_x !== undefined && questionData?.square_y !== undefined &&
                        Number(questionData.square_x) === cartesianX && Number(questionData.square_y) === cartesianY) {
                      objectSymbol = '⬛';
                    } else if (questionData?.triangle_x !== undefined && questionData?.triangle_y !== undefined &&
                               Number(questionData.triangle_x) === cartesianX && Number(questionData.triangle_y) === cartesianY) {
                      objectSymbol = '🔺';
                    } else if (questionData?.circle_x !== undefined && questionData?.circle_y !== undefined &&
                               Number(questionData.circle_x) === cartesianX && Number(questionData.circle_y) === cartesianY) {
                      objectSymbol = '🟢';
                    }
                    
                    // 中心位置特殊處理
                    // if (row === 2 && col === 2) {
                    //   return (
                    //     <div key={index} className="w-12 h-12 flex items-center justify-center bg-papaya-whip rounded border-2 border-buff relative">
                    //       <span className="text-2xl">{objectSymbol || '⭐'}</span>
                    //       <span className="absolute bottom-0 right-0 text-xs text-gray-500">{debugInfo}</span>
                    //     </div>
                    //   );
                    // }
                    
                    return (
                      <div key={index} className="w-12 h-12 flex items-center justify-center bg-cornsilk rounded border-2 border-beige relative">
                        <span className="text-2xl">{objectSymbol}</span>
                      </div>
                    );
                  } else {
                    // 外圍區域 - 顯示方向箭頭
                    let arrowSymbol = '';
                    
                    // 根據當前觀看方向高亮對應的箭頭
                    const isCurrentDirection = 
                      (currentDirection === 'up' && row === 0 && col === 2) ||
                      (currentDirection === 'down' && row === 4 && col === 2) ||
                      (currentDirection === 'left' && row === 2 && col === 0) ||
                      (currentDirection === 'right' && row === 2 && col === 4) ||
                      (currentDirection === 'nw' && row === 0 && col === 0) ||
                      (currentDirection === 'ne' && row === 0 && col === 4) ||
                      (currentDirection === 'sw' && row === 4 && col === 0) ||
                      (currentDirection === 'se' && row === 4 && col === 4);
                    
                    // 第一行 (row 0)
                    if (row === 0) {
                      if (col === 0) arrowSymbol = '↘'; // nw
                      else if (col === 2) arrowSymbol = '↓'; // up
                      else if (col === 4) arrowSymbol = '↙'; // ne
                    }
                    // 第三行 (row 2) - 左右兩側
                    else if (row === 2) {
                      if (col === 0) arrowSymbol = '→'; // left
                      else if (col === 4) arrowSymbol = '←'; // right
                    }
                    // 第五行 (row 4)
                    else if (row === 4) {
                      if (col === 0) arrowSymbol = '↗'; // sw
                      else if (col === 2) arrowSymbol = '↑'; // down
                      else if (col === 4) arrowSymbol = '↖'; // se
                    }
                    
                    return (
                      <div key={index} className={`w-12 h-12 flex items-center justify-center rounded text-2xl ${
                        isCurrentDirection ? 'bg-yellow-300 border-2 border-yellow-500' : 'bg-gray-100'
                      }`}>
                        {arrowSymbol}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
          
          {/* 題目描述 - 只顯示當前語言 */}
          <div className="space-y-4 mb-8 text-left max-w-3xl mx-auto">
            <div className="bg-white/50 p-4 rounded-lg border border-beige">
              <p className="text-lg text-gray-800 font-medium">
                {getQuestionPrompt()}
              </p>
            </div>
          </div>
        </div>

        {/* 選項區 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {questionData.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            let buttonClass = 'bg-cornsilk hover:bg-beige'; // 預設樣式

            if (isSubmitted) {
              // --- 已修正 ---
              // 只有在從後端拿到結果後，才改變顏色
              if (isCorrect !== null) {
                if (option === correctAnswer) {
                  buttonClass = 'bg-green-400 text-white'; // 正確答案
                } else if (isSelected && !isCorrect) {
                  buttonClass = 'bg-red-400 text-white'; // 選錯的答案
                } else {
                  buttonClass = 'bg-gray-200 text-gray-500'; // 其他未選答案
                }
              } else {
                // 提交了，但在等待後端回傳時的樣式
                buttonClass = 'bg-gray-200 text-gray-500'; 
              }
            } else if (isSelected) {
              // 尚未提交，但使用者已選擇的樣式
              buttonClass = 'bg-buff text-white'; 
            }
            
            return (
              <button
                key={index}
                onClick={() => !isSubmitted && setSelectedAnswer(option)}
                disabled={isSubmitted}
                className={`p-4 rounded-lg text-2xl font-bold transition-all duration-200 ${buttonClass}`}
              >
                {formatOption(option)}
              </button>
            );
          })}
        </div>

        {/* 提交/下一題 按鈕 */}
        <div className="text-center">
          {!isSubmitted ? (
            <button onClick={handleSubmit} className="bg-buff hover:bg-opacity-90 text-white text-2xl font-bold py-3 px-12 rounded-lg shadow-md">
              {t('submit')}
            </button>
          ) : (
            isCorrect !== null ? (
              <div className="space-y-4">
                {isCorrect ? (
                  <p className="text-2xl font-bold text-green-600">{t('correct')}</p>
                ) : (
                  <p className="text-2xl font-bold text-red-600">{t('incorrect', { answer: formatOption(correctAnswer) })}</p>
                )}
                <button onClick={handleNextQuestion} className="bg-tea-green hover:bg-beige text-buff text-2xl font-bold py-3 px-12 rounded-lg shadow-md">
                  {currentQuestionIndex + 1 >= sessionData.question_order.length ? t('viewResults') : t('nextQuestion')}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-500">{t('grading')}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}