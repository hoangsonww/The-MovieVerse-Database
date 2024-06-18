import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class FavoritesActivity extends AppCompatActivity {

    private RecyclerView favoritesRecyclerView;
    private FavoritesAdapter adapter;
    private List<Movie> favoriteMovies;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_favorites);

        favoritesRecyclerView = findViewById(R.id.favoritesRecyclerView);
        setupRecyclerView();
    }

    private void setupRecyclerView() {
        adapter = new FavoritesAdapter(favoriteMovies);
        favoritesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        favoritesRecyclerView.setAdapter(adapter);
    }

    public void refreshFavoriteMovies() {
        adapter.notifyDataSetChanged();
    }
}
