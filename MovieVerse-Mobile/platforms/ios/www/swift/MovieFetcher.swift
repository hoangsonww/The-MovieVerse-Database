import Foundation
import SwiftUI
import Combine

struct Movie: Identifiable, Decodable {
    var id: Int
    var title: String
    var voteAverage: Double
    var overview: String
    var posterPath: String?
    
    var posterURL: URL {
        return URL(string: "https://image.tmdb.org/t/p/w500\(posterPath ?? "")")!
    }

    enum CodingKeys: String, CodingKey {
        case id, title, overview
        case voteAverage = "vote_average"
        case posterPath = "poster_path"
    }
}

struct Trivia: Identifiable, Decodable {
    var id: Int
    var results: [TriviaResult]
}

struct TriviaResult: Identifiable, Decodable {
    var id: Int
    var question: String
    var correctAnswer: String
    var incorrectAnswers: [String]

    enum CodingKeys: String, CodingKey {
        case id, question
        case correctAnswer = "correct_answer"
        case incorrectAnswers = "incorrect_answers"
    }
}

struct SearchResults: Identifiable, Decodable {
    var id: Int
    var results: [SearchResult]
}

struct Favorites: Identifiable, Decodable {
    var id: Int
    var results: [Favorite]
}

struct SearchResult: Identifiable, Decodable {
    var id: Int
    var title: String
    var voteAverage: Double
    var overview: String
    var posterPath: String?

    var posterURL: URL {
        return URL(string: "https://image.tmdb.org/t/p/w500\(posterPath ?? "")")!
    }

    enum CodingKeys: String, CodingKey {
        case id, title, overview
        case voteAverage = "vote_average"
        case posterPath = "poster_path"
    }
}

struct Favorite: Identifiable, Decodable {
    var id: Int
    var title: String
    var voteAverage: Double
    var overview: String
    var posterPath: String?

    var posterURL: URL {
        return URL(string: "https://image.tmdb.org/t/p/w500\(posterPath ?? "")")!
    }

    enum CodingKeys: String, CodingKey {
        case id, title, overview
        case voteAverage = "vote_average"
        case posterPath = "poster_path"
    }
}

struct MovieDetails: Identifiable, Decodable {
    var id: Int
    var title: String
    var voteAverage: Double
    var overview: String
    var posterPath: String?
    var backdropPath: String?
    var releaseDate: String
    var runtime: Int
    var genres: [Genre]
    var credits: Credits
    var videos: Videos
    var images: Images
    var keywords: Keywords
    var productionCompanies: [ProductionCompany]
    var productionCountries: [ProductionCountry]
    var spokenLanguages: [SpokenLanguage]
    var revenue: Int
    var budget: Int
    var tagline: String
    var homepage: String
    var imdbId: String
    var status: String

    var posterURL: URL {
        return URL(string: "https://image.tmdb.org/t/p/w500\(posterPath ?? "")")!
    }

    var backdropURL: URL {
        return URL(string: "https://image.tmdb.org/t/p/w500\(backdropPath ?? "")")!
    }

    enum CodingKeys: String, CodingKey {
        case id, title, overview
        case voteAverage = "vote_average"
        case posterPath = "poster_path"
        case backdropPath = "backdrop_path"
        case releaseDate = "release_date"
        case runtime, genres, credits, videos, images, keywords
        case productionCompanies = "production_companies"
        case productionCountries = "production_countries"
        case spokenLanguages = "spoken_languages"
        case revenue, budget, tagline, homepage
        case imdbId = "imdb_id"
        case status
    }
}

class MovieFetcher: ObservableObject {
    @Published var movies = [Movie]()
    @Published var movieDetails: Movie?
    @Published var imageData: Data?
    @Published var trivia: Trivia?
    @Published var favorites = [Favorite]()
    @Published var searchResults = [SearchResult]()
    @Published var searchResults2 = [SearchResult]()
    @Published var searchResults3 = [SearchResult]()
    private var cancellables = Set<AnyCancellable>()
    private var cancellables2 = Set<AnyCancellable>()

    private func handleCompletion(completion: Subscribers.Completion<Error>) {
        switch completion {
        case .finished:
            print("Data fetch completed successfully.")
        case .failure(let error):
            print("Error occurred: \(error.localizedDescription)")
        }
    }

    func fetchMovies() {
        let url = URL(string: "https://api.themoviedb.org/3/movie/popular?api_key=123456789")!
        fetchMovies(url: url)
    }

