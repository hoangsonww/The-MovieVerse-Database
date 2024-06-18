import UIKit

// MARK: - Data Model
struct TriviaQuestion {
    let question: String
    let options: [String]
    let correctAnswer: String
}

class MovieTriviaViewController: UIViewController {

// Data in JS
//     const questionBank = [
//         { question: "What movie won the Academy Award for Best Picture in 2020?", options: ["Joker", "1917", "Parasite"], answer: "Parasite" },
//         { question: "Who directed the movie 'The Godfather'?", options: ["Steven Spielberg", "Francis Ford Coppola", "Martin Scorsese"], answer: "Francis Ford Coppola" },
//         { question: "What was the first feature-length animated movie ever released?", options: ["Snow White and the Seven Dwarfs", "Bambi", "Pinocchio"], answer: "Snow White and the Seven Dwarfs" },
//         { question: "What was the highest-grossing movie of all time before the release of 'Avatar'?", options: ["Titanic", "Star Wars: The Force Awakens", "Avengers: Endgame"], answer: "Titanic" },
//         { question: "Who played the lead role in the movie 'Forrest Gump'?", options: ["Tom Hanks", "Brad Pitt", "Leonardo DiCaprio"], answer: "Tom Hanks" },
//         { question: "What movie won the Academy Award for Best Picture in 2019?", options: ["Bohemian Rhapsody", "Green Book", "Roma"], answer: "Green Book" },
//         { question: "Who played the character of John McClane in the Die Hard movie series?", options: ["Arnold Schwarzenegger", "Sylvester Stallone", "Bruce Willis"], answer: "Bruce Willis" },
//         { question: "What movie is based on a novel by Stephen King and features a character named Jack Torrance?", options: ["Carrie", "The Shining", "Misery"], answer: "The Shining" },
//         { question: "Who directed the movie 'Forrest Gump'?", options: ["Steven Spielberg", "Robert Zemeckis", "Martin Scorsese"], answer: "Robert Zemeckis" },
//         { question: "What is the highest-grossing movie of all time (as of 2021)?", options: ["Avatar", "Avengers: Endgame", "Titanic"], answer: "Avatar" },
//         { question: "What movie features the line 'You can't handle the truth!'?", options: ["The Shawshank Redemption", "A Few Good Men", "Goodfellas"], answer: "A Few Good Men" },
//         { question: "Who played the character of Tony Stark/Iron Man in the Marvel Cinematic Universe?", options: ["Chris Hemsworth", "Mark Ruffalo", "Robert Downey Jr."], answer: "Robert Downey Jr." },
//         { question: "In which movie did Tom Hanks say, 'Houston, we have a problem'?", options: ["Apollo 13", "Cast Away", "The Terminal"], answer: "Apollo 13" },
//         { question: "What is the name of the hobbit played by Elijah Wood in the Lord of the Rings movies?", options: ["Frodo", "Sam", "Merry"], answer: "Frodo" },
//         { question: "What is the name of the kingdom where the 2013 animated movie 'Frozen' is set?", options: ["Arendelle", "Genovia", "DunBroch"], answer: "Arendelle" },
//         { question: "Which 1997 science fiction movie stars Will Smith and Tommy Lee Jones?", options: ["Independence Day", "Men in Black", "Wild Wild West"], answer: "Men in Black" },
//         { question: "Which movie features Bruce Willis as a child psychologist?", options: ["Die Hard", "The Sixth Sense", "Unbreakable"], answer: "The Sixth Sense" },
//         { question: "In 'The Matrix', does Neo take the blue pill or the red pill?", options: ["Blue", "Red", "Green"], answer: "Red" },
//         { question: "Which actress played Katniss Everdeen in 'The Hunger Games' movies?", options: ["Jennifer Lawrence", "Emma Watson", "Shailene Woodley"], answer: "Jennifer Lawrence" },
//         { question: "Who directed 'Jurassic Park'?", options: ["James Cameron", "Steven Spielberg", "George Lucas"], answer: "Steven Spielberg" },
//         { question: "What 1980s movie was the highest grossing film of the decade?", options: ["E.T. the Extra-Terrestrial", "Star Wars: Episode V", "Back to the Future"], answer: "E.T. the Extra-Terrestrial" },
//         { question: "Which movie features the song 'My Heart Will Go On'?", options: ["The Bodyguard", "Titanic", "Romeo + Juliet"], answer: "Titanic" },
//         { question: "What was the first Pixar movie?", options: ["Toy Story", "A Bug's Life", "Monsters, Inc."], answer: "Toy Story" },
//         { question: "Who played Wolverine in the X-Men movies?", options: ["Hugh Jackman", "Liam Hemsworth", "Chris Evans"], answer: "Hugh Jackman" },
//         { question: "Which film did NOT win the Academy Award for Best Picture?", options: ["The Shawshank Redemption", "The Godfather", "Forrest Gump"], answer: "The Shawshank Redemption" },
//         { question: "What is Indiana Jones' real first name?", options: ["Henry", "John", "Walter"], answer: "Henry" },
//         { question: "In 'The Wizard of Oz', what did the Scarecrow want from the wizard?", options: ["Heart", "Brain", "Courage"], answer: "Brain" },
//         { question: "Who is the only actor to receive an Oscar nomination for acting in a Lord of the Rings movie?", options: ["Viggo Mortensen", "Ian McKellen", "Elijah Wood"], answer: "Ian McKellen" },
//         { question: "Which movie features an iconic dance scene between Uma Thurman and John Travolta?", options: ["Pulp Fiction", "Kill Bill", "Saturday Night Fever"], answer: "Pulp Fiction" },
//         { question: "What is the highest-grossing R-rated movie of all time?", options: ["Deadpool", "Joker", "The Matrix"], answer: "Joker" },
//         { question: "Which Alfred Hitchcock movie is notorious for its shower scene?", options: ["Vertigo", "Psycho", "Rear Window"], answer: "Psycho" },
//         { question: "What is Darth Vader's real name?", options: ["Anakin Skywalker", "Luke Skywalker", "Obi-Wan Kenobi"], answer: "Anakin Skywalker" },
//         { question: "Who directed 'Schindler's List'?", options: ["Martin Scorsese", "Steven Spielberg", "Ridley Scott"], answer: "Steven Spielberg" },
//         { question: "In which movie does Tom Cruise perform his own stunts climbing the Burj Khalifa?", options: ["Mission: Impossible - Rogue Nation", "Mission: Impossible - Ghost Protocol", "Edge of Tomorrow"], answer: "Mission: Impossible - Ghost Protocol" },
//         { question: "What is the name of the fictional African country where 'Black Panther' is set?", options: ["Wakanda", "Genovia", "Zamunda"], answer: "Wakanda" },
//         { question: "Who directed 'Inception' and 'Interstellar'?", options: ["Christopher Nolan", "James Cameron", "Steven Spielberg"], answer: "Christopher Nolan" },
//         { question: "In 'The Hunger Games', what district do Katniss and Peeta represent?", options: ["District 12", "District 9", "District 7"], answer: "District 12" },
//         { question: "Which movie features a character named Tyler Durden?", options: ["Fight Club", "Gone Girl", "Seven"], answer: "Fight Club" },
//         { question: "What is the name of the island in 'Jurassic Park'?", options: ["Isla Nublar", "Isla Sorna", "Skull Island"], answer: "Isla Nublar" },
//         { question: "Who played the Joker in 'The Dark Knight'?", options: ["Heath Ledger", "Joaquin Phoenix", "Jared Leto"], answer: "Heath Ledger" },
//         { question: "In which movie is the fictional company Initech featured?", options: ["Office Space", "The Social Network", "Wall Street"], answer: "Office Space" },
//         { question: "What year was the first 'Harry Potter' movie released?", options: ["2001", "2003", "1999"], answer: "2001" },
//         { question: "What fictional country is 'Wonder Woman' from?", options: ["Themyscira", "Asgard", "Genovia"], answer: "Themyscira" },
//         { question: "Which movie is known for the quote 'Here's looking at you, kid'?", options: ["Casablanca", "Gone with the Wind", "The Maltese Falcon"], answer: "Casablanca" },
//         { question: "In 'The Lion King', what is Simba's mother's name?", options: ["Nala", "Sarabi", "Shenzi"], answer: "Sarabi" },
//         { question: "Who directed 'Avengers: Endgame'?", options: ["The Russo Brothers", "Joss Whedon", "Jon Favreau"], answer: "The Russo Brothers" },
//         { question: "What is the name of the kingdom in 'Tangled'?", options: ["Corona", "Far Far Away", "Arendelle"], answer: "Corona" },
//         { question: "Which film features a famous dance scene with Uma Thurman and John Travolta?", options: ["Pulp Fiction", "Saturday Night Fever", "Kill Bill"], answer: "Pulp Fiction" },
//         { question: "Who played Jack Dawson in 'Titanic'?", options: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp"], answer: "Leonardo DiCaprio" },
//         { question: "What is the highest-grossing film of all time?", options: ["Avengers: Endgame", "Avatar", "Titanic"], answer: "Avatar" },
//         { question: "In which movie does the character Neo appear?", options: ["The Matrix", "John Wick", "Speed"], answer: "The Matrix" },
//         { question: "What is the real name of the Black Panther in the Marvel Cinematic Universe?", options: ["T'Challa", "M'Baku", "N'Jadaka"], answer: "T'Challa" },
//         { question: "Who directed 'Mad Max: Fury Road'?", options: ["George Miller", "Ridley Scott", "Peter Jackson"], answer: "George Miller" },
//         { question: "What animated film features a character named 'Hiccup'?", options: ["Brave", "How to Train Your Dragon", "Shrek"], answer: "How to Train Your Dragon" },
//         { question: "In which film is the fictional mineral 'Unobtainium' sought after?", options: ["Avatar", "The Core", "Transformers"], answer: "Avatar" },
//     ];

