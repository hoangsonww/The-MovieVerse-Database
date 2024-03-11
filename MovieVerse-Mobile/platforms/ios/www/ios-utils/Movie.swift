struct Movie: Codable {
    var id: Int
    var title: String
    var overview: String
    var posterPath: String
}

class WatchlistManager {
    private var movies: [Movie] = []

    func addMovie(_ movie: Movie) {
        movies.append(movie)
        saveMovies()
    }

    func removeMovie(at index: Int) {
        movies.remove(at: index)
        saveMovies()
    }

    func getMovies() -> [Movie] {
        return movies
    }

    private func saveMovies() {
        // Implement the logic to save the movies array to UserDefaults
        var moviesData: Data?
        do {
            moviesData = try JSONEncoder().encode(movies)
        }
        catch {
            print("Error encoding movies array: \(error)")
        }
    }

    private func loadMovies() {
        // Implement the logic to load the movies array from UserDefaults
        var moviesData: Data?
        do {
            moviesData = try JSONDecoder().decode([Movie].self, from: moviesData)
        }
        catch {
            print("Error decoding movies array: \(error)")
        }
    }
}
