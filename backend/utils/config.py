import os
from dotenv import load_dotenv

# 找 .env file path
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
    
# 取得 backend 資料夾的絕對路徑
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """基礎設定類別"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False # 用來追蹤資料庫物件在 Session 中的每一次變更，不要開
    UPLOADED_PATH = os.path.join(basedir, 'static', 'uploads')
    
class DevelopmentConfig(Config):
    """開發環境設定"""
    DEBUG = True
    db_user = os.environ.get('POSTGRES_USER')
    db_password = os.environ.get('POSTGRES_PASSWORD')
    db_name = os.environ.get('POSTGRES_DB')
    db_host = os.environ.get('POSTGRES_HOST', 'localhost')  # 預設為 localhost
    db_port = '5432'
    SQLALCHEMY_DATABASE_URI = f'postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'
