import { updateTriviaStats } from './triviaModule.js';

const questionBank = [
  {
    question: 'What movie won the Academy Award for Best Picture in 2020?',
    options: ['Joker', '1917', 'Parasite'],
    answer: 'Parasite',
  },
  {
    question: "Who directed the movie 'The Godfather'?",
    options: ['Steven Spielberg', 'Francis Ford Coppola', 'Martin Scorsese'],
    answer: 'Francis Ford Coppola',
  },
  {
    question: 'What was the first feature-length animated movie ever released?',
    options: ['Snow White and the Seven Dwarfs', 'Bambi', 'Pinocchio'],
    answer: 'Snow White and the Seven Dwarfs',
  },
  {
    question: "What was the highest-grossing movie of all time before the release of 'Avatar'?",
    options: ['Titanic', 'Star Wars: The Force Awakens', 'Avengers: Endgame'],
    answer: 'Titanic',
  },
  {
    question: "Who played the lead role in the movie 'Forrest Gump'?",
    options: ['Tom Hanks', 'Brad Pitt', 'Leonardo DiCaprio'],
    answer: 'Tom Hanks',
  },
  {
    question: 'What movie won the Academy Award for Best Picture in 2019?',
    options: ['Bohemian Rhapsody', 'Green Book', 'Roma'],
    answer: 'Green Book',
  },
  {
    question: 'Who played the character of John McClane in the Die Hard movie series?',
    options: ['Arnold Schwarzenegger', 'Sylvester Stallone', 'Bruce Willis'],
    answer: 'Bruce Willis',
  },
  {
    question: 'What movie is based on a novel by Stephen King and features a character named Jack Torrance?',
    options: ['Carrie', 'The Shining', 'Misery'],
    answer: 'The Shining',
  },
  {
    question: "Who directed the movie 'Forrest Gump'?",
    options: ['Steven Spielberg', 'Robert Zemeckis', 'Martin Scorsese'],
    answer: 'Robert Zemeckis',
  },
  {
    question: 'What is the highest-grossing movie of all time (as of 2021)?',
    options: ['Avatar', 'Avengers: Endgame', 'Titanic'],
    answer: 'Avatar',
  },
  {
    question: "What movie features the line 'You can't handle the truth!'?",
    options: ['The Shawshank Redemption', 'A Few Good Men', 'Goodfellas'],
    answer: 'A Few Good Men',
  },
  {
    question: 'Who played the character of Tony Stark/Iron Man in the Marvel Cinematic Universe?',
    options: ['Chris Hemsworth', 'Mark Ruffalo', 'Robert Downey Jr.'],
    answer: 'Robert Downey Jr.',
  },
  {
    question: "In which movie did Tom Hanks say, 'Houston, we have a problem'?",
    options: ['Apollo 13', 'Cast Away', 'The Terminal'],
    answer: 'Apollo 13',
  },
  {
    question: 'What is the name of the hobbit played by Elijah Wood in the Lord of the Rings movies?',
    options: ['Frodo', 'Sam', 'Merry'],
    answer: 'Frodo',
  },
  {
    question: "What is the name of the kingdom where the 2013 animated movie 'Frozen' is set?",
    options: ['Arendelle', 'Genovia', 'DunBroch'],
    answer: 'Arendelle',
  },
  {
    question: 'Which 1997 science fiction movie stars Will Smith and Tommy Lee Jones?',
    options: ['Independence Day', 'Men in Black', 'Wild Wild West'],
    answer: 'Men in Black',
  },
  {
    question: 'Which movie features Bruce Willis as a child psychologist?',
    options: ['Die Hard', 'The Sixth Sense', 'Unbreakable'],
    answer: 'The Sixth Sense',
  },
  {
    question: "In 'The Matrix', does Neo take the blue pill or the red pill?",
    options: ['Blue', 'Red', 'Green'],
    answer: 'Red',
  },
  {
    question: "Which actress played Katniss Everdeen in 'The Hunger Games' movies?",
    options: ['Jennifer Lawrence', 'Emma Watson', 'Shailene Woodley'],
    answer: 'Jennifer Lawrence',
  },
  {
    question: "Who directed 'Jurassic Park'?",
    options: ['James Cameron', 'Steven Spielberg', 'George Lucas'],
    answer: 'Steven Spielberg',
  },
  {
    question: 'What 1980s movie was the highest grossing film of the decade?',
    options: ['E.T. the Extra-Terrestrial', 'Star Wars: Episode V', 'Back to the Future'],
    answer: 'E.T. the Extra-Terrestrial',
  },
  {
    question: "Which movie features the song 'My Heart Will Go On'?",
    options: ['The Bodyguard', 'Titanic', 'Romeo + Juliet'],
    answer: 'Titanic',
  },
  {
    question: 'What was the first Pixar movie?',
    options: ['Toy Story', "A Bug's Life", 'Monsters, Inc.'],
    answer: 'Toy Story',
  },
  {
    question: 'Who played Wolverine in the X-Men movies?',
    options: ['Hugh Jackman', 'Liam Hemsworth', 'Chris Evans'],
    answer: 'Hugh Jackman',
  },
  {
    question: 'Which film did NOT win the Academy Award for Best Picture?',
    options: ['The Shawshank Redemption', 'The Godfather', 'Forrest Gump'],
    answer: 'The Shawshank Redemption',
  },
  {
    question: "What is Indiana Jones' real first name?",
    options: ['Henry', 'John', 'Walter'],
    answer: 'Henry',
  },
  {
    question: "In 'The Wizard of Oz', what did the Scarecrow want from the wizard?",
    options: ['Heart', 'Brain', 'Courage'],
    answer: 'Brain',
  },
  {
    question: 'Who is the only actor to receive an Oscar nomination for acting in a Lord of the Rings movie?',
    options: ['Viggo Mortensen', 'Ian McKellen', 'Elijah Wood'],
    answer: 'Ian McKellen',
  },
  {
    question: 'Which movie features an iconic dance scene between Uma Thurman and John Travolta?',
    options: ['Pulp Fiction', 'Kill Bill', 'Saturday Night Fever'],
    answer: 'Pulp Fiction',
  },
  {
    question: 'What is the highest-grossing R-rated movie of all time?',
    options: ['Deadpool', 'Joker', 'The Matrix'],
    answer: 'Joker',
  },
  {
    question: 'Which Alfred Hitchcock movie is notorious for its shower scene?',
    options: ['Vertigo', 'Psycho', 'Rear Window'],
    answer: 'Psycho',
  },
  {
    question: "What is Darth Vader's real name?",
    options: ['Anakin Skywalker', 'Luke Skywalker', 'Obi-Wan Kenobi'],
    answer: 'Anakin Skywalker',
  },
  {
    question: "Who directed 'Schindler's List'?",
    options: ['Martin Scorsese', 'Steven Spielberg', 'Ridley Scott'],
    answer: 'Steven Spielberg',
  },
  {
    question: 'In which movie does Tom Cruise perform his own stunts climbing the Burj Khalifa?',
    options: ['Mission: Impossible - Rogue Nation', 'Mission: Impossible - Ghost Protocol', 'Edge of Tomorrow'],
    answer: 'Mission: Impossible - Ghost Protocol',
  },
  {
    question: "What is the name of the fictional African country where 'Black Panther' is set?",
    options: ['Wakanda', 'Genovia', 'Zamunda'],
    answer: 'Wakanda',
  },
  {
    question: "Who directed 'Inception' and 'Interstellar'?",
    options: ['Christopher Nolan', 'James Cameron', 'Steven Spielberg'],
    answer: 'Christopher Nolan',
  },
  {
    question: "In 'The Hunger Games', what district do Katniss and Peeta represent?",
    options: ['District 12', 'District 9', 'District 7'],
    answer: 'District 12',
  },
  {
    question: 'Which movie features a character named Tyler Durden?',
    options: ['Fight Club', 'Gone Girl', 'Seven'],
    answer: 'Fight Club',
  },
  {
    question: "What is the name of the island in 'Jurassic Park'?",
    options: ['Isla Nublar', 'Isla Sorna', 'Skull Island'],
    answer: 'Isla Nublar',
  },
  {
    question: "Who played the Joker in 'The Dark Knight'?",
    options: ['Heath Ledger', 'Joaquin Phoenix', 'Jared Leto'],
    answer: 'Heath Ledger',
  },
  {
    question: 'In which movie is the fictional company Initech featured?',
    options: ['Office Space', 'The Social Network', 'Wall Street'],
    answer: 'Office Space',
  },
  {
    question: "What year was the first 'Harry Potter' movie released?",
    options: ['2001', '2003', '1999'],
    answer: '2001',
  },
  {
    question: "What fictional country is 'Wonder Woman' from?",
    options: ['Themyscira', 'Asgard', 'Genovia'],
    answer: 'Themyscira',
  },
  {
    question: "Which movie is known for the quote 'Here's looking at you, kid'?",
    options: ['Casablanca', 'Gone with the Wind', 'The Maltese Falcon'],
    answer: 'Casablanca',
  },
  {
    question: "In 'The Lion King', what is Simba's mother's name?",
    options: ['Nala', 'Sarabi', 'Shenzi'],
    answer: 'Sarabi',
  },
  {
    question: "Who directed 'Avengers: Endgame'?",
    options: ['The Russo Brothers', 'Joss Whedon', 'Jon Favreau'],
    answer: 'The Russo Brothers',
  },
  {
    question: "What is the name of the kingdom in 'Tangled'?",
    options: ['Corona', 'Far Far Away', 'Arendelle'],
    answer: 'Corona',
  },
  {
    question: 'Which film features a famous dance scene with Uma Thurman and John Travolta?',
    options: ['Pulp Fiction', 'Saturday Night Fever', 'Kill Bill'],
    answer: 'Pulp Fiction',
  },
  {
    question: "Who played Jack Dawson in 'Titanic'?",
    options: ['Leonardo DiCaprio', 'Brad Pitt', 'Johnny Depp'],
    answer: 'Leonardo DiCaprio',
  },
  {
    question: 'What is the highest-grossing film of all time?',
    options: ['Avengers: Endgame', 'Avatar', 'Titanic'],
    answer: 'Avatar',
  },
  {
    question: 'In which movie does the character Neo appear?',
    options: ['The Matrix', 'John Wick', 'Speed'],
    answer: 'The Matrix',
  },
  {
    question: 'What is the real name of the Black Panther in the Marvel Cinematic Universe?',
    options: ["T'Challa", "M'Baku", "N'Jadaka"],
    answer: "T'Challa",
  },
  {
    question: "Who directed 'Mad Max: Fury Road'?",
    options: ['George Miller', 'Ridley Scott', 'Peter Jackson'],
    answer: 'George Miller',
  },
  {
    question: "What animated film features a character named 'Hiccup'?",
    options: ['Brave', 'How to Train Your Dragon', 'Shrek'],
    answer: 'How to Train Your Dragon',
  },
  {
    question: "In which film is the fictional mineral 'Unobtainium' sought after?",
    options: ['Avatar', 'The Core', 'Transformers'],
    answer: 'Avatar',
  },
  {
    question: 'What is the name of the fictional city where the Batman movies take place?',
    options: ['Gotham City', 'Metropolis', 'Star City'],
    answer: 'Gotham City',
  },
  {
    question: "Who directed 'The Dark Knight'?",
    options: ['Christopher Nolan', 'Martin Scorsese', 'Steven Spielberg'],
    answer: 'Christopher Nolan',
  },
  {
    question: 'Who won the Best Actress award at the Oscars in 2021?',
    options: ['Viola Davis', 'Frances McDormand', 'Carey Mulligan'],
    answer: 'Frances McDormand',
  },
  {
    question: 'Which movie features a dystopian future divided into faction-based societies?',
    options: ['The Hunger Games', 'Divergent', 'The Maze Runner'],
    answer: 'Divergent',
  },
  {
    question: "What is the name of the spaceship in 'Alien' (1979)?",
    options: ['Nostromo', 'Serenity', 'Millennium Falcon'],
    answer: 'Nostromo',
  },
  {
    question: "Which director is known for the 'Dark Knight' trilogy?",
    options: ['Christopher Nolan', 'Tim Burton', 'Joel Schumacher'],
    answer: 'Christopher Nolan',
  },
  {
    question: "In 'The Terminator', what is the name of the company that created Skynet?",
    options: ['Cyberdyne Systems', 'Wayland Industries', 'Oscorp'],
    answer: 'Cyberdyne Systems',
  },
  {
    question: "What 1994 film revitalized John Travolta's career?",
    options: ['Get Shorty', 'Pulp Fiction', 'Face/Off'],
    answer: 'Pulp Fiction',
  },
  {
    question: 'Which movie was incorrectly announced as the Best Picture winner at the 2017 Academy Awards?',
    options: ['La La Land', 'Moonlight', 'Manchester by the Sea'],
    answer: 'La La Land',
  },
  {
    question: "What animated film was Disney's first ever full-length feature?",
    options: ['Snow White and the Seven Dwarfs', 'Cinderella', 'The Little Mermaid'],
    answer: 'Snow White and the Seven Dwarfs',
  },
  {
    question: "Who directed 'E.T. the Extra-Terrestrial'?",
    options: ['Steven Spielberg', 'George Lucas', 'Ridley Scott'],
    answer: 'Steven Spielberg',
  },
  {
    question: "Which film contains the quote, 'There's no place like home'?",
    options: ['The Wizard of Oz', 'Gone with the Wind', 'Casablanca'],
    answer: 'The Wizard of Oz',
  },
  {
    question: 'What is the highest grossing film of all time (not adjusted for inflation) as of 2023?',
    options: ['Avengers: Endgame', 'Avatar', 'Titanic'],
    answer: 'Avatar',
  },
  {
    question: "Who composed the score for 'The Lion King' (1994)?",
    options: ['John Williams', 'Hans Zimmer', 'Alan Menken'],
    answer: 'Hans Zimmer',
  },
  {
    question: 'Which movie did Leonardo DiCaprio win his first Oscar for Best Actor?',
    options: ['The Revenant', 'The Wolf of Wall Street', 'Inception'],
    answer: 'The Revenant',
  },
  {
    question: 'In which film does the character Maximus Decimus Meridius appear?',
    options: ['300', 'Gladiator', 'Troy'],
    answer: 'Gladiator',
  },
  {
    question: 'What is the name of the fictional British spy in the film series created by Ian Fleming?',
    options: ['James Bond', 'Jason Bourne', 'Jack Ryan'],
    answer: 'James Bond',
  },
  {
    question: 'Which movie won the Academy Award for Best Animated Feature in 2021?',
    options: ['Onward', 'Soul', 'Wolfwalkers'],
    answer: 'Soul',
  },
  {
    question: "Who played the role of Michael Corleone in 'The Godfather'?",
    options: ['Al Pacino', 'Robert De Niro', 'Marlon Brando'],
    answer: 'Al Pacino',
  },
  {
    question: 'What 2009 film is known for pioneering modern 3D cinema technology?',
    options: ['Inception', 'Avatar', 'The Hurt Locker'],
    answer: 'Avatar',
  },
  {
    question: 'Which 2012 film features a protagonist who survives a shipwreck with a tiger?',
    options: ['Life of Pi', 'Cast Away', 'The Revenant'],
    answer: 'Life of Pi',
  },
  {
    question: "What is the main theme of the movie 'Inception'?",
    options: ['Time travel', 'Dream manipulation', 'Space exploration'],
    answer: 'Dream manipulation',
  },
  {
    question: 'Which film features the character Sarah Connor, who is central to the plot?',
    options: ['The Terminator', 'Aliens', 'Jurassic Park'],
    answer: 'The Terminator',
  },
  {
    question: "What 1999 movie is famous for the quote, 'I see dead people'?",
    options: ['The Sixth Sense', 'Ghost', 'The Others'],
    answer: 'The Sixth Sense',
  },
  {
    question: "Who directed 'Titanic', which won the Academy Award for Best Picture in 1997?",
    options: ['James Cameron', 'Steven Spielberg', 'Martin Scorsese'],
    answer: 'James Cameron',
  },
  {
    question: 'Which film did NOT feature Leonardo DiCaprio?',
    options: ['Titanic', 'The Great Gatsby', 'The Prestige'],
    answer: 'The Prestige',
  },
  {
    question: "In which movie do characters compete in the 'Hunger Games'?",
    options: ['Catching Fire', 'The Hunger Games', 'Battle Royale'],
    answer: 'The Hunger Games',
  },
  {
    question: 'What film, released in 1982, features a character named E.T.?',
    options: ['Star Wars', 'Close Encounters of the Third Kind', 'E.T. the Extra-Terrestrial'],
    answer: 'E.T. the Extra-Terrestrial',
  },
  {
    question: "Who starred as the lead in the 2018 film 'Black Panther'?",
    options: ['Chadwick Boseman', 'Michael B. Jordan', 'Denzel Washington'],
    answer: 'Chadwick Boseman',
  },
  {
    question: "What iconic 1980s movie features the quote, 'Say hello to my little friend!'?",
    options: ['Scarface', 'The Godfather', 'Goodfellas'],
    answer: 'Scarface',
  },
  {
    question: 'Which film features a unique spinning top in its final scene?',
    options: ['Inception', 'Minority Report', 'The Matrix'],
    answer: 'Inception',
  },
  {
    question: 'What movie, featuring a journey to Mordor, won the Academy Award for Best Picture in 2003?',
    options: [
      'The Lord of the Rings: The Two Towers',
      'The Lord of the Rings: The Return of the King',
      'The Lord of the Rings: The Fellowship of the Ring',
    ],
    answer: 'The Lord of the Rings: The Return of the King',
  },
  {
    question: 'Which movie features a giant monster known as Godzilla?',
    options: ['Pacific Rim', 'Godzilla', 'Cloverfield'],
    answer: 'Godzilla',
  },
  {
    question: 'What classic film was remade in 2005 starring Naomi Watts and Jack Black?',
    options: ['King Kong', 'Godzilla', 'Planet of the Apes'],
    answer: 'King Kong',
  },
  {
    question: "Who directed the 1994 crime film 'Pulp Fiction'?",
    options: ['Quentin Tarantino', 'Steven Spielberg', 'Martin Scorsese'],
    answer: 'Quentin Tarantino',
  },
  {
    question: 'Which movie includes a character named Norman Bates?',
    options: ['Psycho', 'Rebecca', 'The Birds'],
    answer: 'Psycho',
  },
  {
    question: "What is the name of the fictional theme park in 'Jurassic Park'?",
    options: ['Dinosaur Land', 'Jurassic World', 'Isla Nublar'],
    answer: 'Isla Nublar',
  },
  {
    question: "Who played the role of Clarice Starling in the film 'The Silence of the Lambs'?",
    options: ['Jodie Foster', 'Julianne Moore', 'Sigourney Weaver'],
    answer: 'Jodie Foster',
  },
  {
    question: "Which film is famous for the line, 'May the Force be with you'?",
    options: ['Star Trek', 'Star Wars', 'Guardians of the Galaxy'],
    answer: 'Star Wars',
  },
  {
    question: 'What 1975 thriller is known for its menacing shark and famous soundtrack?',
    options: ['Deep Blue Sea', 'Jaws', 'Sharknado'],
    answer: 'Jaws',
  },
  {
    question: 'Which film did Tom Hanks win his first Academy Award for Best Actor?',
    options: ['Big', 'Philadelphia', 'Forrest Gump'],
    answer: 'Philadelphia',
  },
  {
    question: "What is the name of the ring in 'The Lord of the Rings'?",
    options: ['The Ring of Power', 'The One Ring', 'The Master Ring'],
    answer: 'The One Ring',
  },
  {
    question: "Who directed 'Avatar', the groundbreaking sci-fi movie released in 2009?",
    options: ['James Cameron', 'George Lucas', 'Steven Spielberg'],
    answer: 'James Cameron',
  },
  {
    question: 'Which 1988 animated film features a dystopian future and psychic powers?',
    options: ['Ghost in the Shell', 'Akira', 'Blade Runner'],
    answer: 'Akira',
  },
  {
    question: 'Who played the role of Hermione Granger in the Harry Potter films?',
    options: ['Emma Watson', 'Emma Stone', 'Emily Blunt'],
    answer: 'Emma Watson',
  },
  {
    question: "Which film features a group of friends who use a map to find a pirate's treasure?",
    options: ['The Goonies', 'Treasure Island', 'Pirates of the Caribbean'],
    answer: 'The Goonies',
  },
  {
    question: 'What was the first animated film to receive a Best Picture nomination at the Oscars?',
    options: ['Beauty and the Beast', 'The Lion King', 'Up'],
    answer: 'Beauty and the Beast',
  },
  {
    question: "What is the fictional sport played in the 'Harry Potter' series?",
    options: ['Quidditch', 'Bludgers', 'Snitchball'],
    answer: 'Quidditch',
  },
  {
    question: "Who composed the iconic score for 'Star Wars'?",
    options: ['Hans Zimmer', 'John Williams', 'Danny Elfman'],
    answer: 'John Williams',
  },
  {
    question: 'What 2000 film, directed by Ridley Scott, features a Roman general turned gladiator?',
    options: ['Spartacus', 'Gladiator', 'Ben-Hur'],
    answer: 'Gladiator',
  },
  {
    question: "Which movie's plot centers around a unique wooden board game?",
    options: ['Clue', 'Jumanji', 'Zathura'],
    answer: 'Jumanji',
  },
  {
    question: "Who directed the 1980 horror film 'The Shining'?",
    options: ['Stanley Kubrick', 'Alfred Hitchcock', 'Stephen King'],
    answer: 'Stanley Kubrick',
  },
  {
    question: 'What 1993 science fiction film directed by Steven Spielberg features dinosaurs brought back to life through cloning?',
    options: ['Jurassic Park', 'The Lost World', 'Dinosaur'],
    answer: 'Jurassic Park',
  },
  {
    question: "Who voiced the character of Woody in the 'Toy Story' movies?",
    options: ['Tom Hanks', 'Tim Allen', 'Billy Crystal'],
    answer: 'Tom Hanks',
  },
  {
    question: 'Which 2010 film directed by Christopher Nolan explores dream-sharing technology?',
    options: ['Inception', 'Interstellar', 'Memento'],
    answer: 'Inception',
  },
  {
    question: 'What film series features a secret British spy agency known as Kingsman?',
    options: ['James Bond', 'Kingsman', 'Johnny English'],
    answer: 'Kingsman',
  },
  {
    question: "Who played the role of Jack Sparrow in the 'Pirates of the Caribbean' film series?",
    options: ['Johnny Depp', 'Orlando Bloom', 'Keira Knightley'],
    answer: 'Johnny Depp',
  },
  {
    question: "Which 2001 film, based on a J.R.R. Tolkien novel, follows a hobbit's quest to destroy a powerful ring?",
    options: ['The Hobbit', 'The Lord of the Rings: The Fellowship of the Ring', 'The Lord of the Rings: The Two Towers'],
    answer: 'The Lord of the Rings: The Fellowship of the Ring',
  },
  {
    question: 'What 2003 animated film features a fish named Nemo?',
    options: ['Shark Tale', 'Finding Nemo', 'The Little Mermaid'],
    answer: 'Finding Nemo',
  },
  {
    question: 'Which 2017 film is based on a DC Comics character and set during World War I?',
    options: ['Wonder Woman', 'Captain America: The First Avenger', 'Justice League'],
    answer: 'Wonder Woman',
  },
  {
    question: "Who directed the 1994 film 'Pulp Fiction'?",
    options: ['Quentin Tarantino', 'Martin Scorsese', 'Ridley Scott'],
    answer: 'Quentin Tarantino',
  },
  {
    question: 'What movie introduced the character of Hannibal Lecter?',
    options: ['Silence of the Lambs', 'Hannibal', 'Manhunter'],
    answer: 'Manhunter',
  },
  {
    question: 'Which 2016 film tells the story of a group of rebels who plan to steal plans for the Death Star?',
    options: ['Star Wars: The Force Awakens', 'Rogue One: A Star Wars Story', 'Star Wars: The Last Jedi'],
    answer: 'Rogue One: A Star Wars Story',
  },
  {
    question: "What is the name of the fictional African kingdom in 'Coming to America'?",
    options: ['Wakanda', 'Zamunda', 'Genovia'],
    answer: 'Zamunda',
  },
  {
    question: "Who directed the 2017 movie 'Get Out'?",
    options: ['Jordan Peele', 'Spike Lee', 'John Singleton'],
    answer: 'Jordan Peele',
  },
  {
    question: 'Which movie features an AI character named HAL 9000?',
    options: ['Blade Runner', 'Ex Machina', '2001: A Space Odyssey'],
    answer: '2001: A Space Odyssey',
  },
  {
    question: "What 1980s movie is known for the quote 'Nobody puts Baby in a corner'?",
    options: ['Dirty Dancing', 'Footloose', 'Flashdance'],
    answer: 'Dirty Dancing',
  },
  {
    question: 'What 1995 film directed by Michael Mann stars Robert De Niro and Al Pacino?',
    options: ['Heat', 'The Godfather', 'Scarface'],
    answer: 'Heat',
  },
  {
    question: "Who starred as the titular character in the 2014 film 'Maleficent'?",
    options: ['Angelina Jolie', 'Charlize Theron', 'Nicole Kidman'],
    answer: 'Angelina Jolie',
  },
  {
    question: 'Which film is about a board game that becomes real for the players?',
    options: ['Zathura', 'Jumanji', 'The Game'],
    answer: 'Jumanji',
  },
  {
    question: 'In which movie does a group of archaeologists find a frozen prehistoric man?',
    options: ['Encino Man', 'Ice Age', 'The Thing'],
    answer: 'Encino Man',
  },
  {
    question: 'What movie features a theme park filled with cloned dinosaurs?',
    options: ['Jurassic Park', 'Westworld', 'Prehistoric Park'],
    answer: 'Jurassic Park',
  },
];

