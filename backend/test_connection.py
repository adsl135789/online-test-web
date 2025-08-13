import os
import psycopg
from dotenv import load_dotenv

# 載入環境變數
load_dotenv('.env')

# 取得連線參數
db_user = os.environ.get('POSTGRES_USER')
db_password = os.environ.get('POSTGRES_PASSWORD')
db_name = os.environ.get('POSTGRES_DB')
db_host = os.environ.get('POSTGRES_HOST')
db_port = '5432'

# 建立連線字串
connection_string = f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

print(f"嘗試連接到: {db_host}")
print(f"資料庫: {db_name}")
print(f"使用者: {db_user}")

try:
    # 嘗試連線
    with psycopg.connect(connection_string) as conn:
        with conn.cursor() as cur:
            cur.execute('SELECT version();')
            version = cur.fetchone()
            print("✅ 連線成功!")
            print(f"PostgreSQL 版本: {version[0]}")
            
except Exception as e:
    print("❌ 連線失敗:")
    print(f"錯誤訊息: {e}")