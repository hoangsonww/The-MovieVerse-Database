package com.movieverse.app;

import android.os.Bundle;
import android.widget.ListView;
import androidx.appcompat.app.AppCompatActivity;

public class MovieTimelineActivity extends AppCompatActivity {

    private ListView timelineListView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_timeline);

        timelineListView = findViewById(R.id.timeline_list_view);

        loadMovieTimeline();
    }

    private void loadMovieTimeline() {
        MovieTimelineAdapter adapter = new MovieTimelineAdapter(this, R.layout.movie_timeline_list_item, Movie.getMovieTimeline());
        timelineListView.setAdapter(adapter);
    }
}
