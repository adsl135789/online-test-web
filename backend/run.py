# run.py
from flask import Flask
from utils.config import DevelopmentConfig
from utils.extensions import db, cors
from utils.models import Question, TestSession, Response

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    
    # 1. 載入設定
    app.config.from_object(config_class)
    
    # 2. 初始化擴充套件
    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})  # 允許所有 /api/ 的跨域請求
    
    # 3. 註冊 Blueprints
    from api.quiz_routes import quiz_api_bp
    from api.admin_routes import admin_api_bp
    
    app.register_blueprint(quiz_api_bp)
    app.register_blueprint(admin_api_bp)
    
    # 4. 建立資料庫表格 (如果需要)
    with app.app_context():
        # 如果您在外部使用 flask shell 或 flask-migrate，通常不需要這行
        # 把它放在這裡可以確保在第一次運行時自動建立表格
        db.create_all()

    return app

# 透過應用程式工廠建立 app 實例
app = create_app()

if __name__ == '__main__':
    # 這裡的 debug=True 僅限於開發環境使用
    app.run(debug=True)