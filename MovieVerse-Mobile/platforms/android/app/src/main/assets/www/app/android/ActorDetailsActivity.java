package com.movieverse.app;

import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.squareup.picasso.Picasso;

public class ActorDetailsActivity extends AppCompatActivity {

    private ImageView actorImageView;
    private TextView actorNameTextView;
    private TextView actorBioTextView;
    private TextView actorFilmographyTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_actor_details);

        actorImageView = findViewById(R.id.actor_image);
        actorNameTextView = findViewById(R.id.actor_name);
        actorBioTextView = findViewById(R.id.actor_bio);
        actorFilmographyTextView = findViewById(R.id.actor_filmography);

        Actor actor = (Actor) getIntent().getSerializableExtra("ACTOR_DETAILS");

        loadActorDetails(actor);
    }

    private void loadActorDetails(Actor actor) {
        Picasso.get().load(actor.getImageUrl()).into(actorImageView);
        actorNameTextView.setText(actor.getName());
        actorBioTextView.setText(actor.getBiography());

        StringBuilder filmography = new StringBuilder();
        for (String movie : actor.getFilmography()) {
            filmography.append(movie).append("\n");
        }

        actorFilmographyTextView.setText(filmography.toString());
    }
}
