# backend/api/quiz_routes.py
import random
from datetime import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy.sql.expression import func
from utils.models import Question, TestSession, Response
from utils.extensions import db

quiz_api_bp = Blueprint('quiz_api', __name__, url_prefix='/api/quiz')

@quiz_api_bp.route('/start', methods=['POST'])
def start_quiz():
    """開始一個新的測驗"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "請求中沒有資料"}), 400

    # 檢查必填欄位
    required_fields = ['age_group', 'gender', 'education', 'vision_status', 
                      'braille_ability', 'mobility_ability', 'drawing_frequency', 'museum_experience']
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"缺少必填欄位: {field}"}), 400

    # 只從啟用的題目中隨機選擇
    random_question = Question.query.filter_by(is_active=True).order_by(func.random()).first()
    if not random_question:
        return jsonify({"error": "題庫中沒有任何啟用的問題"}), 404

    stage1_directions = ['up', 'down', 'left', 'right']
    stage2_directions = ['ne', 'nw', 'se', 'sw']
    random.shuffle(stage1_directions)
    random.shuffle(stage2_directions)
    question_order = stage1_directions + stage2_directions

    try:
        # 處理損傷時間（非必填）
        injury_age = None
        if data.get('injury_age'):
            try:
                injury_age = int(data['injury_age'])
            except ValueError:
                return jsonify({"error": "損傷時間必須是數字"}), 400

        new_session = TestSession(
            question_id=random_question.id,
            tester_name=data.get('name'),  # 姓名（非必要）
            tester_age_group=data['age_group'],
            tester_gender=data['gender'],
            tester_education=data['education'],
            tester_vision_status=data['vision_status'],
            tester_injury_age=injury_age,
            tester_braille_ability=data['braille_ability'],
            tester_mobility_ability=data['mobility_ability'],
            tester_drawing_frequency=data['drawing_frequency'],
            tester_museum_experience=data['museum_experience'],
            question_order=question_order
        )
        db.session.add(new_session)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "建立測驗失敗", "message": str(e)}), 500
    
    return jsonify({
        "message": "測驗已成功建立",
        "session_id": new_session.id,
        "question_id": new_session.question_id,
        "question_order": new_session.question_order,
        "question_image": random_question.image_path,
        "square_x": random_question.square_x,
        "square_y": random_question.square_y,
        "triangle_x": random_question.triangle_x,
        "triangle_y": random_question.triangle_y,
        "circle_x": random_question.circle_x,
        "circle_y": random_question.circle_y
    }), 201

@quiz_api_bp.route('/<int:session_id>/answer', methods=['POST'])
def submit_answer(session_id):
    """提交單題答案並記錄"""
    data = request.get_json()
    if not all(k in data for k in ['direction', 'answer', 'time_ms']):
        return jsonify({"error": "請求資料不完整"}), 400

    session = TestSession.query.get_or_404(session_id)
    question = Question.query.get_or_404(session.question_id)

    direction = data['direction']
    correct_answer = getattr(question, f"answer_{direction}", None)
    is_correct = (correct_answer == data['answer'])

    try:
        new_response = Response(
            test_session_id=session.id,
            direction=direction,
            user_answer=data['answer'],
            reaction_time_ms=data['time_ms'],
            is_correct=is_correct
        )
        db.session.add(new_response)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "儲存答案失敗", "message": str(e)}), 500

    return jsonify({
        "is_correct": is_correct,
        "correct_answer": correct_answer
    })

@quiz_api_bp.route('/<int:session_id>/result', methods=['GET'])
def get_quiz_result(session_id):
    """計算並獲取最終測驗結果"""
    session = TestSession.query.get_or_404(session_id)
    responses = Response.query.filter_by(test_session_id=session.id).all()

    if not responses or len(responses) == 0:
        return jsonify({"error": "找不到此測驗的任何作答記錄"}), 404

    total_questions = len(responses)
    correct_count = sum(1 for r in responses if r.is_correct)
    total_time_ms = sum(r.reaction_time_ms for r in responses)

    accuracy = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    avg_time_ms = total_time_ms / total_questions if total_questions > 0 else 0
    
    # 更新並儲存最終結果到 TestSession
    try:
        session.overall_accuracy = accuracy
        session.average_reaction_time = avg_time_ms
        session.finished_at = datetime.utcnow()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "更新測驗結果失敗", "message": str(e)}), 500
        
    return jsonify({
        "accuracy": f"{accuracy:.2f}%",
        "average_reaction_time": f"{avg_time_ms / 1000:.2f}"
    })