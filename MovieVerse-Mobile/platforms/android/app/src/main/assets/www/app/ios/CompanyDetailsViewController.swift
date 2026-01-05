import Foundation

// Define the company details structure
struct Company: Codable {
    let id: Int
    let name: String
    let headquarters: String?
    let homepage: String?
    let logoPath: String?
    let parentCompany: ParentCompany?

    enum CodingKeys: String, CodingKey {
        case id, name, headquarters, homepage
        case logoPath = "logo_path"
        case parentCompany = "parent_company"
    }

    struct ParentCompany: Codable {
        let id: Int
        let name: String
        let logoPath: String?

        enum CodingKeys: String, CodingKey {
            case id, name
            case logoPath = "logo_path"
        }
    }
}

// Networking class for fetching company details
class NetworkManager {
    static let shared = NetworkManager()
    private init() {}

    func fetchCompanyDetails(companyId: Int, completion: @escaping (Company?, Error?) -> Void) {
        let apiKey = "unpublished" // Check .env file
        let urlString = "https://api.themoviedb.org/3/company/\(companyId)?api_key=\(apiKey)"
        guard let url = URL(string: urlString) else {
            completion(nil, NSError(domain: "Invalid URL", code: 0, userInfo: nil))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(nil, error)
                return
            }

            guard let data = data else {
                completion(nil, NSError(domain: "No data", code: 0, userInfo: nil))
                return
            }

            do {
                let company = try JSONDecoder().decode(Company.self, from: data)
                completion(company, nil)
            }
            catch {
                completion(nil, error)
            }
        }.resume()
    }
}

class fetchCompanyDetails {
    let networkManager = NetworkManager.shared
    networkManager.fetchCompanyDetails(companyId: 174) { company, error in
        if let company = company {
            print("Company Name: \(company.name)")
        }
        else if let error = error {
            print("Error fetching company details: \(error.localizedDescription)")
        }
    }
}