    func fetchMovies(url: URL) {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: [Movie].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { [weak self] completion in
                self?.handleCompletion(completion: completion)
            }, receiveValue: { [weak self] movies in
                self?.movies = movies
            })
            .store(in: &cancellables)
    }

    func fetchMovieDetails(url: URL) {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: Movie.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                handleCompletion()
            }, receiveValue: { [weak self] movie in
                self?.movieDetails = movie
            })
            .store(in: &cancellables)
    }

    func fetchFavorites() {
        let url = URL(string: "https://api.themoviedb.org/3/movie/popular?api_key=123456789")!
        fetchFavorites(url: url)
    }

    func fetchFavorites(url: URL) {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: [Favorite].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { [weak self] completion in
                self?.handleCompletion(completion: completion)
            }, receiveValue: { [weak self] favorites in
                self?.favorites = favorites
            })
            .store(in: &cancellables)
    }

    func searchMovies(query: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/movie?query=\(query)&api_key=123456789")!
        fetchMovies(url: url)
    }

    func fetchMovieDetails(movieId: Int) {
        let url = URL(string: "https://api.themoviedb.org/3/movie/\(movieId)?api_key=123456789")!
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: Movie.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                handleCompletion()
            }, receiveValue: { [weak self] movie in
                self?.movieDetails = movie
            })
            .store(in: &cancellables)
    }

    func fetchMoviesByCategory(category: String) {
        let url = URL(string: "https://api.themoviedb.org/3/movie/\(category)?api_key=123456789")!
        fetchMovies(url: url)
    }

    func fetchTrivia() {
        let url = URL(string: "https://opentdb.com/api.php?amount=1&category=11&difficulty=easy&type=multiple")!
        fetchTrivia(url: url)
    }

    func fetchTrivia(url: URL) {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .decode(type: Trivia.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                handleCompletion()
            }, receiveValue: { [weak self] trivia in
                self?.trivia = trivia
            })
            .store(in: &cancellables)
    }

    func fetchTriviaByCategory(category: String) {
        let url = URL(string: "https://opentdb.com/api.php?amount=1&category=\(category)&difficulty=easy&type=multiple")!
        fetchTrivia(url: url)
    }

    func fetchImageData(from url: URL) {
        URLSession.shared.dataTaskPublisher(for: url)
            .map { $0.data }
            .receive(on: DispatchQueue.main)
            .sink(receiveCompletion: { completion in
                handleCompletion()
            }, receiveValue: { [weak self] data in
                self?.imageData = data
            })
            .store(in: &cancellables)
    }

    func fetchMoviesByGenre(genre: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByYear(year: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&primary_release_year=\(year)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByActor(actor: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/person?api_key=123456789&query=\(actor)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByDirector(director: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/person?api_key=123456789&query=\(director)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByWriter(writer: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/person?api_key=123456789&query=\(writer)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByKeyword(keyword: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/keyword?api_key=123456789&query=\(keyword)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByCompany(company: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/company?api_key=123456789&query=\(company)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByCountry(country: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/company?api_key=123456789&query=\(country)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByLanguage(language: String) {
        let url = URL(string: "https://api.themoviedb.org/3/search/company?api_key=123456789&query=\(language)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByRuntime(runtime: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_runtime.lte=\(runtime)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByRating(rating: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&vote_average.gte=\(rating)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByRevenue(revenue: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_revenue.gte=\(revenue)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByVoteCount(voteCount: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&vote_count.gte=\(voteCount)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByCertification(certification: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&certification_country=US&certification=\(certification)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByReleaseDate(releaseDate: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&primary_release_date.gte=\(releaseDate)")!
        fetchMovies(url: url)
    }

    func fetchMoviesBySort(sort: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&sort_by=\(sort)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByAdult(adult: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&include_adult=\(adult)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByVideo(video: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&include_video=\(video)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByPage(page: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&page=\(page)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndYear(genre: String, year: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&primary_release_year=\(year)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndActor(genre: String, actor: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_people=\(actor)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndDirector(genre: String, director: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_people=\(director)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndWriter(genre: String, writer: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_people=\(writer)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndKeyword(genre: String, keyword: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_keywords=\(keyword)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndCompany(genre: String, company: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_companies=\(company)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndCountry(genre: String, country: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_companies=\(country)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndLanguage(genre: String, language: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_companies=\(language)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndRuntime(genre: String, runtime: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_runtime.lte=\(runtime)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndRating(genre: String, rating: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&vote_average.gte=\(rating)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndRevenue(genre: String, revenue: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&with_revenue.gte=\(revenue)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndVoteCount(genre: String, voteCount: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&with_genres=\(genre)&vote_count.gte=\(voteCount)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndCertification(genre: String, certification: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&certification_country=US&certification=\(certification)&with_genres=\(genre)")!
        fetchMovies(url: url)
    }

    func fetchMoviesByGenreAndReleaseDate(genre: String, releaseDate: String) {
        let url = URL(string: "https://api.themoviedb.org/3/discover/movie?api_key=123456789&primary_release_date.gte=\(releaseDate)&with_genres=\(genre)")!
        fetchMovies(url: url)
    }

}
