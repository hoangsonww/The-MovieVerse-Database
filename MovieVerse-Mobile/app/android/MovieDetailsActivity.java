package app;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.squareup.picasso.Picasso;
import com.squareup.retrofit2.Call;
import com.squareup.retrofit2.Callback;
import com.squareup.retrofit2.Response;
import com.squareup.retrofit2.Retrofit;
import com.squareup.retrofit2.converter.gson.GsonConverterFactory;
import com.squareup.retrofit2.http.GET;
import com.squareup.retrofit2.http.Path;

public class MovieDetailsActivity extends AppCompatActivity {

    private TextView titleTextView;
    private TextView overviewTextView;
    private ImageView posterImageView;
    private Retrofit retrofit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_details);

        titleTextView = findViewById(R.id.title_text_view);
        overviewTextView = findViewById(R.id.overview_text_view);
        posterImageView = findViewById(R.id.poster_image_view);

        Intent intent = getIntent();
        int movieId = intent.getIntExtra("MOVIE_ID", -1);

        if (movieId != -1) {
            fetchMovieDetails(movieId);
        } else {
            Toast.makeText(this, "Movie ID not found.", Toast.LENGTH_LONG).show();
        }
    }

    private void fetchMovieDetails(int movieId) {
        retrofit = new Retrofit.Builder()
                .baseUrl("https://api.example.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        MovieApi movieApi = retrofit.create(MovieApi.class);
        movieApi.getMovieDetails(movieId, "your_api_key").enqueue(new Callback<Movie>() {
            @Override
            public void onResponse(Call<Movie> call, Response<Movie> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Movie movie = response.body();
                    titleTextView.setText(movie.getTitle());
                    overviewTextView.setText(movie.getOverview());
                    Picasso.get().load("https://image.tmdb.org/t/p/w500" + movie.getPosterPath()).into(posterImageView);
                } else {
                    Toast.makeText(MovieDetailsActivity.this, "Error fetching movie details", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Movie> call, Throwable t) {
                Toast.makeText(MovieDetailsActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private interface MovieApi {
        @GET("movie/{id}")
        Call<Movie> getMovieDetails(@Path("id") int movieId, @Query("api_key") String apiKey);
    }

    private class Movie {
        private String title;
        private String overview;
        private String posterPath;

        public String getTitle() {
            return title;
        }

        public String getOverview() {
            return overview;
        }

        public String getPosterPath() {
            return posterPath;
        }
    }
}