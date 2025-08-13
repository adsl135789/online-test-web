# 線上測驗系統開發需求與架構設計
這是一份針對線上空間感知識測驗系統的開發需求文件，旨在定義系統功能、使用者流程、技術架構與資料庫設計。
## 1. 專案總覽 (Project Overview)
### 1.1. 專案目標
開發一個線上測驗平台，使用者透過填寫個人資料後，進行一個包含八道題目的空間方向測驗。系統需記錄每位使用者的作答狀況（準確率、反應時間），並提供後台讓管理者上傳題目與分析數據。
### 1.2. 技術棧 (Tech Stack)
- 前端 (Frontend): React
- 後端 (Backend): Python (使用 Flask 框架)
- 資料庫 (Database): PostgreSQL
### 1.3. 設計風格 (Design Style)
- 風格: 空間線條感
- 調色 (CSS Variables):
```css
:root {
  --tea-green: #ccd5aeff;
  --beige: #e9edc9ff;
  --cornsilk: #fefae0ff;
  --papaya-whip: #faedcdff;
  --buff: #d4a373ff;
}
```

## 2. 測驗前端設計與流程 (Frontend Design & Flow)
### 2.1. 頁面流程
整個測驗流程分為四個主要頁面：
#### 1. 首頁 (Home Page)
- 內容:
    - 測驗標題
    - 測驗說明文字欄
- 互動:
    - 一個「開始測驗」按鈕，點擊後進入個人資料頁。
#### 2. 個人資料頁 (User Info Page)
- 內容: 一個表單，用於收集使用者基本資料。
- 欄位:
    - 姓名 (Name): 文字輸入
    - 年齡 (Age): 數字輸入
    - 視覺程度 (Visual Acuity): 下拉選單或單選按鈕 (正常, 矇眼, 部分視力, 先天失明, 後天失明)
    - 慣用手 (Handedness): 下拉選單或單選按鈕 (左手, 右手)
- 互動:
    - 填寫完畢後，點擊「開始測驗」按鈕，進入測驗頁面。
#### 3. 測驗頁 (Test Page)
- 核心邏輯:
    - 測驗共八題，分為兩個階段。
    - 第一階段: 四題（方向：上、下、左、右），題目順序隨機，選項隨機排列。共有 6 個答案選項。
    - 第二階段: 四題（方向：四個角落），題目順序隨機，選項隨機排列。共有 12 個答案選項。
- 畫面佈局與功能:
    - 一次一題: 每次只顯示一道題目。
    - 題目內容: 包含一張主要參考圖片和九宮格輔助表。
    - 進度條 (Progress Bar): 畫面中上方應有一個 步驟進度條 (Step Progress Bar)，共8格，用來視覺化顯示目前在第幾題，不需額外文字。
    - 計時器 (Timer): 畫面右上角有一個碼錶。進入該題頁面後，碼錶從 0 開始計時。
    - 作答與提交: 使用者從選項中選擇一個答案，點擊「繳交」按鈕。
- 互動流程:
    - 進入題目頁，計時器啟動。
    - 使用者選擇答案，點擊「繳交」。
    - 計時器停止，系統記錄反應時間。
    - 系統立即比對答案，並給予視覺回饋（例如綠色勾勾表示正確，紅色叉叉表示錯誤）。
    - 如果答錯，需在畫面上明確標示出正確答案。
    - 顯示「下一題」按鈕，使用者點擊後載入下一道題目，計時器重置並重新開始。
#### 4. 測驗結果頁 (Results Page)
- 觸發時機: 完成全部八道題目後自動跳轉。
- 顯示內容:
    - 總準確率 (Overall Accuracy): 例如 75% (8題答對6題)。
    - 平均反應時間 (Average Reaction Time): 所有題目反應時間的- 互動:
    - 「再測驗一次」按鈕: 點擊後，跳轉回個人資料頁。
    - 「回到首頁」按鈕: 點擊後跳轉回 首頁。