    // Trivia Data
    private var questions: [TriviaQuestion] = [
        TriviaQuestion(question: "What movie won the Academy Award for Best Picture in 2020?", options: ["Joker", "1917", "Parasite"], correctAnswer: "Parasite"),
        TriviaQuestion(question: "Who directed the movie 'The Godfather'?", options: ["Steven Spielberg", "Francis Ford Coppola", "Martin Scorsese"], correctAnswer: "Francis Ford Coppola"),
        TriviaQuestion(question: "What was the first feature-length animated movie ever released?", options: ["Snow White and the Seven Dwarfs", "Bambi", "Pinocchio"], correctAnswer: "Snow White and the Seven Dwarfs"),
        TriviaQuestion(question: "What was the highest-grossing movie of all time before the release of 'Avatar'?", options: ["Titanic", "Star Wars: The Force Awakens", "Avengers: Endgame"], correctAnswer: "Titanic"),
        TriviaQuestion(question: "Who played the lead role in the movie 'Forrest Gump'?", options: ["Tom Hanks", "Brad Pitt", "Leonardo DiCaprio"], correctAnswer: "Tom Hanks"),
        TriviaQuestion(question: "What movie won the Academy Award for Best Picture in 2019?", options: ["Bohemian Rhapsody", "Green Book", "Roma"], correctAnswer: "Green Book"),
        TriviaQuestion(question: "Who played the character of John McClane in the Die Hard movie series?", options: ["Arnold Schwarzenegger", "Sylvester Stallone", "Bruce Willis"], correctAnswer: "Bruce Willis"),
        TriviaQuestion(question: "What movie is based on a novel by Stephen King and features a character named Jack Torrance?", options: ["Carrie", "The Shining", "Misery"], correctAnswer: "The Shining"),
        TriviaQuestion(question: "Who directed the movie 'Forrest Gump'?", options: ["Steven Spielberg", "Robert Zemeckis", "Martin Scorsese"], correctAnswer: "Robert Zemeckis"),
        TriviaQuestion(question: "What is the highest-grossing movie of all time (as of 2021)?", options: ["Avatar", "Avengers: Endgame", "Titanic"], correctAnswer: "Avatar"),
    ]

