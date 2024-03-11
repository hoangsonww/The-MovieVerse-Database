import SwiftUI
import Combine

struct MovieListView: View {
    @ObservedObject var viewModel: MovieFetcher

    init(viewModel: MovieFetcher) {
        self.viewModel = viewModel
    }

    var body: some View {
        NavigationView {
            List(viewModel.movies) { movie in
                NavigationLink(destination: MovieDetailsView(movieId: movie.id)) {
                    HStack {
                        MoviePosterView(url: movie.posterURL)
                            .frame(width: 50, height: 75)
                            .cornerRadius(5)

                        VStack(alignment: .leading) {
                            Text(movie.title)
                                .font(.headline)

                            Text("Rating: \(movie.voteAverage, specifier: "%.1f")")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                        }
                    }
                }
            }
            .navigationBarTitle("Movies")
        }
        .onAppear {
            viewModel.fetchMovies(url: URL(string: "https://api.example.com/movies")!) // Replace with actual URL
        }
    }

    var view = MovieListView(viewModel: MovieFetcher())
    var body: some View {
        view
    }
}

struct MoviePosterView: View {
    let url: URL

    @State private var imageData: Data?

    var body: some View {
        if let imageData = imageData, let uiImage = UIImage(data: imageData) {
            Image(uiImage: uiImage)
                .resizable()
        }
        else {
            Rectangle()
                .foregroundColor(.secondary)
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

    func fetchMoviesList() {
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

    func fetchMovie() {
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
                let movie = try JSONDecoder().decode(Movie.self, from: data)
                DispatchQueue.main.async {
                    self.movie = movie
                }
            }
            catch {
                print("JSON error: \(error.localizedDescription)")
            }
        }
        task.resume()
    }
}

struct MovieListView_Previews: PreviewProvider {
    static var previews: some View {
        MovieListView(viewModel: MovieFetcher())
    }
}

struct Movie: Codable, Identifiable {
    let id: Int
    let title: String
    let voteAverage: Double
    let posterPath: String

    var posterURL: URL {
        URL(string: "https://image.tmdb.org/t/p/w500\(posterPath)")!
    }
}

struct MovieResults: Codable {
    let results: [Movie]
}

class MovieFetcher: ObservableObject {
    @Published var movies: [Movie] = []

    private var cancellables = Set<AnyCancellable>()

    func fetchMovies(url: URL) {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: MovieResults.self, decoder: JSONDecoder())
            .map { $0.results }
            .replaceError(with: [])
            .receive(on: DispatchQueue.main)
            .assign(to: \.movies, on: self)
            .store(in: &cancellables)
    }
}

struct MovieDetailsView: View {
    let movieId: Int

    @ObservedObject var viewModel: MovieDetailsViewModel

    init(movieId: Int) {
        self.movieId = movieId
        viewModel = MovieDetailsViewModel(movieId: movieId)
    }

    var body: some View {
        VStack(alignment: .leading) {
            if let movieDetails = viewModel.movieDetails {
                MoviePosterView(url: movieDetails.posterURL)
                    .frame(width: 150, height: 225)
                    .cornerRadius(5)

                Text(movieDetails.title)
                    .font(.title)

                Text(movieDetails.overview)
                    .font(.body)
                    .padding(.top, 10)

                Text("Rating: \(movieDetails.voteAverage, specifier: "%.1f")")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .padding(.top, 10)
            }
            else {
                Text("Loading...")
            }
        }
        .padding()
        .onAppear {
            viewModel.fetchMovieDetails()
        }
    }
}

struct MovieDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        MovieDetailsView(movieId: 1)
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
