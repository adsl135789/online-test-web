# 空間能力線上測驗系統

一個基於 React + Vite 的多語言空間認知能力測驗平台，支援中文、英文與日文三種語言。

## 📋 專案簡介

本系統旨在評估使用者對於三維空間物件在不同視角下的排列順序判斷能力。測驗分為兩個階段，共八道題目，提供直觀的 3D 物件視覺化與方向指引。

## ✨ 功能特色

- **多語言支援**：支援中文（繁體）、英文、日文
- **響應式設計**：適配各種螢幕尺寸
- **空間認知測驗**：3D 物件排列順序判斷
- **視覺化指引**：5x5 方向指引格子與箭頭提示
- **無障礙友善**：考量視覺障礙使用者需求
- **即時計時**：精確到 10ms 的反應時間測量
- **詳細報告**：提供準確率與平均反應時間分析

## 🛠 技術架構

- **前端框架**：React 19.1.0
- **建置工具**：Vite 7.0.0
- **路由管理**：React Router DOM 7.8.0
- **樣式框架**：Tailwind CSS 3.4.17
- **HTTP 請求**：Axios 1.10.0
- **開發工具**：ESLint + PostCSS

## 📦 安裝步驟

### 1. 環境需求
```bash
curl -fsSL https//deb.nodesource.com/setup_20.x | sudo -E bash - sudo apt install -y nodejs
```
確保您的系統已安裝：
- Node.js (版本 16.0.0 或以上)
- npm 或 yarn 套件管理器

### 2. 複製專案

```bash
git clone <your-repository-url>
cd frontend-quiz
```

### 3. 安裝相依套件

使用 npm：
```bash
npm install
```

或使用 yarn：
```bash
yarn install
```

### 4. 啟動開發伺服器

```bash
npm run dev
```
或
```bash
yarn dev
```

專案將在 `http://localhost:5173` 啟動

### 5. 建置生產版本

```bash
npm run build
```
或
```bash
yarn build
```

## 🚀 使用說明

### 基本流程

1. **選擇語言**：在首頁右上角選擇偏好語言
2. **填寫資料**：輸入基本個人資訊（部分為必填）
3. **進行測驗**：依序回答 8 道空間認知題目
4. **查看結果**：獲得準確率與平均反應時間報告

### 測驗內容

- **題目類型**：3D 物件（正方形⬛、三角形🔺、圓形🟢）排列順序判斷
- **觀看角度**：8 個不同方向（上、下、左、右、東北、西北、東南、西南）
- **答題方式**：多選一，每題限時回答
- **計分標準**：正確性與反應時間

### 個人資料欄位

**必填項目**：
- 年齡區間
- 生理性別
- 教育程度
- 視力狀況
- 點字能力
- 定向行動能力

**選填項目**：
- 姓名
- 損傷時間

## 📁 專案結構

```
frontend-quiz/
├── public/                 # 靜態資源
├── src/
│   ├── components/         # React 元件
│   │   ├── HomePage.jsx    # 首頁
│   │   ├── UserInfoPage.jsx # 使用者資料頁
│   │   ├── QuizPage.jsx    # 測驗頁面
│   │   ├── ResultPage.jsx  # 結果頁面
│   │   └── LanguageSelector.jsx # 語言選擇器
│   ├── contexts/           # React Context
│   │   └── LanguageContext.jsx # 多語言狀態管理
│   ├── locales/            # 多語言資源
│   │   └── translations.js # 翻譯檔案
│   ├── App.jsx            # 主要應用程式元件
│   ├── main.jsx           # 應用程式進入點
│   └── index.css          # 全域樣式
├── index.html             # HTML 模板
├── package.json           # 專案配置
├── tailwind.config.js     # Tailwind CSS 配置
├── vite.config.js         # Vite 配置
└── README.md             # 專案說明文件
```

## 🎨 自訂配色

專案使用自訂的溫和色調：

```javascript
colors: {
  'tea-green': '#ccd5aeff',    // 茶綠色
  'beige': '#e9edc9ff',        // 米色
  'cornsilk': '#fefae0ff',     // 玉米絲色
  'papaya-whip': '#faedcdff',  // 木瓜色
  'buff': '#d4a373ff',         // 淺黃褐色
}
```

## 🔧 開發指令

```bash
# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 執行 ESLint 檢查
npm run lint
```

## 🌐 多語言支援

### 支援語言

- 🇹🇼 中文（繁體）
- 🇺🇸 English
- 🇯🇵 日本語

### 新增語言

1. 在 `src/locales/translations.js` 中新增語言資料
2. 更新 `supportedLanguages` 陣列
3. 測試所有頁面的翻譯完整性

## 📱 響應式設計

- **桌面版**：完整功能與大圖顯示
- **平板版**：適配中等螢幕尺寸
- **手機版**：優化觸控操作體驗

## 🧪 測試建議

1. **跨瀏覽器測試**：Chrome、Firefox、Safari、Edge
2. **多裝置測試**：桌機、平板、手機
3. **語言切換測試**：確保所有文字正確翻譯
4. **無障礙測試**：鍵盤導航、螢幕閱讀器相容性

## ⚠️ 注意事項

- 本專案需要配合後端 API 使用
- 確保後端伺服器在 `http://localhost:5000` 運行
- 測驗資料將暫存在瀏覽器 localStorage 中
- 建議使用現代瀏覽器以獲得最佳體驗

## 🤝 貢獻指南

1. Fork 本專案
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 提交變更：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 發起 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案