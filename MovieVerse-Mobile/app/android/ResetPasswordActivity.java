import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class ResetPasswordActivity extends AppCompatActivity {

    private EditText emailEditText;
    private EditText newPasswordEditText;
    private EditText confirmNewPasswordEditText;
    private Button resetPasswordButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_password);

        emailEditText = findViewById(R.id.emailEditText);
        newPasswordEditText = findViewById(R.id.newPasswordEditText);
        confirmNewPasswordEditText = findViewById(R.id.confirmNewPasswordEditText);
        resetPasswordButton = findViewById(R.id.resetPasswordButton);

        resetPasswordButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = emailEditText.getText().toString();
                String newPassword = newPasswordEditText.getText().toString();
                String confirmNewPassword = confirmNewPasswordEditText.getText().toString();

                if (!isValidEmail(email) || !isValidPassword(newPassword) || !newPassword.equals(confirmNewPassword)) {
                    Toast.makeText(ResetPasswordActivity.this, "Invalid input", Toast.LENGTH_SHORT).show();
                    return;
                }

                resetPasswordButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String email = emailEditText.getText().toString();
                        String newPassword = newPasswordEditText.getText().toString();
                        String confirmNewPassword = confirmNewPasswordEditText.getText().toString();

                        if (!isValidEmail(email) || !isValidPassword(newPassword) || !newPassword.equals(confirmNewPassword)) {
                            Toast.makeText(ResetPasswordActivity.this, "Invalid input", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        if (updatePassword(email, newPassword)) {
                            Toast.makeText(ResetPasswordActivity.this, "Password updated successfully!", Toast.LENGTH_SHORT).show();
                        }
                        else {
                            Toast.makeText(ResetPasswordActivity.this, "Failed to update password", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }

            private boolean updatePassword(String email, String newPassword) {
                SharedPreferences sharedPreferences = getSharedPreferences("MyAppPreferences", MODE_PRIVATE);
                if (sharedPreferences.contains(email)) {
                    sharedPreferences.edit().putString(email, newPassword).apply();
                    return true;
                }
                return false;
            }

            private boolean isValidEmail(String email) {
                return email != null && android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
            }
        });
    }

    private boolean isValidEmail(String email) {
        return email != null && android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    private boolean isValidPassword(String password) {
        return password != null && password.length() >= 8 && password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") && password.matches(".*[0-9].*") &&
                password.matches(".*[!@#$%^&*+=?-].*");
    }
}
