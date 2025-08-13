# backend/extensions.py
# 避免循環依賴
# 這些物件都還沒有和您的主要 Flask app綁定，皆處於一個等待被啟用的狀態。

from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# 建立一個 SQLAlchemy 的物件，它未來將負責所有與資料庫的互動。
db = SQLAlchemy()

# 負責處理跨域請求，讓您的前端能順利呼叫後端 API。
cors = CORS() 