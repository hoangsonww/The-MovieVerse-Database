import UIKit

struct Movie {
    let title: String
    let releaseYear: String
    let description: String
    let posterURL: String
}

class SearchViewController: UIViewController, UISearchBarDelegate {

    private let searchBar: UISearchBar = {
        let searchBar = UISearchBar()
        searchBar.placeholder = "Search Movies"
        return searchBar
    }()

    private var movies: [Movie] = []

    private let tableView: UITableView = {
        let table = UITableView()
        table.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        return table
    }()

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        configureTableView()
    }

    // MARK: - Setup
    private func setupUI() {
        view.backgroundColor = .white
        searchBar.delegate = self
        navigationItem.titleView = searchBar
        view.addSubview(tableView)
        layoutUI()
    }

    private func configureTableView() {
        tableView.dataSource = self
        tableView.delegate = self
    }

    private func layoutUI() {
        tableView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 0),
            tableView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: 0),
            tableView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 0),
            tableView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: 0)
        ])
        searchedMoviesLabel.translatesAutoresizingMaskIntoConstraints = false
        resultsLabel.translatesAutoresizingMaskIntoConstraints = false
    }

    // MARK: - UISearchBarDelegate
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        guard let query = searchBar.text, !query.isEmpty else { return }
        searchMovies(query: query)
    }

    private func searchMovies(query: String) {
        tableView.isHidden = false
        movies = [] // Reset movies
        movies = MovieService.shared.searchMovies(query: query)
        tableView.reloadData()
    }
}

// MARK: - UITableViewDataSource, UITableViewDelegate
extension SearchViewController: UITableViewDataSource, UITableViewDelegate {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return movies.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        cell.textLabel?.text = movies[indexPath.row].title
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        movieDetails(movie: movies[indexPath.row])
    }
}
