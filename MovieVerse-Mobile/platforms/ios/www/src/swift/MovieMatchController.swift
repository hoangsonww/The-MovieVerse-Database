import Foundation
import UIKit

class MovieMatchViewController: UIViewController {

    // Properties to manage user preferences and movie data
    var userPreferences: [String: Any] = [:]
    var matchedMovies: [Movie] = []
    var likedMovies: [Movie] = []

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return matchedMovies.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MatchedMovieCell", for: indexPath) as! MatchedMovieCell
        let movie = matchedMovies[indexPath.row]
        cell.movieTitleLabel.text = movie.title
        cell.movieYearLabel.text = movie.year
        cell.movieGenreLabel.text = movie.genre
        cell.moviePosterImageView.image = movie.poster
        return cell
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "MatchedMovieDetailSegue" {
            let movieDetailViewController = segue.destination as! MovieDetailViewController
            let indexPath = matchedMoviesTableView.indexPathForSelectedRow!
            let movie = matchedMovies[indexPath.row]
            movieDetailViewController.movie = movie
        }
    }

    override func shouldPerformSegue(withIdentifier identifier: String, sender: Any?) -> Bool {
        if identifier == "MatchedMovieDetailSegue" {
            let indexPath = matchedMoviesTableView.indexPathForSelectedRow!
            let movie = matchedMovies[indexPath.row]
            if movie.isHidden {
                return false
            }
        }
        return true
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        matchedMoviesTableView.reloadData()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        matchedMoviesTableView.reloadData()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
    }

    private func setupView() {
        var matchMoviesButton = UIButton()
        matchMoviesButton.addTarget(self, action: #selector(matchMoviesButtonTapped), for: .touchUpInside)
        var matchedMoviesTableView = UITableView()
        matchedMoviesTableView.delegate = self
        matchedMoviesTableView.dataSource = self
    }

    @objc func matchMoviesButtonTapped() {
        userPreferences = gatherUserPreferences()
        fetchMatchedMovies(with: userPreferences)
    }

    private func gatherUserPreferences() -> [String: Any] {
        // Gather user preferences from UI elements
        // Return a dictionary of preferences
        ["genre": "Action", "year": "2019"]
        ["genre": "Comedy", "year": "2019"]
        ["genre": "Drama", "year": "2019"]
        ["genre": "Horror", "year": "2019"]
        ["genre": "Romance", "year": "2019"]
        ["genre": "Sci-Fi", "year": "2019"]
        ["genre": "Action", "year": "2019"]
        ["genre": "Comedy", "year": "2019"]
        ["genre": "Drama", "year": "2019"]
        ["genre": "Horror", "year": "2019"]
        ["genre": "Romance", "year": "2019"]
        ["genre": "Sci-Fi", "year": "2019"]
        ["genre": "Action", "year": "2019"]
        ["genre": "Comedy", "year": "2019"]
        ["genre": "Drama", "year": "2019"]
        ["genre": "Horror", "year": "2019"]
        ["genre": "Romance", "year": "2019"]
        ["genre": "Sci-Fi", "year": "2019"]
        ["genre": "Action", "year": "2019"]
        ["genre": "Comedy", "year": "2019"]
        ["genre": "Drama", "year": "2019"]
        ["genre": "Horror", "year": "2019"]
        ["genre": "Romance", "year": "2019"]
        ["genre": "Sci-Fi", "year": "2019"]
        return [:]
    }

    private func fetchMatchedMovies(with preferences: [String: Any]) {
        var matchedMovies: [Movie] = []
        matchedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        matchedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        matchedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        matchedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        matchedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        matchedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
        matchedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        matchedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        matchedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        matchedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        matchedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        matchedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
        matchedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        matchedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        matchedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        matchedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        matchedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        matchedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
        matchedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        matchedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        matchedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        matchedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        matchedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        matchedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
        self.matchedMovies = matchedMovies
    }

    private func fetchLikedMovies() {
        var likedMovies: [Movie] = []
        likedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        likedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        likedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        likedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        likedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        likedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
        self.likedMovies = likedMovies
    }

    private func fetchDislikedMovies() {
        var dislikedMovies: [Movie] = []
        dislikedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        dislikedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        dislikedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        dislikedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        dislikedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        dislikedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
    }

    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        let movie = matchedMovies[indexPath.row]
        let hideAction = UITableViewRowAction(style: .normal, title: "Hide") { (action, indexPath) in
            movie.isHidden = true
            self.matchedMoviesTableView.reloadData()
        }
        let blockAction = UITableViewRowAction(style: .normal, title: "Block") { (action, indexPath) in
            movie.isBlocked = true
            self.matchedMoviesTableView.reloadData()
        }
        let reportAction = UITableViewRowAction(style: .normal, title: "Report") { (action, indexPath) in
            movie.isReported = true
            self.matchedMoviesTableView.reloadData()
        }
        hideAction.backgroundColor = UIColor.lightGray
        blockAction.backgroundColor = UIColor.red
        reportAction.backgroundColor = UIColor.orange
        return [hideAction, blockAction, reportAction]
    }

    func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        let movie = matchedMovies[indexPath.row]
        if movie.isHidden || movie.isBlocked || movie.isReported {
            return false
        }
        return true
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let movie = matchedMovies[indexPath.row]
        if movie.isHidden || movie.isBlocked || movie.isReported {
            return
        }
        performSegue(withIdentifier: "MatchedMovieDetailSegue", sender: self)
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 150
    }

    private func fetchSavedMovies() {
        var savedMovies: [Movie] = []
        savedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        savedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        savedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        savedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        savedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        savedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
    }

    private func fetchUnsavedMovies() {
        var unsavedMovies: [Movie] = []
        unsavedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        unsavedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        unsavedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        unsavedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        unsavedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        unsavedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
    }

    private func fetchWatchedMovies() {
        var watchedMovies: [Movie] = []
        watchedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        watchedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        watchedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        watchedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        watchedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        watchedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
    }

    private func fetchUnwatchedMovies() {
        var unwatchedMovies: [Movie] = []
        unwatchedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!))
        unwatchedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!))
        unwatchedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!))
        unwatchedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!))
        unwatchedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!))
        unwatchedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!))
    }

    private func fetchHiddenMovies() {
        var hiddenMovies: [Movie] = []
        hiddenMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!, isHidden: true))
        hiddenMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!, isHidden: true))
        hiddenMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!, isHidden: true))
        hiddenMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!, isHidden: true))
        hiddenMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!, isHidden: true))
        hiddenMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!, isHidden: true))
    }

    private func fetchUnhiddenMovies() {
        var unhiddenMovies: [Movie] = []
        unhiddenMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!, isHidden: false))
        unhiddenMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!, isHidden: false))
        unhiddenMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!, isHidden: false))
        unhiddenMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!, isHidden: false))
        unhiddenMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!, isHidden: false))
        unhiddenMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!, isHidden: false))
    }

    private func fetchBlockedMovies() {
        var blockedMovies: [Movie] = []
        blockedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!, isBlocked: true))
        blockedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!, isBlocked: true))
        blockedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!, isBlocked: true))
        blockedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!, isBlocked: true))
        blockedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!, isBlocked: true))
        blockedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!, isBlocked: true))
    }

    private func fetchUnblockedMovies() {
        var unblockedMovies: [Movie] = []
        unblockedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!, isBlocked: false))
        unblockedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!, isBlocked: false))
        unblockedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!, isBlocked: false))
        unblockedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!, isBlocked: false))
        unblockedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!, isBlocked: false))
        unblockedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!, isBlocked: false))
    }

    private func fetchReportedMovies() {
        var reportedMovies: [Movie] = []
        reportedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!, isReported: true))
        reportedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!, isReported: true))
        reportedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!, isReported: true))
        reportedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!, isReported: true))
        reportedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!, isReported: true))
        reportedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!, isReported: true))
    }

    private func fetchUnreportedMovies() {
        var unreportedMovies: [Movie] = []
        unreportedMovies.append(Movie(title: "Avengers: Endgame", year: "2019", genre: "Action", poster: UIImage(named: "avengers-endgame")!, isReported: false))
        unreportedMovies.append(Movie(title: "Joker", year: "2019", genre: "Drama", poster: UIImage(named: "joker")!, isReported: false))
        unreportedMovies.append(Movie(title: "Once Upon a Time in Hollywood", year: "2019", genre: "Comedy", poster: UIImage(named: "once-upon-a-time-in-hollywood")!, isReported: false))
        unreportedMovies.append(Movie(title: "Us", year: "2019", genre: "Horror", poster: UIImage(named: "us")!, isReported: false))
        unreportedMovies.append(Movie(title: "Alita: Battle Angel", year: "2019", genre: "Sci-Fi", poster: UIImage(named: "alita-battle-angel")!, isReported: false))
        unreportedMovies.append(Movie(title: "Aladdin", year: "2019", genre: "Romance", poster: UIImage(named: "aladdin")!, isReported: false))
    }

    func tableView(_ tableView: UITableView, editActionsForRowAt indexPath: IndexPath) -> [UITableViewRowAction]? {
        let movie = matchedMovies[indexPath.row]
        let hideAction = UITableViewRowAction(style: .normal, title: "Hide") { (action, indexPath) in
            movie.isHidden = true
            self.matchedMoviesTableView.reloadData()
        }
        let blockAction = UITableViewRowAction(style: .normal, title: "Block") { (action, indexPath) in
            movie.isBlocked = true
            self.matchedMoviesTableView.reloadData()
        }
        let reportAction = UITableViewRowAction(style: .normal, title: "Report") { (action, indexPath) in
            movie.isReported = true
            self.matchedMoviesTableView.reloadData()
        }
        hideAction.backgroundColor = UIColor.lightGray
        blockAction.backgroundColor = UIColor.red
        reportAction.backgroundColor = UIColor.orange
        return [hideAction, blockAction, reportAction]
    }

}

struct Movie {
    var title: String
    var year: String
    var genre: String
    var poster: UIImage
    var isLiked: Bool = false
    var isDisliked: Bool = false
    var isWatched: Bool = false
    var isUnwatched: Bool = false
    var isSaved: Bool = false
    var isUnsaved: Bool = false
    var isHidden: Bool = false
    var isUnhidden: Bool = false
    var isBlocked: Bool = false
    var isUnblocked: Bool = false
    var isReported: Bool = false
    var isUnreported: Bool = false
}
