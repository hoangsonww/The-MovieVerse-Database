import UIKit

class MoviesViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!

    var movies = [Movie]()

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self

        fetchMovies()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        fetchMovies()
    }

    private func saveFavorites() {
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(movies) {
            UserDefaults.standard.set(encoded, forKey: "Favorites")
        }
    }

    private func loadFavorites() {
        if let savedMovies = UserDefaults.standard.object(forKey: "Favorites") as? Data {
            let decoder = JSONDecoder()
            if let loadedMovies = try? decoder.decode([Movie].self, from: savedMovies) {
                movies = loadedMovies
                tableView.reloadData()
            }
        }
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showDetail",
           let destinationVC = segue.destination as? MovieDetailViewController,
           let movie = sender as? Movie {
            destinationVC.movie = movie
        }
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let movie = movies[indexPath.row]
        performSegue(withIdentifier: "showDetail", sender: movie)
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return movies.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {

        let cell = tableView.dequeueReusableCell(withIdentifier: "MovieCell", for: indexPath)
        let movie = movies[indexPath.row]
        cell.textLabel?.text = movie.title
        return cell

    }

    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            movies.remove(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
            saveFavorites()
        }
    }

    func fetchMovies() {
        guard let url = URL(string: "https://api.example.com/movies") else {
            print("Invalid URL")
            return
        }
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Network error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }
            do {
                let movies = try JSONDecoder().decode([Movie].self, from: data)
                DispatchQueue.main.async {
                    self.movies = movies
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
        let cell = tableView.dequeueReusableCell(withIdentifier: "MovieCell", for: indexPath)
        let movie = movies[indexPath.row]
        cell.textLabel?.text = movie.title
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let movie = movies[indexPath.row]
        performSegue(withIdentifier: "showDetail", sender: movie)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showDetail",
           let destinationVC = segue.destination as? MovieDetailViewController,
           let movie = sender as? Movie {
            destinationVC.movie = movie
        }
    }

}

struct Movie: Codable {
    let title: String
    let overview: String
}

struct MovieDetailViewController: UIViewController {
    var movie: Movie?

    override func viewDidLoad() {
        super.viewDidLoad()
        guard let movie = movie else {
            print("No movie")
            return
        }
        print(movie.title)
    }
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

    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            favoriteMovies.remove(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
            saveFavorites()
        }
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let movie = favoriteMovies[indexPath.row]
        performSegue(withIdentifier: "showDetail", sender: movie)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showDetail",
           let destinationVC = segue.destination as? MovieDetailViewController,
           let movie = sender as? Movie {
            destinationVC.movie = movie
        }
    }
}

struct MovieImageViewController: UIViewController {
    var movie: Movie?

    override func viewDidLoad() {
        super.viewDidLoad()
        guard let movie = movie else {
            print("No movie")
            return
        }
        print(movie.title)
    }
}
