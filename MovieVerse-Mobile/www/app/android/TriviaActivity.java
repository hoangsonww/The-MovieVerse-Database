package com.movieverse.app;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class TriviaActivity extends AppCompatActivity {

    private TextView questionTextView;
    private RadioGroup optionsRadioGroup;
    private RadioButton option1RadioButton, option2RadioButton, option3RadioButton, option4RadioButton;
    private Button nextButton;

    private TriviaQuestion currentQuestion;
    private int currentQuestionIndex = 0;
    private List<TriviaQuestion> questions;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_trivia);

        questionTextView = findViewById(R.id.question_text_view);
        optionsRadioGroup = findViewById(R.id.options_radio_group);
        option1RadioButton = findViewById(R.id.option_1_radio_button);
        option2RadioButton = findViewById(R.id.option_2_radio_button);
        option3RadioButton = findViewById(R.id.option_3_radio_button);
        option4RadioButton = findViewById(R.id.option_4_radio_button);
        nextButton = findViewById(R.id.next_button);

        initializeQuestions();

        loadQuestion(currentQuestionIndex);

        nextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleAnswer();
            }
        });
    }

    private void initializeQuestions() {
        questions = new ArrayList<>();
    }

    private void loadQuestion(int index) {
        if (index < questions.size()) {
            currentQuestion = questions.get(index);
            questionTextView.setText(currentQuestion.getQuestion());
            option1RadioButton.setText(currentQuestion.getOption1());
            option2RadioButton.setText(currentQuestion.getOption2());
            option3RadioButton.setText(currentQuestion.getOption3());
            option4RadioButton.setText(currentQuestion.getOption4());
        }
        else {
            finishTrivia();
        }
    }

    private void handleAnswer() {
        int selectedOption = optionsRadioGroup.getCheckedRadioButtonId();
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    }

    private void finishTrivia() {
        startActivity(new Intent(TriviaActivity.this, ScoreActivity.class));
    }
}
