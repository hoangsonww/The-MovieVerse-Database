import UIKit

// MARK: - Data Model
struct AboutSection {
    let title: String
    let description: String
}

class AboutViewController: UIViewController {

    // Data
    private let sections: [AboutSection] = [
        AboutSection(title: "Welcome to The MovieVerse",
                     description: "Your ultimate destination for exploring the magic of movies. Here, you can discover, engage, and immerse yourself in the world of film."),
        AboutSection(title: "Core Features",
                     description: "Explore movies by genre, director, language, and era. Enjoy interactive movie details, high-quality trailers, and a community-driven recommendation system."),
        AboutSection(title: "Our Vision",
                     description: "We aim to create a haven for cinephiles, where discovery of movies is an adventure. It's a vibrant community for sharing cinematic experiences and insights."),
        AboutSection(title: "Join The Journey",
                     description: "We're constantly innovating to bring you new and exciting features. Your engagement and feedback are invaluable to us.")
    ]

    // UI Components
    private lazy var tableView: UITableView = {
        let table = UITableView()
        table.delegate = self
        table.dataSource = self
        table.register(AboutSectionCell.self, forCellReuseIdentifier: AboutSectionCell.identifier)
        return table
    }()

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    // MARK: - Setup
    private func setupUI() {
        view.addSubview(tableView)
        tableView.frame = view.bounds
        title = "About The MovieVerse"
    }
}

// MARK: - UITableView DataSource & Delegate
extension AboutViewController: UITableViewDataSource, UITableViewDelegate {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return sections.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: AboutSectionCell.identifier, for: indexPath) as? AboutSectionCell else {
            return UITableViewCell()
        }
        let section = sections[indexPath.row]
        cell.configure(with: section)
        return cell
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }
}

// MARK: - Custom TableViewCell
class AboutSectionCell: UITableViewCell {

    static let identifier = "AboutSectionCell"

    private let titleLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 18)
        label.numberOfLines = 0
        return label
    }()

    private let descriptionLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 16)
        label.numberOfLines = 0
        label.textColor = .darkGray
        return label
    }()

    // Initialization
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        contentView.addSubview(titleLabel)
        contentView.addSubview(descriptionLabel)
        applyConstraints()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // Configure Cell
    func configure(with section: AboutSection) {
        titleLabel.text = section.title
        descriptionLabel.text = section.description
    }

    // Constraints
    private func applyConstraints() {
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 10),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 10),
            titleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -10),

            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 5),
            descriptionLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 10),
            descriptionLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -10),
            descriptionLabel.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -10)
        ])
    }
}
