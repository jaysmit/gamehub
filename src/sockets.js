const { v4: uuidv4 } = require('uuid');

// In-memory room store (rooms are ephemeral — no need to persist them)
const rooms = new Map();

// Trivia questions bank (embedded for server-side use)
// This is a subset - full list is in client/data/triviaQuestions.js
const TRIVIA_QUESTIONS = [
  { id: 1, category: 'Movies', question: 'Which Disney movie features a character named Simba?', answers: ['The Lion King', 'Frozen', 'Moana', 'Aladdin', 'Tarzan', 'Bambi'], correctIndex: 0 },
  { id: 2, category: 'Movies', question: 'What color is the fish Nemo in "Finding Nemo"?', answers: ['Orange and white', 'Blue and yellow', 'Red and black', 'Green and purple', 'Pink and white', 'Yellow and orange'], correctIndex: 0 },
  { id: 3, category: 'Movies', question: 'In "Toy Story", what kind of toy is Woody?', answers: ['Cowboy', 'Astronaut', 'Dinosaur', 'Soldier', 'Robot', 'Superhero'], correctIndex: 0 },
  { id: 4, category: 'Movies', question: 'What is the name of the snowman in "Frozen"?', answers: ['Olaf', 'Sven', 'Kristoff', 'Marshmallow', 'Frosty', 'Snowy'], correctIndex: 0 },
  { id: 5, category: 'Movies', question: 'Which superhero is known as the "Dark Knight"?', answers: ['Batman', 'Superman', 'Spider-Man', 'Iron Man', 'Thor', 'Captain America'], correctIndex: 0 },
  { id: 6, category: 'Movies', question: 'In "Shrek", what kind of creature is the main character?', answers: ['Ogre', 'Troll', 'Giant', 'Goblin', 'Monster', 'Dragon'], correctIndex: 0 },
  { id: 7, category: 'Movies', question: 'What is the name of the rat who wants to be a chef in "Ratatouille"?', answers: ['Remy', 'Emile', 'Alfredo', 'Gusteau', 'Django', 'Pierre'], correctIndex: 0 },
  { id: 8, category: 'Movies', question: 'In "The Incredibles", what is the family\'s last name?', answers: ['Parr', 'Smith', 'Jones', 'Super', 'Powers', 'Strong'], correctIndex: 0 },
  { id: 9, category: 'Movies', question: 'What magical object does Aladdin find in the cave?', answers: ['A lamp', 'A ring', 'A carpet', 'A sword', 'A crown', 'A mirror'], correctIndex: 0 },
  { id: 10, category: 'Movies', question: 'In "Up", what lifts Carl\'s house into the sky?', answers: ['Balloons', 'Rockets', 'A tornado', 'Magic', 'Birds', 'A helicopter'], correctIndex: 0 },
  { id: 11, category: 'Movies', question: 'What is the name of the kingdom in "Tangled"?', answers: ['Corona', 'Arendelle', 'Atlantis', 'Agrabah', 'Enchancia', 'Motunui'], correctIndex: 0 },
  { id: 12, category: 'Movies', question: 'In "Despicable Me", what are the small yellow creatures called?', answers: ['Minions', 'Yellows', 'Helpers', 'Bananas', 'Creatures', 'Workers'], correctIndex: 0 },
  { id: 13, category: 'Movies', question: 'What animal is Baloo in "The Jungle Book"?', answers: ['Bear', 'Panther', 'Tiger', 'Monkey', 'Snake', 'Elephant'], correctIndex: 0 },
  { id: 14, category: 'Movies', question: 'In "Harry Potter", what sport do wizards play on broomsticks?', answers: ['Quidditch', 'Broomball', 'Wizardball', 'Flyball', 'Seekers', 'Snitchball'], correctIndex: 0 },
  { id: 15, category: 'Movies', question: 'What is the name of the princess in "Brave"?', answers: ['Merida', 'Moana', 'Aurora', 'Ariel', 'Mulan', 'Tiana'], correctIndex: 0 },
  { id: 16, category: 'Movies', question: 'In "Spider-Man", what is Peter Parker\'s job at the Daily Bugle?', answers: ['Photographer', 'Reporter', 'Editor', 'Janitor', 'Delivery boy', 'Intern'], correctIndex: 0 },
  { id: 17, category: 'Movies', question: 'What type of animal is Dory in "Finding Dory"?', answers: ['Blue tang fish', 'Clownfish', 'Whale', 'Shark', 'Octopus', 'Seahorse'], correctIndex: 0 },
  { id: 18, category: 'Movies', question: 'In "Coco", what is the name of Miguel\'s dog?', answers: ['Dante', 'Pepita', 'Hector', 'Ernesto', 'Oscar', 'Julio'], correctIndex: 0 },
  { id: 19, category: 'Movies', question: 'What superhero wears a red and gold suit of armor?', answers: ['Iron Man', 'Thor', 'Captain America', 'Hulk', 'Black Panther', 'Ant-Man'], correctIndex: 0 },
  { id: 20, category: 'Movies', question: 'In "Monsters, Inc.", what do monsters collect from children?', answers: ['Screams', 'Laughs', 'Tears', 'Dreams', 'Hair', 'Toys'], correctIndex: 0 },
  { id: 21, category: 'Music', question: 'Which singer is known as the "Queen of Pop"?', answers: ['Madonna', 'Beyonce', 'Lady Gaga', 'Taylor Swift', 'Rihanna', 'Ariana Grande'], correctIndex: 0 },
  { id: 22, category: 'Music', question: 'What band sang "We Will Rock You"?', answers: ['Queen', 'The Beatles', 'AC/DC', 'Led Zeppelin', 'The Rolling Stones', 'Guns N\' Roses'], correctIndex: 0 },
  { id: 23, category: 'Music', question: 'Which Disney song includes the lyrics "Let it go, let it go"?', answers: ['Let It Go', 'Into the Unknown', 'Show Yourself', 'Frozen Heart', 'Do You Want to Build a Snowman', 'Love Is an Open Door'], correctIndex: 0 },
  { id: 24, category: 'Music', question: 'What instrument does a drummer play?', answers: ['Drums', 'Guitar', 'Piano', 'Violin', 'Trumpet', 'Saxophone'], correctIndex: 0 },
  { id: 25, category: 'Music', question: 'Which singer performed at the Super Bowl 2023 halftime show?', answers: ['Rihanna', 'Beyonce', 'Taylor Swift', 'Lady Gaga', 'Shakira', 'Miley Cyrus'], correctIndex: 0 },
  { id: 26, category: 'Music', question: 'What popular song starts with "We don\'t talk about Bruno"?', answers: ['We Don\'t Talk About Bruno', 'Surface Pressure', 'What Else Can I Do?', 'Waiting on a Miracle', 'The Family Madrigal', 'Colombia, Mi Encanto'], correctIndex: 0 },
  { id: 27, category: 'Music', question: 'Which band has members named John, Paul, George, and Ringo?', answers: ['The Beatles', 'The Rolling Stones', 'Queen', 'The Who', 'Led Zeppelin', 'Pink Floyd'], correctIndex: 0 },
  { id: 28, category: 'Music', question: 'What is the name of Taylor Swift\'s 2024 world tour?', answers: ['The Eras Tour', 'The Reputation Tour', 'The 1989 Tour', 'Speak Now Tour', 'Fearless Tour', 'Lover Fest'], correctIndex: 0 },
  { id: 29, category: 'Music', question: 'Which music streaming app has a green logo?', answers: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music', 'Pandora', 'SoundCloud'], correctIndex: 0 },
  { id: 30, category: 'Music', question: 'What song from "Moana" was sung by The Rock?', answers: ['You\'re Welcome', 'How Far I\'ll Go', 'Shiny', 'Where You Are', 'We Know the Way', 'I Am Moana'], correctIndex: 0 },
  { id: 31, category: 'Music', question: 'Which K-pop group performed "Dynamite"?', answers: ['BTS', 'BLACKPINK', 'EXO', 'TWICE', 'Stray Kids', 'NCT'], correctIndex: 0 },
  { id: 32, category: 'Music', question: 'What is the highest-pitched voice type for a female singer?', answers: ['Soprano', 'Alto', 'Mezzo-soprano', 'Contralto', 'Tenor', 'Bass'], correctIndex: 0 },
  { id: 33, category: 'Music', question: 'Which singer is known for the song "Bad Guy"?', answers: ['Billie Eilish', 'Ariana Grande', 'Dua Lipa', 'Olivia Rodrigo', 'Doja Cat', 'SZA'], correctIndex: 0 },
  { id: 34, category: 'Music', question: 'What instrument has 88 keys?', answers: ['Piano', 'Organ', 'Accordion', 'Synthesizer', 'Harpsichord', 'Keyboard'], correctIndex: 0 },
  { id: 35, category: 'Music', question: 'Which rapper is known as "Slim Shady"?', answers: ['Eminem', 'Drake', 'Kanye West', 'Snoop Dogg', 'Jay-Z', 'Lil Wayne'], correctIndex: 0 },
  { id: 36, category: 'TV Shows', question: 'What is the name of the talking sea sponge who lives in a pineapple?', answers: ['SpongeBob SquarePants', 'Patrick Star', 'Squidward', 'Mr. Krabs', 'Gary', 'Sandy Cheeks'], correctIndex: 0 },
  { id: 37, category: 'TV Shows', question: 'In "Stranger Things", what is Eleven\'s favorite food?', answers: ['Eggo waffles', 'Pizza', 'Ice cream', 'Burgers', 'Fries', 'Chicken nuggets'], correctIndex: 0 },
  { id: 38, category: 'TV Shows', question: 'What cartoon features a boy named Finn and a dog named Jake?', answers: ['Adventure Time', 'Regular Show', 'Gravity Falls', 'Steven Universe', 'The Amazing World of Gumball', 'Teen Titans Go!'], correctIndex: 0 },
  { id: 39, category: 'TV Shows', question: 'In "Paw Patrol", what is the name of the boy who leads the pups?', answers: ['Ryder', 'Chase', 'Marshall', 'Rocky', 'Zuma', 'Rubble'], correctIndex: 0 },
  { id: 40, category: 'TV Shows', question: 'What Netflix show features a game called "Red Light, Green Light"?', answers: ['Squid Game', 'Money Heist', 'All of Us Are Dead', 'Sweet Home', 'Hellbound', 'The Glory'], correctIndex: 0 },
  { id: 41, category: 'TV Shows', question: 'In "The Simpsons", what color is Marge\'s hair?', answers: ['Blue', 'Yellow', 'Purple', 'Green', 'Pink', 'Orange'], correctIndex: 0 },
  { id: 42, category: 'TV Shows', question: 'What is the name of the main character in "Bluey"?', answers: ['Bluey', 'Bingo', 'Bandit', 'Chilli', 'Muffin', 'Socks'], correctIndex: 0 },
  { id: 43, category: 'TV Shows', question: 'What is Baby Yoda\'s real name in "The Mandalorian"?', answers: ['Grogu', 'Din', 'Mando', 'Yoda', 'Luke', 'Ben'], correctIndex: 0 },
  { id: 44, category: 'TV Shows', question: 'In "Gravity Falls", what are the names of the twin siblings?', answers: ['Dipper and Mabel', 'Finn and Jake', 'Phineas and Ferb', 'Tom and Jerry', 'Rick and Morty', 'Bart and Lisa'], correctIndex: 0 },
  { id: 45, category: 'TV Shows', question: 'In "Avatar: The Last Airbender", what element does Aang master first?', answers: ['Air', 'Water', 'Earth', 'Fire', 'Metal', 'Lightning'], correctIndex: 0 },
  { id: 46, category: 'TV Shows', question: 'What is the name of the pet snail in SpongeBob SquarePants?', answers: ['Gary', 'Larry', 'Barry', 'Harry', 'Jerry', 'Terry'], correctIndex: 0 },
  { id: 47, category: 'TV Shows', question: 'In "Peppa Pig", what is the name of Peppa\'s little brother?', answers: ['George', 'Pedro', 'Danny', 'Gerald', 'Richard', 'Edmund'], correctIndex: 0 },
  { id: 48, category: 'Video Games', question: 'What is the name of Mario\'s brother?', answers: ['Luigi', 'Wario', 'Waluigi', 'Toad', 'Yoshi', 'Bowser'], correctIndex: 0 },
  { id: 49, category: 'Video Games', question: 'In Minecraft, what material is needed to make a pickaxe handle?', answers: ['Sticks', 'Wood planks', 'Cobblestone', 'Iron', 'Coal', 'String'], correctIndex: 0 },
  { id: 50, category: 'Video Games', question: 'What is the main goal in "Among Us"?', answers: ['Complete tasks or find the impostor', 'Build a base', 'Win races', 'Collect coins', 'Fight monsters', 'Solve puzzles'], correctIndex: 0 },
  { id: 51, category: 'Video Games', question: 'In Fortnite, what is the name of the shrinking danger zone?', answers: ['The Storm', 'The Circle', 'The Zone', 'The Ring', 'The Wall', 'The Fog'], correctIndex: 0 },
  { id: 52, category: 'Video Games', question: 'What color is Sonic the Hedgehog?', answers: ['Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange'], correctIndex: 0 },
  { id: 53, category: 'Video Games', question: 'In Pokemon, what type is Pikachu?', answers: ['Electric', 'Fire', 'Water', 'Grass', 'Normal', 'Flying'], correctIndex: 0 },
  { id: 54, category: 'Video Games', question: 'What is the name of the princess Mario often rescues?', answers: ['Peach', 'Daisy', 'Rosalina', 'Toadstool', 'Zelda', 'Pauline'], correctIndex: 0 },
  { id: 55, category: 'Video Games', question: 'In Roblox, what is the in-game currency called?', answers: ['Robux', 'Coins', 'Gems', 'Bucks', 'Credits', 'Tokens'], correctIndex: 0 },
  { id: 56, category: 'Video Games', question: 'What creature in Minecraft explodes when it gets close to you?', answers: ['Creeper', 'Zombie', 'Skeleton', 'Enderman', 'Spider', 'Witch'], correctIndex: 0 },
  { id: 57, category: 'Video Games', question: 'In "The Legend of Zelda", what is the hero\'s name?', answers: ['Link', 'Zelda', 'Ganon', 'Epona', 'Navi', 'Impa'], correctIndex: 0 },
  { id: 58, category: 'Video Games', question: 'What game features characters like Steve and Alex?', answers: ['Minecraft', 'Roblox', 'Fortnite', 'Terraria', 'Stardew Valley', 'Animal Crossing'], correctIndex: 0 },
  { id: 59, category: 'Video Games', question: 'In Animal Crossing, what do you use to catch fish?', answers: ['Fishing rod', 'Net', 'Shovel', 'Axe', 'Slingshot', 'Hands'], correctIndex: 0 },
  { id: 60, category: 'Sports', question: 'How many players are on a soccer team on the field?', answers: ['11', '10', '9', '12', '8', '7'], correctIndex: 0 },
  { id: 61, category: 'Sports', question: 'What sport does LeBron James play?', answers: ['Basketball', 'Football', 'Baseball', 'Soccer', 'Tennis', 'Golf'], correctIndex: 0 },
  { id: 62, category: 'Sports', question: 'In which sport would you perform a slam dunk?', answers: ['Basketball', 'Volleyball', 'Tennis', 'Baseball', 'Hockey', 'Soccer'], correctIndex: 0 },
  { id: 63, category: 'Sports', question: 'How many rings are in the Olympic symbol?', answers: ['5', '4', '6', '7', '3', '8'], correctIndex: 0 },
  { id: 64, category: 'Sports', question: 'What sport is played at Wimbledon?', answers: ['Tennis', 'Golf', 'Cricket', 'Polo', 'Rugby', 'Soccer'], correctIndex: 0 },
  { id: 65, category: 'Sports', question: 'In baseball, how many strikes make an out?', answers: ['3', '2', '4', '5', '1', '6'], correctIndex: 0 },
  { id: 66, category: 'Sports', question: 'What country won the 2022 FIFA World Cup?', answers: ['Argentina', 'France', 'Brazil', 'Germany', 'Spain', 'England'], correctIndex: 0 },
  { id: 67, category: 'Sports', question: 'In American football, how many points is a touchdown worth?', answers: ['6', '7', '3', '5', '4', '2'], correctIndex: 0 },
  { id: 68, category: 'Sports', question: 'What color belt is highest in karate?', answers: ['Black', 'White', 'Red', 'Brown', 'Blue', 'Green'], correctIndex: 0 },
  { id: 69, category: 'Sports', question: 'How many holes are on a standard golf course?', answers: ['18', '9', '12', '20', '15', '21'], correctIndex: 0 },
  { id: 70, category: 'Sports', question: 'What sport uses a puck?', answers: ['Hockey', 'Lacrosse', 'Curling', 'Field Hockey', 'Polo', 'Cricket'], correctIndex: 0 },
  { id: 71, category: 'General', question: 'What planet is known as the "Red Planet"?', answers: ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Neptune'], correctIndex: 0 },
  { id: 72, category: 'General', question: 'How many continents are there on Earth?', answers: ['7', '6', '5', '8', '9', '4'], correctIndex: 0 },
  { id: 73, category: 'General', question: 'What is the largest ocean on Earth?', answers: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Southern Ocean', 'Mediterranean Sea'], correctIndex: 0 },
  { id: 74, category: 'General', question: 'What animal is the tallest in the world?', answers: ['Giraffe', 'Elephant', 'Whale', 'Ostrich', 'Camel', 'Bear'], correctIndex: 0 },
  { id: 75, category: 'General', question: 'What is the capital of the United States?', answers: ['Washington D.C.', 'New York City', 'Los Angeles', 'Chicago', 'Philadelphia', 'Boston'], correctIndex: 0 },
  { id: 76, category: 'General', question: 'How many colors are in a rainbow?', answers: ['7', '6', '5', '8', '9', '10'], correctIndex: 0 },
  { id: 77, category: 'General', question: 'What is the largest mammal on Earth?', answers: ['Blue whale', 'Elephant', 'Giraffe', 'Great white shark', 'Hippopotamus', 'Polar bear'], correctIndex: 0 },
  { id: 78, category: 'General', question: 'What do bees make?', answers: ['Honey', 'Milk', 'Silk', 'Wax only', 'Nectar', 'Pollen'], correctIndex: 0 },
  { id: 79, category: 'General', question: 'What is the hardest natural substance on Earth?', answers: ['Diamond', 'Gold', 'Iron', 'Steel', 'Titanium', 'Platinum'], correctIndex: 0 },
  { id: 80, category: 'General', question: 'How many legs does a spider have?', answers: ['8', '6', '10', '4', '12', '7'], correctIndex: 0 },
  { id: 81, category: 'General', question: 'What is the fastest land animal?', answers: ['Cheetah', 'Lion', 'Horse', 'Gazelle', 'Leopard', 'Greyhound'], correctIndex: 0 },
  { id: 82, category: 'General', question: 'What gas do plants breathe in?', answers: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen', 'Helium', 'Methane'], correctIndex: 0 },
  { id: 83, category: 'General', question: 'What famous tower is located in Paris?', answers: ['Eiffel Tower', 'Leaning Tower', 'Big Ben', 'Empire State Building', 'Burj Khalifa', 'CN Tower'], correctIndex: 0 },
  { id: 84, category: 'General', question: 'What holiday is celebrated on October 31st?', answers: ['Halloween', 'Thanksgiving', 'Easter', 'Christmas', 'Valentine\'s Day', 'St. Patrick\'s Day'], correctIndex: 0 },
  { id: 85, category: 'General', question: 'What is the largest planet in our solar system?', answers: ['Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Earth', 'Mars'], correctIndex: 0 }
];

// Trivia game constants
const TRIVIA_RULES_DURATION_ROUND1 = 10000;  // 10 seconds for first round (full rules)
const TRIVIA_RULES_DURATION_NORMAL = 3000;   // 3 seconds for rounds 2-3
const TRIVIA_RULES_DURATION_SPEED = 5000;    // 5 seconds for speed round announcement
const TRIVIA_QUESTION_DURATION = 10000;  // 10 seconds per question
const TRIVIA_SPEED_ROUND_DURATION = 60000;  // 60 seconds total for speed round
const TRIVIA_SPEED_WRONG_DELAY = 3000;  // 3 seconds delay after wrong answer in speed round
const TRIVIA_SPEED_CORRECT_DELAY = 1000;  // 1 second delay after correct answer to show green feedback
const TRIVIA_REVEAL_DURATION = 3000;  // 3 seconds to show correct answer
const TRIVIA_SPEED_REVEAL_DURATION = 1500;  // 1.5 seconds reveal in speed round (faster)
const TRIVIA_BASE_POINTS = 100;
const TRIVIA_TIME_BONUS_MAX = 50;
const TRIVIA_SPEED_MULTIPLIER = 2;
const TRIVIA_SPEED_FIXED_POINTS = 200;  // Fixed points per correct answer in speed round

// Quick Math game constants
const MATH_RULES_DURATION_ROUND1 = 10000;  // 10 seconds for first round (full rules)
const MATH_RULES_DURATION_NORMAL = 3000;   // 3 seconds for rounds 2-3
const MATH_RULES_DURATION_SPEED = 5000;    // 5 seconds for speed round announcement
const MATH_QUESTION_DURATION = 15000;  // 15 seconds per question (typing takes longer)
const MATH_SPEED_ROUND_DURATION = 60000;  // 60 seconds total for speed round
const MATH_SPEED_WRONG_DELAY = 3000;  // 3 seconds delay after wrong answer in speed round
const MATH_SPEED_CORRECT_DELAY = 1000;  // 1 second delay after correct answer
const MATH_REVEAL_DURATION = 3000;  // 3 seconds to show correct answer
const MATH_BASE_POINTS = 100;
const MATH_TIME_BONUS_MAX = 50;
const MATH_SPEED_MULTIPLIER = 2;
const MATH_SPEED_FIXED_POINTS = 200;  // Fixed points per correct answer in speed round

// Math questions bank
const MATH_QUESTIONS = [
  // Addition
  { id: 1, category: 'Addition', question: '15 + 27', answer: 42 },
  { id: 2, category: 'Addition', question: '34 + 58', answer: 92 },
  { id: 3, category: 'Addition', question: '45 + 36', answer: 81 },
  { id: 4, category: 'Addition', question: '67 + 24', answer: 91 },
  { id: 5, category: 'Addition', question: '89 + 11', answer: 100 },
  { id: 6, category: 'Addition', question: '23 + 77', answer: 100 },
  { id: 7, category: 'Addition', question: '56 + 44', answer: 100 },
  { id: 8, category: 'Addition', question: '38 + 47', answer: 85 },
  { id: 9, category: 'Addition', question: '19 + 64', answer: 83 },
  { id: 10, category: 'Addition', question: '72 + 18', answer: 90 },
  { id: 11, category: 'Addition', question: '33 + 49', answer: 82 },
  { id: 12, category: 'Addition', question: '51 + 39', answer: 90 },
  { id: 13, category: 'Addition', question: '28 + 65', answer: 93 },
  { id: 14, category: 'Addition', question: '14 + 78', answer: 92 },
  { id: 15, category: 'Addition', question: '46 + 37', answer: 83 },
  // Subtraction
  { id: 31, category: 'Subtraction', question: '85 - 37', answer: 48 },
  { id: 32, category: 'Subtraction', question: '92 - 45', answer: 47 },
  { id: 33, category: 'Subtraction', question: '74 - 28', answer: 46 },
  { id: 34, category: 'Subtraction', question: '100 - 63', answer: 37 },
  { id: 35, category: 'Subtraction', question: '67 - 19', answer: 48 },
  { id: 36, category: 'Subtraction', question: '83 - 56', answer: 27 },
  { id: 37, category: 'Subtraction', question: '91 - 34', answer: 57 },
  { id: 38, category: 'Subtraction', question: '58 - 29', answer: 29 },
  { id: 39, category: 'Subtraction', question: '76 - 48', answer: 28 },
  { id: 40, category: 'Subtraction', question: '99 - 52', answer: 47 },
  { id: 41, category: 'Subtraction', question: '64 - 17', answer: 47 },
  { id: 42, category: 'Subtraction', question: '87 - 39', answer: 48 },
  { id: 43, category: 'Subtraction', question: '73 - 26', answer: 47 },
  { id: 44, category: 'Subtraction', question: '95 - 68', answer: 27 },
  { id: 45, category: 'Subtraction', question: '82 - 44', answer: 38 },
  // Multiplication
  { id: 61, category: 'Multiplication', question: '8 x 9', answer: 72 },
  { id: 62, category: 'Multiplication', question: '7 x 6', answer: 42 },
  { id: 63, category: 'Multiplication', question: '9 x 7', answer: 63 },
  { id: 64, category: 'Multiplication', question: '6 x 8', answer: 48 },
  { id: 65, category: 'Multiplication', question: '5 x 9', answer: 45 },
  { id: 66, category: 'Multiplication', question: '8 x 8', answer: 64 },
  { id: 67, category: 'Multiplication', question: '7 x 7', answer: 49 },
  { id: 68, category: 'Multiplication', question: '9 x 9', answer: 81 },
  { id: 69, category: 'Multiplication', question: '6 x 7', answer: 42 },
  { id: 70, category: 'Multiplication', question: '8 x 6', answer: 48 },
  { id: 71, category: 'Multiplication', question: '12 x 7', answer: 84 },
  { id: 72, category: 'Multiplication', question: '11 x 8', answer: 88 },
  { id: 73, category: 'Multiplication', question: '9 x 11', answer: 99 },
  { id: 74, category: 'Multiplication', question: '12 x 6', answer: 72 },
  { id: 75, category: 'Multiplication', question: '8 x 12', answer: 96 },
  // Division
  { id: 86, category: 'Division', question: '72 / 8', answer: 9 },
  { id: 87, category: 'Division', question: '63 / 7', answer: 9 },
  { id: 88, category: 'Division', question: '56 / 8', answer: 7 },
  { id: 89, category: 'Division', question: '48 / 6', answer: 8 },
  { id: 90, category: 'Division', question: '81 / 9', answer: 9 },
  { id: 91, category: 'Division', question: '42 / 7', answer: 6 },
  { id: 92, category: 'Division', question: '54 / 9', answer: 6 },
  { id: 93, category: 'Division', question: '64 / 8', answer: 8 },
  { id: 94, category: 'Division', question: '45 / 5', answer: 9 },
  { id: 95, category: 'Division', question: '36 / 4', answer: 9 },
  { id: 96, category: 'Division', question: '49 / 7', answer: 7 },
  { id: 97, category: 'Division', question: '40 / 8', answer: 5 },
  { id: 98, category: 'Division', question: '84 / 7', answer: 12 },
  { id: 99, category: 'Division', question: '96 / 8', answer: 12 },
  { id: 100, category: 'Division', question: '100 / 4', answer: 25 }
];

// Fisher-Yates shuffle helper
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// In-memory online users tracking: userId -> { socketId, status, roomId }
// status: 'online' | 'inRoom' | 'inGame'
const onlineUsers = new Map();

// Word list for Pictionary
const PICTIONARY_WORDS = [
  'ELEPHANT', 'PIZZA', 'RAINBOW', 'ROCKET', 'CASTLE', 'GUITAR', 'ROBOT',
  'TREASURE', 'UNICORN', 'DRAGON', 'MOUNTAIN', 'AIRPLANE', 'BIRTHDAY',
  'TELESCOPE', 'WATERFALL', 'DINOSAUR', 'BUTTERFLY', 'SNOWMAN', 'PIRATE',
  'VOLCANO', 'BANANA', 'LIGHTHOUSE', 'SKATEBOARD', 'MERMAID', 'TORNADO',
  'SUNFLOWER', 'SPACESHIP', 'CAMPFIRE', 'PENGUIN', 'JELLYFISH'
];

// Track disconnected players in their grace period so we can cancel removal on rejoin
// Key: "roomId:playerName", Value: { timer }
const disconnectedPlayers = new Map();

// Track players who haven't selected an avatar yet
// Key: "roomId:playerName", Value: { timer }
const avatarSelectionTimers = new Map();

// Track which room each master owns (for detecting when master joins another room)
// Key: masterName, Value: roomId
const masterRooms = new Map();

const GRACE_PERIOD_MS = 15000;
const AVATAR_SELECTION_TIMEOUT_MS = 30000;

// --- Multi-round Pictionary helpers ---

function computeDrawingOrder(players) {
  return players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, tiebreaker: Math.random() }))
    .sort((a, b) => b.score - a.score || a.tiebreaker - b.tiebreaker)
    .map(({ name, avatar }) => ({ name, avatar }));
}

function pickWord(usedWords) {
  const available = PICTIONARY_WORDS.filter(w => !usedWords.includes(w));
  const pool = available.length > 0 ? available : PICTIONARY_WORDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function startRound(io, room, roomId) {
  // Word and drawer are already set on room.game before this is called
  io.to(roomId).emit('gameStarted', {
    drawerName: room.game.drawerName,
    currentRound: room.game.currentRound,
    totalRounds: room.game.totalRounds,
    currentPickValue: room.game.currentPickValue
  });

  const drawerPlayer = room.players.find(p => p.name === room.game.drawerName);
  if (drawerPlayer) {
    io.to(drawerPlayer.socketId).emit('yourWord', { word: room.game.currentWord });
  }

  // After 10s rules countdown, signal all clients to start game timer in sync
  setTimeout(() => {
    if (room.game) {
      const endTime = Date.now() + 60000;
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(roomId).emit('gameTimerStart', { endTime });
    }
  }, 10000);
}

function advanceRound(io, room, roomId) {
  if (!room.game) return;
  room.game.currentDrawerIndex++;
  room.game.currentRound++;

  // Skip disconnected players
  while (room.game.currentDrawerIndex < room.game.drawingOrder.length) {
    const nextDrawer = room.game.drawingOrder[room.game.currentDrawerIndex];
    const player = room.players.find(p => p.name === nextDrawer.name);

    // If player doesn't exist or is disconnected, skip them
    if (!player || player.connected === false) {
      console.log(`Skipping disconnected drawer: ${nextDrawer.name}`);
      io.to(roomId).emit('drawerSkipped', { playerName: nextDrawer.name, reason: 'disconnected' });
      room.game.currentDrawerIndex++;
      room.game.currentRound++;
    } else {
      break;
    }
  }

  if (room.game.currentDrawerIndex >= room.game.drawingOrder.length) {
    // All players have drawn — game over
    const finalScores = room.players
      .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
      .sort((a, b) => b.score - a.score);

    // Compile game history entry
    const gameHistoryEntry = {
      game: 'Drawing Game',
      timestamp: Date.now(),
      finalScores,
      roundScores: room.game.roundScores || {}
    };

    if (!room.gameHistory) room.gameHistory = [];
    room.gameHistory.push(gameHistoryEntry);

    // Remove the completed game from the queue
    if (room.selectedGames && room.selectedGames.length > 0) {
      room.selectedGames.shift();
    }

    io.to(roomId).emit('gameEnded', { finalScores, gameHistory: room.gameHistory });
    room.game = null;
    return;
  }

  const drawer = room.game.drawingOrder[room.game.currentDrawerIndex];
  const word = pickWord(room.game.usedWords);
  room.game.usedWords.push(word);
  room.game.drawerName = drawer.name;
  room.game.currentWord = word;
  room.game.currentPickValue = 100;

  io.to(roomId).emit('nextRound', {
    drawerName: drawer.name,
    currentRound: room.game.currentRound,
    totalRounds: room.game.totalRounds,
    currentPickValue: 100
  });

  const drawerPlayer = room.players.find(p => p.name === drawer.name);
  if (drawerPlayer) {
    io.to(drawerPlayer.socketId).emit('yourWord', { word });
  }

  // After 10s rules countdown, signal all clients to start game timer in sync
  setTimeout(() => {
    if (room.game) {
      const endTime = Date.now() + 60000;
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(roomId).emit('gameTimerStart', { endTime });
    }
  }, 10000);
}

// Helper to broadcast friend status changes
function broadcastToFriends(io, userId, friendIds, event, data) {
  friendIds.forEach(friendId => {
    const friend = onlineUsers.get(friendId);
    if (friend) {
      io.to(friend.socketId).emit(event, data);
    }
  });
}

// --- Trivia Game Helpers ---

function getRandomTriviaQuestions(count, usedIds = []) {
  const available = TRIVIA_QUESTIONS.filter(q => !usedIds.includes(q.id));
  const pool = available.length >= count ? available : TRIVIA_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function calculateTriviaPoints(answerTimestamp, questionStartTime, questionDuration, isSpeedRound) {
  const timeTaken = answerTimestamp - questionStartTime;
  const maxTime = questionDuration;

  // Time bonus: faster answers get more bonus points
  const timeRatio = Math.max(0, 1 - (timeTaken / maxTime));
  const timeBonus = Math.floor(timeRatio * TRIVIA_TIME_BONUS_MAX);

  const basePoints = TRIVIA_BASE_POINTS + timeBonus;
  return isSpeedRound ? basePoints * TRIVIA_SPEED_MULTIPLIER : basePoints;
}

function startTriviaRound(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  const roundIndex = game.currentRound - 1;
  const isSpeedRound = game.currentRound === 4;

  game.isSpeedRound = isSpeedRound;
  game.currentQuestionIndex = 0;
  game.phase = 'rules';

  // For speed round, get more questions (we'll use as many as fit in 60s)
  // For normal rounds, use the preset count
  const questionsInRound = isSpeedRound ? 30 : game.questionsPerRound[roundIndex];  // 30 is plenty for 60s
  const roundQuestions = getRandomTriviaQuestions(questionsInRound, game.usedQuestionIds);
  game.roundQuestions = roundQuestions;
  roundQuestions.forEach(q => game.usedQuestionIds.push(q.id));

  // Pre-shuffle all answers once for speed round (same order for all players)
  if (isSpeedRound) {
    game.shuffledQuestions = roundQuestions.map(q => {
      const correctAnswer = q.answers[q.correctIndex];
      const shuffledAnswers = shuffleArray(q.answers);
      const shuffledCorrectIndex = shuffledAnswers.indexOf(correctAnswer);
      return {
        ...q,
        shuffledAnswers,
        shuffledCorrectIndex,
        correctAnswer
      };
    });

    // Initialize per-player progress tracking for speed round
    game.playerProgress = {};
    room.players.forEach(p => {
      game.playerProgress[p.name] = {
        currentQuestionIndex: 0,
        correctAnswers: [],  // Array of { questionIndex, points }
        wrongAnswers: [],    // Array of { questionIndex }
        totalPoints: 0,
        isWaiting: false     // True when player is in 2s wrong answer delay
      };
    });
  }

  // Dynamic rules duration based on round
  let rulesDuration;
  if (game.currentRound === 1) {
    rulesDuration = TRIVIA_RULES_DURATION_ROUND1;  // 10s with full rules
  } else if (isSpeedRound) {
    rulesDuration = TRIVIA_RULES_DURATION_SPEED;   // 5s for speed round announcement
  } else {
    rulesDuration = TRIVIA_RULES_DURATION_NORMAL;  // 3s "Same rules! Get ready!"
  }

  // Set rules end time
  const rulesEndTime = Date.now() + rulesDuration;
  game.rulesEndTime = rulesEndTime;

  // Initialize ready players for this round
  game.readyPlayers = [];

  // For speed round, calculate when the 60s will end (after rules)
  const speedRoundEndTime = isSpeedRound ? Date.now() + rulesDuration + TRIVIA_SPEED_ROUND_DURATION : null;
  game.speedRoundEndTime = speedRoundEndTime;

  io.to(roomId).emit('triviaRulesStart', {
    rulesEndTime,
    round: game.currentRound,
    totalRounds: game.totalRounds,
    isSpeedRound,
    questionsInRound: isSpeedRound ? '∞' : questionsInRound,
    speedRoundEndTime,
    readyPlayers: []
  });

  // After rules countdown, start questions (store timer so we can cancel if all ready)
  console.log(`[TRIVIA] Setting rules timer for ${rulesDuration}ms, isSpeedRound=${isSpeedRound}`);
  game.rulesTimer = setTimeout(() => {
    console.log(`[TRIVIA] Rules timer fired! isSpeedRound=${isSpeedRound}, game exists=${!!room.game}`);
    if (room.game && room.game.gameType === 'trivia') {
      if (isSpeedRound) {
        // Speed round: send first question to each player individually
        console.log(`[TRIVIA] Starting speed round...`);
        startSpeedRound(io, room, roomId);
      } else {
        advanceTriviaQuestion(io, room, roomId);
      }
    }
  }, rulesDuration);
}

function advanceTriviaQuestion(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  const questionIndex = game.currentQuestionIndex;

  // For speed round, check if 60s has expired
  if (game.isSpeedRound && game.speedRoundEndTime) {
    const timeRemaining = game.speedRoundEndTime - Date.now();
    if (timeRemaining <= 0) {
      // Speed round time is up - show recap
      showTriviaRecap(io, room, roomId);
      return;
    }
  }

  // Check if round is complete (for non-speed rounds, or if we ran out of questions)
  if (questionIndex >= game.roundQuestions.length) {
    // Show recap for this round
    showTriviaRecap(io, room, roomId);
    return;
  }

  const question = game.roundQuestions[questionIndex];

  // For speed round, question duration is shorter but capped by remaining time
  let questionDuration;
  if (game.isSpeedRound && game.speedRoundEndTime) {
    const timeRemaining = game.speedRoundEndTime - Date.now();
    questionDuration = Math.min(TRIVIA_SPEED_QUESTION_DURATION, timeRemaining);
    if (questionDuration <= 0) {
      // No time left, end the round
      showTriviaRecap(io, room, roomId);
      return;
    }
  } else {
    questionDuration = TRIVIA_QUESTION_DURATION;
  }

  const questionEndTime = Date.now() + questionDuration;

  // Shuffle answers and track new correct index
  const correctAnswer = question.answers[question.correctIndex];
  const shuffledAnswers = shuffleArray(question.answers);
  const shuffledCorrectIndex = shuffledAnswers.indexOf(correctAnswer);

  // Store question with shuffled data for this round
  game.currentQuestion = {
    ...question,
    shuffledAnswers,
    shuffledCorrectIndex
  };
  game.questionEndTime = questionEndTime;
  game.questionStartTime = Date.now();
  game.answers = {};
  game.phase = 'question';

  io.to(roomId).emit('triviaQuestion', {
    question: question.question,
    answers: shuffledAnswers,
    category: question.category,
    questionEndTime,
    questionNumber: questionIndex + 1,
    totalQuestions: game.isSpeedRound ? '∞' : game.roundQuestions.length,
    round: game.currentRound,
    totalRounds: game.totalRounds,
    isSpeedRound: game.isSpeedRound,
    speedRoundEndTime: game.speedRoundEndTime
  });

  // Set timer to reveal answer
  game.questionTimer = setTimeout(() => {
    if (room.game && room.game.gameType === 'trivia') {
      revealTriviaAnswer(io, room, roomId);
    }
  }, questionDuration);
}

function revealTriviaAnswer(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.phase = 'reveal';
  const question = game.currentQuestion;
  // Use shuffled correct index for validation
  const correctIndex = question.shuffledCorrectIndex;
  const correctAnswer = question.shuffledAnswers[correctIndex];

  // Calculate points for each player who answered correctly
  const playerResults = {};
  const questionDuration = game.isSpeedRound ? TRIVIA_SPEED_QUESTION_DURATION : TRIVIA_QUESTION_DURATION;

  Object.entries(game.answers).forEach(([playerName, answerData]) => {
    const isCorrect = answerData.answerIndex === correctIndex;
    let pointsEarned = 0;

    if (isCorrect) {
      pointsEarned = calculateTriviaPoints(
        answerData.timestamp,
        game.questionStartTime,
        questionDuration,
        game.isSpeedRound
      );

      // Update player score
      const player = room.players.find(p => p.name === playerName);
      if (player) {
        player.score = (player.score || 0) + pointsEarned;
      }
    }

    playerResults[playerName] = {
      answerIndex: answerData.answerIndex,
      isCorrect,
      pointsEarned
    };
  });

  // Track question in history (with shuffled data for recap animation)
  game.questionHistory.push({
    question: question.question,
    category: question.category,
    correctIndex,
    correctAnswer,
    answers: question.shuffledAnswers,
    playerResults
  });

  // Broadcast updated scores
  io.to(roomId).emit('scoresUpdated', { players: room.players });

  io.to(roomId).emit('triviaReveal', {
    correctIndex,
    correctAnswer,
    playerResults,
    questionNumber: game.currentQuestionIndex + 1,
    totalQuestions: game.isSpeedRound ? '∞' : game.roundQuestions.length
  });

  // Use shorter reveal duration for speed round to fit more questions
  const revealDuration = game.isSpeedRound ? TRIVIA_SPEED_REVEAL_DURATION : TRIVIA_REVEAL_DURATION;

  // After reveal duration, advance to next question
  setTimeout(() => {
    if (room.game && room.game.gameType === 'trivia') {
      game.currentQuestionIndex++;
      advanceTriviaQuestion(io, room, roomId);
    }
  }, revealDuration);
}

function showTriviaRecap(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  game.phase = 'recap';

  // Calculate standings
  const standings = room.players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
    .sort((a, b) => b.score - a.score);

  // Get question history for this round
  const roundStartIndex = game.questionHistory.length - game.roundQuestions.length;
  const roundHistory = game.questionHistory.slice(roundStartIndex);

  io.to(roomId).emit('triviaRecap', {
    round: game.currentRound,
    totalRounds: game.totalRounds,
    standings,
    questionHistory: roundHistory,
    isLastRound: game.currentRound >= game.totalRounds
  });
}

function startNextTriviaRound(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;

  // Check if game is complete
  if (game.currentRound >= game.totalRounds) {
    endTriviaGame(io, room, roomId);
    return;
  }

  game.currentRound++;
  startTriviaRound(io, room, roomId);
}

function endTriviaGame(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  game.phase = 'finalRecap';

  // Calculate final standings
  const finalStandings = room.players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
    .sort((a, b) => b.score - a.score);

  const winner = finalStandings[0];

  // Compile roundScores from questionHistory for PlayerProfile display
  // Structure: { playerName: [{ round, points }, ...] }
  const roundScores = {};
  let currentRound = 1;
  let questionsInRound = 0;
  const questionsPerRound = 5; // Normal rounds have 5 questions each

  game.questionHistory.forEach((qh) => {
    if (qh.type === 'speedRound') {
      // Speed round data - add all player points as round 4
      if (qh.raceData) {
        qh.raceData.forEach(pd => {
          if (!roundScores[pd.name]) roundScores[pd.name] = [];
          if (pd.totalPoints > 0) {
            roundScores[pd.name].push({ round: 4, points: pd.totalPoints });
          }
        });
      }
    } else if (qh.playerResults) {
      // Normal question - track by round
      Object.entries(qh.playerResults).forEach(([playerName, result]) => {
        if (result.pointsEarned > 0) {
          if (!roundScores[playerName]) roundScores[playerName] = [];
          roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
        }
      });
      questionsInRound++;
      if (questionsInRound >= questionsPerRound && currentRound < 3) {
        currentRound++;
        questionsInRound = 0;
      }
    }
  });

  // Compile game history entry
  const gameHistoryEntry = {
    game: 'Trivia Master',
    timestamp: Date.now(),
    finalScores: finalStandings,
    questionHistory: game.questionHistory,
    roundScores
  };

  if (!room.gameHistory) room.gameHistory = [];
  room.gameHistory.push(gameHistoryEntry);

  io.to(roomId).emit('triviaFinalResults', {
    winner,
    finalStandings,
    gameHistory: room.gameHistory,
    totalQuestions: game.questionHistory.length
  });

  // Clean up game state after delay
  setTimeout(() => {
    if (room.game && room.game.gameType === 'trivia') {
      // Remove the completed game from the queue
      if (room.selectedGames && room.selectedGames.length > 0) {
        room.selectedGames.shift();
      }
      room.game = null;
      io.to(roomId).emit('gameEnded', { finalScores: finalStandings, gameHistory: room.gameHistory });
    }
  }, 5500);  // 5.5 seconds to show winner celebration
}

// --- Speed Round Helper Functions ---

function startSpeedRound(io, room, roomId) {
  console.log(`[SPEED] startSpeedRound called. game exists=${!!room.game}, isSpeedRound=${room.game?.isSpeedRound}`);
  if (!room.game || room.game.gameType !== 'trivia' || !room.game.isSpeedRound) {
    console.log(`[SPEED] startSpeedRound early return - guard failed`);
    return;
  }

  const game = room.game;
  game.phase = 'speedRound';
  console.log(`[SPEED] Phase set to speedRound, sending questions to ${room.players.length} players`);

  // Send first question to each player individually
  room.players.forEach(player => {
    if (player.connected !== false) {
      console.log(`[SPEED] Sending first question to ${player.name}`);
      sendSpeedRoundQuestion(io, room, roomId, player);
    }
  });

  // Set timer to end speed round after 60s
  console.log(`[SPEED] Setting 60s timer to end speed round`);
  game.speedRoundTimer = setTimeout(() => {
    console.log(`[SPEED] 60s timer fired, ending speed round`);
    endSpeedRound(io, room, roomId);
  }, TRIVIA_SPEED_ROUND_DURATION);
}

function sendSpeedRoundQuestion(io, room, roomId, player) {
  console.log(`[SPEED] sendSpeedRoundQuestion for ${player.name}`);
  if (!room.game || !room.game.isSpeedRound) {
    console.log(`[SPEED] sendSpeedRoundQuestion guard failed: game=${!!room.game}, isSpeedRound=${room.game?.isSpeedRound}`);
    return;
  }

  const game = room.game;
  const progress = game.playerProgress[player.name];
  if (!progress) {
    console.log(`[SPEED] No progress found for ${player.name}`);
    return;
  }
  console.log(`[SPEED] ${player.name} progress: questionIndex=${progress.currentQuestionIndex}, totalQuestions=${game.shuffledQuestions?.length}`);

  // Check if player has completed all questions
  if (progress.currentQuestionIndex >= game.shuffledQuestions.length) {
    // Player finished all questions - they wait for others/timer
    io.to(player.socketId).emit('speedRoundWaiting', {
      message: 'All questions answered! Waiting for time to run out...',
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length,
      correctCount: progress.correctAnswers.length,
      totalPoints: progress.totalPoints
    });
    return;
  }

  const question = game.shuffledQuestions[progress.currentQuestionIndex];

  io.to(player.socketId).emit('speedRoundQuestion', {
    question: question.question,
    answers: question.shuffledAnswers,
    category: question.category,
    questionNumber: progress.currentQuestionIndex + 1,
    speedRoundEndTime: game.speedRoundEndTime
  });
}

function handleSpeedRoundAnswer(io, room, roomId, player, answerIndex) {
  if (!room.game || !room.game.isSpeedRound || room.game.phase !== 'speedRound') return;

  const game = room.game;
  const progress = game.playerProgress[player.name];
  if (!progress || progress.isWaiting) return;  // Ignore if player is in wrong answer delay

  const questionIndex = progress.currentQuestionIndex;
  if (questionIndex >= game.shuffledQuestions.length) return;

  const question = game.shuffledQuestions[questionIndex];
  const isCorrect = answerIndex === question.shuffledCorrectIndex;

  if (isCorrect) {
    // Correct answer: award points with 1 second delay to show green feedback
    const points = TRIVIA_SPEED_FIXED_POINTS;
    progress.correctAnswers.push({ questionIndex, points });
    progress.totalPoints += points;
    progress.currentQuestionIndex++;
    progress.isWaiting = true;  // Mark as waiting during delay

    // Update player score
    player.score = (player.score || 0) + points;

    // Send feedback - client will show green for 1 second
    io.to(player.socketId).emit('speedRoundCorrect', {
      points,
      totalPoints: progress.totalPoints,
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length
    });

    // After 1s delay, send next question
    setTimeout(() => {
      if (room.game && room.game.isSpeedRound && game.playerProgress[player.name]) {
        progress.isWaiting = false;
        sendSpeedRoundQuestion(io, room, roomId, player);
      }
    }, TRIVIA_SPEED_CORRECT_DELAY);

  } else {
    // Wrong answer: show correct answer, 2s delay, then next question
    progress.wrongAnswers.push({ questionIndex });
    progress.currentQuestionIndex++;
    progress.isWaiting = true;

    // Send feedback with correct answer
    io.to(player.socketId).emit('speedRoundWrong', {
      correctIndex: question.shuffledCorrectIndex,
      correctAnswer: question.correctAnswer,
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length
    });

    // After 2s delay, send next question
    setTimeout(() => {
      if (room.game && room.game.isSpeedRound && game.playerProgress[player.name]) {
        progress.isWaiting = false;
        sendSpeedRoundQuestion(io, room, roomId, player);
      }
    }, TRIVIA_SPEED_WRONG_DELAY);
  }
}

function endSpeedRound(io, room, roomId) {
  if (!room.game || !room.game.isSpeedRound) return;

  const game = room.game;

  // Clear the timer if it exists
  if (game.speedRoundTimer) {
    clearTimeout(game.speedRoundTimer);
    game.speedRoundTimer = null;
  }

  game.phase = 'speedRecap';

  // Compile race data for all players
  const raceData = [];
  let maxCorrect = 0;

  room.players.forEach(player => {
    const progress = game.playerProgress[player.name];
    if (progress) {
      const correctCount = progress.correctAnswers.length;
      if (correctCount > maxCorrect) maxCorrect = correctCount;

      raceData.push({
        name: player.name,
        avatar: player.avatar,
        correctCount,
        wrongCount: progress.wrongAnswers.length,
        totalPoints: progress.totalPoints,
        // For animation: array of points earned per correct answer
        steps: progress.correctAnswers.map(ca => ca.points)
      });

      // Update player score in room
      player.score = (player.score || 0);  // Already updated during round
    }
  });

  // Sort by total points (correct count * 200)
  raceData.sort((a, b) => b.totalPoints - a.totalPoints);

  // Calculate animation speed: ~10 seconds total, based on max questions answered
  const animationDuration = 10000;  // 10 seconds
  const stepDuration = maxCorrect > 0 ? Math.floor(animationDuration / maxCorrect) : 1000;

  // Determine winner
  const winner = raceData[0];

  // Store in question history for game record
  game.questionHistory.push({
    type: 'speedRound',
    raceData,
    maxCorrect,
    winner: winner?.name
  });

  // Emit race recap event to ALL players in the room
  console.log(`[SPEED] Emitting speedRoundRecap to room ${roomId} with ${raceData.length} players`);
  console.log(`[SPEED] Room has ${room.players.length} players:`, room.players.map(p => p.name));
  io.to(roomId).emit('speedRoundRecap', {
    raceData,
    maxCorrect,
    stepDuration,
    winner,
    round: game.currentRound,
    totalRounds: game.totalRounds
  });
}

// --- Quick Math Game Helpers ---

function getRandomMathQuestions(count, usedIds = []) {
  const available = MATH_QUESTIONS.filter(q => !usedIds.includes(q.id));
  const pool = available.length >= count ? available : MATH_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateSpeedRoundOptions(correctAnswer) {
  const options = [correctAnswer];
  const offsets = [-10, -5, -2, -1, 1, 2, 5, 10];
  const shuffledOffsets = offsets.sort(() => Math.random() - 0.5);

  for (const offset of shuffledOffsets) {
    const wrongAnswer = correctAnswer + offset;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
      if (options.length === 4) break;
    }
  }

  let multiplier = 2;
  while (options.length < 4) {
    const offset = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20 * multiplier);
    const wrongAnswer = correctAnswer + offset;
    if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
    multiplier++;
  }

  return shuffleArray(options);
}

function calculateMathPoints(answerTimestamp, questionStartTime, questionDuration, isSpeedRound) {
  const timeTaken = answerTimestamp - questionStartTime;
  const maxTime = questionDuration;
  const timeRatio = Math.max(0, 1 - (timeTaken / maxTime));
  const timeBonus = Math.floor(timeRatio * MATH_TIME_BONUS_MAX);
  const basePoints = MATH_BASE_POINTS + timeBonus;
  return isSpeedRound ? basePoints * MATH_SPEED_MULTIPLIER : basePoints;
}

function startMathRound(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  const roundIndex = game.currentRound - 1;
  const isSpeedRound = game.currentRound === 4;

  game.isSpeedRound = isSpeedRound;
  game.currentQuestionIndex = 0;
  game.phase = 'rules';

  const questionsInRound = isSpeedRound ? 30 : game.questionsPerRound[roundIndex];
  const roundQuestions = getRandomMathQuestions(questionsInRound, game.usedQuestionIds);
  game.roundQuestions = roundQuestions;
  roundQuestions.forEach(q => game.usedQuestionIds.push(q.id));

  if (isSpeedRound) {
    game.shuffledQuestions = roundQuestions.map(q => {
      const options = generateSpeedRoundOptions(q.answer);
      const correctIndex = options.indexOf(q.answer);
      return {
        ...q,
        options,
        correctIndex
      };
    });

    game.playerProgress = {};
    room.players.forEach(p => {
      game.playerProgress[p.name] = {
        currentQuestionIndex: 0,
        correctAnswers: [],
        wrongAnswers: [],
        totalPoints: 0,
        isWaiting: false
      };
    });
  }

  let rulesDuration;
  if (game.currentRound === 1) {
    rulesDuration = MATH_RULES_DURATION_ROUND1;
  } else if (isSpeedRound) {
    rulesDuration = MATH_RULES_DURATION_SPEED;
  } else {
    rulesDuration = MATH_RULES_DURATION_NORMAL;
  }

  const rulesEndTime = Date.now() + rulesDuration;
  game.rulesEndTime = rulesEndTime;
  game.readyPlayers = [];

  const speedRoundEndTime = isSpeedRound ? Date.now() + rulesDuration + MATH_SPEED_ROUND_DURATION : null;
  game.speedRoundEndTime = speedRoundEndTime;

  io.to(roomId).emit('mathRulesStart', {
    rulesEndTime,
    round: game.currentRound,
    totalRounds: game.totalRounds,
    isSpeedRound,
    questionsInRound: isSpeedRound ? 30 : questionsInRound,
    speedRoundEndTime,
    readyPlayers: []
  });

  game.rulesTimer = setTimeout(() => {
    if (room.game && room.game.gameType === 'quickmath') {
      if (isSpeedRound) {
        startMathSpeedRound(io, room, roomId);
      } else {
        advanceMathQuestion(io, room, roomId);
      }
    }
  }, rulesDuration);
}

function advanceMathQuestion(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  const questionIndex = game.currentQuestionIndex;

  if (questionIndex >= game.roundQuestions.length) {
    showMathRecap(io, room, roomId);
    return;
  }

  const question = game.roundQuestions[questionIndex];
  const questionDuration = MATH_QUESTION_DURATION;
  const questionEndTime = Date.now() + questionDuration;

  game.currentQuestion = question;
  game.questionEndTime = questionEndTime;
  game.questionStartTime = Date.now();
  game.answers = {};
  game.phase = 'question';

  io.to(roomId).emit('mathQuestion', {
    question: question.question,
    category: question.category,
    questionEndTime,
    questionNumber: questionIndex + 1,
    totalQuestions: game.roundQuestions.length,
    round: game.currentRound,
    totalRounds: game.totalRounds,
    isSpeedRound: false
  });

  game.questionTimer = setTimeout(() => {
    if (room.game && room.game.gameType === 'quickmath') {
      revealMathAnswer(io, room, roomId);
    }
  }, questionDuration);
}

function revealMathAnswer(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.phase = 'reveal';
  const question = game.currentQuestion;
  const correctAnswer = question.answer;

  const playerResults = {};
  const questionDuration = MATH_QUESTION_DURATION;

  Object.entries(game.answers).forEach(([playerName, answerData]) => {
    const isCorrect = answerData.answer === correctAnswer;
    let pointsEarned = 0;

    if (isCorrect) {
      pointsEarned = calculateMathPoints(
        answerData.timestamp,
        game.questionStartTime,
        questionDuration,
        false
      );

      const player = room.players.find(p => p.name === playerName);
      if (player) {
        player.score = (player.score || 0) + pointsEarned;
      }
    }

    playerResults[playerName] = {
      answer: answerData.answer,
      isCorrect,
      pointsEarned
    };
  });

  game.questionHistory.push({
    question: question.question,
    category: question.category,
    correctAnswer,
    playerResults
  });

  io.to(roomId).emit('scoresUpdated', { players: room.players });

  io.to(roomId).emit('mathReveal', {
    correctAnswer,
    playerResults,
    questionNumber: game.currentQuestionIndex + 1,
    totalQuestions: game.roundQuestions.length
  });

  setTimeout(() => {
    if (room.game && room.game.gameType === 'quickmath') {
      game.currentQuestionIndex++;
      advanceMathQuestion(io, room, roomId);
    }
  }, MATH_REVEAL_DURATION);
}

function showMathRecap(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  game.phase = 'recap';

  const standings = room.players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
    .sort((a, b) => b.score - a.score);

  const roundStartIndex = game.questionHistory.length - game.roundQuestions.length;
  const roundHistory = game.questionHistory.slice(roundStartIndex);

  io.to(roomId).emit('mathRecap', {
    round: game.currentRound,
    totalRounds: game.totalRounds,
    standings,
    questionHistory: roundHistory,
    isLastRound: game.currentRound >= game.totalRounds
  });
}

function startNextMathRound(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;

  if (game.currentRound >= game.totalRounds) {
    endMathGame(io, room, roomId);
    return;
  }

  game.currentRound++;
  startMathRound(io, room, roomId);
}

function endMathGame(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  game.phase = 'finalRecap';

  const finalStandings = room.players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
    .sort((a, b) => b.score - a.score);

  const winner = finalStandings[0];

  // Compile roundScores from questionHistory for PlayerProfile display
  // Structure: { playerName: [{ round, points }, ...] }
  const roundScores = {};
  let currentRound = 1;
  let questionsInRound = 0;
  const questionsPerRound = 5; // Normal rounds have 5 questions each

  game.questionHistory.forEach((qh) => {
    if (qh.type === 'speedRound') {
      // Speed round data - add all player points as round 4
      if (qh.raceData) {
        qh.raceData.forEach(pd => {
          if (!roundScores[pd.name]) roundScores[pd.name] = [];
          if (pd.totalPoints > 0) {
            roundScores[pd.name].push({ round: 4, points: pd.totalPoints });
          }
        });
      }
    } else if (qh.playerResults) {
      // Normal question - track by round
      Object.entries(qh.playerResults).forEach(([playerName, result]) => {
        if (result.pointsEarned > 0) {
          if (!roundScores[playerName]) roundScores[playerName] = [];
          roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
        }
      });
      questionsInRound++;
      if (questionsInRound >= questionsPerRound && currentRound < 3) {
        currentRound++;
        questionsInRound = 0;
      }
    }
  });

  const gameHistoryEntry = {
    game: 'Quick Math',
    timestamp: Date.now(),
    finalScores: finalStandings,
    questionHistory: game.questionHistory,
    roundScores
  };

  if (!room.gameHistory) room.gameHistory = [];
  room.gameHistory.push(gameHistoryEntry);

  // Remove the completed game from the queue
  if (room.selectedGames && room.selectedGames.length > 0) {
    room.selectedGames.shift();
  }

  // Send gameEnded immediately since WinnerCelebration was already shown
  room.game = null;
  io.to(roomId).emit('gameEnded', {
    finalScores: finalStandings,
    roundScores,
    gameHistory: room.gameHistory
  });
}

// Math Speed Round Helpers
function startMathSpeedRound(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath' || !room.game.isSpeedRound) return;

  const game = room.game;
  game.phase = 'speedRound';

  room.players.forEach(player => {
    if (player.connected !== false) {
      sendMathSpeedRoundQuestion(io, room, roomId, player);
    }
  });

  game.speedRoundTimer = setTimeout(() => {
    endMathSpeedRound(io, room, roomId);
  }, MATH_SPEED_ROUND_DURATION);
}

function sendMathSpeedRoundQuestion(io, room, roomId, player) {
  if (!room.game || !room.game.isSpeedRound) return;

  const game = room.game;
  const progress = game.playerProgress[player.name];
  if (!progress) return;

  if (progress.currentQuestionIndex >= game.shuffledQuestions.length) {
    io.to(player.socketId).emit('speedRoundWaiting', {
      message: 'All questions answered! Waiting for time to run out...',
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length,
      correctCount: progress.correctAnswers.length,
      totalPoints: progress.totalPoints
    });
    return;
  }

  const question = game.shuffledQuestions[progress.currentQuestionIndex];

  io.to(player.socketId).emit('speedRoundQuestion', {
    question: question.question,
    answers: question.options,
    category: question.category,
    questionNumber: progress.currentQuestionIndex + 1,
    speedRoundEndTime: game.speedRoundEndTime
  });
}

function handleMathSpeedRoundAnswer(io, room, roomId, player, answerIndex) {
  if (!room.game || !room.game.isSpeedRound || room.game.phase !== 'speedRound') return;

  const game = room.game;
  const progress = game.playerProgress[player.name];
  if (!progress || progress.isWaiting) return;

  const questionIndex = progress.currentQuestionIndex;
  if (questionIndex >= game.shuffledQuestions.length) return;

  const question = game.shuffledQuestions[questionIndex];
  const isCorrect = answerIndex === question.correctIndex;

  if (isCorrect) {
    const points = MATH_SPEED_FIXED_POINTS;
    progress.correctAnswers.push({ questionIndex, points });
    progress.totalPoints += points;
    progress.currentQuestionIndex++;
    progress.isWaiting = true;

    player.score = (player.score || 0) + points;

    io.to(player.socketId).emit('speedRoundCorrect', {
      points,
      totalPoints: progress.totalPoints,
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length
    });

    setTimeout(() => {
      if (room.game && room.game.isSpeedRound && game.playerProgress[player.name]) {
        progress.isWaiting = false;
        sendMathSpeedRoundQuestion(io, room, roomId, player);
      }
    }, MATH_SPEED_CORRECT_DELAY);

  } else {
    progress.wrongAnswers.push({ questionIndex });
    progress.currentQuestionIndex++;
    progress.isWaiting = true;

    io.to(player.socketId).emit('speedRoundWrong', {
      correctIndex: question.correctIndex,
      correctAnswer: question.answer,
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length
    });

    setTimeout(() => {
      if (room.game && room.game.isSpeedRound && game.playerProgress[player.name]) {
        progress.isWaiting = false;
        sendMathSpeedRoundQuestion(io, room, roomId, player);
      }
    }, MATH_SPEED_WRONG_DELAY);
  }
}

function endMathSpeedRound(io, room, roomId) {
  if (!room.game || !room.game.isSpeedRound) return;

  const game = room.game;

  if (game.speedRoundTimer) {
    clearTimeout(game.speedRoundTimer);
    game.speedRoundTimer = null;
  }

  game.phase = 'speedRecap';

  const raceData = [];
  let maxCorrect = 0;

  room.players.forEach(player => {
    const progress = game.playerProgress[player.name];
    if (progress) {
      const correctCount = progress.correctAnswers.length;
      if (correctCount > maxCorrect) maxCorrect = correctCount;

      raceData.push({
        name: player.name,
        avatar: player.avatar,
        correctCount,
        wrongCount: progress.wrongAnswers.length,
        totalPoints: progress.totalPoints,
        steps: progress.correctAnswers.map(ca => ca.points)
      });
    }
  });

  raceData.sort((a, b) => b.totalPoints - a.totalPoints);

  const animationDuration = 10000;
  const stepDuration = maxCorrect > 0 ? Math.floor(animationDuration / maxCorrect) : 1000;

  const winner = raceData[0];

  game.questionHistory.push({
    type: 'speedRound',
    raceData,
    maxCorrect,
    winner: winner?.name
  });

  io.to(roomId).emit('speedRoundRecap', {
    raceData,
    maxCorrect,
    stepDuration,
    winner,
    round: game.currentRound,
    totalRounds: game.totalRounds
  });

  // Note: endMathGame will be called when client emits 'mathCelebrationComplete'
}

function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // --- User Online Status Events ---

    // User comes online (authenticated)
    socket.on('userOnline', ({ userId, friendIds }) => {
      if (!userId) return;

      onlineUsers.set(userId, {
        socketId: socket.id,
        status: 'online',
        roomId: null
      });

      // Store userId on socket for disconnect handling
      socket.userId = userId;
      socket.friendIds = friendIds || [];

      // Notify friends that user is online
      if (friendIds && friendIds.length > 0) {
        broadcastToFriends(io, userId, friendIds, 'friendOnline', {
          userId,
          status: 'online'
        });
      }

      console.log(`User ${userId} is now online`);
    });

    // User enters a room
    socket.on('userInRoom', ({ userId, roomId }) => {
      if (!userId) return;

      const user = onlineUsers.get(userId);
      if (user) {
        user.status = 'inRoom';
        user.roomId = roomId;

        // Notify friends
        if (socket.friendIds && socket.friendIds.length > 0) {
          broadcastToFriends(io, userId, socket.friendIds, 'friendStatusChanged', {
            userId,
            status: 'inRoom',
            roomId
          });
        }
      }
    });

    // User starts a game
    socket.on('userInGame', ({ userId, roomId }) => {
      if (!userId) return;

      const user = onlineUsers.get(userId);
      if (user) {
        user.status = 'inGame';
        user.roomId = roomId;

        // Notify friends
        if (socket.friendIds && socket.friendIds.length > 0) {
          broadcastToFriends(io, userId, socket.friendIds, 'friendStatusChanged', {
            userId,
            status: 'inGame',
            roomId
          });
        }
      }
    });

    // Get status of multiple friends
    socket.on('getFriendsStatus', ({ friendIds }, callback) => {
      const statuses = {};
      friendIds.forEach(friendId => {
        const friend = onlineUsers.get(friendId);
        if (friend) {
          statuses[friendId] = {
            status: friend.status,
            roomId: friend.roomId
          };
        } else {
          statuses[friendId] = { status: 'offline', roomId: null };
        }
      });

      if (typeof callback === 'function') {
        callback(statuses);
      } else {
        socket.emit('friendsStatus', statuses);
      }
    });

    // --- Create Room ---
    socket.on('createRoom', (data) => {
      // Check if this master already has an existing room
      const existingRoomId = masterRooms.get(data.playerName);
      if (existingRoomId && rooms.has(existingRoomId)) {
        const existingRoom = rooms.get(existingRoomId);
        // Close the existing room
        io.to(existingRoomId).emit('roomClosed', {
          roomId: existingRoomId,
          reason: 'Master created a new room'
        });
        // Clean up avatar timers for all players in the old room
        existingRoom.players.forEach(p => {
          const timerKey = `${existingRoomId}:${p.name}`;
          const pending = avatarSelectionTimers.get(timerKey);
          if (pending) {
            clearTimeout(pending.timer);
            avatarSelectionTimers.delete(timerKey);
          }
        });
        rooms.delete(existingRoomId);
        console.log(`Room ${existingRoomId} closed because master ${data.playerName} created a new room`);
      }

      const roomId = uuidv4().substring(0, 6).toUpperCase();
      const room = {
        id: roomId,
        name: data.roomName,
        master: data.playerName,
        players: [{ name: data.playerName, isMaster: true, avatar: data.avatar || 'meta', socketId: socket.id, connected: true, score: 0 }],
        selectedGames: []
      };

      rooms.set(roomId, room);
      masterRooms.set(data.playerName, roomId);
      socket.join(roomId);
      socket.emit('roomCreated', room);
      console.log(`Room ${roomId} created by ${data.playerName}`);

      // Start avatar selection timer if master starts with meta avatar
      const avatar = data.avatar || 'meta';
      if (avatar === 'meta') {
        const timerKey = `${roomId}:${data.playerName}`;
        const timer = setTimeout(() => {
          avatarSelectionTimers.delete(timerKey);
          const currentRoom = rooms.get(roomId);
          if (!currentRoom) return;

          const player = currentRoom.players.find(p => p.name === data.playerName);
          if (!player || player.avatar !== 'meta') return; // Already selected an avatar

          // Remove player and close the room since they are master
          io.to(socket.id).emit('removedForNoAvatar', { roomId });
          masterRooms.delete(data.playerName);
          rooms.delete(roomId);
          console.log(`Master ${data.playerName} removed from room ${roomId} for not selecting an avatar in 30 seconds - room closed`);
        }, AVATAR_SELECTION_TIMEOUT_MS);

        avatarSelectionTimers.set(timerKey, { timer });
      }
    });

    // --- Join Room ---
    socket.on('joinRoom', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Check if this player is a master of another room
      const existingRoomId = masterRooms.get(data.playerName);
      if (existingRoomId && existingRoomId !== data.roomId && rooms.has(existingRoomId)) {
        const existingRoom = rooms.get(existingRoomId);
        // Close the existing room
        io.to(existingRoomId).emit('roomClosed', {
          roomId: existingRoomId,
          reason: 'Master joined another room'
        });
        // Clean up avatar timers for all players in the old room
        existingRoom.players.forEach(p => {
          const timerKey = `${existingRoomId}:${p.name}`;
          const pending = avatarSelectionTimers.get(timerKey);
          if (pending) {
            clearTimeout(pending.timer);
            avatarSelectionTimers.delete(timerKey);
          }
        });
        rooms.delete(existingRoomId);
        masterRooms.delete(data.playerName);
        console.log(`Room ${existingRoomId} closed because master ${data.playerName} joined another room`);
      }

      // Check for duplicate name (case-insensitive)
      const nameTaken = room.players.some(
        p => p.name.trim().toLowerCase() === data.playerName.trim().toLowerCase()
      );
      if (nameTaken) {
        socket.emit('error', { message: 'Name already taken in this room. Please choose a different name.' });
        return;
      }

      const avatar = data.avatar || 'meta';
      room.players.push({ name: data.playerName, isMaster: false, avatar, socketId: socket.id, connected: true, score: 0 });
      socket.join(data.roomId);

      // Tell the joining player the full room state
      socket.emit('roomJoined', room);
      // Tell everyone else a new player joined
      socket.to(data.roomId).emit('playerJoined', { roomId: data.roomId, player: data.playerName, avatar });
      console.log(`${data.playerName} joined room ${data.roomId}`);

      // Start avatar selection timer if player joined with meta avatar
      if (avatar === 'meta') {
        const timerKey = `${data.roomId}:${data.playerName}`;
        const timer = setTimeout(() => {
          avatarSelectionTimers.delete(timerKey);
          const currentRoom = rooms.get(data.roomId);
          if (!currentRoom) return;

          const player = currentRoom.players.find(p => p.name === data.playerName);
          if (!player || player.avatar !== 'meta') return; // Already selected an avatar

          // Remove player from room
          currentRoom.players = currentRoom.players.filter(p => p.name !== data.playerName);
          io.to(player.socketId).emit('removedForNoAvatar', { roomId: data.roomId });
          io.to(data.roomId).emit('playerLeft', { roomId: data.roomId, playerName: data.playerName, reason: 'noAvatar' });
          console.log(`${data.playerName} removed from room ${data.roomId} for not selecting an avatar in 30 seconds`);

          // Clean up room if empty
          if (currentRoom.players.length === 0) {
            rooms.delete(data.roomId);
            console.log(`Room ${data.roomId} removed (empty)`);
          }
        }, AVATAR_SELECTION_TIMEOUT_MS);

        avatarSelectionTimers.set(timerKey, { timer });
      }
    });

    // --- Rejoin Room (after page refresh) ---
    socket.on('rejoinRoom', (data) => {
      const { roomId, playerName, avatar } = data;
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit('rejoinFailed', { message: 'Room no longer exists' });
        return;
      }

      const player = room.players.find(p => p.name === playerName);
      if (!player) {
        socket.emit('rejoinFailed', { message: 'You are no longer in this room' });
        return;
      }

      // Cancel grace period timer if pending
      const key = `${roomId}:${playerName}`;
      const pending = disconnectedPlayers.get(key);
      if (pending) {
        clearTimeout(pending.timer);
        disconnectedPlayers.delete(key);
        console.log(`Grace period cancelled for ${playerName} in room ${roomId}`);
      }

      // Update player's socket and mark connected
      player.socketId = socket.id;
      player.connected = true;
      socket.join(roomId);

      // Send full room state back to the rejoining player (include gameHistory)
      socket.emit('rejoinSuccess', { ...room, gameHistory: room.gameHistory || [] });

      // If there's an active game, send game sync data to the rejoining player
      if (room.game) {
        const gameSync = {
          drawerName: room.game.drawerName,
          currentRound: room.game.currentRound,
          totalRounds: room.game.totalRounds,
          currentPickValue: room.game.currentPickValue,
          paused: room.game.paused || false,
          timerEndTime: room.game.timerEndTime,
          timerRemainingMs: room.game.timerRemainingMs
        };

        // Send game state sync
        socket.emit('gameSync', gameSync);

        // If this player is the drawer, send them their word
        if (room.game.drawerName === playerName) {
          socket.emit('yourWord', { word: room.game.currentWord });
        }
      }

      // Notify other players
      socket.to(roomId).emit('playerRejoined', { roomId, playerName, avatar: player.avatar });
      console.log(`${playerName} rejoined room ${roomId}`);
    });

    // --- Request Game Sync (for visibility change / tab return / rejoin) ---
    socket.on('requestGameSync', (data) => {
      const { roomId } = data;
      const room = rooms.get(roomId);

      if (!room || !room.game) {
        // No active game, send player back to room
        socket.emit('gameSync', { noActiveGame: true });
        return;
      }

      // Find the requesting player
      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      const game = room.game;

      if (game.gameType === 'trivia') {
        // Trivia game sync
        const hasAnswered = game.answers && game.answers[player.name] !== undefined;
        const answeredPlayers = game.answers ? Object.keys(game.answers) : [];

        const triviaSync = {
          gameType: 'trivia',
          phase: game.phase,
          currentRound: game.currentRound,
          totalRounds: game.totalRounds,
          isSpeedRound: game.isSpeedRound,
          questionNumber: game.currentQuestionIndex + 1,
          totalQuestions: game.isSpeedRound ? '∞' : (game.roundQuestions ? game.roundQuestions.length : 0),
          rulesEndTime: game.rulesEndTime,
          questionEndTime: game.questionEndTime,
          speedRoundEndTime: game.speedRoundEndTime,
          hasAnswered,
          answeredPlayers
        };

        // Include current question if in question phase
        if (game.phase === 'question' && game.currentQuestion) {
          triviaSync.question = game.currentQuestion.question;
          triviaSync.answers = game.currentQuestion.shuffledAnswers;
          triviaSync.category = game.currentQuestion.category;
        }

        // Include standings
        triviaSync.standings = room.players
          .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
          .sort((a, b) => b.score - a.score);

        socket.emit('triviaSync', triviaSync);
      } else if (game.gameType === 'quickmath') {
        // Quick Math game sync
        const hasAnswered = game.answers && game.answers[player.name] !== undefined;
        const answeredPlayers = game.answers ? Object.keys(game.answers) : [];

        const mathSync = {
          gameType: 'quickmath',
          phase: game.phase,
          currentRound: game.currentRound,
          totalRounds: game.totalRounds,
          isSpeedRound: game.isSpeedRound,
          questionNumber: game.currentQuestionIndex + 1,
          totalQuestions: game.isSpeedRound ? '∞' : (game.roundQuestions ? game.roundQuestions.length : 0),
          rulesEndTime: game.rulesEndTime,
          questionEndTime: game.questionEndTime,
          speedRoundEndTime: game.speedRoundEndTime,
          hasAnswered,
          answeredPlayers
        };

        // Include current question if in question phase
        if (game.phase === 'question' && game.currentQuestion) {
          mathSync.question = game.currentQuestion.question;
          mathSync.category = game.currentQuestion.category;
        }

        // Include speed round question if applicable
        if (game.isSpeedRound && game.playerProgress && game.playerProgress[player.name]) {
          const playerProg = game.playerProgress[player.name];
          if (playerProg.currentQuestion) {
            mathSync.speedQuestion = playerProg.currentQuestion.question;
            mathSync.speedAnswers = playerProg.options;
            mathSync.speedCategory = playerProg.currentQuestion.category;
            mathSync.speedQuestionsAnswered = playerProg.questionsAnswered || 0;
            mathSync.speedCorrectAnswers = playerProg.correctAnswers || 0;
          }
        }

        // Include standings
        mathSync.standings = room.players
          .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
          .sort((a, b) => b.score - a.score);

        socket.emit('mathSync', mathSync);
      } else {
        // Pictionary game sync (existing logic)
        const gameSync = {
          gameType: 'pictionary',
          drawerName: game.drawerName,
          currentRound: game.currentRound,
          totalRounds: game.totalRounds,
          currentPickValue: game.currentPickValue,
          paused: game.paused || false,
          timerEndTime: game.timerEndTime,
          timerRemainingMs: game.timerRemainingMs,
          drawingOrder: game.drawingOrder
        };

        socket.emit('gameSync', gameSync);

        // If this player is the drawer, resend their word
        if (game.drawerName === player.name) {
          socket.emit('yourWord', { word: game.currentWord });
        }
      }
    });

    // --- Toggle Game Selection ---
    socket.on('toggleGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const index = room.selectedGames.indexOf(data.gameId);
      if (index > -1) {
        room.selectedGames.splice(index, 1);
      } else {
        room.selectedGames.push(data.gameId);
      }

      io.to(data.roomId).emit('gamesUpdated', { roomId: data.roomId, selectedGames: room.selectedGames });
    });

    // --- Start Game ---
    socket.on('startGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      // Determine game type from the FIRST selected game
      // Game ID 1 = Trivia Master, Game ID 2 = Drawing Battle (Pictionary), Game ID 5 = Quick Math
      const firstGameId = room.selectedGames[0];
      let gameType = 'pictionary'; // default
      if (firstGameId === 1) {
        gameType = 'trivia';
      } else if (firstGameId === 5) {
        gameType = 'quickmath';
      } else if (firstGameId === 2) {
        gameType = 'pictionary';
      }

      if (gameType === 'quickmath') {
        // Initialize Quick Math game
        room.game = {
          gameType: 'quickmath',
          currentRound: 1,
          totalRounds: 4,
          questionsPerRound: [5, 5, 5, 30],  // Rounds 1-3: 5 questions, Round 4: 30 speed questions
          currentQuestionIndex: 0,
          currentQuestion: null,
          questionEndTime: null,
          rulesEndTime: null,
          phase: 'rules',
          answers: {},
          questionHistory: [],
          roundQuestions: [],
          isSpeedRound: false,
          usedQuestionIds: [],
          questionStartTime: null,
          questionTimer: null
        };

        // Reset player scores
        room.players.forEach(p => { p.score = 0; });

        // Emit countdown to all
        io.to(data.roomId).emit('gameStarting', {
          roomId: data.roomId,
          gameType: 'quickmath',
          totalRounds: 4,
          currentRound: 1
        });

        // After 4s countdown, start first round
        setTimeout(() => {
          if (room.game && room.game.gameType === 'quickmath') {
            startMathRound(io, room, data.roomId);
          }
        }, 4000);

      } else if (gameType === 'trivia') {
        // Initialize Trivia game
        room.game = {
          gameType: 'trivia',
          currentRound: 1,
          totalRounds: 4,
          questionsPerRound: [5, 5, 5, 10],  // Rounds 1-3: 5 questions, Round 4: 10 questions
          currentQuestionIndex: 0,
          currentQuestion: null,
          questionEndTime: null,
          rulesEndTime: null,
          phase: 'rules',
          answers: {},
          questionHistory: [],
          roundQuestions: [],
          isSpeedRound: false,
          usedQuestionIds: [],
          questionStartTime: null,
          questionTimer: null
        };

        // Reset player scores
        room.players.forEach(p => { p.score = 0; });

        // Emit countdown to all
        io.to(data.roomId).emit('gameStarting', {
          roomId: data.roomId,
          gameType: 'trivia',
          totalRounds: 4,
          currentRound: 1
        });

        // After 4s countdown, start first round
        setTimeout(() => {
          if (room.game && room.game.gameType === 'trivia') {
            startTriviaRound(io, room, data.roomId);
          }
        }, 4000);

      } else {
        // Existing Pictionary logic
        const drawingOrder = computeDrawingOrder(room.players);
        const firstWord = pickWord([]);

        // Reset player scores
        room.players.forEach(p => { p.score = 0; });

        room.game = {
          gameType: 'pictionary',
          drawingOrder,
          currentDrawerIndex: 0,
          currentRound: 1,
          totalRounds: drawingOrder.length,
          drawerName: drawingOrder[0].name,
          currentWord: firstWord,
          usedWords: [firstWord],
          roundScores: {},
          currentPickValue: 100,
          timerEndTime: null,
          timerRemainingMs: null
        };

        // Emit countdown to all with drawing order info
        io.to(data.roomId).emit('gameStarting', {
          roomId: data.roomId,
          gameType: 'pictionary',
          drawingOrder,
          totalRounds: drawingOrder.length,
          currentRound: 1
        });

        // After 4s (PictionaryGame mounts after 3-2-1 countdown), start first round
        setTimeout(() => {
          if (room.game && room.game.gameType === 'pictionary') {
            startRound(io, room, data.roomId);
          }
        }, 4000);
      }
    });

    // --- Draw Line (Pictionary) ---
    socket.on('drawLine', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      socket.to(data.roomId).emit('drawLine', {
        x0: data.x0, y0: data.y0,
        x1: data.x1, y1: data.y1,
        color: data.color, size: data.size
      });
    });

    // --- Clear Canvas (Pictionary) ---
    socket.on('clearCanvas', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      socket.to(data.roomId).emit('clearCanvas');
    });

    // --- Pause Game (drawer picking winner) ---
    socket.on('pauseGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      room.game.paused = true;
      room.game.timerRemainingMs = Math.max(0, room.game.timerEndTime - Date.now());
      room.game.timerEndTime = null;
      io.to(data.roomId).emit('gamePaused', { pickDuration: data.pickDuration || 5 });
    });

    // --- Resume Game (drawer cancelled pick) ---
    socket.on('resumeGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      room.game.paused = false;
      const endTime = Date.now() + (room.game.timerRemainingMs || 0);
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(data.roomId).emit('gameResumed', { endTime });
    });

    // --- Game Guess (Pictionary) ---
    socket.on('gameGuess', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Block guesses while game is paused
      if (room.game.paused) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name === room.game.drawerName) return;

      io.to(data.roomId).emit('gameGuess', {
        player: sender.name,
        avatar: sender.avatar,
        message: data.message,
        timestamp: Date.now()
      });
    });

    // --- Winner Picked (Pictionary) ---
    socket.on('winnerPicked', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      const winner = room.players.find(p => p.name === data.winnerName);
      if (!winner) return;

      // Flat 300 points for both drawer and guesser
      const points = 300;

      // Award points to both drawer and winner
      sender.score = (sender.score || 0) + points;
      winner.score = (winner.score || 0) + points;

      // Track round scores
      const rs = room.game.roundScores;
      const round = room.game.currentRound;
      if (!rs[sender.name]) rs[sender.name] = [];
      if (!rs[winner.name]) rs[winner.name] = [];
      rs[sender.name].push({ round, points });
      rs[winner.name].push({ round, points });

      // Broadcast updated scores
      io.to(data.roomId).emit('scoresUpdated', { players: room.players });

      // Broadcast winnerPicked to room for announcement
      io.to(data.roomId).emit('winnerPicked', {
        winnerName: data.winnerName,
        drawerName: sender.name,
        points,
        word: room.game.currentWord
      });

      // If timer expired, advance to next round after announcement delay
      if (data.timerExpired) {
        room.game.paused = false;
        room.game.timerEndTime = null;
        room.game.timerRemainingMs = null;
        setTimeout(() => {
          if (room.game) {
            advanceRound(io, room, data.roomId);
          }
        }, 3000);
        return;
      }

      // After 2s announcement, pick new word and continue drawing
      setTimeout(() => {
        if (!room.game) return;
        room.game.paused = false;
        const endTime = Date.now() + (room.game.timerRemainingMs || 0);
        room.game.timerEndTime = endTime;
        room.game.timerRemainingMs = null;
        const newWord = pickWord(room.game.usedWords);
        room.game.usedWords.push(newWord);
        room.game.currentWord = newWord;

        io.to(data.roomId).emit('continueDrawing', { nextPickValue: room.game.currentPickValue, endTime });

        const drawerPlayer = room.players.find(p => p.name === room.game.drawerName);
        if (drawerPlayer) {
          io.to(drawerPlayer.socketId).emit('yourWord', { word: newWord });
        }
      }, 2000);
    });

    // --- Kick Player (Master only) ---
    socket.on('kickPlayer', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Validate sender is the room master
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) {
        socket.emit('error', { message: 'You are not in this room' });
        console.log(`kickPlayer failed: sender not found for socket ${socket.id} in room ${data.roomId}`);
        return;
      }
      if (sender.name !== room.master) {
        socket.emit('error', { message: 'Only the room master can kick players' });
        console.log(`kickPlayer failed: ${sender.name} is not master (master is ${room.master})`);
        return;
      }

      // Find the player to kick
      const playerToKick = room.players.find(p => p.name === data.playerName);
      if (!playerToKick) return;

      // Can't kick yourself
      if (playerToKick.name === sender.name) return;

      // Cancel any pending grace period for this player
      const key = `${data.roomId}:${data.playerName}`;
      const pending = disconnectedPlayers.get(key);
      if (pending) {
        clearTimeout(pending.timer);
        disconnectedPlayers.delete(key);
      }

      // Remove player from room
      room.players = room.players.filter(p => p.name !== data.playerName);

      // Notify the kicked player
      io.to(playerToKick.socketId).emit('youWereKicked', { roomId: data.roomId });

      // Notify remaining players
      io.to(data.roomId).emit('playerKicked', { roomId: data.roomId, playerName: data.playerName });

      console.log(`${data.playerName} was kicked from room ${data.roomId} by ${sender.name}`);

      // If kicked player was drawing during a game, advance the round
      if (room.game && room.game.drawerName === data.playerName) {
        // Update drawing order to remove kicked player
        room.game.drawingOrder = room.game.drawingOrder.filter(p => p.name !== data.playerName);
        room.game.totalRounds = room.game.drawingOrder.length;

        io.to(data.roomId).emit('roundResult', {
          winnerName: null,
          points: 0,
          currentRound: room.game.currentRound,
          totalRounds: room.game.totalRounds
        });

        setTimeout(() => {
          if (room.game) {
            // Adjust current drawer index since we removed a player
            if (room.game.currentDrawerIndex > 0) {
              room.game.currentDrawerIndex--;
            }
            advanceRound(io, room, data.roomId);
          }
        }, 2000);
      }
    });

    // --- Skip Player Turn (Master only, during game) ---
    socket.on('skipPlayerTurn', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }
      if (!room.game) {
        socket.emit('error', { message: 'No active game' });
        return;
      }

      // Validate sender is the room master
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) {
        socket.emit('error', { message: 'You are not in this room' });
        console.log(`skipPlayerTurn failed: sender not found for socket ${socket.id} in room ${data.roomId}`);
        return;
      }
      if (sender.name !== room.master) {
        socket.emit('error', { message: 'Only the room master can skip turns' });
        console.log(`skipPlayerTurn failed: ${sender.name} is not master (master is ${room.master})`);
        return;
      }

      // Can only skip the current drawer
      if (room.game.drawerName !== data.playerName) return;

      // Emit skip notification
      io.to(data.roomId).emit('drawerSkipped', { playerName: data.playerName, reason: 'master_skipped' });

      io.to(data.roomId).emit('roundResult', {
        winnerName: null,
        points: 0,
        currentRound: room.game.currentRound,
        totalRounds: room.game.totalRounds
      });

      // Advance to next round after brief delay
      setTimeout(() => {
        if (room.game) {
          advanceRound(io, room, data.roomId);
        }
      }, 2000);

      console.log(`${data.playerName}'s turn was skipped in room ${data.roomId} by ${sender.name}`);
    });

    // --- End Game Early (Master only) ---
    socket.on('endGameEarly', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the room master
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.master) return;

      // Don't reset player scores - they keep their accumulated scores from previous games
      // Just end the current game without adding any points from this cancelled game

      // End the game without recording history
      io.to(data.roomId).emit('gameEnded', { finalScores: [], gameHistory: room.gameHistory || [], cancelled: true });
      room.game = null;
    });

    // --- No Winner (Pictionary) ---
    socket.on('noWinner', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      io.to(data.roomId).emit('roundResult', {
        winnerName: null,
        points: 0,
        currentRound: room.game.currentRound,
        totalRounds: room.game.totalRounds
      });

      // After 3s display, advance to next round
      setTimeout(() => {
        advanceRound(io, room, data.roomId);
      }, 3000);
    });

    // --- Chat Message ---
    socket.on('chatMessage', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      io.to(data.roomId).emit('chatMessage', {
        player: sender.name,
        avatar: sender.avatar,
        message: data.message,
        timestamp: Date.now()
      });
    });

    // --- Leave Room (voluntary) ---
    socket.on('leaveRoom', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      const playerName = player.name;
      const wasMaster = player.name === room.master;

      // Cancel any pending grace period
      const key = `${data.roomId}:${playerName}`;
      const pending = disconnectedPlayers.get(key);
      if (pending) {
        clearTimeout(pending.timer);
        disconnectedPlayers.delete(key);
      }

      // Cancel avatar selection timer
      const timerKey = `${data.roomId}:${playerName}`;
      const avatarPending = avatarSelectionTimers.get(timerKey);
      if (avatarPending) {
        clearTimeout(avatarPending.timer);
        avatarSelectionTimers.delete(timerKey);
      }

      // Remove player from room
      room.players = room.players.filter(p => p.name !== playerName);

      // Leave the socket room
      socket.leave(data.roomId);

      console.log(`${playerName} voluntarily left room ${data.roomId}`);

      // If master left, close the room
      if (wasMaster) {
        io.to(data.roomId).emit('roomClosed', { roomId: data.roomId, reason: 'Master left the room' });
        rooms.delete(data.roomId);
        masterRooms.delete(playerName);
        console.log(`Room ${data.roomId} closed because master ${playerName} left`);
        return;
      }

      // Notify remaining players
      io.to(data.roomId).emit('playerLeft', { roomId: data.roomId, playerName });

      // If player was drawing during a game, advance the round
      if (room.game && room.game.drawerName === playerName) {
        room.game.drawingOrder = room.game.drawingOrder.filter(p => p.name !== playerName);
        room.game.totalRounds = room.game.drawingOrder.length;

        io.to(data.roomId).emit('roundResult', {
          winnerName: null,
          points: 0,
          currentRound: room.game.currentRound,
          totalRounds: room.game.totalRounds
        });

        setTimeout(() => {
          if (room.game) {
            if (room.game.currentDrawerIndex > 0) {
              room.game.currentDrawerIndex--;
            }
            advanceRound(io, room, data.roomId);
          }
        }, 2000);
      }
    });

    // --- Set AFK Status ---
    socket.on('setAfkStatus', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      player.isAfk = data.isAfk;

      // Broadcast to all players in the room
      io.to(data.roomId).emit('playerAfkChanged', {
        roomId: data.roomId,
        playerName: player.name,
        isAfk: data.isAfk
      });

      console.log(`${player.name} is now ${data.isAfk ? 'AFK' : 'active'} in room ${data.roomId}`);
    });

    // --- Trivia: Submit Answer ---
    socket.on('triviaAnswer', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'trivia') return;

      const game = room.game;
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      // Handle speed round answers differently
      if (game.isSpeedRound && game.phase === 'speedRound') {
        handleSpeedRoundAnswer(io, room, data.roomId, sender, data.answerIndex);
        return;
      }

      // Normal trivia answer handling
      if (game.phase !== 'question') return;

      // Don't allow duplicate answers
      if (game.answers[sender.name]) return;

      // Record answer with timestamp
      game.answers[sender.name] = {
        answerIndex: data.answerIndex,
        timestamp: Date.now()
      };

      // Notify all players that this player answered
      io.to(data.roomId).emit('triviaAnswerReceived', {
        playerName: sender.name
      });

      // Check if all connected players have answered
      const connectedPlayers = room.players.filter(p => p.connected !== false);
      const answeredCount = Object.keys(game.answers).length;

      if (answeredCount >= connectedPlayers.length) {
        // All players answered, reveal immediately
        if (game.questionTimer) {
          clearTimeout(game.questionTimer);
          game.questionTimer = null;
        }
        revealTriviaAnswer(io, room, data.roomId);
      }
    });

    // --- Trivia: Master advances to next round ---
    socket.on('triviaNextRound', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'trivia') return;

      // Only master can advance (but auto-advance is allowed from client)
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      // Allow advance from recap or speedRecap phase
      if (room.game.phase !== 'recap' && room.game.phase !== 'speedRecap') return;

      startNextTriviaRound(io, room, data.roomId);
    });

    // --- Trivia: End game after speed round recap (skip finalRecap, go to room) ---
    socket.on('triviaEndAfterSpeed', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'trivia') return;

      // Only allow from speedRecap phase
      if (room.game.phase !== 'speedRecap') return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      const game = room.game;

      // Calculate final standings
      const finalStandings = room.players
        .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
        .sort((a, b) => b.score - a.score);

      // Compile roundScores from questionHistory for PlayerProfile display
      const roundScores = {};
      let currentRound = 1;
      let questionsInRound = 0;
      const questionsPerRound = 5;

      game.questionHistory.forEach((qh) => {
        if (qh.type === 'speedRound') {
          if (qh.raceData) {
            qh.raceData.forEach(pd => {
              if (!roundScores[pd.name]) roundScores[pd.name] = [];
              if (pd.totalPoints > 0) {
                roundScores[pd.name].push({ round: 4, points: pd.totalPoints });
              }
            });
          }
        } else if (qh.playerResults) {
          Object.entries(qh.playerResults).forEach(([playerName, result]) => {
            if (result.pointsEarned > 0) {
              if (!roundScores[playerName]) roundScores[playerName] = [];
              roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
            }
          });
          questionsInRound++;
          if (questionsInRound >= questionsPerRound && currentRound < 3) {
            currentRound++;
            questionsInRound = 0;
          }
        }
      });

      // Compile game history entry
      const gameHistoryEntry = {
        game: 'Trivia Master',
        timestamp: Date.now(),
        finalScores: finalStandings,
        questionHistory: game.questionHistory,
        roundScores
      };

      if (!room.gameHistory) room.gameHistory = [];
      room.gameHistory.push(gameHistoryEntry);

      // Remove the completed game from the queue
      if (room.selectedGames && room.selectedGames.length > 0) {
        room.selectedGames.shift();
      }

      // Clear game state and return to room
      room.game = null;
      io.to(data.roomId).emit('gameEnded', { finalScores: finalStandings, gameHistory: room.gameHistory });
      console.log(`[TRIVIA] Game ended after speed round, returning to room ${data.roomId}`);
    });

    // --- Trivia: Player ready during rules ---
    socket.on('triviaReady', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'trivia') return;

      const game = room.game;
      if (game.phase !== 'rules') return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      // Initialize readyPlayers if not exists
      if (!game.readyPlayers) game.readyPlayers = [];

      // Don't allow duplicate ready
      if (game.readyPlayers.includes(sender.name)) return;

      // Add player to ready list
      game.readyPlayers.push(sender.name);

      // Broadcast ready status to all players
      io.to(data.roomId).emit('triviaPlayerReady', {
        playerName: sender.name,
        readyPlayers: game.readyPlayers
      });

      // Check if all connected players are ready
      const connectedPlayers = room.players.filter(p => p.connected !== false);
      if (game.readyPlayers.length >= connectedPlayers.length) {
        // All players ready - start round immediately
        if (game.rulesTimer) {
          clearTimeout(game.rulesTimer);
          game.rulesTimer = null;
        }

        // Start questions after a brief 1s delay to show "All ready!"
        setTimeout(() => {
          if (room.game && room.game.gameType === 'trivia' && room.game.phase === 'rules') {
            if (game.isSpeedRound) {
              startSpeedRound(io, room, data.roomId);
            } else {
              advanceTriviaQuestion(io, room, data.roomId);
            }
          }
        }, 1000);
      }
    });

    // --- Dev: Skip to Speed Round ---
    socket.on('devSkipToSpeedRound', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game) return;

      const game = room.game;
      const gameType = game.gameType;

      // Support both trivia and quickmath
      if (gameType !== 'trivia' && gameType !== 'quickmath') return;

      console.log(`[DEV] Skipping to speed round in room ${data.roomId}, game: ${gameType}, current round: ${game.currentRound}`);

      // Clear any existing timers
      if (game.rulesTimer) {
        clearTimeout(game.rulesTimer);
        game.rulesTimer = null;
      }
      if (game.questionTimer) {
        clearTimeout(game.questionTimer);
        game.questionTimer = null;
      }
      if (game.speedRoundTimer) {
        clearTimeout(game.speedRoundTimer);
        game.speedRoundTimer = null;
      }
      if (game.recapTimer) {
        clearTimeout(game.recapTimer);
        game.recapTimer = null;
      }

      // Set current round to 4 (speed round) and start it directly
      game.currentRound = 4;
      game.isSpeedRound = true;

      if (gameType === 'trivia') {
        console.log(`[DEV] Starting trivia speed round`);
        startTriviaRound(io, room, data.roomId);
      } else if (gameType === 'quickmath') {
        console.log(`[DEV] Starting quickmath speed round`);

        // Generate speed round questions (30 questions for 60 seconds)
        const roundQuestions = getRandomMathQuestions(30, game.usedQuestionIds || []);
        game.roundQuestions = roundQuestions;
        roundQuestions.forEach(q => {
          if (!game.usedQuestionIds) game.usedQuestionIds = [];
          game.usedQuestionIds.push(q.id);
        });

        // Create shuffled questions with multiple choice options
        game.shuffledQuestions = roundQuestions.map(q => {
          const options = generateSpeedRoundOptions(q.answer);
          const correctIndex = options.indexOf(q.answer);
          return {
            ...q,
            options,
            correctIndex
          };
        });

        // Initialize player progress for speed round
        game.playerProgress = {};
        room.players.forEach(player => {
          game.playerProgress[player.name] = {
            currentQuestionIndex: 0,
            correctAnswers: [],
            wrongAnswers: [],
            totalPoints: 0,
            isWaiting: false
          };
        });

        // Initialize speed round state
        game.phase = 'speedRound';
        game.speedRoundEndTime = Date.now() + MATH_SPEED_ROUND_DURATION;

        console.log(`[DEV] Generated ${game.shuffledQuestions.length} questions for speed round`);

        startMathSpeedRound(io, room, data.roomId);
      }
    });

    // --- Quick Math: Celebration Complete (triggers game end) ---
    socket.on('mathCelebrationComplete', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'quickmath') return;

      // Only process once (first player to send this triggers the end)
      if (room.game.celebrationCompleted) return;
      room.game.celebrationCompleted = true;

      console.log(`[MATH] Celebration complete in room ${data.roomId}, ending game`);
      endMathGame(io, room, data.roomId);
    });

    // --- Quick Math: Submit Answer ---
    socket.on('mathAnswer', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'quickmath') return;

      const game = room.game;
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      // Handle speed round answers differently
      if (game.isSpeedRound && game.phase === 'speedRound') {
        handleMathSpeedRoundAnswer(io, room, data.roomId, sender, data.answerIndex);
        return;
      }

      // Normal math answer handling
      if (game.phase !== 'question') return;

      // Don't allow duplicate answers
      if (game.answers[sender.name]) return;

      // Record answer with timestamp (answer is a number, not an index)
      game.answers[sender.name] = {
        answer: data.answer,
        timestamp: Date.now()
      };

      // Notify all players that this player answered
      io.to(data.roomId).emit('mathAnswerReceived', {
        playerName: sender.name
      });

      // Check if all connected players have answered
      const connectedPlayers = room.players.filter(p => p.connected !== false);
      const answeredCount = Object.keys(game.answers).length;

      if (answeredCount >= connectedPlayers.length) {
        // All players answered, reveal immediately
        if (game.questionTimer) {
          clearTimeout(game.questionTimer);
          game.questionTimer = null;
        }
        revealMathAnswer(io, room, data.roomId);
      }
    });

    // --- Quick Math: Master advances to next round ---
    socket.on('mathNextRound', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'quickmath') return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      if (room.game.phase !== 'recap' && room.game.phase !== 'speedRecap') return;

      startNextMathRound(io, room, data.roomId);
    });

    // --- Quick Math: End game after speed round recap ---
    socket.on('mathEndAfterSpeed', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'quickmath') return;

      if (room.game.phase !== 'speedRecap') return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      const game = room.game;

      const finalStandings = room.players
        .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
        .sort((a, b) => b.score - a.score);

      // Compile roundScores from questionHistory for PlayerProfile display
      const roundScores = {};
      let currentRound = 1;
      let questionsInRound = 0;
      const questionsPerRound = 5;

      game.questionHistory.forEach((qh) => {
        if (qh.type === 'speedRound') {
          if (qh.raceData) {
            qh.raceData.forEach(pd => {
              if (!roundScores[pd.name]) roundScores[pd.name] = [];
              if (pd.totalPoints > 0) {
                roundScores[pd.name].push({ round: 4, points: pd.totalPoints });
              }
            });
          }
        } else if (qh.playerResults) {
          Object.entries(qh.playerResults).forEach(([playerName, result]) => {
            if (result.pointsEarned > 0) {
              if (!roundScores[playerName]) roundScores[playerName] = [];
              roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
            }
          });
          questionsInRound++;
          if (questionsInRound >= questionsPerRound && currentRound < 3) {
            currentRound++;
            questionsInRound = 0;
          }
        }
      });

      const gameHistoryEntry = {
        game: 'Quick Math',
        timestamp: Date.now(),
        finalScores: finalStandings,
        questionHistory: game.questionHistory,
        roundScores
      };

      if (!room.gameHistory) room.gameHistory = [];
      room.gameHistory.push(gameHistoryEntry);

      // Remove the completed game from the queue
      if (room.selectedGames && room.selectedGames.length > 0) {
        room.selectedGames.shift();
      }

      room.game = null;
      io.to(data.roomId).emit('gameEnded', { finalScores: finalStandings, gameHistory: room.gameHistory });
      console.log(`[MATH] Game ended after speed round, returning to room ${data.roomId}`);
    });

    // --- Quick Math: Player ready during rules ---
    socket.on('mathReady', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'quickmath') return;

      const game = room.game;
      if (game.phase !== 'rules') return;

      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender) return;

      if (!game.readyPlayers) game.readyPlayers = [];

      if (game.readyPlayers.includes(sender.name)) return;

      game.readyPlayers.push(sender.name);

      io.to(data.roomId).emit('mathPlayerReady', {
        playerName: sender.name,
        readyPlayers: game.readyPlayers
      });

      const connectedPlayers = room.players.filter(p => p.connected !== false);
      if (game.readyPlayers.length >= connectedPlayers.length) {
        if (game.rulesTimer) {
          clearTimeout(game.rulesTimer);
          game.rulesTimer = null;
        }

        setTimeout(() => {
          if (room.game && room.game.gameType === 'quickmath' && room.game.phase === 'rules') {
            if (game.isSpeedRound) {
              startMathSpeedRound(io, room, data.roomId);
            } else {
              advanceMathQuestion(io, room, data.roomId);
            }
          }
        }, 1000);
      }
    });

    // --- Change Avatar ---
    socket.on('changeAvatar', (data) => {
      const { roomId, avatar } = data;
      const room = rooms.get(roomId);
      if (!room) return;

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return;

      // Check if avatar is already taken by another player
      const taken = room.players.find(p => p.avatar === avatar && p.name !== player.name);
      if (taken) {
        socket.emit('avatarTaken', { avatar });
        return;
      }

      const wasMetaAvatar = player.avatar === 'meta';
      player.avatar = avatar;
      io.to(roomId).emit('avatarChanged', { roomId, playerName: player.name, avatar });
      console.log(`${player.name} changed avatar to ${avatar} in room ${roomId}`);

      // Cancel avatar selection timer if player is selecting a non-meta avatar
      if (wasMetaAvatar && avatar !== 'meta') {
        const timerKey = `${roomId}:${player.name}`;
        const pending = avatarSelectionTimers.get(timerKey);
        if (pending) {
          clearTimeout(pending.timer);
          avatarSelectionTimers.delete(timerKey);
          console.log(`Avatar selection timer cancelled for ${player.name} in room ${roomId}`);
        }
      }
    });

    // --- Disconnect: grace period before removing player ---
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);

      // Handle online user cleanup
      if (socket.userId) {
        const userId = socket.userId;
        onlineUsers.delete(userId);

        // Notify friends that user is offline
        if (socket.friendIds && socket.friendIds.length > 0) {
          broadcastToFriends(io, userId, socket.friendIds, 'friendOffline', { userId });
        }

        console.log(`User ${userId} is now offline`);
      }

      rooms.forEach((room, roomId) => {
        const player = room.players.find(p => p.socketId === socket.id);
        if (!player) return;

        // Cancel any pending avatar selection timer for this player
        const avatarTimerKey = `${roomId}:${player.name}`;
        const pendingAvatarTimer = avatarSelectionTimers.get(avatarTimerKey);
        if (pendingAvatarTimer) {
          clearTimeout(pendingAvatarTimer.timer);
          avatarSelectionTimers.delete(avatarTimerKey);
        }

        // If disconnecting player is current drawer during active game, treat as noWinner + advance
        if (room.game && room.game.drawerName === player.name) {
          io.to(roomId).emit('roundResult', {
            winnerName: null,
            points: 0,
            currentRound: room.game.currentRound,
            totalRounds: room.game.totalRounds
          });
          setTimeout(() => {
            advanceRound(io, room, roomId);
          }, 3000);
        }

        // Mark disconnected but don't remove yet
        player.connected = false;
        const key = `${roomId}:${player.name}`;

        // Notify other players that this player is disconnected (but not removed yet)
        io.to(roomId).emit('playerDisconnected', { roomId, playerName: player.name });

        console.log(`${player.name} disconnected from room ${roomId}, grace period started (${GRACE_PERIOD_MS / 1000}s)`);

        const timer = setTimeout(() => {
          disconnectedPlayers.delete(key);

          // Re-check room still exists
          const currentRoom = rooms.get(roomId);
          if (!currentRoom) return;

          // Remove the player
          currentRoom.players = currentRoom.players.filter(p => p.name !== player.name);
          console.log(`Grace period expired — ${player.name} removed from room ${roomId}`);

          // If room is empty, delete it
          if (currentRoom.players.length === 0) {
            // Clean up masterRooms tracking
            if (masterRooms.get(currentRoom.master) === roomId) {
              masterRooms.delete(currentRoom.master);
            }
            rooms.delete(roomId);
            console.log(`Room ${roomId} removed (empty)`);
          } else {
            // Notify remaining players
            io.to(roomId).emit('playerLeft', { roomId, playerName: player.name });
          }
        }, GRACE_PERIOD_MS);

        disconnectedPlayers.set(key, { timer });
      });
    });
  });
}

module.exports = { setupSockets };
