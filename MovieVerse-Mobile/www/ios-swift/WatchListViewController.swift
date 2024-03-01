import UIKit

class WatchlistViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    var watchlistManager = WatchlistManager()
    @IBOutlet weak var tableView: UITableView!

    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
    }

    func CreateWatchlist() {
        let watchlist = Watchlist()
        watchlistManager.addWatchlist(watchlist)
    }

    func DeleteWatchlist() {
        watchlistManager.removeWatchlist(at: 0)
    }

    func GetWatchlists() -> [Watchlist] {
        return watchlistManager.getWatchlists()
    }

    func GetWatchlist(at index: Int) -> Watchlist {
        return watchlistManager.getWatchlist(at: index)
    }

    func GetWatchlistCount() -> Int {
        return watchlistManager.getWatchlistCount()
    }

    func EditWatchlist(at index: Int, with watchlist: Watchlist) {
        watchlistManager.updateWatchlist(at: index, with: watchlist)
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return watchlistManager.getMovies().count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MovieCell", for: indexPath)
        let movie = watchlistManager.getMovies()[indexPath.row]
        cell.textLabel?.text = movie.title
        return cell
    }

    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            watchlistManager.removeMovie(at: indexPath.row)
            tableView.deleteRows(at: [indexPath], with: .fade)
        }
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        var movie = watchlistManager.getMovies()[indexPath.row]
        let alert = UIAlertController(title: "Edit Movie", message: "Edit the movie title", preferredStyle: .alert)
        alert.addTextField { (textField) in
            textField.text = movie.title
        }
        alert.addAction(UIAlertAction(title: "Update", style: .default, handler: { [weak alert] (_) in
            let textField = alert?.textFields![0]
            movie.title = textField!.text!
            self.watchlistManager.updateMovie(at: indexPath.row, with: movie)
            self.tableView.reloadData()
        }))
        self.present(alert, animated: true, completion: nil)
    }

    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let addMovieViewController = segue.destination as! AddMovieViewController
        addMovieViewController.watchlistManager = watchlistManager
    }

    @IBAction func unwindToWatchlistViewController(_ unwindSegue: UIStoryboardSegue) {
        tableView.reloadData()
    }

    @IBAction func editButtonTapped(_ sender: Any) {
        tableView.isEditing = !tableView.isEditing
    }

    @IBAction func clearButtonTapped(_ sender: Any) {
        watchlistManager.clearMovies()
        tableView.reloadData()
    }

    @IBAction func saveButtonTapped(_ sender: Any) {
        watchlistManager.saveMovies()
    }

    @IBAction func loadButtonTapped(_ sender: Any) {
        watchlistManager.loadMovies()
        tableView.reloadData()
    }

    @IBAction func sortButtonTapped(_ sender: Any) {
        watchlistManager.sortMovies()
        tableView.reloadData()
    }

    @IBAction func filterButtonTapped(_ sender: Any) {
        watchlistManager.filterMovies()
        tableView.reloadData()
    }

    @IBAction func mapButtonTapped(_ sender: Any) {
        let mapViewController = storyboard?.instantiateViewController(withIdentifier: "MapViewController") as! MapViewController
        mapViewController.watchlistManager = watchlistManager
        navigationController?.pushViewController(mapViewController, animated: true)
    }

    @IBAction func searchButtonTapped(_ sender: Any) {
        let searchViewController = storyboard?.instantiateViewController(withIdentifier: "SearchViewController") as! SearchViewController
        searchViewController.watchlistManager = watchlistManager
        navigationController?.pushViewController(searchViewController, animated: true)
    }

    @IBAction func settingsButtonTapped(_ sender: Any) {
        let settingsViewController = storyboard?.instantiateViewController(withIdentifier: "SettingsViewController") as! SettingsViewController
        settingsViewController.watchlistManager = watchlistManager
        navigationController?.pushViewController(settingsViewController, animated: true)
    }

    @IBAction func logoutButtonTapped(_ sender: Any) {
        let loginViewController = storyboard?.instantiateViewController(withIdentifier: "LoginViewController") as! LoginViewController
        navigationController?.pushViewController(loginViewController, animated: true)
    }

    @IBAction func addButtonTapped(_ sender: Any) {
        let addMovieViewController = storyboard?.instantiateViewController(withIdentifier: "AddMovieViewController") as! AddMovieViewController
        addMovieViewController.watchlistManager = watchlistManager
        navigationController?.pushViewController(addMovieViewController, animated: true)
    }

    @IBAction func refreshButtonTapped(_ sender: Any) {
        tableView.reloadData()
    }

    @IBAction func unwindToWatchlistViewControllerWithSegue(_ segue: UIStoryboardSegue) {
        tableView.reloadData()
    }

    @IBAction func unwindToWatchlistViewControllerWithUnwindSegue(_ unwindSegue: UIStoryboardSegue) {
        tableView.reloadData()
    }

    @IBAction func unwindToWatchlistViewControllerWithUnwindSegueAndSender(_ unwindSegue: UIStoryboardSegue) {
        tableView.reloadData()
    }

    func tableView(_ tableView: UITableView, moveRowAt sourceIndexPath: IndexPath, to destinationIndexPath: IndexPath) {
        watchlistManager.moveMovie(from: sourceIndexPath.row, to: destinationIndexPath.row)
        tableView.reloadData()
    }

    private func addMovie(_ movie: Movie) {
        watchlistManager.addMovie(movie)
        tableView.reloadData()
    }

    private func removeMovie(at index: Int) {
        watchlistManager.removeMovie(at: index)
        tableView.reloadData()
    }

    private func favoriteMovie(at index: Int) {
        watchlistManager.favoriteMovie(at: index)
        tableView.reloadData()
    }

    private func unfavoriteMovie(at index: Int) {
        watchlistManager.unfavoriteMovie(at: index)
        tableView.reloadData()
    }

    private func getMovies() -> [Movie] {
        return watchlistManager.getMovies()
    }

    private func saveMovies() {
        watchlistManager.saveMovies()
    }

    private func loadMovies() {
        watchlistManager.loadMovies()
        tableView.reloadData()
    }

    private func sortMovies() {
        watchlistManager.sortMovies()
        tableView.reloadData()
    }

    private func filterMovies() {
        watchlistManager.filterMovies()
        tableView.reloadData()
    }

    private func clearMovies() {
        watchlistManager.clearMovies()
        tableView.reloadData()
    }

    private func moveMovie(from sourceIndexPathRow: Int, to destinationIndexPathRow: Int) {
        watchlistManager.moveMovie(from: sourceIndexPathRow, to: destinationIndexPathRow)
        tableView.reloadData()
    }

    private func updateMovie(at index: Int, with movie: Movie) {
        watchlistManager.updateMovie(at: index, with: movie)
        tableView.reloadData()
    }

    private func getFavoriteMovies() -> [Movie] {
        return watchlistManager.getFavoriteMovies()
    }

    private func getUnfavoriteMovies() -> [Movie] {
        return watchlistManager.getUnfavoriteMovies()
    }

    private func getFavoriteMoviesCount() -> Int {
        return watchlistManager.getFavoriteMoviesCount()
    }

    private func getUnfavoriteMoviesCount() -> Int {
        return watchlistManager.getUnfavoriteMoviesCount()
    }

    private func getFavoriteMoviesCountText() -> String {
        return watchlistManager.getFavoriteMoviesCountText()
    }

    private func getUnfavoriteMoviesCountText() -> String {
        return watchlistManager.getUnfavoriteMoviesCountText()
    }

    private func getFavoriteMoviesCountTextWithCount(_ count: Int) -> String {
        return watchlistManager.getFavoriteMoviesCountTextWithCount(count)
    }

    private func updateWatchlist(at index: Int, with watchlist: Watchlist) {
        watchlistManager.updateWatchlist(at: index, with: watchlist)
    }

    private func getWatchlist(at index: Int) -> Watchlist {
        return watchlistManager.getWatchlist(at: index)
    }

    private func getWatchlistCount() -> Int {
        return watchlistManager.getWatchlistCount()
    }

    private func getWatchlists() -> [Watchlist] {
        return watchlistManager.getWatchlists()
    }

    private func addWatchlist(_ watchlist: Watchlist) {
        watchlistManager.addWatchlist(watchlist)
    }

    private func removeWatchlist(at index: Int) {
        watchlistManager.removeWatchlist(at: index)
    }

    private func clearWatchlists() {
        watchlistManager.clearWatchlists()
    }

    private func saveWatchlists() {
        watchlistManager.saveWatchlists()
    }

    private func loadWatchlists() {
        watchlistManager.loadWatchlists()
    }

    private func sortWatchlists() {
        watchlistManager.sortWatchlists()
    }

    private func filterWatchlists() {
        watchlistManager.filterWatchlists()
    }

    private func moveWatchlist(from sourceIndexPathRow: Int, to destinationIndexPathRow: Int) {
        watchlistManager.moveWatchlist(from: sourceIndexPathRow, to: destinationIndexPathRow)
    }

    private func getFavoriteWatchlists() -> [Watchlist] {
        return watchlistManager.getFavoriteWatchlists()
    }

    private func getUnfavoritedWatchlists() -> [Watchlist] {
        return watchlistManager.getUnfavoriteWatchlists()
    }
}
