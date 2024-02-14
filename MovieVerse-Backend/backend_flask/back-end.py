import hashlib

# Utility Functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# User model
class User:
    def __init__(self, username, password):
        self.username = username
        self.password = hash_password(password)
        self.data = {}

    def add_data(self, key, value):
        self.data[key] = value

    def get_data(self, key):
        return self.data.get(key, "Not found")

    def update_password(self, new_password):
        self.password = hash_password(new_password)

# Backend service
class BackendService:
    def __init__(self):
        self.users = {}

    def register_user(self, username, password):
        if username in self.users:
            return "Username already exists."
        self.users[username] = User(username, password)
        return "User registered successfully."

    def login_user(self, username, password):
        user = self.users.get(username)
        if not user:
            return "User not found."
        if user.password != hash_password(password):
            return "Incorrect password."
        return "Login successful."

    def add_user_data(self, username, key, value):
        user = self.users.get(username)
        if not user:
            return "User not found."
        user.add_data(key, value)
        return "Data added successfully."

    def retrieve_user_data(self, username, key):
        user = self.users.get(username)
        if not user:
            return "User not found."
        return user.get_data(key)

    def change_user_password(self, username, old_password, new_password):
        user = self.users.get(username)
        if not user:
            return "User not found."
        if user.password != hash_password(old_password):
            return "Incorrect old password."
        user.update_password(new_password)
        return "Password updated successfully."

    def delete_user(self, username):
        if username in self.users:
            del self.users[username]
            return "User deleted successfully."
        return "User not found."

    def list_users(self):
        return ", ".join(self.users.keys()) if self.users else "No users found."

# Admin Panel for user management
class AdminPanel:
    def __init__(self, service):
        self.service = service

    def run(self):
        while True:
            print("\nAdmin Panel:")
            print("1. List Users")
            print("2. Delete User")
            print("3. Exit")
            choice = input("Enter choice: ")

            if choice == "1":
                print("Users:", self.service.list_users())
            elif choice == "2":
                username = input("Enter username to delete: ")
                print(self.service.delete_user(username))
            elif choice == "3":
                break
            else:
                print("Invalid choice.")

# Main function to run the service
def main():
    service = BackendService()
    admin_panel = AdminPanel(service)

    while True:
        print("\nMain Menu:")
        print("1. Register")
        print("2. Login")
        print("3. Add Data")
        print("4. Retrieve Data")
        print("5. Change Password")
        print("6. Admin Panel")
        print("7. Exit")
        choice = input("Enter choice: ")

        if choice == "1":
            username = input("Enter username: ")
            password = input("Enter password: ")
            print(service.register_user(username, password))
        elif choice == "2":
            username = input("Enter username: ")
            password = input("Enter password: ")
            print(service.login_user(username, password))
        elif choice == "3":
            username = input("Enter username: ")
            key = input("Enter data key: ")
            value = input("Enter data value: ")
            print(service.add_user_data(username, key, value))
        elif choice == "4":
            username = input("Enter username: ")
            key = input("Enter data key: ")
            print(service.retrieve_user_data(username, key))
        elif choice == "5":
            username = input("Enter username: ")
            old_password = input("Enter old password: ")
            new_password = input("Enter new password: ")
            print(service.change_user_password(username, old_password, new_password))
        elif choice == "6":
            admin_panel.run()
        elif choice == "7":
            break
        else:
            print("Invalid choice.")

if __name__ == "__main__":
    main()
