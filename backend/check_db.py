import sqlite3
import os

db_path = 'xls_cleaner.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print('Tables created:', [table[0] for table in tables])
    
    # Check users table structure
    cursor.execute("PRAGMA table_info(users);")
    columns = cursor.fetchall()
    print('Users table columns:', [(col[1], col[2]) for col in columns])
    
    conn.close()
else:
    print('Database file not found')