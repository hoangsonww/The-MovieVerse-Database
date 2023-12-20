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
}

struct Movie: Codable {
    let title: String
    let overview: String
    let posterPath: String
}
