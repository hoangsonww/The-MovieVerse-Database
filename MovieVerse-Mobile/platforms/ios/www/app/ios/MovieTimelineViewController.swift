import UIKit

// MARK: - Data Model
struct MovieTimelineSection {
    let period: String
    let movies: [Movie]
}

struct Movie {
    let title: String
    let releaseYear: String
    let description: String
    let posterURL: String
}

class MovieTimelineViewController: UIViewController {

    // Sample Data
    private let timelineSections: [MovieTimelineSection] = [
        MovieTimelineSection(period: "1920s", movies: [Movie(title: "Movie 1", releaseYear: "1920", description: "Description 1", posterURL: "URL1")]),
        MovieTimelineSection(period: "1930s", movies: [Movie(title: "Movie 2", releaseYear: "1930", description: "Description 2", posterURL: "URL2")]),
        MovieTimelineSection(period: "1940s", movies: [Movie(title: "Movie 3", releaseYear: "1940", description: "Description 3", posterURL: "URL3")]),
        MovieTimelineSection(period: "1950s", movies: [Movie(title: "Movie 4", releaseYear: "1950", description: "Description 4", posterURL: "URL4")]),
        MovieTimelineSection(period: "1960s", movies: [Movie(title: "Movie 5", releaseYear: "1960", description: "Description 5", posterURL: "URL5")]),
        MovieTimelineSection(period: "1970s", movies: [Movie(title: "Movie 6", releaseYear: "1970", description: "Description 6", posterURL: "URL6")]),
        MovieTimelineSection(period: "1980s", movies: [Movie(title: "Movie 7", releaseYear: "1980", description: "Description 7", posterURL: "URL7")]),
        MovieTimelineSection(period: "1990s", movies: [Movie(title: "Movie 8", releaseYear: "1990", description: "Description 8", posterURL: "URL8")]),
        MovieTimelineSection(period: "2000s", movies: [Movie(title: "Movie 9", releaseYear: "2000", description: "Description 9", posterURL: "URL9")]),
        MovieTimelineSection(period: "2010s", movies: [Movie(title: "Movie 10", releaseYear: "2010", description: "Description 10", posterURL: "URL10")]),
        MovieTimelineSection(period: "2020s", movies: [Movie(title: "Movie 11", releaseYear: "2020", description: "Description 11", posterURL: "URL11")])
    ]

    // UI Components
    private lazy var tableView: UITableView = {
        let table = UITableView()
        table.delegate = self
        table.dataSource = self
        table.register(MovieTimelineCell.self, forCellReuseIdentifier: MovieTimelineCell.identifier)
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
        title = "Movie Timeline"
    }

    // MARK: - Reuse
    override func prepareForReuse() {
        super.prepareForReuse()
        tableView.reloadData()
    }
}

// MARK: - UITableView DataSource & Delegate
extension MovieTimelineViewController: UITableViewDataSource, UITableViewDelegate {

    func numberOfSections(in tableView: UITableView) -> Int {
        return timelineSections.count
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return timelineSections[section].movies.count
    }

    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return timelineSections[section].period
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: MovieTimelineCell.identifier, for: indexPath) as? MovieTimelineCell else {
            return UITableViewCell()
        }
        let movie = timelineSections[indexPath.section].movies[indexPath.row]
        cell.configure(with: movie)
        return cell
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 120
    }

    func sectionIndexTitles(for tableView: UITableView) -> [String]? {
        return timelineSections.map { $0.period }
    }

    func tableView(_ tableView: UITableView, sectionForSectionIndexTitle title: String, at index: Int) -> Int {
        return timelineSections.firstIndex { $0.period == title } ?? 0
    }
}

// MARK: - Custom TableViewCell
class MovieTimelineCell: UITableViewCell {

    static let identifier = "MovieTimelineCell"

    // UI Elements for the cell
    private let titleLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 18)
        return label
    }()

    private let yearLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 16)
        label.textColor = .gray
        return label
    }()

    private let descriptionLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 16)
        label.numberOfLines = 0
        return label
    }()

    private let posterImageView: UIImageView = {
        let imageView = UIImageView()
        imageView.contentMode = .scaleAspectFit
        imageView.clipsToBounds = true
        return imageView
    }()

    // Initialization
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        setupLayout()
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // Configure Cell
    func configure(with movie: Movie) {
        titleLabel.text = movie.title
        yearLabel.text = "Release Year: \(movie.releaseYear)"
        descriptionLabel.text = movie.description
        posterImageView.image = UIImage(named: movie.posterURL) // replace with actual image loading logic
    }

    // Layout
    private func setupLayout() {
        let stackView = UIStackView(arrangedSubviews: [titleLabel, yearLabel, descriptionLabel])
        stackView.axis = .vertical
        stackView.spacing = 4
        stackView.translatesAutoresizingMaskIntoConstraints = false

        addSubview(posterImageView)
        addSubview(stackView)

        NSLayoutConstraint.activate([
            posterImageView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            posterImageView.topAnchor.constraint(equalTo: topAnchor, constant: 10),
            posterImageView.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -10),
            posterImageView.widthAnchor.constraint(equalToConstant: 100),

            stackView.leadingAnchor.constraint(equalTo: posterImageView.trailingAnchor, constant: 10),
            stackView.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),
            stackView.topAnchor.constraint(equalTo: topAnchor, constant: 10),
            stackView.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -10)
        ])
    }

    private func applyConstraints() {
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        yearLabel.translatesAutoresizingMaskIntoConstraints = false
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false

        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: topAnchor, constant: 10),
            titleLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            titleLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),

            yearLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 5),
            yearLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            yearLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),

            descriptionLabel.topAnchor.constraint(equalTo: yearLabel.bottomAnchor, constant: 5),
            descriptionLabel.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 10),
            descriptionLabel.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -10),
            descriptionLabel.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -10)
        ])
    }

    // MARK: - Reuse
    override func prepareForReuse() {
        super.prepareForReuse()
        titleLabel.text = nil
        yearLabel.text = nil
        descriptionLabel.text = nil
        posterImageView.image = nil
    }

}