const movieCode = {
  part1: 'YzVhMjBjODY=',
  part2: 'MWFjZjdiYjg=',
  part3: 'ZDllOTg3ZGNjN2YxYjU1OA==',
};

function getMovieCode() {
  return atob(movieCode.part1) + atob(movieCode.part2) + atob(movieCode.part3);
}

function generateMovieNames(input) {
  return String.fromCharCode(97, 112, 105, 95, 107, 101, 121, 61);
}

const form = document.getElementById('form');

form.addEventListener('submit', e => {
  e.preventDefault();
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'search.html';
});

function handleSearch() {
  const searchQuery = document.getElementById('search').value;
  localStorage.setItem('searchQuery', searchQuery);
  window.location.href = 'search.html';
}

function generateRandomQuestions() {
  const questionsToDisplay = 10;
  const shuffledQuestions = questionBank.sort(() => 0.5 - Math.random());
  let selectedQuestions = shuffledQuestions.slice(0, questionsToDisplay);

  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = '';

  selectedQuestions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
        <h2 class="question-header" id="${index}">Question ${index + 1}:</h2>
        <p>${question.question}</p>
        ${question.options.map((option, i) => `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`).join('')}
        <br>`;
    quizContainer.appendChild(questionElement);

    const headerElement = questionElement.querySelector(`h2`);

    headerElement.addEventListener('click', function (e) {
      e.preventDefault();

      headerElement.scrollIntoView({ behavior: 'smooth' });
    });

    headerElement.addEventListener('mouseover', function () {
      headerElement.style.color = 'orange';
    });

    headerElement.addEventListener('mouseout', function () {
      headerElement.style.color = '#ff8623';
    });

    headerElement.style.cursor = 'pointer';
  });
}

document.getElementById('regenerate-questions').addEventListener('click', generateRandomQuestions);
generateRandomQuestions();

async function showMovieOfTheDay() {
  const year = new Date().getFullYear();
  const url = `https://${getMovieVerseData()}/3/discover/movie?${generateMovieNames()}${getMovieCode()}&sort_by=vote_average.desc&vote_count.gte=100&primary_release_year=${year}&vote_average.gte=7`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const movies = data.results;

    if (movies.length > 0) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      localStorage.setItem('selectedMovieId', randomMovie.id);
      window.location.href = 'movie-details.html';
    } else {
      fallbackMovieSelection();
    }
  } catch (error) {
    console.log('Error fetching movie:', error);
    fallbackMovieSelection();
  }
}

