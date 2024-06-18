import UIKit

class AddMovieViewController: UIViewController {
    var watchlistManager = WatchlistManager()

    @IBOutlet weak var movieTitleTextField: UITextField!
    @IBOutlet weak var movieOverviewTextView: UITextView!
    @IBOutlet weak var moviePosterPathTextField: UITextField!

    @IBAction func saveButtonTapped(_ sender: Any) {
        let newMovie = Movie(id: id, title: movieTitleTextField.text!, overview: movieOverviewTextView.text!, posterPath: moviePosterPathTextField.text!)
        watchlistManager.addMovie(newMovie)
        navigationController?.popViewController(animated: true)
    }
}
