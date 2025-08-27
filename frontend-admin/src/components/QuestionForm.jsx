import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://54.174.181.192';

// const API_BASE_URL = 'http://localhost'; // 本地開發環境

// --- 常數定義 ---
const STAGE_1_CHOICES = [
  { value: 'C,T,S', label: '⬛ 🔺 🟢' }, { value: 'C,S,T', label: '⬛ 🟢 🔺' },
  { value: 'T,C,S', label: '🔺 ⬛ 🟢' }, { value: 'T,S,C', label: '🔺 🟢 ⬛' },
  { value: 'S,C,T', label: '🟢 ⬛ 🔺' }, { value: 'S,T,C', label: '🟢 🔺 ⬛' }
];
const STAGE_2_CHOICES = [
  ...STAGE_1_CHOICES,
  { value: 'C,T', label: '⬛ 🔺' }, { value: 'T,C', label: '🔺 ⬛' },
  { value: 'C,S', label: '⬛ 🟢' }, { value: 'C,S', label: '🟢 ⬛' },
  { value: 'T,S', label: '🔺 🟢' }, { value: 'S,T', label: '🟢 🔺' }
];
const DIRECTIONS = [
  { key: 'answer_down', label: '答案 (下)', choices: STAGE_1_CHOICES },
  { key: 'answer_right', label: '答案 (右)', choices: STAGE_1_CHOICES },
  { key: 'answer_up', label: '答案 (上)', choices: STAGE_1_CHOICES },
  { key: 'answer_left', label: '答案 (左)', choices: STAGE_1_CHOICES },
  { key: 'answer_se', label: '答案 (右下)', choices: STAGE_2_CHOICES },
  { key: 'answer_ne', label: '答案 (右上)', choices: STAGE_2_CHOICES },
  { key: 'answer_nw', label: '答案 (左上)', choices: STAGE_2_CHOICES },
  { key: 'answer_sw', label: '答案 (左下)', choices: STAGE_2_CHOICES },
];
const SHAPES = {
  square: { symbol: '⬛', name: '正方體' },
  triangle: { symbol: '🔺', name: '三角錐' },
  circle: { symbol: '🟢', name: '球體' },
};

