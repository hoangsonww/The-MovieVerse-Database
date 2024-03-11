import UIKit

class FavoritesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

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

    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            favoriteMovies.remove(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
            saveFavorites()
        }
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let movie = favoriteMovies[indexPath.row]
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let movieDetailViewController = storyboard.instantiateViewController(withIdentifier: "MovieDetailViewController") as! MovieDetailViewController
        movieDetailViewController.movie = movie
        navigationController?.pushViewController(movieDetailViewController, animated: true)
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }

    func showAlert() {
        let alert = UIAlertController(title: "No Favorites", message: "You have no favorite movies. Add some by tapping the star icon on a movie's detail page.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { action in
            self.navigationController?.popViewController(animated: true)
        }))
        self.present(alert, animated: true)
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if favoriteMovies.count == 0 {
            showAlert()
        }
    }

    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        cell.backgroundColor = UIColor.clear
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showMovieDetail" {
            let movieDetailViewController = segue.destination as! MovieDetailViewController
            movieDetailViewController.movie = movie
        }
    }

    func tableView(_ tableView: UITableView, accessoryButtonTappedForRowWith indexPath: IndexPath) {
        movie = favoriteMovies[indexPath.row]
        performSegue(withIdentifier: "showMovieDetail", sender: self)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    override var shouldAutorotate: Bool {
        return false
    }

    override var supportedInterfaceOrientations : UIInterfaceOrientationMask {
        return .portrait
    }

    override var preferredInterfaceOrientationForPresentation: UIInterfaceOrientation {
        return .portrait
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        navigationController?.navigationBar.barStyle = .default
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.navigationBar.barStyle = .black
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        loadFavorites()
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

// Path: MovieVerse-Mobile/app/MovieDetailViewController.swift
