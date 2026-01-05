import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.EditText;
import android.widget.Button;
import android.view.View;
import android.widget.Toast;
import java.util.List;

public class SearchActivity extends AppCompatActivity {

    private EditText searchEditText;
    private Button searchButton;
    private RecyclerView searchResultsRecyclerView;
    private MovieListAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        searchEditText = findViewById(R.id.searchEditText);
        searchButton = findViewById(R.id.searchButton);
        searchResultsRecyclerView = findViewById(R.id.searchResultsRecyclerView);

        adapter = new MovieListAdapter(new MovieListAdapter.OnMovieClickListener() {
            @Override
            public void onMovieClick(int position) {
                Movie movie = adapter.getMovies().get(position);
                Toast.makeText(SearchActivity.this, movie.getTitle(), Toast.LENGTH_SHORT).show();
            }
        });
        searchResultsRecyclerView.setAdapter(adapter);

        searchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String query = searchEditText.getText().toString();
                performSearch(query);
            }
        });
    }

    private void performSearch(String query) {
        if(query.isEmpty()) {
            Toast.makeText(this, "Please enter a search term", Toast.LENGTH_SHORT).show();
            return;
        }

        List<Movie> searchResults = MovieApi.searchMovies(query); // This is a placeholder method call
        adapter.setMovies(searchResults);
        adapter.notifyDataSetChanged();
    }
}