### 3. 後臺管理系統 (Admin Panel System)
建議使用 Flask 框架搭配 Flask-Admin 套件來快速建構。
#### 1. 題目管理 (Question Management)
- 功能: 新增、查看、修改、刪除測驗題目。
- 題目上傳流程:
    1. 管理者進入後台，選擇「新增題目」。
    2. 上傳圖片: 上傳該題目的主要參考圖 (3D物件排列圖)。
    3. 填寫答案: 畫面上會出現 8 個 文字輸入框，分別對應八個固定的方向 (下, 右, 上, 左, 右下, 右上, 左上, 左下)。
    4. 管理者將每個方向對應的正確答案，手動依序 填入對應的輸入框。
    5. 點擊儲存，題目即建立完成。
#### 2. 作答分析 (Response Analysis)
- 功能: 視覺化分析使用者作答數據。
- 篩選: 提供日期範圍選擇器，讓管理者能篩選特定時間內的作答資料。
- 圖表呈現:
    - 使用兩個長條圖 (Bar Chart) 來呈現分析結果。
    - 圖表一: 各視覺程度準確率 (Accuracy by Visual Acuity)
        - X軸: 八個題目方向 (上, 下, 左, 右...)
        - Y軸: 準確率 (0%-100%)
        - 圖例 (Legend): 不同的視覺程度 (正常, 矇眼...)
    - 圖表二: 各視覺程度反應時間 (Reaction Time by Visual Acuity)
        - X軸: 八個題目方向
        - Y軸: 平均反應時間 (秒)
        - 圖例 (Legend): 不同的視覺程度
### 4. 建議技術架構 (Suggested Technical Architecture)
#### 4.1. 後端 (Flask)
- 核心框架: Flask
- 資料庫互動: 使用 Flask-SQLAlchemy 作為 ORM (Object-Relational Mapper)。
- 後台管理: 推薦使用 Flask-Admin，可以基於 SQLAlchemy 的模型快速生成功能完整的後台介面。
- API 設計 (Endpoints):
    - POST /api/tests: 建立一筆新的測驗。前端傳送當次測試者的所有資料 (name, age, visual_acuity, handedness)，後端建立 TestSession 記錄，並回傳 session_id。
    - GET /api/tests/<session_id>/questions: 獲取該次測驗需要的所有題目。後端從資料庫隨機選擇一組問題設定，並生成好隨機排序的八個方向題目列表。
    - POST /api/responses: 提交單題作答。前端傳送 session_id, direction, user_answer, reaction_time_ms。後端驗證答案，儲存結果，並回傳是否正確及正確答案。
    - GET /api/results/<session_id>: 獲取測驗最終結果。
/admin/*: Flask-Admin 管理後台的所有路由。
#### 4.2. 前端 (React)
- API 請求: 使用 axios 或 fetch API 與後端溝通。
- 狀態管理: 對於跨組件的狀態（如 session_id、測驗進度），可考慮使用 Context API、Zustand 或 Redux Toolkit 來管理。
- 組件化: 將UI拆分為可重用的組件，例如 HomePage, TestPage, ProgressBar, Timer, ResultPage 等。
### 5. 資料庫結構設計 (Database Schema Design)
#### test_sessions 表
記錄每一次完整的測驗過程，並包含當次測試者的資訊。
- id (PK, Integer, Auto-increment)
- question_id (FK, References questions.id)
- tester_name (String)
- tester_age (Integer)
- tester_visual_acuity (String)
- tester_handedness (String)
- finished_at (Timestamp)
- overall_accuracy (Float, Nullable)
- average_reaction_time (Integer, Nullable, in ms)
#### questions 表
儲存測驗題目內容與所有方向的答案。
- id (PK, Integer, Auto-increment)
- image_path (String)
- description (Text, Nullable)
- answer_up (String)
- answer_down (String)
- answer_left (String)
- answer_right (String)
- answer_se (String) -- 右下角
- answer_sw (String) -- 左下角
- answer_ne (String) -- 右上角
- answer_nw (String) -- 左上角
- created_at (Timestamp)
#### responses 表
儲存每一道題目的作答詳情，是數據分析的核心。
- id (PK, Integer, Auto-increment)
- test_session_id (FK, References test_sessions.id)
- direction (String)
- user_answer (String)
- is_correct (Boolean)
- reaction_time_ms (Integer)
