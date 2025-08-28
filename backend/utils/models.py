# backend/models.py
from .extensions import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(255), nullable=True) # 題目參考圖片

    # 物件座標 (儲存 1-3 的整數)
    square_x = db.Column(db.Integer, nullable=False)
    square_y = db.Column(db.Integer, nullable=False)
    triangle_x = db.Column(db.Integer, nullable=False)
    triangle_y = db.Column(db.Integer, nullable=False)
    circle_x = db.Column(db.Integer, nullable=False)
    circle_y = db.Column(db.Integer, nullable=False)

    # 八個方向的答案 (儲存 "S,T,C" 這樣的字串)
    answer_down = db.Column(db.String(100), nullable=False)
    answer_up = db.Column(db.String(100), nullable=False)
    answer_left = db.Column(db.String(100), nullable=False)
    answer_right = db.Column(db.String(100), nullable=False)
    answer_se = db.Column(db.String(100), nullable=False) # 右下
    answer_sw = db.Column(db.String(100), nullable=False) # 左下
    answer_ne = db.Column(db.String(100), nullable=False) # 右上
    answer_nw = db.Column(db.String(100), nullable=False) # 左上

    # 新增欄位
    is_active = db.Column(db.Boolean, default=True, nullable=False)  # 是否啟用於測驗
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class TestSession(db.Model):
    __tablename__ = 'test_sessions'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    
    # 更新測試者資料欄位
    tester_name = db.Column(db.String(100), nullable=True)  # 姓名（非必要）
    tester_age_group = db.Column(db.String(20), nullable=False)  # 年齡區間
    tester_gender = db.Column(db.String(20), nullable=False)  # 生理性別
    tester_education = db.Column(db.String(20), nullable=False)  # 教育程度
    tester_vision_status = db.Column(db.String(30), nullable=False)  # 視力狀況
    tester_injury_age = db.Column(db.Integer, nullable=True)  # 損傷時間（非必填）
    tester_braille_ability = db.Column(db.String(20), nullable=False)  # 點字能力
    tester_mobility_ability = db.Column(db.String(20), nullable=False)  # 定向行動能力
    tester_drawing_frequency = db.Column(db.String(20), nullable=False)  # 繪畫頻率
    tester_museum_experience = db.Column(db.String(30), nullable=False)  # 博物館參觀經驗
    
    finished_at = db.Column(db.DateTime(timezone=True))
    overall_accuracy = db.Column(db.Float)
    average_reaction_time = db.Column(db.Integer)
    question_order = db.Column(JSONB) 
    
    # 建立與 Response 的關聯
    responses = db.relationship('Response', backref='test_session', lazy=True)

class Response(db.Model):
    __tablename__ = 'responses'
    id = db.Column(db.Integer, primary_key=True)
    test_session_id = db.Column(db.Integer, db.ForeignKey('test_sessions.id'), nullable=False)
    direction = db.Column(db.String(50))
    user_answer = db.Column(db.String(100))
    correct_answer = db.Column(db.String(100))
    is_correct = db.Column(db.Boolean)
    reaction_time_ms = db.Column(db.Integer)