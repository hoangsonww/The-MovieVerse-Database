package com.movieverse.app;

import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class AboutActivity extends AppCompatActivity {

    private TextView aboutTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        aboutTextView = findViewById(R.id.about_text_view);

        String aboutText = "The MovieVerse App\n\nVersion: 1.0\n\nDeveloped by: Your Name\n\nThe MovieVerse is your ultimate guide to explore and discover movies, directors, actors, and production companies. Stay tuned for more features!";
        aboutTextView.setText(aboutText);
    }
}
