import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class SignInActivity extends AppCompatActivity {

    private EditText emailEditText;
    private EditText passwordEditText;
    private Button signInButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);

        emailEditText = findViewById(R.id.emailEditText);
        passwordEditText = findViewById(R.id.passwordEditText);
        signInButton = findViewById(R.id.signInButton);

        signInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = emailEditText.getText().toString();
                String password = passwordEditText.getText().toString();

                if (!isValidEmail(email) || password.isEmpty()) {
                    Toast.makeText(SignInActivity.this, "Invalid input", Toast.LENGTH_SHORT).show();
                    return;
                }

                signInButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String email = emailEditText.getText().toString();
                        String password = passwordEditText.getText().toString();

                        if (!isValidEmail(email) || password.isEmpty()) {
                            Toast.makeText(SignInActivity.this, "Invalid input", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        if (authenticateUser(email, password)) {
                            Toast.makeText(SignInActivity.this, "Sign in successful", Toast.LENGTH_SHORT).show();
                        }
                        else {
                            Toast.makeText(SignInActivity.this, "Invalid credentials", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }

            private boolean authenticateUser(String email, String password) {
                SharedPreferences sharedPreferences = getSharedPreferences("MyAppPreferences", MODE_PRIVATE);
                String storedPassword = sharedPreferences.getString(email, null);

                return storedPassword != null && storedPassword.equals(password);
            }

            private boolean isValidEmail(String email) {
                return email != null && android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
            }

        });
    }

    private boolean isValidEmail(String email) {
        return email != null && android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }
}
