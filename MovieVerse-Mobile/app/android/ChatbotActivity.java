import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.EditText;
import android.widget.Button;
import android.widget.TextView;
import android.view.View;

public class ChatbotActivity extends AppCompatActivity {

    private EditText userInputEditText;
    private Button sendButton;
    private TextView chatTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chatbot);

        userInputEditText = findViewById(R.id.userInputEditText);
        sendButton = findViewById(R.id.sendButton);
        chatTextView = findViewById(R.id.chatTextView);

        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String userInput = userInputEditText.getText().toString();
                updateChat(userInput);
            }
        });
    }

    private void updateChat(String userInput) {
        chatTextView.append("\nYou: " + userInput);
        chatTextView.append("\nBot: " + "Response from bot");
    }

}
