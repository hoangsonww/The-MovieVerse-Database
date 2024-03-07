import UIKit

// MARK: - Actor Data Model
struct Actor {
    let id: Int
    let name: String
    let bio: String
    let birthDate: String
    let filmography: [String]
}

class ActorDetailsViewController: UIViewController {

    var actor: Actor? // Actor data passed from the previous screen

    // UI Components
    private let nameLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 24)
        label.textAlignment = .center
        return label
    }()

    private let bioLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 16)
        label.numberOfLines = 0
        label.textAlignment = .left
        return label
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
        loadActorDetails()
    }

    // MARK: - Setup
    private func setupUI() {
        view.backgroundColor = .white
        view.addSubview(nameLabel)
        view.addSubview(bioLabel)
        view.addSubview(tableView)
        layoutUI()
    }

    private func configureTableView() {
        tableView.dataSource = self
        tableView.delegate = self
    }

    private func layoutUI() {
        nameLabel.translatesAutoresizingMaskIntoConstraints = false
        bioLabel.translatesAutoresizingMaskIntoConstraints = false
        tableView.translatesAutoresizingMaskIntoConstraints = false
        dobLabel.translatesAutoresizingMaskIntoConstraints = false
        ageLabel.translatesAutoresizingMaskIntoConstraints = false
        filmographyLabel.translatesAutoresizingMaskIntoConstraints = false
        heightLabel.translatesAutoresizingMaskIntoConstraints = false
    }

    private func loadActorDetails() {
        guard let actor = actor else { return }
        nameLabel.text = actor.name
        bioLabel.text = "Biography: \(actor.bio)"

        tableView.reloadData()
    }
}

// MARK: - UITableViewDataSource, UITableViewDelegate
extension ActorDetailsViewController: UITableViewDataSource, UITableViewDelegate {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return actor?.filmography.count ?? 0
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        cell.textLabel?.text = actor?.filmography[indexPath.row]
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        tableView.reloadData()
    }
}
