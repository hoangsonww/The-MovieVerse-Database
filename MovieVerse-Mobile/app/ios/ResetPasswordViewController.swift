import UIKit

class ResetPasswordViewController: UIViewController {

    // UI Elements
    private let emailTextField = UITextField()
    private let newPasswordTextField = UITextField()
    private let confirmNewPasswordTextField = UITextField()
    private let resetPasswordButton = UIButton()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    private func setupUI() {
        view.backgroundColor = .white

        // Email TextField Setup
        emailTextField.placeholder = "Email"
        emailTextField.borderStyle = .roundedRect
        emailTextField.keyboardType = .emailAddress
        emailTextField.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(emailTextField)

        // New Password TextField Setup
        newPasswordTextField.placeholder = "New Password"
        newPasswordTextField.isSecureTextEntry = true
        newPasswordTextField.borderStyle = .roundedRect
        newPasswordTextField.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(newPasswordTextField)

        // Confirm New Password TextField Setup
        confirmNewPasswordTextField.placeholder = "Confirm New Password"
        confirmNewPasswordTextField.isSecureTextEntry = true
        confirmNewPasswordTextField.borderStyle = .roundedRect
        confirmNewPasswordTextField.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(confirmNewPasswordTextField)

        // Reset Password Button Setup
        resetPasswordButton.setTitle("Reset Password", for: .normal)
        resetPasswordButton.backgroundColor = .blue
        resetPasswordButton.addTarget(self, action: #selector(resetPasswordTapped), for: .touchUpInside)
        resetPasswordButton.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(resetPasswordButton)

        // AutoLayout Constraints
        NSLayoutConstraint.activate([
            emailTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emailTextField.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -120),
            emailTextField.widthAnchor.constraint(equalTo: view.widthAnchor, constant: -50),

            newPasswordTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            newPasswordTextField.topAnchor.constraint(equalTo: emailTextField.bottomAnchor, constant: 20),
            newPasswordTextField.widthAnchor.constraint(equalTo: emailTextField.widthAnchor),

            confirmNewPasswordTextField.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            confirmNewPasswordTextField.topAnchor.constraint(equalTo: newPasswordTextField.bottomAnchor, constant: 20),
            confirmNewPasswordTextField.widthAnchor.constraint(equalTo: newPasswordTextField.widthAnchor),

            resetPasswordButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            resetPasswordButton.topAnchor.constraint(equalTo: confirmNewPasswordTextField.bottomAnchor, constant: 30),
            resetPasswordButton.widthAnchor.constraint(equalTo: confirmNewPasswordTextField.widthAnchor)
        ])
    }

    @objc private func resetPasswordTapped() {
        guard let email = emailTextField.text, !email.isEmpty,
              let newPassword = newPasswordTextField.text, !newPassword.isEmpty,
              let confirmNewPassword = confirmNewPasswordTextField.text, !confirmNewPassword.isEmpty else {
            showAlert(message: "Please fill in all fields.")
            return
        }

        guard newPassword == confirmNewPassword else {
            showAlert(message: "New passwords do not match.")
            return
        }

        guard isValidPassword(newPassword) else {
            showAlert(message: "New password does not meet requirements.")
            return
        }

        resetPassword(email: email, newPassword: newPassword)
    }

    private func isValidPassword(_ password: String) -> Bool {
        let minLength = 8
        let hasUppercase = password.range(of: "[A-Z]", options: .regularExpression) != nil
        let hasLowercase = password.range(of: "[a-z]", options: .regularExpression) != nil
        let hasNumber = password.range(of: "\\d", options: .regularExpression) != nil
        let hasSpecialCharacter = password.range(of: "[!@#$%^&*(),.?\":{}|<>]", options: .regularExpression) != nil

        return password.count >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter
    }

    private func showAlert(message: String) {
        let alert = UIAlertController(title: "Alert", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
