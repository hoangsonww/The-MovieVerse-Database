import java.io.Serializable;
import java.util.List;

public class Movie implements Serializable {
    private int id;
    private String title;
    private String overview;
    private double voteAverage;
    private String posterPath;
    private String releaseDate;
    private List<String> genres;
    private long budget;
    private long revenue;
    private String tagline;
    private String originalLanguage;
    private double popularity;
    private String status;
    private List<String> productionCompanies;
    private List<String> keywords;
    private List<Movie> similarMovies;

    public Movie(int id, String title, String overview, double voteAverage, String posterPath, String releaseDate, List<String> genres, long budget, long revenue, String tagline, String originalLanguage, double popularity, String status, List<String> productionCompanies, List<String> keywords, List<Movie> similarMovies) {
        this.id = id;
        this.title = title;
        this.overview = overview;
        this.voteAverage = voteAverage;
        this.posterPath = posterPath;
        this.releaseDate = releaseDate;
        this.genres = genres;
        this.budget = budget;
        this.revenue = revenue;
        this.tagline = tagline;
        this.originalLanguage = originalLanguage;
        this.popularity = popularity;
        this.status = status;
        this.productionCompanies = productionCompanies;
        this.keywords = keywords;
        this.similarMovies = similarMovies;
    }

    // Method to get formatted image URL
    public String getFormattedImageUrl(String basePath) {
        return basePath + posterPath;
    }

    // Method to get a concatenated string of genres
    public String getFormattedGenres() {
        return String.join(", ", genres);
    }

}
