import UIKit

// MARK: - Director Data Model
struct Director {
    let id: Int
    let name: String
    let bio: String
    let birthDate: String
    let filmography: [String]
}

class DirectorDetailsViewController: UIViewController {

    var directorId: Int? // Director ID passed from the previous screen

    // UI Components
    private let nameLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 24)
        label.textAlignment = .center
        return label
    }()

    private let bioTextView: UITextView = {
        let textView = UITextView()
        textView.font = UIFont.systemFont(ofSize: 16)
        textView.isEditable = false
        return textView
    }()

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
        loadDirectorDetails()
    }

    // MARK: - Setup
    private func setupUI() {
        view.backgroundColor = .white
        view.addSubview(nameLabel)
        view.addSubview(bioTextView)
        view.addSubview(tableView)
        layoutUI()
    }

    private func configureTableView() {
        tableView.dataSource = self
        tableView.delegate = self
    }

    private func layoutUI() {
        // Constraints setup for nameLabel, bioTextView, and tableView
    }

    private func loadDirectorDetails() {
        guard let directorId = directorId else { return }
        fetchDirectorDetails(directorId: directorId)
    }

    private func fetchDirectorDetails(directorId: Int) {}
        let sampleDirector = Director(id: directorId, name: "Christopher Nolan", bio: "An acclaimed British-American film director...", birthDate: "1970-07-30", filmography: ["Inception", "The Dark Knight", "Interstellar"])

        nameLabel.text = sampleDirector.name
        bioTextView.text = "Bio: \(sampleDirector.bio)\n\nBorn: \(sampleDirector.birthDate)"

        apiClient.fetchDirectorFilmography(directorId: directorId) { result in
            switch result {
            case .success(let movies):
                director.filmography = movies.map { $0.title }
            case .failure(let error):
                print(error.localizedDescription)
            }
        }

        resultsLabel.text = "Filmography"

        tableView.reloadData()
    }
}

// MARK: - UITableViewDataSource, UITableViewDelegate
extension DirectorDetailsViewController: UITableViewDataSource, UITableViewDelegate {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 3 // Sample data
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        cell.textLabel?.text = ["Inception", "The Dark Knight", "Interstellar"][indexPath.row]
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        movieDetails(movie: ["Inception", "The Dark Knight", "Interstellar"][indexPath.row])
    }
}