function getMovieVerseData(input) {
  return String.fromCharCode(97, 112, 105, 46, 116, 104, 101, 109, 111, 118, 105, 101, 100, 98, 46, 111, 114, 103);
}

function fallbackMovieSelection() {
  const fallbackMovies = [
    432413, 299534, 1726, 562, 118340, 455207, 493922, 447332, 22970, 530385, 27205, 264660, 120467, 603, 577922, 76341, 539, 419704, 515001, 118340,
    424, 98,
  ];
  const randomFallbackMovie = fallbackMovies[Math.floor(Math.random() * fallbackMovies.length)];
  localStorage.setItem('selectedMovieId', randomFallbackMovie);
  window.location.href = 'movie-details.html';
}

function handleSignInOut() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

  if (isSignedIn) {
    localStorage.setItem('isSignedIn', JSON.stringify(false));
    alert('You have been signed out.');
  } else {
    window.location.href = 'sign-in.html';
    return;
  }

  updateSignInButtonState();
}

function updateSignInButtonState() {
  const isSignedIn = JSON.parse(localStorage.getItem('isSignedIn')) || false;

  const signInText = document.getElementById('signInOutText');
  const signInIcon = document.getElementById('signInIcon');
  const signOutIcon = document.getElementById('signOutIcon');

  if (isSignedIn) {
    signInText.textContent = 'Sign Out';
    signInIcon.style.display = 'none';
    signOutIcon.style.display = 'inline-block';
  } else {
    signInText.textContent = 'Sign In';
    signInIcon.style.display = 'inline-block';
    signOutIcon.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  updateSignInButtonState();
  document.getElementById('googleSignInBtn').addEventListener('click', handleSignInOut);
});

