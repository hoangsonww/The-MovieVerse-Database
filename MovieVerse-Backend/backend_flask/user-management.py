from flask import Flask, request, jsonify, session
import sqlite3
import hashlib

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with your secret key

# Database setup
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def setup_database():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL)''')
    conn.commit()
    conn.close()

def teardown_database():
    conn = get_db_connection()
    conn.execute('DROP TABLE IF EXISTS users')
    conn.commit()
    conn.close()

setup_database()

# Utility function to hash passwords
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Register new user
@app.route('/register', methods=['POST'])
def register():
    request_data = request.get_json()
    username = request_data['username']
    password = hash_password(request_data['password'])

    try:
        conn = get_db_connection()
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                     (username, password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409

# Get all users
@app.route('/users')
def users():
    conn = get_db_connection()
    users = conn.execute('SELECT * FROM users').fetchall()
    conn.close()

    return jsonify([dict(user) for user in users]), 200

# Get user by id
@app.route('/users/<int:id>')
def user(id):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE id = ?',
                        (id,)).fetchone()
    conn.close()

    if user:
        return jsonify(dict(user)), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Update user by id
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    request_data = request.get_json()
    username = request_data['username']
    password = hash_password(request_data['password'])

    try:
        conn = get_db_connection()
        conn.execute('UPDATE users SET username = ?, password = ? WHERE id = ?',
                     (username, password, id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User updated successfully'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409
    except sqlite3.OperationalError:
        return jsonify({'error': 'User not found'}), 404

# Delete user by id
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM users WHERE id = ?',
                 (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User deleted successfully'}), 200

# User login
@app.route('/login', methods=['POST'])
def login():
    request_data = request.get_json()
    username = request_data['username']
    password = hash_password(request_data['password'])

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ?',
                        (username,)).fetchone()
    conn.close()

    if user and user['password'] == password:
        session['user_id'] = user['id']
        return jsonify({'message': 'Logged in successfully'}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Get current user
@app.route('/user')
def current_user():
    if 'user_id' in session:
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE id = ?',
                            (session['user_id'],)).fetchone()
        conn.close()

        return jsonify(dict(user)), 200
    else:
        return jsonify({'error': 'User is not logged in'}), 401

# Check if user is logged in
@app.route('/status')
def status():
    if 'user_id' in session:
        return jsonify({'message': 'User is logged in'}), 200
    else:
        return jsonify({'error': 'User is not logged in'}), 401

# User logout
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
