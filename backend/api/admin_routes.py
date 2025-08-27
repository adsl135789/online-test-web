# backend/api/admin_routes.py
import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from PIL import Image
from utils.models import Question, Response, TestSession 
from utils.extensions import db

# 建立一個名為 'admin_api' 的 Blueprint
admin_api_bp = Blueprint('admin_api', __name__, url_prefix='/api/admin')

# 允許的圖片副檔名
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_webp(input_path, output_path):
    """
    將圖片轉換為 WebP 格式
    """
    try:
        with Image.open(input_path) as img:
            # 檢查圖片是否需要透明度
            if img.mode == 'RGBA':
                # 儲存為無失真 WebP，保留透明度
                img.save(
                    output_path,
                    'WEBP',
                    lossless=True,
                    quality=80, # lossless=True 時，quality 代表壓縮力度
                    method=6    # 追求最佳壓縮效果
                )
            else:
                # 儲存為失真 WebP，類似 JPEG
                img.save(
                    output_path,
                    'WEBP',
                    quality=80, # 類似 JPEG 的品質設定
                    method=6
                )
        return True
    except Exception as e:
        print(f"轉換失敗: {e}")
        return False

def convert_to_webp_from_file_object(file_obj, output_path):
    """
    直接從檔案物件轉換為 WebP 格式
    """
    try:
        with Image.open(file_obj) as img:
            # 檢查圖片是否需要透明度
            if img.mode == 'RGBA':
                # 儲存為無失真 WebP，保留透明度
                img.save(
                    output_path,
                    'WEBP',
                    lossless=True,
                    quality=80,
                    method=6
                )
            else:
                # 儲存為失真 WebP，類似 JPEG
                img.save(
                    output_path,
                    'WEBP',
                    quality=80,
                    method=6
                )
        return True
    except Exception as e:
        print(f"轉換失敗: {e}")
        return False

@admin_api_bp.route('/questions', methods=['GET'])
def get_questions():
    """
    獲取所有問題的列表
    """
    try:
        questions = Question.query.order_by(Question.id.desc()).all()
        results = [
            {
                "id": q.id,
                "image_path": q.image_path,
                "square_x": q.square_x,
                "square_y": q.square_y,
                "triangle_x": q.triangle_x,
                "triangle_y": q.triangle_y,
                "circle_x": q.circle_x,
                "circle_y": q.circle_y,
                "answer_down": q.answer_down,
                "answer_up": q.answer_up,
                "answer_left": q.answer_left,
                "answer_right": q.answer_right,
                "answer_se": q.answer_se,
                "answer_sw": q.answer_sw,
                "answer_ne": q.answer_ne,
                "answer_nw": q.answer_nw,
                "is_active": q.is_active,  # 新增這一行
            } for q in questions
        ]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": "無法獲取問題列表", "message": str(e)}), 500

