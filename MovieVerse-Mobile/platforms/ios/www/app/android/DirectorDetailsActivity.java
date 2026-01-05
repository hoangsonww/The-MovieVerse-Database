package com.movieverse.app;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.squareup.picasso.Picasso;

public class DirectorDetailsActivity extends AppCompatActivity {

    private ImageView directorImageView;
    private TextView directorNameTextView;
    private TextView directorBioTextView;
    private TextView directorFilmographyTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_director_details);

        directorImageView = findViewById(R.id.director_image);
        directorNameTextView = findViewById(R.id.director_name);
        directorBioTextView = findViewById(R.id.director_bio);
        directorFilmographyTextView = findViewById(R.id.director_filmography);

        Director director = (Director) getIntent().getSerializableExtra("DIRECTOR_DETAILS");

        loadDirectorDetails(director);
    }

    private void loadDirectorDetails(Director director) {
        Picasso.get().load(director.getImageUrl()).into(directorImageView);
        directorNameTextView.setText(director.getName());
        directorBioTextView.setText(director.getBiography());

        StringBuilder filmography = new StringBuilder();
        for (String movie : director.getFilmography()) {
            filmography.append(movie).append("\n");
        }

        directorFilmographyTextView.setText(filmography.toString());
    }
}
