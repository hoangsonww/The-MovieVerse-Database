import SwiftUI
import Combine

struct FavoritesView: View {
    @ObservedObject var viewModel: FavoritesViewModel

    init(viewModel: FavoritesViewModel) {
        self.viewModel = viewModel
    }

    var body: some View {
        NavigationView {
            List(viewModel.favoriteMovies) { movie in
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
            .navigationBarTitle("Favorites")
        }
        .onAppear {
            viewModel.loadFavorites()
        }
    }
}

class FavoritesViewModel: ObservableObject {
    @Published var favoriteMovies: [Movie] = []

    func loadFavorites() {
        if let data = UserDefaults.standard.data(forKey: "favoriteMovies"),
           let movies = try? JSONDecoder().decode([Movie].self, from: data) {
            favoriteMovies = movies
        }
    }

}

struct FavoritesView_Previews: PreviewProvider {
    static var previews: some View {
        FavoritesView(viewModel: FavoritesViewModel())
    }

}
