import psycopg2
from config.config import Config

def get_db_connection():
    conn = psycopg2.connect(
        dbname=Config.DB_NAME,
        user=Config.DB_USER,
        host=Config.DB_HOST
    )
    conn.autocommit = False  # 🔴 IMPORTANT
    return conn
