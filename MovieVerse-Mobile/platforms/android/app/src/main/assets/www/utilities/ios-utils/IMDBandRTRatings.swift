import Foundation

// MARK: - Models

struct TMDBMovieResponse: Codable {
    let id: Int
    let title: String
    let voteAverage: Double
    let imdbId: String?

    enum CodingKeys: String, CodingKey {
        case id, title
        case voteAverage = "vote_average"
        case imdbId = "imdb_id"
    }
}

struct OMDbMovieResponse: Codable {
    let imdbRating: String?
    let ratings: [Rating]

    struct Rating: Codable {
        let source: String
        let value: String

        enum CodingKeys: String, CodingKey {
            case source = "Source"
            case value = "Value"
        }
    }
}

// MARK: - API Service

class MovieRatingService {
    let tmdbAPIKey = "123" // Replace with your TMDB API key - This is only for demo purposes
    let omdbAPIKey = "xyz" // Replace with your OMDb API key - This is only for demo purposes

    func fetchMovieRatings(from movieId: Int, completion: @escaping (String?, String?) -> Void) {
        let tmdbURL = URL(string: "https://api.themoviedb.org/3/movie/\(movieId)?api_key=\(tmdbAPIKey)&append_to_response=external_ids")!

        URLSession.shared.dataTask(with: tmdbURL) { data, response, error in
            guard let data = data, error == nil else {
                print("TMDB API request failed: \(error?.localizedDescription ?? "Unknown error")")
                completion(nil, nil)
                return
            }

            do {
                let tmdbResponse = try JSONDecoder().decode(TMDBMovieResponse.self, from: data)
                if let imdbId = tmdbResponse.imdbId {
                    // Fetch movie details from OMDb using IMDb ID
                    self.fetchOMDbMovieRatings(imdbId: imdbId, tmdbRating: tmdbResponse.voteAverage, completion: completion)
                } else {
                    // Fallback to TMDB rating if IMDb ID is not available
                    completion("\(tmdbResponse.voteAverage)/10", nil)
                }
            }
            catch {
                print("JSON parsing error: \(error.localizedDescription)")
                completion(nil, nil)
            }
        }.resume()
    }

    private func fetchOMDbMovieRatings(imdbId: String, tmdbRating: Double, completion: @escaping (String?, String?) -> Void) {
        let omdbURL = URL(string: "http://www.omdbapi.com/?i=\(imdbId)&apikey=\(omdbAPIKey)")!

        URLSession.shared.dataTask(with: omdbURL) { data, response, error in
            guard let data = data, error == nil else {
                print("OMDb API request failed: \(error?.localizedDescription ?? "Unknown error")")
                completion("\(tmdbRating)/10", nil)
                return
            }

            do {
                let omdbResponse = try JSONDecoder().decode(OMDbMovieResponse.self, from: data)
                let rtRating = omdbResponse.ratings.first { $0.source == "Rotten Tomatoes" }?.value
                completion(omdbResponse.imdbRating, rtRating)
            }
            catch {
                print("JSON parsing error: \(error.localizedDescription)")
                completion("\(tmdbRating)/10", nil)
            }
        }.resume()
    }
}

// MARK: - UI Update

func updateMovieRatingsUI(movieId: Int) {
    let movieRatingService = MovieRatingService()
    movieRatingService.fetchMovieRatings(from: movieId) { imdbRating, rtRating in
        DispatchQueue.main.async {
            print("IMDb Rating: \(imdbRating ?? "N/A")")
            print("Rotten Tomatoes Rating: \(rtRating ?? "N/A")")
        }
    }
}
