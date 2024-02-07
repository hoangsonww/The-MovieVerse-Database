import SwiftUI

struct MovieSearchView: View {
    @ObservedObject var viewModel: MovieFetcher
    @State private var searchText = ""

    init(viewModel: MovieFetcher) {
        self.viewModel = viewModel
    }

    var body: some View {
        NavigationView {
            List {
                TextField("Search movies...", text: $searchText, onCommit: {
                    viewModel.searchMovies(query: searchText)
                })
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

                ForEach(viewModel.movies) { movie in
                    NavigationLink(destination: MovieDetailsView(movieId: movie.id)) {
                        Text(movie.title)
                    }
                }
            }
            .navigationBarTitle("Search Movies")
        }
    }

    var view = MovieSearchView(viewModel: MovieFetcher())

    var body: some View {
        view
    }

}

struct MovieSearchView_Previews: PreviewProvider {
    static var previews: some View {
        MovieSearchView(viewModel: MovieFetcher())
    }
}

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
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data else {
                print("No data in response: \(error?.localizedDescription ?? "Unknown error")")
                return
            }

            DispatchQueue.main.async {
                self.imageData = data
            }
        }
        .resume()
    }
}

struct MovieDetailsView_Previews: PreviewProvider {
    static var previews: some View {
        MovieDetailsView(movieId: 1)
    }
}
