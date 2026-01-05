import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;

public class FavoritesAdapter extends RecyclerView.Adapter<FavoritesAdapter.FavoriteViewHolder> {

    private List<Movie> favoritesList;

    public FavoritesAdapter(List<Movie> favoritesList) {
        this.favoritesList = favoritesList;
    }

    @Override
    public FavoriteViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.favorite_item, parent, false);
        return new FavoriteViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(FavoriteViewHolder holder, int position) {
        Movie movie = favoritesList.get(position);
        holder.titleTextView.setText(movie.getTitle());
    }

    @Override
    public int getItemCount() {
        return favoritesList.size();
    }

    static class FavoriteViewHolder extends RecyclerView.ViewHolder {
        TextView titleTextView;

        FavoriteViewHolder(View view) {
            super(view);
            titleTextView = view.findViewById(R.id.titleTextView);
        }
    }
}
