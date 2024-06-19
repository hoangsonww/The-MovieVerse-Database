import SwiftUI
import Combine

struct MovieDetailsView: View {
    @ObservedObject var viewModel: MovieDetailsViewModel
    let movieId: Int

    init(movieId: Int) {
        self.movieId = movieId
        self.viewModel = MovieDetailsViewModel(movieId: movieId)
    }

    var body: some View {
        ScrollView {
            VStack {
                if let movie = viewModel.movieDetails {
                    MoviePosterImage(url: movie.posterURL)
                        .frame(width: 200, height: 300)
                        .cornerRadius(8)

                    Text(movie.title)
                        .font(.title)
                        .fontWeight(.bold)
                        .padding(.top, 10)

                    Text("Rating: \(movie.voteAverage, specifier: "%.1f") / 10")
                        .font(.subheadline)
                        .padding(.vertical, 4)

                    Text(movie.overview)
                        .font(.body)
                        .padding()
                } else {
                    Text("Loading movie details...")
                        .font(.headline)
                        .foregroundColor(.gray)
                }
            }
        }
        .onAppear {
            viewModel.fetchMovieDetails()
        }
    }
}

struct MoviePosterImage: View {
    let url: URL

    @State private var imageData: Data?

    var body: some View {
        if let imageData = imageData, let uiImage = UIImage(data: imageData) {
            Image(uiImage: uiImage)
                .resizable()
        }
        else {
            Rectangle()
                .foregroundColor(.gray)
                .onAppear {
                    fetchImageData()
                }
        }
    }

    private func fetchImageData() {
        URLSession.shared.dataTask(with: url) { data, _, _ in
            if let data = data {
                DispatchQueue.main.async {
                    self.imageData = data
                }
            }
        }.resume()
    }

    private func fetchImageData2() {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .replaceError(with: nil)
            .receive(on: DispatchQueue.main)
            .assign(to: \.imageData, on: self)
    }

}

struct MovieDetailsViewModel {
    @Published var movieDetails: MovieDetail?

    private let movieId: Int
    private var cancellables = Set<AnyCancellable>()

    init(movieId: Int) {
        self.movieId = movieId
    }

    func fetchMovieDetails() {
        let url = URL(string: "https://api.themoviedb.org/3/movie/\(movieId)?api_key=YOUR_API_KEY_HERE")!
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: MovieDetail.self, decoder: JSONDecoder())
            .replaceError(with: nil)
            .receive(on: DispatchQueue.main)
            .assign(to: \.movieDetails, on: self)
            .store(in: &cancellables)
    }
}

struct MovieDetail: Codable {
    let title: String
    let overview: String
    let voteAverage: Double
    let posterPath: String

    var posterURL: URL {
        URL(string: "https://image.tmdb.org/t/p/w500\(posterPath)")!
    }
}

struct MovieDetailResults: Codable {
    let results: [MovieDetail]
}

struct MovieDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        MovieDetailsView(movieId: 123)
    }
}