    private var currentQuestionIndex = 0
    private var score = 0

    // UI Components
    private let questionLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.systemFont(ofSize: 20)
        label.numberOfLines = 0
        label.textAlignment = .center
        return label
    }()

    private var optionButtons: [UIButton] = []

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        loadQuestion()
    }

    // MARK: - Setup
    private func setupUI() {
        view.backgroundColor = .white
        view.addSubview(questionLabel)

        setupOptionButtons()
        layoutUI()
        title = "Movie Trivia"
    }

    private func setupOptionButtons() {
        for _ in 1...4 {
            let button = UIButton(type: .system)
            button.titleLabel?.font = UIFont.systemFont(ofSize: 18)
            button.addTarget(self, action: #selector(optionButtonTapped), for: .touchUpInside)
            optionButtons.append(button)
            view.addSubview(button)
        }
    }

    private func layoutUI() {
        questionLabel.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            questionLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            questionLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            questionLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])

        var previousButton: UIButton?
        for button in optionButtons {
            button.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                button.topAnchor.constraint(equalTo: previousButton?.bottomAnchor ?? questionLabel.bottomAnchor, constant: 20),
                button.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
                button.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
            ])
            previousButton = button
        }
    }

    // MARK: - Actions
    @objc private func optionButtonTapped(_ sender: UIButton) {
        guard let answer = sender.titleLabel?.text else { return }
        checkAnswer(answer)
    }

    // MARK: - Trivia Logic
    private func loadQuestion() {
        guard currentQuestionIndex < questions.count else {
            // Show results
            showResults()
            return
        }

        let currentQuestion = questions[currentQuestionIndex]
        questionLabel.text = currentQuestion.question

        for (index, button) in optionButtons.enumerated() {
            button.setTitle(currentQuestion.options[index], for: .normal)
        }
    }

    private func checkAnswer(_ answer: String) {
        let currentQuestion = questions[currentQuestionIndex]
        if answer == currentQuestion.correctAnswer {
            score += 1
        }

        currentQuestionIndex += 1
        loadQuestion()
    }

    private func showResults() {
        let alertController = UIAlertController(title: "Trivia Complete", message: "Your score: \(score)/\(questions.count)", preferredStyle: .alert)
        let action = UIAlertAction(title: "OK", style: .default) { _ in
            self.navigationController?.popViewController(animated: true)
        }
        alertController.addAction(action)
        present(alertController, animated: true)
    }
}
