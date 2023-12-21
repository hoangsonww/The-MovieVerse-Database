import UIKit

class MovieDetailViewController: UIViewController {

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var overviewLabel: UILabel!
    @IBOutlet weak var posterImageView: UIImageView!

    var movie: Movie?

    override func viewDidLoad() {
        super.viewDidLoad()

        if let movie = movie {
            titleLabel.text = movie.title
            overviewLabel.text = movie.overview
            loadPosterImage(from: movie.posterPath)
        }
    }

    private func loadPosterImage(from path: String) {
        let baseUrl = "https://image.tmdb.org/t/p/w500"
        guard let imageUrl = URL(string: baseUrl + path) else {
            print("Invalid poster URL")
            return
        }

        let task = URLSession.shared.dataTask(with: imageUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching poster: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            DispatchQueue.main.async {
                self.posterImageView.image = UIImage(data: data)
            }
        }
        task.resume()
    }

    private func loadMovieDetail(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path) else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieDetail = try JSONDecoder().decode(MovieDetail.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieDetail.title
                    self.overviewLabel.text = movieDetail.overview
                    self.loadPosterImage(from: movieDetail.posterPath)
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    private func loadMovieCredits(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path + "/credits") else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieCredits = try JSONDecoder().decode(MovieCredits.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieCredits.cast.name
                    self.overviewLabel.text = movieCredits.cast.character
                    self.loadPosterImage(from: movieCredits.cast.profilePath)
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    private func loadMovieVideos(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path + "/videos") else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieVideos = try JSONDecoder().decode(MovieVideos.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieVideos.key
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    private func loadMovieReviews(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path + "/reviews") else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieReviews = try JSONDecoder().decode(MovieReviews.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieReviews.author
                    self.overviewLabel.text = movieReviews.content
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    private func loadMovieDetail(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path) else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieDetail = try JSONDecoder().decode(MovieDetail.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieDetail.title
                    self.overviewLabel.text = movieDetail.overview
                    self.loadPosterImage(from: movieDetail.posterPath)
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    private func loadMovieCredits(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path + "/credits") else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieCredits = try JSONDecoder().decode(MovieCredits.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieCredits.cast.name
                    self.overviewLabel.text = movieCredits.cast.character
                    self.loadPosterImage(from: movieCredits.cast.profilePath)
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    private func loadMovieVideos(from path: String) {
        let baseUrl = "https://api.themoviedb.org/3/movie/"
        guard let movieUrl = URL(string: baseUrl + path + "/videos") else {
            print("Invalid movie URL")
            return
        }

        let task = URLSession.shared.dataTask(with: movieUrl) { data, response, error in
            guard let data = data, error == nil else {
                print("Error fetching movie: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieVideos = try JSONDecoder().decode(MovieVideos.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieVideos.key
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    func fetchingMovieDetail() {
        guard let url = URL(string: "https://api.themoviedb.org/3/movie/550?api_key=1f54bd990f1cdfb230adb312546d765d") else {
            print("Invalid URL")
            return
        }
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Network error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieDetail = try JSONDecoder().decode(MovieDetail.self, from: data)
                DispatchQueue.main.async {
                    self.titleLabel.text = movieDetail.title
                    self.overviewLabel.text = movieDetail.overview
                    self.loadPosterImage(from: movieDetail.posterPath)
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }
}

struct Movie: Codable {
    let title: String
    let overview: String
    let posterPath: String
}

struct MovieResults: Codable {
    let results: [Movie]
}

struct MovieDetail: Codable {
    let title: String
    let overview: String
    let posterPath: String
    let releaseDate: String
    let runtime: Int
    let voteAverage: Double
    let genres: [Genre]
}

struct Genre: Codable {
    let name: String
}

struct MovieDetailResults: Codable {
    let results: [MovieDetail]
}

struct MovieCredits: Codable {
    let cast: [Cast]
}

struct Cast: Codable {
    let name: String
    let character: String
    let profilePath: String
}

struct MovieCreditsResults: Codable {
    let results: [MovieCredits]
}

struct MovieVideos: Codable {
    let key: String
}

struct MovieVideosResults: Codable {
    let results: [MovieVideos]
}

struct MovieReviews: Codable {
    let author: String
    let content: String
}

struct MovieReviewsResults: Codable {
    let results: [MovieReviews]
}

struct FavoritesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!

    var favoriteMovies: [Movie] = []
    var movie: Movie?

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self

        loadFavorites()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadFavorites()
    }

    private func loadFavorites() {
        if let savedMovies = UserDefaults.standard.object(forKey: "Favorites") as? Data {
            let decoder = JSONDecoder()
            if let loadedMovies = try? decoder.decode([Movie].self, from: savedMovies) {
                favoriteMovies = loadedMovies
                tableView.reloadData()
            }
        }
    }

    private func saveFavorites() {
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(favoriteMovies) {
            UserDefaults.standard.set(encoded, forKey: "Favorites")
        }
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return favoriteMovies.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FavoriteMovieCell", for: indexPath)
        let movie = favoriteMovies[indexPath.row]
        cell.textLabel?.text = movie.title
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        movie = favoriteMovies[indexPath.row]
        performSegue(withIdentifier: "ShowFavoriteMovieDetail", sender: self)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "ShowFavoriteMovieDetail" {
            let movieDetailViewController = segue.destination as! MovieDetailViewController
            movieDetailViewController.movie = movie
        }
    }

    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            favoriteMovies.remove(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
            saveFavorites()
        }
    }

}

struct MoviesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!

    var movies: [Movie] = []
    var movie: Movie?

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self

        loadMovies()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        loadMovies()
    }

    private func loadMovies() {
        guard let url = URL(string: "https://api.themoviedb.org/3/movie/now_playing?api_key=1f54bd990f1cdfb230adb312546d765d") else {
            print("Invalid URL")
            return
        }
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Network error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movieResults = try JSONDecoder().decode(MovieResults.self, from: data)
                DispatchQueue.main.async {
                    self.movies = movieResults.results
                    self.tableView.reloadData()
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return movies.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let movie = movies[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "MovieCell", for: indexPath)
        cell.textLabel?.text = movie.title
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        movie = movies[indexPath.row]
        performSegue(withIdentifier: "ShowMovieDetail", sender: self)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "ShowMovieDetail" {
            let movieDetailViewController = segue.destination as! MovieDetailViewController
            movieDetailViewController.movie = movie
        }
    }
}