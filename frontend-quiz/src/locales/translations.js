export const translations = {
  zh: {
    // Page title
    pageTitle: "空間認知能力線上測驗",

    // HomePage
    title: "空間認知能力線上測驗",
    description: "本測驗旨在評估您對於三維空間物件在不同視角下的排列順序判斷能力。測驗將分為兩個階段，共八道題目。請依照指示完成測驗。",
    projectLeader: "計畫主持人：國立中興大學 趙欣怡 副教授",
    startTest: "開始測驗",
    
    // Language selection
    language: "語言",
    selectLanguage: "選擇語言",
    
    // UserInfoPage
    userInfoTitle: "請填寫您的基本資料",
    name: "姓名",
    optional: "(選填)",
    age: "年齡",
    required: "*",
    selectAge: "請選擇年齡區間",
    gender: "生理性別",
    selectGender: "請選擇生理性別",
    education: "教育程度",
    selectEducation: "請選擇教育程度",
    visionStatus: "視力狀況",
    selectVision: "請選擇視力狀況",
    injuryAge: "損傷時間",
    injuryAgePlaceholder: "請輸入損傷時的年齡",
    injuryAgeHint: "(填寫歲數/選填)",
    brailleAbility: "點字能力",
    selectBraille: "請選擇點字能力",
    mobilityAbility: "定向行動能力",
    selectMobility: "請選擇定向行動能力",
    drawingFrequency: "繪畫頻率",
    selectDrawing: "請選擇繪畫頻率",
    museumExperience: "博物館參觀經驗",
    selectMuseum: "請選擇博物館參觀經驗",
    startQuiz: "進行測驗",
    preparing: "準備中...",
    fillRequired: "請填寫所有必填欄位。",
    startTestError: "無法開始測驗，請稍後再試。",
    
    // Age options
    under9: "9以下",
    age10to19: "10-19",
    age20to29: "20-29",
    age30to39: "30-39",
    age40to49: "40-49",
    age50to59: "50-59",
    age60to69: "60-69",
    over70: "70以上",
    
    // Gender options
    male: "生理男性",
    female: "生理女性",
    other: "其它",
    
    // Education options
    elementary: "小學",
    middleSchool: "國中",
    highSchool: "高中職",
    university: "大學",
    graduate: "研究所",
    
    // Vision status options
    totalBlind: "全盲無光覺",
    severe: "重度視障",
    moderate: "中度視障",
    mild: "輕度視障",
    noImpairment: "無視覺障礙",
    
    // Ability options
    yes: "會",
    no: "不會",
    learning: "正在學習",
    
    // QuizPage
    progress: "進度:",
    time: "時間:",
    questionPrompt: "從「{direction}」方向觀看這三個物件從左到右的排列順序，哪一個是正確答案？",
    selectAnswer: "請選擇一個答案！",
    submit: "繳交",
    correct: "答對了！",
    incorrect: "答錯了！正確答案是: {answer}",
    grading: "批改中...",
    nextQuestion: "下一題",
    viewResults: "查看結果",
    loading: "載入中...",
    loadQuestionError: "無法載入題目，請稍後再試。",
    submitError: "提交答案失敗，請稍後再試。",
    
    // ResultPage
    testResult: "測驗結果",
    thankYou: "感謝您的參與，您測驗的結果為平均正確率{accuracy}、平均反應時間{averageTime}。",
    contactInfo: "如有任何問題，請聯絡計畫主持人",
    retakeTest: "再測驗一次",
    backToHome: "回到首頁",
    calculatingResults: "計算結果中...",
    resultError: "無法獲取測驗結果。",
    timeUnit: "秒",

    // Drawing frequency options
    always: "總是",
    often: "經常",
    sometimes: "偶爾",
    rarely: "很少",
    never: "沒有",
    
    // Museum experience options
    almostDaily: "幾乎每天",
    weekly1to3: "一週1~3次",
    monthly1to3: "一個月1~3次",
    yearly1to3: "一年1~3次",
    lessYearly: "一年不到1次",

    // InstructionPage
    stageTitle: "第{stage}階段說明",
    stage1Intro1: "您好，這是一項關於空間感知能力及物體位置關係的測驗，測驗中將會出現一張圖片，顯示三個物體（正立方體、圓錐體、球體）之排列方位。",
    stage1Intro2: "您被預設坐在單一方位上觀察這三個物體的方向及距離，再運用空間旋轉能力從不同方位或角度來思考三個物體在不同方位下觀看的排列順序。",
    stage1Intro3: "請從以下的選項選出不同視角觀看下，三個物體的正確排列順序。",
    stage2Intro1: "同樣地，測驗中將會出現一張圖片，顯示三個物體（正立方體、圓錐體、球體）之排列方位。",
    stage2Intro2: "您被預設坐在單一方位上觀察這三個物體的方向及距離，再運用空間旋轉能力從不同方位或角度來思考三個物體在不同方位下觀看的排列順序。",
    stage2Intro3: "請從以下的選項選出不同視角觀看下，三個物體的正確排列順序。",
    stage2Intro4: "接下來，將有來自不同角落的方位觀看三個物體，可能會有前後物體被遮蔽的狀況，能觀察到的物體數量可能會有三個或兩個。如果物體大部分被遮蔽住可以選擇不排列，如果還可以看到物體的造型，可以將其排列出來。",
    preparingImages: "正在準備圖片資源...",
    startStage: "開始測驗",
  },
  
  en: {
    // Page title
    pageTitle: "Spatial Ability Online Assessment",

    // HomePage
    title: "Spatial Ability Online Assessment",
    description: "This assessment aims to evaluate your ability to judge the arrangement order of three-dimensional spatial objects from different viewing angles. The test consists of two phases with a total of eight questions. Please complete the test according to the instructions.",
    projectLeader: "Project Leader: Associate Professor Hsin-Yi Chao, National Chung Hsing University",
    startTest: "Start Test",
    
    // Language selection
    language: "Language",
    selectLanguage: "Select Language",
    
    // UserInfoPage
    userInfoTitle: "Please Fill in Your Basic Information",
    name: "Name",
    optional: "(Optional)",
    age: "Age",
    required: "*",
    selectAge: "Please select age range",
    gender: "Biological Sex",
    selectGender: "Please select biological sex",
    education: "Education Level",
    selectEducation: "Please select education level",
    visionStatus: "Vision Status",
    selectVision: "Please select vision status",
    injuryAge: "Injury Time",
    injuryAgePlaceholder: "Please enter age at time of injury",
    injuryAgeHint: "(Enter age/Optional)",
    brailleAbility: "Braille Ability",
    selectBraille: "Please select braille ability",
    mobilityAbility: "Orientation and Mobility Ability",
    selectMobility: "Please select mobility ability",
    drawingFrequency: "Drawing Frequency",
    selectDrawing: "Please select drawing frequency",
    museumExperience: "Museum Visiting Experience",
    selectMuseum: "Please select museum visiting experience",
    startQuiz: "Start Quiz",
    preparing: "Preparing...",
    fillRequired: "Please fill in all required fields.",
    startTestError: "Unable to start test, please try again later.",
    
    // Age options
    under9: "Under 9",
    age10to19: "10-19",
    age20to29: "20-29",
    age30to39: "30-39",
    age40to49: "40-49",
    age50to59: "50-59",
    age60to69: "60-69",
    over70: "Over 70",
    
    // Gender options
    male: "Biological Male",
    female: "Biological Female",
    other: "Other",
    
    // Education options
    elementary: "Elementary School",
    middleSchool: "Middle School",
    highSchool: "High School",
    university: "University",
    graduate: "Graduate School",
    
    // Vision status options
    totalBlind: "Total Blindness (No Light Perception)",
    severe: "Severe Visual Impairment",
    moderate: "Moderate Visual Impairment",
    mild: "Mild Visual Impairment",
    noImpairment: "No Visual Impairment",
    
    // Ability options
    yes: "Yes",
    no: "No",
    learning: "Learning",
    
    // QuizPage
    progress: "Progress:",
    time: "Time:",
    questionPrompt: "Which is the correct answer when you look at the order of these three objects from left to right in the \"{direction}\" direction?",
    selectAnswer: "Please select an answer!",
    submit: "Submit",
    correct: "Correct!",
    incorrect: "Incorrect! The correct answer is: {answer}",
    grading: "Grading...",
    nextQuestion: "Next Question",
    viewResults: "View Results",
    loading: "Loading...",
    loadQuestionError: "Unable to load question, please try again later.",
    submitError: "Failed to submit answer, please try again later.",
    
    // ResultPage
    testResult: "Test Results",
    thankYou: "Thank you for your participation. Your test results are: average accuracy {accuracy}, average reaction time {averageTime}.",
    contactInfo: "If you have any questions, please contact the project leader",
    retakeTest: "Take Test Again",
    backToHome: "Back to Home",
    calculatingResults: "Calculating results...",
    resultError: "Unable to retrieve test results.",
    timeUnit: "seconds",

    // Drawing frequency options
    always: "Always",
    often: "Often",
    sometimes: "Sometimes",
    rarely: "Rarely",
    never: "Never",
    
    // Museum experience options
    almostDaily: "Almost Daily",
    weekly1to3: "1-3 Times per Week",
    monthly1to3: "1-3 Times per Month",
    yearly1to3: "1-3 Times per Year",
    lessYearly: "Less than Once per Year",

    // InstructionPage
    stageTitle: "Stage {stage} Instructions",
    stage1Intro1: "Hello, this is a test about spatial perception ability and object positional relationships. In the test, an image will appear showing the arrangement of three objects (cube, cone, sphere).",
    stage1Intro2: "You are preset to observe the direction and distance of these three objects from a single orientation, then use spatial rotation ability to think about the arrangement order of the three objects when viewed from different orientations or angles.",
    stage1Intro3: "Please select the correct arrangement order of the three objects when viewed from different perspectives from the following options.",
    stage2Intro1: "Similarly, an image will appear in the test showing the arrangement of three objects (cube, cone, sphere).",
    stage2Intro2: "You are preset to observe the direction and distance of these three objects from a single orientation, then use spatial rotation ability to think about the arrangement order of the three objects when viewed from different orientations or angles.",
    stage2Intro3: "Please select the correct arrangement order of the three objects when viewed from different perspectives from the following options.",
    stage2Intro4: "Next, there will be views from different corners, and objects may be obscured by others. The number of observable objects may be three or two. If an object is mostly obscured, you can choose not to arrange it. If you can still see the shape of the object, you can arrange it.",
    preparingImages: "Preparing image resources...",
    startStage: "Start Test",
  },
  
  ja: {
    // Page title
    pageTitle: "空間能力オンラインテスト",

    // HomePage
    title: "空間能力オンラインテスト",
    description: "このテストは、異なる視角から三次元空間オブジェクトの配列順序を判断する能力を評価することを目的としています。テストは2つの段階で構成され、全8問があります。指示に従ってテストを完了してください。",
    projectLeader: "プロジェクトリーダー：国立中興大学 趙欣怡 副教授",
    startTest: "テスト開始",
    
    // Language selection
    language: "言語",
    selectLanguage: "言語を選択",
    
    // UserInfoPage
    userInfoTitle: "基本情報をご入力ください",
    name: "氏名",
    optional: "(任意)",
    age: "年齢",
    required: "*",
    selectAge: "年齢範囲を選択してください",
    gender: "生物学的性別",
    selectGender: "生物学的性別を選択してください",
    education: "教育レベル",
    selectEducation: "教育レベルを選択してください",
    visionStatus: "視力状況",
    selectVision: "視力状況を選択してください",
    injuryAge: "障害発生時期",
    injuryAgePlaceholder: "障害発生時の年齢を入力してください",
    injuryAgeHint: "(年齢を記入/任意)",
    brailleAbility: "点字能力",
    selectBraille: "点字能力を選択してください",
    mobilityAbility: "歩行訓練能力",
    selectMobility: "歩行訓練能力を選択してください",
    drawingFrequency: "絵画頻度",
    selectDrawing: "絵画頻度を選択してください",
    museumExperience: "博物館見学経験",
    selectMuseum: "博物館見学経験を選択してください",
    startQuiz: "テスト開始",
    preparing: "準備中...",
    fillRequired: "すべての必須項目を入力してください。",
    startTestError: "テストを開始できません。後でもう一度お試しください。",
    
    // Age options
    under9: "9歳以下",
    age10to19: "10-19歳",
    age20to29: "20-29歳",
    age30to39: "30-39歳",
    age40to49: "40-49歳",
    age50to59: "50-59歳",
    age60to69: "60-69歳",
    over70: "70歳以上",
    
    // Gender options
    male: "生物学的男性",
    female: "生物学的女性",
    other: "その他",
    
    // Education options
    elementary: "小学校",
    middleSchool: "中学校",
    highSchool: "高等学校",
    university: "大学",
    graduate: "大学院",
    
    // Vision status options
    totalBlind: "全盲（光覚なし）",
    severe: "重度視覚障害",
    moderate: "中度視覚障害",
    mild: "軽度視覚障害",
    noImpairment: "視覚障害なし",
    
    // Ability options
    yes: "できる",
    no: "できない",
    learning: "学習中",
    
    // QuizPage
    progress: "進捗:",
    time: "時間:",
    questionPrompt: "「{direction}」の方向からこの三つの物体を見たとき、左から右への並び順として正しいものはどれですか？",
    selectAnswer: "答えを選択してください！",
    submit: "提出",
    correct: "正解です！",
    incorrect: "不正解です！正しい答えは: {answer}",
    grading: "採点中...",
    nextQuestion: "次の問題",
    viewResults: "結果を見る",
    loading: "読み込み中...",
    loadQuestionError: "問題を読み込めません。後でもう一度お試しください。",
    submitError: "答えの提出に失敗しました。後でもう一度お試しください。",
    
    // ResultPage
    testResult: "テスト結果",
    thankYou: "ご参加いただきありがとうございます。あなたのテスト結果は：平均正答率{accuracy}、平均反応時間{averageTime}です。",
    contactInfo: "ご質問がございましたら、プロジェクトリーダーまでお問い合わせください",
    retakeTest: "もう一度テストする",
    backToHome: "ホームに戻る",
    calculatingResults: "結果を計算中...",
    resultError: "テスト結果を取得できません。",
    timeUnit: "秒",

    // Drawing frequency options
    always: "いつも",
    often: "よく",
    sometimes: "ときどき",
    rarely: "めったに",
    never: "全くない",
    
    // Museum experience options
    almostDaily: "ほぼ毎日",
    weekly1to3: "週1~3回",
    monthly1to3: "月1~3回",
    yearly1to3: "年1~3回",
    lessYearly: "年1回未満",

    // InstructionPage
    stageTitle: "ステージ{stage}の説明",
    stage1Intro1: "こんにちは、これは空間認知能力と物体の位置関係に関するテストです。テストでは、3つの物体（立方体、円錐、球体）の配置を示す画像が表示されます。",
    stage1Intro2: "あなたは単一の方向からこれら3つの物体の方向と距離を観察し、空間回転能力を使って異なる方向や角度から3つの物体の配置順序を考えます。",
    stage1Intro3: "以下の選択肢から、異なる視点で見た時の3つの物体の正しい配置順序を選択してください。",
    stage2Intro1: "同様に、テストでは3つの物体（立方体、円錐、球体）の配置を示す画像が表示されます。",
    stage2Intro2: "あなたは単一の方向からこれら3つの物体の方向と距離を観察し、空間回転能力を使って異なる方向や角度から3つの物体の配置順序を考えます。",
    stage2Intro3: "以下の選択肢から、異なる視点で見た時の3つの物体の正しい配置順序を選択してください。",
    stage2Intro4: "次に、異なる角度からの視点があり、物体が他の物体に遮られる場合があります。観察できる物体の数は3個または2個の場合があります。物体がほとんど遮られている場合は配置しないことを選択でき、物体の形状がまだ見える場合は配置することができます。",
    preparingImages: "画像リソースを準備中...",
    startStage: "テスト開始",
  }
};

export const supportedLanguages = [
  { code: 'zh', name: '中文', englishName: 'Chinese' },
  { code: 'en', name: 'English', englishName: 'English' },
  { code: 'ja', name: '日本語', englishName: 'Japanese' }
];

