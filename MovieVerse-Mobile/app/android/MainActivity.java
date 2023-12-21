package app;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.squareup.retrofit2.Call;
import com.squareup.retrofit2.Callback;
import com.squareup.retrofit2.Response;
import com.squareup.retrofit2.Retrofit;
import com.squareup.retrofit2.converter.gson.GsonConverterFactory;
import com.squareup.retrofit2.http.GET;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private MoviesAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        adapter = new MoviesAdapter();
        recyclerView.setAdapter(adapter);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api.example.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        MovieApi movieApi = retrofit.create(MovieApi.class);
        movieApi.getMovies("your_api_key").enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setMovies(response.body());
                } else {
                    Toast.makeText(MainActivity.this, "Error fetching data", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private interface MovieApi {
        @GET("movie/popular")
        Call<List<Movie>> getMovies(@Query("api_key") String apiKey);
    }

    private class Movie {
        String title;
        String overview;

        // Assume getters for each field
        public String getTitle() {
            return title;
        }

        public String getOverview() {
            return overview;
        }
    }

    private class MoviesAdapter extends RecyclerView.Adapter<MoviesAdapter.MovieViewHolder> {

        private List<Movie> movies;

        @NonNull
        @Override
        public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.movie_item, parent, false);
            return new MovieViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
            Movie movie = movies.get(position);
            holder.titleTextView.setText(movie.getTitle());
            holder.overviewTextView.setText(movie.getOverview());
        }

        @Override
        public int getItemCount() {
            return movies == null ? 0 : movies.size();
        }

        void setMovies(List<Movie> movies) {
            this.movies = movies;
            notifyDataSetChanged();
        }

        class MovieViewHolder extends RecyclerView.ViewHolder {
            TextView titleTextView;
            TextView overviewTextView;

            MovieViewHolder(View itemView) {
                super(itemView);
                titleTextView = itemView.findViewById(R.id.title_text_view);
                overviewTextView = itemView.findViewById(R.id.overview_text_view);
            }
        }
    }
}
