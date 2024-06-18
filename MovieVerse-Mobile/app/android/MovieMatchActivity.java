package com.movieverse.app;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Spinner;
import androidx.appcompat.app.AppCompatActivity;

public class MovieMatchActivity extends AppCompatActivity {

    private Spinner genreSpinner;
    private Spinner yearSpinner;
    private Button findMoviesButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_match);

        genreSpinner = findViewById(R.id.genre_spinner);
        yearSpinner = findViewById(R.id.year_spinner);
        findMoviesButton = findViewById(R.id.find_movies_button);

        findMoviesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String selectedGenre = genreSpinner.getSelectedItem().toString();
                String selectedYear = yearSpinner.getSelectedItem().toString();
                findMovies(selectedGenre, selectedYear);
            }
        });
    }

    private void findMovies(String genre, String year) {
        Movie movie = new Movie();
        movie.setGenre(genre);
        movie.setYear(year);
    }
}
