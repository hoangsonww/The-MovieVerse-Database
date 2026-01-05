import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MovieRepository {

    private static final String BASE_URL = "https://api.example.com/";
    private MovieApi movieApi;

    public MovieRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        movieApi = retrofit.create(MovieApi.class);
    }

    public void getMovies(Callback<List<Movie>> callback) {
        Call<List<Movie>> call = movieApi.getMovies();
        call.enqueue(callback);
    }

    interface MovieApi {
        @GET("movies")
        Call<List<Movie>> getMovies();
    }

    public class Movie {
        private String title;
        private String overview;

        public String getTitle() {
            return title;
        }

        public String getOverview() {
            return overview;
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

}
