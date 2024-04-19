import SwiftUI

struct UserProfileView: View {
    @State private var userName: String = UserDefaults.standard.string(forKey: "userName") ?? ""
    @State private var userEmail: String = UserDefaults.standard.string(forKey: "userEmail") ?? ""
    @State private var userPreferences: String = UserDefaults.standard.string(forKey: "userPreferences") ?? ""

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("User Information")) {
                    TextField("Name", text: $userName)
                    TextField("Email", text: $userEmail)
                }

                Section(header: Text("Preferences")) {
                    TextField("Preferences", text: $userPreferences)
                }

                Section {
                    Button("Save Changes") {
                        saveUserProfile()
                    }
                }
            }
            .navigationBarTitle("Profile")
        }
    }

    private func saveUserProfile() {
        UserDefaults.standard.set(userName, forKey: "userName")
        UserDefaults.standard.set(userEmail, forKey: "userEmail")
        UserDefaults.standard.set(userPreferences, forKey: "userPreferences")
    }
}

struct UserProfileView_Previews: PreviewProvider {
    static var previews: some View {
        UserProfileView()
    }
}