@admin_api_bp.route('/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    """獲取單一問題的詳細資料"""
    q = Question.query.get_or_404(question_id)
    result = {
        "id": q.id, 
        "image_path": q.image_path,
        "square_x": q.square_x, "square_y": q.square_y,
        "triangle_x": q.triangle_x, "triangle_y": q.triangle_y,
        "circle_x": q.circle_x, "circle_y": q.circle_y,
        "answer_up": q.answer_up, "answer_down": q.answer_down,
        "answer_left": q.answer_left, "answer_right": q.answer_right,
        "answer_ne": q.answer_ne, "answer_nw": q.answer_nw,
        "answer_se": q.answer_se, "answer_sw": q.answer_sw,
        "is_active": q.is_active,  # 新增這一行
    }
    return jsonify(result)

@admin_api_bp.route('/questions', methods=['POST'])
def create_question():
    """
    建立一個新的問題 (包含圖片上傳)
    前端需要使用 multipart/form-data 來發送請求
    """
    # --- 1. 從表單中獲取資料 ---
    # request.form 包含所有非檔案的欄位 (JSON 字串)
    # request.files 包含所有檔案欄位
    
    # 檢查是否有 'image' 這個檔案部分
    if 'image' not in request.files:
        return jsonify({"error": "請求中沒有圖片檔案"}), 400
    
    file = request.files['image']
    
    # 如果使用者沒有選擇檔案，瀏覽器可能會送出一個沒有檔名的空檔案
    if file.filename == '':
        return jsonify({"error": "沒有選擇任何檔案"}), 400

    # --- 2. 處理圖片儲存 ---
    if file and allowed_file(file.filename):
        original_filename = secure_filename(file.filename)
        # 更改副檔名為 .webp，並添加時間戳避免檔名衝突
        import time
        timestamp = str(int(time.time()))
        filename_without_ext = os.path.splitext(original_filename)[0]
        webp_filename = f"{filename_without_ext}_{timestamp}.webp"
        
        # 確保上傳資料夾存在
        upload_folder = current_app.config['UPLOADED_PATH']
        os.makedirs(upload_folder, exist_ok=True)
        
        # 直接轉換為 WebP 格式
        webp_file_path = os.path.join(upload_folder, webp_filename)
        if convert_to_webp_from_file_object(file, webp_file_path):
            # 我們在資料庫中只儲存相對於 static 資料夾的路徑
            db_image_path = os.path.join('uploads', webp_filename)
        else:
            return jsonify({"error": "圖片壓縮轉換失敗"}), 500
    else:
        return jsonify({"error": "不允許的檔案格式"}), 400

    # --- 3. 處理其他表單資料 ---
    try:
        new_question = Question(
            id=int(filename_without_ext) if filename_without_ext.isdigit() else None,
            image_path=db_image_path,
            square_x=request.form.get('square_x', type=int),
            square_y=request.form.get('square_y', type=int),
            triangle_x=request.form.get('triangle_x', type=int),
            triangle_y=request.form.get('triangle_y', type=int),
            circle_x=request.form.get('circle_x', type=int),
            circle_y=request.form.get('circle_y', type=int),
            answer_down=request.form.get('answer_down'),
            answer_up=request.form.get('answer_up'),
            answer_left=request.form.get('answer_left'),
            answer_right=request.form.get('answer_right'),
            answer_se=request.form.get('answer_se'),
            answer_sw=request.form.get('answer_sw'),
            answer_ne=request.form.get('answer_ne'),
            answer_nw=request.form.get('answer_nw'),
        )
        db.session.add(new_question)
        db.session.commit()
    except Exception as e:
        # 如果發生錯誤，需要刪除已上傳的圖片
        if os.path.exists(webp_file_path):
            os.remove(webp_file_path)
        return jsonify({"error": "資料庫儲存失敗", "message": str(e)}), 500

    return jsonify({"message": "問題建立成功", "question_id": new_question.id}), 201

@ admin_api_bp.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """
    刪除指定 ID 的問題
    """
    question = Question.query.get_or_404(question_id)
    if not question:
        return jsonify({"error": "問題不存在"}), 404

     # 刪除與此問題相關的 test_sessions 和 responses
    # 這一步很重要，避免因為外鍵約束導致刪除失敗
    TestSession.query.filter_by(question_id=question.id).delete()
    # 注意：如果 Response 表有外鍵到 TestSession，上面的刪除會自動級聯，
    # 如果沒有，您可能需要手動刪除 Response

    # 刪除圖片檔案
    if question.image_path:
        try:
            # 我們需要完整的伺服器路徑來刪除檔案
            full_path = os.path.join(current_app.root_path, 'static', question.image_path)
            if os.path.exists(full_path):
                os.remove(full_path)
        except Exception as e:
            print(f"刪除圖片失敗: {e}")

    db.session.delete(question)
    db.session.commit()
    
    return jsonify({"message": f"問題 ID {question_id} 已成功刪除"}), 200
 
@admin_api_bp.route('/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """更新一個現有的問題"""
    question = Question.query.get_or_404(question_id)

    # 處理圖片更新 (可選)
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '' and allowed_file(file.filename):
            # 刪除舊圖片
            if question.image_path:
                old_path = os.path.join(current_app.root_path, 'static', question.image_path)
                if os.path.exists(old_path): os.remove(old_path)
            
            # 處理新圖片壓縮
            original_filename = secure_filename(file.filename)
            import time
            timestamp = str(int(time.time()))
            filename_without_ext = os.path.splitext(original_filename)[0]
            webp_filename = f"{filename_without_ext}_{timestamp}.webp"
            
            upload_folder = current_app.config['UPLOADED_PATH']
            os.makedirs(upload_folder, exist_ok=True)
            
            # 直接轉換為 WebP 格式
            webp_file_path = os.path.join(upload_folder, webp_filename)
            if convert_to_webp_from_file_object(file, webp_file_path):
                question.image_path = os.path.join('uploads', webp_filename)
            else:
                return jsonify({"error": "圖片壓縮轉換失敗"}), 500

    # 更新其他資料
    try:
        question.square_x = request.form.get('square_x', question.square_x, type=int)
        question.square_y = request.form.get('square_y', question.square_y, type=int)
        question.triangle_x = request.form.get('triangle_x', question.triangle_x, type=int)
        question.triangle_y = request.form.get('triangle_y', question.triangle_y, type=int)
        question.circle_x = request.form.get('circle_x', question.circle_x, type=int)
        question.circle_y = request.form.get('circle_y', question.circle_y, type=int)
        question.answer_down = request.form.get('answer_down', question.answer_down)
        question.answer_up = request.form.get('answer_up', question.answer_up)
        question.answer_left = request.form.get('answer_left', question.answer_left)
        question.answer_right = request.form.get('answer_right', question.answer_right)
        question.answer_se = request.form.get('answer_se', question.answer_se)
        question.answer_sw = request.form.get('answer_sw', question.answer_sw)
        question.answer_ne = request.form.get('answer_ne', question.answer_ne)
        question.answer_nw = request.form.get('answer_nw', question.answer_nw)
        
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "資料庫更新失敗", "message": str(e)}), 500

    return jsonify({"message": f"問題 ID {question_id} 更新成功"}), 200