document.getElementById('quiz-form').addEventListener('submit', function (event) {
  event.preventDefault();

  let answeredQuestions = 0;

  for (let i = 0; i < 10; i++) {
    if (document.querySelector(`input[name="q${i}"]:checked`)) {
      answeredQuestions++;
    }
  }

  if (answeredQuestions < 10) {
    const confirmSubmit = confirm(`You have only answered ${answeredQuestions} questions. Are you sure you want to submit?`);
    if (!confirmSubmit) {
      return;
    }
  }

  calculateAndDisplayResults();
});

function calculateAndDisplayResults() {
  let score = 0;
  const totalQuestions = 10;

  questionBank.forEach((question, index) => {
    const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
    if (selectedAnswer && selectedAnswer.value === question.answer) {
      score++;
    }
  });

  const currentUserEmail = localStorage.getItem('currentlySignedInMovieVerseUser') || null;

  updateTriviaStats(currentUserEmail, score, totalQuestions);

  displayResults(score);
}

function displayResults(score) {
  let accuracy = (score / 10) * 100;
  let progress = 0;

  document.getElementById('progress-circle').style.setProperty('--progress', `${progress}%`);
  document.getElementById('correct-answers').textContent = score;
  document.getElementById('result-text').textContent = `Your score is ${score} out of 10 (${accuracy.toFixed(1)}% accuracy)`;

  const interval = setInterval(() => {
    if (progress < accuracy) {
      progress++;
      document.getElementById('progress-circle').style.setProperty('--progress', `${progress}%`);
    } else {
      clearInterval(interval);
    }
  }, 20);

  showModal();
}

function showModal() {
  const modal = document.getElementById('result-modal');
  modal.style.display = 'block';

  modal.querySelector('.close-button').addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });
}
