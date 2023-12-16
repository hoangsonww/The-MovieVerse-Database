from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'

users_db = new MongoDB()

# User model
class User:
    def __init__(self, username, password):
        self.id = str(uuid.uuid4())
        self.username = username
        self.password = generate_password_hash(password)
        self.data = {}

    def add_data(self, key, value):
        self.data[key] = value

    def get_data(self, key):
        return self.data.get(key, None)

# Backend service
class BackendService:
    def __init__(self):
        self.users = users_db

    def register_user(self, username, password):
        if username in self.users:
            return False, "Username already exists."
        self.users[username] = User(username, password)
        return True, "User registered successfully."

    def get_user(self, username):
        return self.users.get(username, None)

    def authenticate_user(self, username, password):
        user = self.get_user(username)
        if user and check_password_hash(user.password, password):
            return True, user
        return False, None

    def delete_user(self, username):
        if username in self.users:
            del self.users[username]
            return True, "User deleted successfully."
        return False, "User not found."

    def update_user_data(self, username, key, value):
        user = self.get_user(username)
        if not user:
            return False, "User not found."
        user.add_data(key, value)
        return True, "Data updated successfully."

    def list_all_users(self):
        return list(self.users.keys())

service = BackendService()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = service.get_user(data['username'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    success, message = service.register_user(username, password)
    return jsonify({"success": success, "message": message})

# User Login
@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    success, user = service.authenticate_user(auth['username'], auth['password'])
    if not success:
        return jsonify({'message': 'Login failed'}), 401

    token = jwt.encode({'username': user.username, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, app.config['SECRET_KEY'])
    return jsonify({'token': token})

# Get User Data
@app.route('/user/<username>', methods=['GET'])
@token_required
def get_user(current_user, username):
    if current_user.username != username:
        return jsonify({'message': 'Cannot perform that function!'}), 403

    user = service.get_user(username)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    return jsonify({"success": True, "username": user.username, "data": user.data})

# Update User Data
@app.route('/user/<username>', methods=['PUT'])
@token_required
def update_user_data(current_user, username):
    if current_user.username != username:
        return jsonify({'message': 'Cannot perform that function!'}), 403

    data = request.json
    key = data.get('key')
    value = data.get('value')
    success, message = service.update_user_data(username, key, value)
    return jsonify({"success": success, "message": message})

# Delete User
@app.route('/user/<username>', methods=['DELETE'])
@token_required
def delete_user(current_user, username):
    if current_user.username != username:
        return jsonify({'message': 'Cannot perform that function!'}), 403

    success, message = service.delete_user(username)
    return jsonify({"success": success, "message": message})

# List All Users (Admin Only)
@app.route('/users', methods=['GET'])
@token_required
def list_users(current_user):
    if current_user.username != 'admin':
        return jsonify({'message': 'Cannot perform that function!'}), 403

    users = service.list_all_users()
    return jsonify({'users': users})

if __name__ == '__main__':
    app.run(debug=True)