@admin_api_bp.route('/questions/batch-toggle', methods=['POST'])
def batch_toggle_questions():
    """批量啟用/停用題目"""
    data = request.get_json()
    question_ids = data.get('question_ids', [])
    is_active = data.get('is_active', True)
    
    if not question_ids:
        return jsonify({"error": "請選擇要修改的題目"}), 400
    
    try:
        Question.query.filter(Question.id.in_(question_ids)).update(
            {'is_active': is_active}, synchronize_session=False
        )
        db.session.commit()
        action = "啟用" if is_active else "停用"
        return jsonify({"message": f"成功{action} {len(question_ids)} 道題目"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "批量操作失敗", "message": str(e)}), 500

@admin_api_bp.route('/questions/<int:question_id>/toggle', methods=['POST'])
def toggle_question(question_id):
    """切換單一題目的啟用狀態"""
    question = Question.query.get_or_404(question_id)
    question.is_active = not question.is_active
    print(f"切換題目 {question_id} 的啟用狀態為: {question.is_active}")
    try:
        db.session.commit()
        status = "啟用" if question.is_active else "停用"
        print(f"題目 {question_id} 已{status}")
        return jsonify({"message": f"題目已{status}", "is_active": question.is_active}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "操作失敗", "message": str(e)}), 500

@admin_api_bp.route('/test-sessions', methods=['GET'])
def get_all_test_sessions():
    """
    獲取所有測試會話的資料，包含八個方向的回應詳情
    """
    try:
        # 查詢所有測試會話，並預載入相關的回應資料
        test_sessions = TestSession.query.options(
            db.joinedload(TestSession.responses)
        ).order_by(TestSession.id.desc()).all()
        
        results = []
        for session in test_sessions:
            # 組織回應資料為八個方向的字典
            responses_by_direction = {}
            for response in session.responses:
                responses_by_direction[response.direction] = {
                    "user_answer": response.user_answer,
                    "correct_answer": response.correct_answer,
                    "is_correct": response.is_correct,
                    "reaction_time_ms": response.reaction_time_ms
                }
            
            session_data = {
                "id": session.id,
                "question_id": session.question_id,
                "tester_name": session.tester_name,
                "tester_age_group": session.tester_age_group,
                "tester_gender": session.tester_gender,
                "tester_education": session.tester_education,
                "tester_vision_status": session.tester_vision_status,
                "tester_injury_age": session.tester_injury_age,
                "tester_braille_ability": session.tester_braille_ability,
                "tester_mobility_ability": session.tester_mobility_ability,
                "tester_drawing_frequency": session.tester_drawing_frequency,
                "tester_museum_experience": session.tester_museum_experience,
                "finished_at": session.finished_at.isoformat() if session.finished_at else None,
                "overall_accuracy": session.overall_accuracy,
                "average_reaction_time": session.average_reaction_time,
                "question_order": session.question_order,
                "responses": responses_by_direction
            }
            results.append(session_data)
        
        return jsonify({
            "total_sessions": len(results),
            "sessions": results
        }), 200
        
    except Exception as e:
        return jsonify({"error": "無法獲取測試會話資料", "message": str(e)}), 500

@admin_api_bp.route('/test-sessions/batch-delete', methods=['POST'])
def batch_delete_test_sessions():
    """批量刪除測試會話及其對應的回應資料"""
    data = request.get_json()
    session_ids = data.get('session_ids', [])
    
    if not session_ids:
        return jsonify({"error": "請選擇要刪除的測試會話"}), 400
    
    try:
        # 確認所有session_ids都存在
        existing_sessions = TestSession.query.filter(TestSession.id.in_(session_ids)).all()
        existing_ids = [session.id for session in existing_sessions]
        
        if len(existing_ids) != len(session_ids):
            missing_ids = list(set(session_ids) - set(existing_ids))
            return jsonify({
                "error": f"部分測試會話不存在: {missing_ids}"
            }), 404
        
        # 先刪除所有相關的responses
        deleted_responses = Response.query.filter(
            Response.test_session_id.in_(session_ids)
        ).delete(synchronize_session=False)
        
        # 再刪除test_sessions
        deleted_sessions = TestSession.query.filter(
            TestSession.id.in_(session_ids)
        ).delete(synchronize_session=False)
        
        db.session.commit()
        
        return jsonify({
            "message": f"成功刪除 {deleted_sessions} 個測試會話和 {deleted_responses} 個回應記錄",
            "deleted_sessions": deleted_sessions,
            "deleted_responses": deleted_responses
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "批量刪除失敗", 
            "message": str(e)
        }), 500

@admin_api_bp.route('/test-sessions/<int:session_id>', methods=['DELETE'])
def delete_single_test_session(session_id):
    """刪除單一測試會話及其對應的回應資料"""
    try:
        # 確認測試會話存在
        session = TestSession.query.get_or_404(session_id)
        
        # 先刪除相關的responses
        deleted_responses = Response.query.filter_by(test_session_id=session_id).delete()
        
        # 再刪除test_session
        db.session.delete(session)
        db.session.commit()
        
        return jsonify({
            "message": f"成功刪除測試會話 {session_id} 和 {deleted_responses} 個回應記錄"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "刪除測試會話失敗", 
            "message": str(e)
        }), 500
