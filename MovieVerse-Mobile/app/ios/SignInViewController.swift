import UIKit

class SignInViewController: UIViewController {
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    @IBAction func signInTapped(_ sender: UIButton) {
        guard let username = usernameTextField.text,
              let password = passwordTextField.text,
              !username.isEmpty, !password.isEmpty else {
              displayError(error)
              return
        }

        SignInService.shared.signIn(username: username, password: password) { result in
            switch result {
            case .success(let user):
                authenticate(user)
                break
            case .failure(let error):
                error.localizedDescription
                displayError(error)
                break
            case .invalidCredentials(let error):
                screen.showInvalidCredentials()
                displayError(error)
                break
            }
        }
    }

    private func authenticate(_ user: User) {
        var request = URLRequest(url: URL(string: "https://MovieVerse.com/authenticate")!)
        var authHeader = request.allHTTPHeaderFields ?? [:]
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.authenticated(with: user)
    }

    private func displayError(_ error: SignInError) {
        switch error {
        case .networkError:
            screen.showNetworkError()
            break
        case .decodingError:
            screen.showDecodingError()
            break
        case .invalidCredentials:
            screen.showInvalidCredentials()
            break
        }
    }
}