export default function QuestionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  // --- State Management ---
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [positions, setPositions] = useState({ square: null, triangle: null, circle: null });
  const [answers, setAnswers] = useState(DIRECTIONS.reduce((acc, dir) => ({ ...acc, [dir.key]: '' }), {}));
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [draggedItem, setDraggedItem] = useState(null);
  const fileInputRef = useRef(null);

  // --- Reset form when switching from edit to create mode ---
  useEffect(() => {
    if (!isEditing) {
      // 重置所有狀態到初始值
      setImage(null);
      setImagePreview('');
      setPositions({ square: null, triangle: null, circle: null });
      setAnswers(DIRECTIONS.reduce((acc, dir) => ({ ...acc, [dir.key]: '' }), {}));
      setStatus({ loading: false, error: null, success: null });
      setDraggedItem(null);
    }
  }, [isEditing]);

  // --- Data Fetching for Edit Mode ---
  useEffect(() => {
    if (isEditing) {
      const fetchQuestionData = async () => {
        setStatus({ loading: true, error: null, success: null });
        try {
          const response = await axios.get(`${API_BASE_URL}:5000/api/admin/questions/${id}`);
          const data = response.data;
          
          const initialAnswers = {};
          DIRECTIONS.forEach(dir => { initialAnswers[dir.key] = data[dir.key] || ''; });
          setAnswers(initialAnswers);
          
          const initialPositions = { square: null, triangle: null, circle: null };
          Object.keys(SHAPES).forEach(shape => {
            const x = data[`${shape}_x`]; // 笛卡爾 x 座標 (0-2)
            const y = data[`${shape}_y`]; // 笛卡爾 y 座標 (0-2)
            if (x != null && y != null) {
              // 將笛卡爾座標轉換為陣列索引：左下角(0,0)對應索引6，右上角(2,2)對應索引2
              initialPositions[shape] = (2 - y) * 3 + x;
            }
          });
          setPositions(initialPositions);

          if (data.image_path) {
            setImagePreview(`${API_BASE_URL}:5000/static/${data.image_path}`);
          }
          setStatus({ loading: false, error: null, success: null });
        } catch (error) {
          setStatus({ loading: false, error: '無法載入問題資料', success: null });
        }
      };
      fetchQuestionData();
    }
  }, [id, isEditing]);

  // --- Event Handlers ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleDragStart = (e, shape) => setDraggedItem(shape);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, cellIndex) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    // 如果 cellIndex 為 null，表示拖拉回放置區
    if (cellIndex === null) {
      const newPositions = { ...positions };
      newPositions[draggedItem] = null;
      setPositions(newPositions);
      setDraggedItem(null);
      return;
    }
    
    // 禁止在中央位置（索引 4，對應笛卡爾座標 (1,1)）放置物件
    if (cellIndex === 4) return;
    
    // 計算目標位置的笛卡爾座標
    const targetRow = Math.floor(cellIndex / 3);
    const targetCol = cellIndex % 3;
    const targetX = targetCol; // x 座標：左到右 (0-2)
    const targetY = 2 - targetRow; // y 座標：下到上 (0-2)
    
    // 檢查是否有其他物體在相同的 x 或 y 軸上
    for (const [shape, pos] of Object.entries(positions)) {
      if (shape === draggedItem || pos === null) continue;
      
      const existingRow = Math.floor(pos / 3);
      const existingCol = pos % 3;
      const existingX = existingCol;
      const existingY = 2 - existingRow;
      
      // 如果目標位置與現有物體在相同的 x 或 y 軸上，則禁止放置
      if (existingX === targetX || existingY === targetY) {
        return;
      }
    }
    
    const newPositions = { ...positions };
    Object.keys(newPositions).forEach(key => { if (newPositions[key] === cellIndex) newPositions[key] = null; });
    newPositions[draggedItem] = cellIndex;
    setPositions(newPositions);
    setDraggedItem(null);
  };
  const handleAnswerChange = (e, key) => setAnswers({ ...answers, [key]: e.target.value });

  // --- 答案生成引擎 ---
  const generateBasicAnswers = () => {
    // 檢查是否所有物體都已放置
    if (Object.values(positions).some(pos => pos === null)) {
      setStatus({ loading: false, error: '請先將所有物件都拖拉到九宮格中才能生成答案。', success: null });
      return;
    }

    // 計算每個物體的笛卡爾座標
    const shapeCoordinates = {};
    Object.entries(positions).forEach(([shape, pos]) => {
      const row = Math.floor(pos / 3);
      const col = pos % 3;
      shapeCoordinates[shape] = {
        x: col, // x 座標：左到右 (0-2)
        y: 2 - row // y 座標：下到上 (0-2)
      };
    });

    // 生成答案
    const newAnswers = { ...answers };
    const shapes = Object.keys(SHAPES);
    
    // 下: 根據 x 座標由小到大排列
    const downOrder = shapes.sort((a, b) => shapeCoordinates[a].x - shapeCoordinates[b].x);
    newAnswers.answer_down = downOrder.map(shape => shape.charAt(0).toUpperCase()).join(',');
    
    // 右: 根據 y 座標由小到大排列
    const rightOrder = shapes.sort((a, b) => shapeCoordinates[a].y - shapeCoordinates[b].y);
    newAnswers.answer_right = rightOrder.map(shape => shape.charAt(0).toUpperCase()).join(',');
    
    // 上: 根據 x 座標由大到小排列
    const upOrder = shapes.sort((a, b) => shapeCoordinates[b].x - shapeCoordinates[a].x);
    newAnswers.answer_up = upOrder.map(shape => shape.charAt(0).toUpperCase()).join(',');
    
    // 左: 根據 y 座標由大到小排列
    const leftOrder = shapes.sort((a, b) => shapeCoordinates[b].y - shapeCoordinates[a].y);
    newAnswers.answer_left = leftOrder.map(shape => shape.charAt(0).toUpperCase()).join(',');

    setAnswers(newAnswers);
    setStatus({ loading: false, error: null, success: '基本答案已自動生成！' });
    
    // 清除成功訊息
    setTimeout(() => {
      setStatus(prev => ({ ...prev, success: null }));
    }, 2000);
  };

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing && !image) {
      setStatus({ loading: false, error: '建立新問題時，必須上傳參考圖片。', success: null });
      return;
    }
    if (Object.values(positions).some(pos => pos === null)) {
      setStatus({ loading: false, error: '請將所有物件都拖拉到九宮格中。', success: null });
      return;
    }
    if (Object.values(answers).some(ans => ans === '')) {
      setStatus({ loading: false, error: '請選擇所有八個方向的答案。', success: null });
      return;
    }
    
    setStatus({ loading: true, error: null, success: null });

    const formData = new FormData();
    if (image) { formData.append('image', image); }
    
    Object.entries(positions).forEach(([shape, pos]) => {
      if (pos !== null) {
        // 將陣列索引轉換為笛卡爾座標
        const row = Math.floor(pos / 3); // 陣列行 (0-2，上到下)
        const col = pos % 3; // 陣列列 (0-2，左到右)
        const cartesianX = col; // x 座標：左到右 (0-2)
        const cartesianY = 2 - row; // y 座標：下到上 (0-2)
        
        formData.append(`${shape}_x`, cartesianX);
        formData.append(`${shape}_y`, cartesianY);
      } else {
        formData.append(`${shape}_x`, '');
        formData.append(`${shape}_y`, '');
      }
    });
    Object.entries(answers).forEach(([key, value]) => formData.append(key, value));

    try {
      const url = isEditing
        ? `${API_BASE_URL}:5000/api/admin/questions/${id}`
        : `${API_BASE_URL}:5000/api/admin/questions`;
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios[method](url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      setStatus({ loading: false, error: null, success: response.data.message });
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.error || '發生未知錯誤', success: null });
    }
  };
  
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="bg-papaya-whip rounded-2xl shadow-lg p-8 sm:p-12 border border-beige">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8 border-b-2 border-beige pb-4">
            {isEditing ? `編輯問題 #${id}` : '建立新問題'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="w-full">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">1. 參考圖片</h2>
                    <div className="w-full aspect-square max-h-[456px] bg-cornsilk border-2 border-dashed border-beige rounded-xl flex justify-center items-center cursor-pointer hover:bg-beige transition-colors duration-200" onClick={() => fileInputRef.current.click()}>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/png, image/jpeg, image/gif"/>
                        {imagePreview ? (
                            <img src={imagePreview} alt="圖片預覽" className="max-h-full max-w-full object-contain rounded-lg" />
                        ) : (
                            <div className="text-center text-buff">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <p className="mt-2 text-base">點擊此處上傳</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">2. 物件座標設定</h2>
                    <div className="flex flex-col items-center gap-6">
                        <div className="grid grid-cols-3 gap-2 w-full max-w-[456px] aspect-square p-2 bg-tea-green rounded-xl shadow-inner">
                            {[...Array(9)].map((_, i) => {
                                // 計算笛卡爾座標顯示
                                const row = Math.floor(i / 3);
                                const col = i % 3;
                                const cartesianX = col;
                                const cartesianY = 2 - row;
                                
                                // 找出放置在此位置的物件
                                const shapeInCell = Object.keys(positions).find(shape => positions[shape] === i);
                                
                                return (
                                    <div 
                                        key={i} 
                                        onDragOver={i === 4 ? undefined : handleDragOver} 
                                        onDrop={i === 4 ? undefined : (e) => handleDrop(e, i)} 
                                        className={`rounded-lg flex justify-center items-center relative transition-colors duration-200 ${
                                            i === 4 
                                                ? 'bg-gray-300 cursor-not-allowed opacity-50' 
                                                : 'bg-papaya-whip hover:bg-beige'
                                        }`}
                                    >
                                        {shapeInCell && (
                                            <span 
                                                key={shapeInCell} 
                                                className="text-8xl absolute select-none cursor-grab active:cursor-grabbing" 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, shapeInCell)}
                                            >
                                                {SHAPES[shapeInCell].symbol}
                                            </span>
                                        )}
                                        <span className="absolute top-1 left-2 text-sm text-gray-400 select-none">({cartesianX}, {cartesianY})</span>
                                        {i === 4 && <span className="text-2xl text-gray-500 select-none">✖</span>}
                                    </div>
                                );
                            })}
                        </div>
                        <div 
                            className="flex flex-row justify-around w-full max-w-[456px] p-4 border-2 border-dashed border-beige rounded-xl bg-cornsilk"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, null)}
                        >
                            {Object.entries(SHAPES).map(([key, { symbol, name }]) => {
                                // 只顯示未放置在九宮格中的物體
                                const isPlaced = positions[key] !== null;
                                
                                return (
                                    <div 
                                        key={key} 
                                        className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                                            isPlaced 
                                                ? 'opacity-30 cursor-not-allowed' 
                                                : 'cursor-grab hover:bg-beige'
                                        }`}
                                    >
                                        {!isPlaced && (
                                            <span 
                                                className="text-5xl select-none cursor-grab active:cursor-grabbing" 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, key)}
                                            >
                                                {symbol}
                                            </span>
                                        )}
                                        {isPlaced && (
                                            <span className="text-5xl select-none opacity-30">
                                                {symbol}
                                            </span>
                                        )}
                                        <span className="text-base text-gray-600 select-none">{name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">3. 答案設定</h2>
                
                {/* 答案生成按鈕 */}
                <div className="mb-6 p-4 bg-cornsilk border-2 border-beige rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">自動生成基本答案</h3>
                            <p className="text-sm text-gray-600">根據物體位置自動生成上、下、左、右四個方向的答案</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={generateBasicAnswers}
                            className="bg-tea-green hover:bg-opacity-90 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            生成答案
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                    {DIRECTIONS.map(({ key, label, choices }) => (
                        <div key={key}>
                            <label htmlFor={key} className="block text-gray-600 text-base font-bold mb-2">{label}</label>
                            <select id={key} value={answers[key]} onChange={(e) => handleAnswerChange(e, key)} className="block w-full bg-cornsilk border-2 border-beige text-gray-800 rounded-lg focus:ring-2 focus:ring-buff focus:border-buff p-3 transition-shadow duration-200 text-base">
                                <option value="" disabled>請選擇答案...</option>
                                {choices.map(choice => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
            <div className="pt-8 border-t-2 border-beige">
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold py-3 px-8 rounded-lg transition-colors">
                        取消
                    </button>
                    <button type="submit" disabled={status.loading} className="bg-buff hover:bg-opacity-90 text-white text-xl font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-buff focus:ring-opacity-50 disabled:bg-gray-400 transition-all duration-300 shadow-md hover:shadow-lg">
                        {status.loading ? '儲存中...' : (isEditing ? '儲存變更' : '建立問題')}
                    </button>
                </div>
                {status.error && <p className="mt-4 text-red-600 bg-red-100 border border-red-400 rounded-md p-3 text-base">{status.error}</p>}
                {status.success && <p className="mt-4 text-green-700 bg-green-100 border border-green-500 rounded-md p-3 text-base">{status.success}</p>}
            </div>
        </form>
    </div>
  );
}