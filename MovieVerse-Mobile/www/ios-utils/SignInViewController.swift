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

    // UI Elements
    private let emailTextField = UITextField()
    private let passwordTextField = UITextField()
    private let signInButton = UIButton()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    private func setupUI() {
        view.backgroundColor = .white

        // Email TextField Setup
        emailTextField.placeholder = "Email"
        emailTextField.borderStyle = .roundedRect
        emailTextField.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emailTextField)

        // Password TextField Setup
        passwordTextField.placeholder = "Password"
        passwordTextField.isSecureTextEntry = true
        passwordTextField.borderStyle = .roundedRect
        passwordTextField.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(passwordTextField)

        // SignIn Button Setup
        signInButton.setTitle("Sign In", for: .normal)
        signInButton.backgroundColor = .blue
        signInButton.addTarget(self, action: #selector(signInTapped), for: .touchUpInside)
        signInButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(signInButton)

        // AutoLayout Constraints
        NSLayoutConstraint.activate([
            emailTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emailTextField.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -100),
            emailTextField.widthAnchor.constraint(equalTo: view.widthAnchor, constant: -50),

            passwordTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            passwordTextField.topAnchor.constraint(equalTo: emailTextField.bottomAnchor, constant: 20),
            passwordTextField.widthAnchor.constraint(equalTo: emailTextField.widthAnchor),

            signInButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            signInButton.topAnchor.constraint(equalTo: passwordTextField.bottomAnchor, constant: 30),
            signInButton.widthAnchor.constraint(equalTo: passwordTextField.widthAnchor)
        ])
    }

    @objc private func signInTapped() {
        guard let email = emailTextField.text, !email.isEmpty,
              let password = passwordTextField.text, !password.isEmpty else {
            showAlert(message: "Please enter both email and password.")
            return
        }

        authenticate(email: email, password: password)
    }

    private func showAlert(message: String) {
        let alert = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        self.present(alert, animated: true, completion: nil)
    }
}
