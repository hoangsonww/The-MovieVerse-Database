from flask import Flask, request, jsonify

app = Flask(__name__)

# Mock database
users_db = {}

# User model
class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password
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

# Initialize service
service = BackendService()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    success, message = service.register_user(username, password)
    return jsonify({"success": success, "message": message})

@app.route('/user/<username>', methods=['GET'])
def get_user(username):
    user = service.get_user(username)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    return jsonify({"success": True, "username": user.username, "data": user.data})

@app.route('/user/<username>/add_data', methods=['POST'])
def add_user_data(username):
    user = service.get_user(username)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    data = request.json
    key = data.get('key')
    value = data.get('value')
    user.add_data(key, value)
    return jsonify({"success": True, "message": "Data added successfully."})

# Add more endpoints as needed...

if __name__ == '__main__':
    app.run(debug=True)
