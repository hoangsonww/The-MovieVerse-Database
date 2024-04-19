import Foundation

class SignInService {
    static let shared = SignInService()

    private init() {}

    func signIn(username: String, password: String, completion: @escaping (Result<User, SignInError>) -> Void) {
        let url = URL(string: "https://MovieVerse.com/signin")! // Replace with your real URL - Mine is not published here
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = ["username": username, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                completion(.failure(.networkError))
                return
            }

            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            }
            catch {
                completion(.failure(.decodingError))
            }
        }.resume()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        SignInService.shared.signIn(username: "username", password: "password") { result in
            switch result {
            case .success(let user):
                print("Signed in as \(user.name)")
            case .failure(let error):
                print("Error signing in: \(error)")
            }
        }
    }

    private func signIn(username: String, password: String, completion: @escaping (Result<User, SignInError>) -> Void) {
        let url = URL(string: "https://MovieVerse.com/signin")! // Replace with your real URL - Mine is not published here
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        let body: [String: Any] = ["username": username, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                completion(.failure(.networkError))
                return
            }

            do {
                let user = try JSONDecoder().decode(User.self, from: data)
                completion(.success(user))
            }
            catch {
                completion(.failure(.decodingError))
            }
        }.resume()
    }
}

struct User: Codable {
    let id: String
    let name: String
    let profilePictureURL: URL
    let token: String
    let password: String
}

enum SignInError: Error {
    case networkError
    case decodingError
    case invalidCredentials
    case other
}