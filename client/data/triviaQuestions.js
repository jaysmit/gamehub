// Trivia questions organized by difficulty level
// Very Easy (ages 3-7): Picture recognition, basic colors, simple animals
// Easy (ages 7-12): Common pop culture, basic facts
// Medium (ages 12-18): General knowledge, entertainment
// Hard (ages 18+): Specific facts, history, science
// Master (PhD): Expert-level, obscure facts

// ==================== VERY EASY (Ages 3-7) ====================
export const TRIVIA_VERY_EASY = [
    // Colors & Shapes
    { id: 'VE1', category: 'Colors', question: 'What color is the sky on a sunny day?', answers: ['Blue', 'Red', 'Green', 'Purple'], correctIndex: 0 },
    { id: 'VE2', category: 'Colors', question: 'What color is a banana?', answers: ['Yellow', 'Blue', 'Red', 'Green'], correctIndex: 0 },
    { id: 'VE3', category: 'Colors', question: 'What color is grass?', answers: ['Green', 'Blue', 'Yellow', 'Red'], correctIndex: 0 },
    { id: 'VE4', category: 'Colors', question: 'What color is a fire truck?', answers: ['Red', 'Blue', 'Yellow', 'Green'], correctIndex: 0 },
    { id: 'VE5', category: 'Shapes', question: 'How many sides does a triangle have?', answers: ['3', '4', '5', '6'], correctIndex: 0 },
    { id: 'VE6', category: 'Shapes', question: 'What shape is a ball?', answers: ['Round', 'Square', 'Triangle', 'Rectangle'], correctIndex: 0 },
    // Animals
    { id: 'VE7', category: 'Animals', question: 'What sound does a dog make?', answers: ['Woof', 'Meow', 'Moo', 'Oink'], correctIndex: 0 },
    { id: 'VE8', category: 'Animals', question: 'What sound does a cat make?', answers: ['Meow', 'Woof', 'Moo', 'Quack'], correctIndex: 0 },
    { id: 'VE9', category: 'Animals', question: 'What animal says "moo"?', answers: ['Cow', 'Dog', 'Cat', 'Duck'], correctIndex: 0 },
    { id: 'VE10', category: 'Animals', question: 'What animal has a long trunk?', answers: ['Elephant', 'Dog', 'Cat', 'Bird'], correctIndex: 0 },
    { id: 'VE11', category: 'Animals', question: 'Which animal can fly?', answers: ['Bird', 'Fish', 'Dog', 'Cat'], correctIndex: 0 },
    { id: 'VE12', category: 'Animals', question: 'What animal lives in water?', answers: ['Fish', 'Dog', 'Cat', 'Bird'], correctIndex: 0 },
    { id: 'VE13', category: 'Animals', question: 'What animal hops?', answers: ['Rabbit', 'Fish', 'Snake', 'Cow'], correctIndex: 0 },
    { id: 'VE14', category: 'Animals', question: 'What animal has spots and a very long neck?', answers: ['Giraffe', 'Dog', 'Cat', 'Fish'], correctIndex: 0 },
    // Body Parts
    { id: 'VE15', category: 'Body', question: 'How many eyes do you have?', answers: ['2', '1', '3', '4'], correctIndex: 0 },
    { id: 'VE16', category: 'Body', question: 'How many fingers are on one hand?', answers: ['5', '4', '3', '10'], correctIndex: 0 },
    { id: 'VE17', category: 'Body', question: 'What do you use to see?', answers: ['Eyes', 'Ears', 'Nose', 'Mouth'], correctIndex: 0 },
    { id: 'VE18', category: 'Body', question: 'What do you use to hear?', answers: ['Ears', 'Eyes', 'Nose', 'Mouth'], correctIndex: 0 },
    // Numbers
    { id: 'VE19', category: 'Numbers', question: 'What comes after 1, 2, 3?', answers: ['4', '5', '6', '7'], correctIndex: 0 },
    { id: 'VE20', category: 'Numbers', question: 'How many legs does a dog have?', answers: ['4', '2', '6', '8'], correctIndex: 0 },
    // Food
    { id: 'VE21', category: 'Food', question: 'What fruit is red and grows on trees?', answers: ['Apple', 'Banana', 'Orange', 'Grape'], correctIndex: 0 },
    { id: 'VE22', category: 'Food', question: 'What do you put on a birthday cake?', answers: ['Candles', 'Toys', 'Books', 'Shoes'], correctIndex: 0 },
    { id: 'VE23', category: 'Food', question: 'What comes from a chicken?', answers: ['Eggs', 'Milk', 'Honey', 'Juice'], correctIndex: 0 },
    { id: 'VE24', category: 'Food', question: 'What is round and has cheese and sauce?', answers: ['Pizza', 'Cake', 'Apple', 'Bread'], correctIndex: 0 },
    // Nature
    { id: 'VE25', category: 'Nature', question: 'The sun comes out during the...?', answers: ['Day', 'Night', 'Evening', 'Never'], correctIndex: 0 },
    { id: 'VE26', category: 'Nature', question: 'Rain falls from the...?', answers: ['Sky', 'Ground', 'Trees', 'Ocean'], correctIndex: 0 },
    { id: 'VE27', category: 'Nature', question: 'Snow is what color?', answers: ['White', 'Blue', 'Yellow', 'Green'], correctIndex: 0 },
    { id: 'VE28', category: 'Nature', question: 'Where do fish live?', answers: ['Water', 'Trees', 'Caves', 'Houses'], correctIndex: 0 },
    // Disney
    { id: 'VE29', category: 'Disney', question: 'Mickey Mouse has two big...?', answers: ['Ears', 'Noses', 'Feet', 'Hands'], correctIndex: 0 },
    { id: 'VE30', category: 'Disney', question: 'What princess has very long golden hair?', answers: ['Rapunzel', 'Cinderella', 'Ariel', 'Elsa'], correctIndex: 0 }
];

// ==================== EASY (Ages 7-12) ====================
export const TRIVIA_EASY = [
    // Disney & Movies
    { id: 'E1', category: 'Movies', question: 'Which Disney movie features a character named Simba?', answers: ['The Lion King', 'Frozen', 'Moana', 'Aladdin'], correctIndex: 0 },
    { id: 'E2', category: 'Movies', question: 'What is the name of the snowman in "Frozen"?', answers: ['Olaf', 'Sven', 'Kristoff', 'Marshmallow'], correctIndex: 0 },
    { id: 'E3', category: 'Movies', question: 'In "Toy Story", what kind of toy is Woody?', answers: ['Cowboy', 'Astronaut', 'Dinosaur', 'Soldier'], correctIndex: 0 },
    { id: 'E4', category: 'Movies', question: 'What color is the fish Nemo in "Finding Nemo"?', answers: ['Orange and white', 'Blue and yellow', 'Red and black', 'Green and purple'], correctIndex: 0 },
    { id: 'E5', category: 'Movies', question: 'In "Despicable Me", what are the small yellow creatures called?', answers: ['Minions', 'Yellows', 'Helpers', 'Bananas'], correctIndex: 0 },
    { id: 'E6', category: 'Movies', question: 'What animal is Baloo in "The Jungle Book"?', answers: ['Bear', 'Panther', 'Tiger', 'Monkey'], correctIndex: 0 },
    { id: 'E7', category: 'Movies', question: 'In "Up", what lifts Carl\'s house into the sky?', answers: ['Balloons', 'Rockets', 'A tornado', 'Magic'], correctIndex: 0 },
    { id: 'E8', category: 'Movies', question: 'What is the name of the rat who wants to be a chef in "Ratatouille"?', answers: ['Remy', 'Emile', 'Alfredo', 'Gusteau'], correctIndex: 0 },
    // TV Shows
    { id: 'E9', category: 'TV Shows', question: 'What is the name of the talking sea sponge who lives in a pineapple?', answers: ['SpongeBob SquarePants', 'Patrick Star', 'Squidward', 'Mr. Krabs'], correctIndex: 0 },
    { id: 'E10', category: 'TV Shows', question: 'In "Paw Patrol", what is the name of the boy who leads the pups?', answers: ['Ryder', 'Chase', 'Marshall', 'Rocky'], correctIndex: 0 },
    { id: 'E11', category: 'TV Shows', question: 'What is the name of the main character in "Bluey"?', answers: ['Bluey', 'Bingo', 'Bandit', 'Chilli'], correctIndex: 0 },
    { id: 'E12', category: 'TV Shows', question: 'In "Peppa Pig", what is the name of Peppa\'s little brother?', answers: ['George', 'Pedro', 'Danny', 'Gerald'], correctIndex: 0 },
    // Video Games
    { id: 'E13', category: 'Video Games', question: 'What is the name of Mario\'s brother?', answers: ['Luigi', 'Wario', 'Waluigi', 'Toad'], correctIndex: 0 },
    { id: 'E14', category: 'Video Games', question: 'In Minecraft, what explodes when it gets close to you?', answers: ['Creeper', 'Zombie', 'Skeleton', 'Enderman'], correctIndex: 0 },
    { id: 'E15', category: 'Video Games', question: 'What color is Sonic the Hedgehog?', answers: ['Blue', 'Red', 'Green', 'Yellow'], correctIndex: 0 },
    { id: 'E16', category: 'Video Games', question: 'In Pokemon, what type is Pikachu?', answers: ['Electric', 'Fire', 'Water', 'Grass'], correctIndex: 0 },
    // Animals
    { id: 'E17', category: 'Animals', question: 'What is the largest animal on Earth?', answers: ['Blue whale', 'Elephant', 'Giraffe', 'Great white shark'], correctIndex: 0 },
    { id: 'E18', category: 'Animals', question: 'How many legs does a spider have?', answers: ['8', '6', '10', '4'], correctIndex: 0 },
    { id: 'E19', category: 'Animals', question: 'What is the fastest land animal?', answers: ['Cheetah', 'Lion', 'Horse', 'Gazelle'], correctIndex: 0 },
    { id: 'E20', category: 'Animals', question: 'What do bees make?', answers: ['Honey', 'Milk', 'Silk', 'Wax only'], correctIndex: 0 },
    // Sports
    { id: 'E21', category: 'Sports', question: 'How many players are on a soccer team on the field?', answers: ['11', '10', '9', '12'], correctIndex: 0 },
    { id: 'E22', category: 'Sports', question: 'In which sport would you perform a slam dunk?', answers: ['Basketball', 'Volleyball', 'Tennis', 'Baseball'], correctIndex: 0 },
    { id: 'E23', category: 'Sports', question: 'How many rings are in the Olympic symbol?', answers: ['5', '4', '6', '7'], correctIndex: 0 },
    // General Knowledge
    { id: 'E24', category: 'General', question: 'How many colors are in a rainbow?', answers: ['7', '6', '5', '8'], correctIndex: 0 },
    { id: 'E25', category: 'General', question: 'What planet is known as the "Red Planet"?', answers: ['Mars', 'Venus', 'Jupiter', 'Saturn'], correctIndex: 0 },
    { id: 'E26', category: 'General', question: 'How many continents are there on Earth?', answers: ['7', '6', '5', '8'], correctIndex: 0 },
    { id: 'E27', category: 'General', question: 'What holiday is celebrated on October 31st?', answers: ['Halloween', 'Thanksgiving', 'Easter', 'Christmas'], correctIndex: 0 },
    { id: 'E28', category: 'General', question: 'What is the largest ocean on Earth?', answers: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], correctIndex: 0 },
    // Music
    { id: 'E29', category: 'Music', question: 'Which Disney song includes the lyrics "Let it go, let it go"?', answers: ['Let It Go', 'Into the Unknown', 'Show Yourself', 'Frozen Heart'], correctIndex: 0 },
    { id: 'E30', category: 'Music', question: 'What instrument does a drummer play?', answers: ['Drums', 'Guitar', 'Piano', 'Violin'], correctIndex: 0 }
];

// ==================== MEDIUM (Ages 12-18) ====================
export const TRIVIA_MEDIUM = [
    // Movies
    { id: 'M1', category: 'Movies', question: 'Which superhero is known as the "Dark Knight"?', answers: ['Batman', 'Superman', 'Spider-Man', 'Iron Man'], correctIndex: 0 },
    { id: 'M2', category: 'Movies', question: 'In "Harry Potter", what sport do wizards play on broomsticks?', answers: ['Quidditch', 'Broomball', 'Wizardball', 'Flyball'], correctIndex: 0 },
    { id: 'M3', category: 'Movies', question: 'What is the name of the kingdom in "Tangled"?', answers: ['Corona', 'Arendelle', 'Atlantis', 'Agrabah'], correctIndex: 0 },
    { id: 'M4', category: 'Movies', question: 'In "Spider-Man", what is Peter Parker\'s job at the Daily Bugle?', answers: ['Photographer', 'Reporter', 'Editor', 'Janitor'], correctIndex: 0 },
    { id: 'M5', category: 'Movies', question: 'What superhero wears a red and gold suit of armor?', answers: ['Iron Man', 'Thor', 'Captain America', 'Hulk'], correctIndex: 0 },
    { id: 'M6', category: 'Movies', question: 'In "Monsters, Inc.", what do monsters collect from children?', answers: ['Screams', 'Laughs', 'Tears', 'Dreams'], correctIndex: 0 },
    { id: 'M7', category: 'Movies', question: 'What is Baby Yoda\'s real name in "The Mandalorian"?', answers: ['Grogu', 'Din', 'Mando', 'Yoda'], correctIndex: 0 },
    { id: 'M8', category: 'Movies', question: 'In "The Incredibles", what is the family\'s last name?', answers: ['Parr', 'Smith', 'Jones', 'Super'], correctIndex: 0 },
    // TV Shows
    { id: 'M9', category: 'TV Shows', question: 'In "Stranger Things", what is Eleven\'s favorite food?', answers: ['Eggo waffles', 'Pizza', 'Ice cream', 'Burgers'], correctIndex: 0 },
    { id: 'M10', category: 'TV Shows', question: 'What Netflix show features a game called "Red Light, Green Light"?', answers: ['Squid Game', 'Money Heist', 'All of Us Are Dead', 'Sweet Home'], correctIndex: 0 },
    { id: 'M11', category: 'TV Shows', question: 'In "Gravity Falls", what are the names of the twin siblings?', answers: ['Dipper and Mabel', 'Finn and Jake', 'Phineas and Ferb', 'Tom and Jerry'], correctIndex: 0 },
    { id: 'M12', category: 'TV Shows', question: 'In "Avatar: The Last Airbender", what element does Aang master first?', answers: ['Air', 'Water', 'Earth', 'Fire'], correctIndex: 0 },
    // Music
    { id: 'M13', category: 'Music', question: 'Which singer is known as the "Queen of Pop"?', answers: ['Madonna', 'Beyonce', 'Lady Gaga', 'Taylor Swift'], correctIndex: 0 },
    { id: 'M14', category: 'Music', question: 'What band sang "We Will Rock You"?', answers: ['Queen', 'The Beatles', 'AC/DC', 'Led Zeppelin'], correctIndex: 0 },
    { id: 'M15', category: 'Music', question: 'Which K-pop group performed "Dynamite"?', answers: ['BTS', 'BLACKPINK', 'EXO', 'TWICE'], correctIndex: 0 },
    { id: 'M16', category: 'Music', question: 'Which singer is known for the song "Bad Guy"?', answers: ['Billie Eilish', 'Ariana Grande', 'Dua Lipa', 'Olivia Rodrigo'], correctIndex: 0 },
    { id: 'M17', category: 'Music', question: 'Which rapper is known as "Slim Shady"?', answers: ['Eminem', 'Drake', 'Kanye West', 'Snoop Dogg'], correctIndex: 0 },
    // Video Games
    { id: 'M18', category: 'Video Games', question: 'In Minecraft, what material is needed to make a pickaxe handle?', answers: ['Sticks', 'Wood planks', 'Cobblestone', 'Iron'], correctIndex: 0 },
    { id: 'M19', category: 'Video Games', question: 'What is the main goal in "Among Us"?', answers: ['Complete tasks or find the impostor', 'Build a base', 'Win races', 'Collect coins'], correctIndex: 0 },
    { id: 'M20', category: 'Video Games', question: 'In Fortnite, what is the name of the shrinking danger zone?', answers: ['The Storm', 'The Circle', 'The Zone', 'The Ring'], correctIndex: 0 },
    { id: 'M21', category: 'Video Games', question: 'In "The Legend of Zelda", what is the hero\'s name?', answers: ['Link', 'Zelda', 'Ganon', 'Epona'], correctIndex: 0 },
    { id: 'M22', category: 'Video Games', question: 'In Roblox, what is the in-game currency called?', answers: ['Robux', 'Coins', 'Gems', 'Bucks'], correctIndex: 0 },
    // Science & Nature
    { id: 'M23', category: 'Science', question: 'What gas do plants breathe in?', answers: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correctIndex: 0 },
    { id: 'M24', category: 'Science', question: 'What is the hardest natural substance on Earth?', answers: ['Diamond', 'Gold', 'Iron', 'Steel'], correctIndex: 0 },
    { id: 'M25', category: 'Science', question: 'What is the largest planet in our solar system?', answers: ['Jupiter', 'Saturn', 'Neptune', 'Uranus'], correctIndex: 0 },
    // Sports
    { id: 'M26', category: 'Sports', question: 'What country won the 2022 FIFA World Cup?', answers: ['Argentina', 'France', 'Brazil', 'Germany'], correctIndex: 0 },
    { id: 'M27', category: 'Sports', question: 'In American football, how many points is a touchdown worth?', answers: ['6', '7', '3', '5'], correctIndex: 0 },
    { id: 'M28', category: 'Sports', question: 'What color belt is highest in karate?', answers: ['Black', 'White', 'Red', 'Brown'], correctIndex: 0 },
    // General
    { id: 'M29', category: 'General', question: 'What is the capital of the United States?', answers: ['Washington D.C.', 'New York City', 'Los Angeles', 'Chicago'], correctIndex: 0 },
    { id: 'M30', category: 'General', question: 'What famous tower is located in Paris?', answers: ['Eiffel Tower', 'Leaning Tower', 'Big Ben', 'Empire State Building'], correctIndex: 0 }
];

// ==================== HARD (Ages 18+) ====================
export const TRIVIA_HARD = [
    // History
    { id: 'H1', category: 'History', question: 'In what year did World War II end?', answers: ['1945', '1944', '1946', '1943'], correctIndex: 0 },
    { id: 'H2', category: 'History', question: 'Who was the first President of the United States?', answers: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'], correctIndex: 0 },
    { id: 'H3', category: 'History', question: 'The Great Wall of China was built primarily to defend against which group?', answers: ['Mongol invaders', 'Japanese armies', 'Korean forces', 'Indian traders'], correctIndex: 0 },
    { id: 'H4', category: 'History', question: 'What ancient civilization built the pyramids of Giza?', answers: ['Egyptians', 'Romans', 'Greeks', 'Mayans'], correctIndex: 0 },
    { id: 'H5', category: 'History', question: 'In what year did the Titanic sink?', answers: ['1912', '1910', '1914', '1905'], correctIndex: 0 },
    // Science
    { id: 'H6', category: 'Science', question: 'What is the chemical symbol for gold?', answers: ['Au', 'Ag', 'Fe', 'Cu'], correctIndex: 0 },
    { id: 'H7', category: 'Science', question: 'What is the speed of light in km per second (approximately)?', answers: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'], correctIndex: 0 },
    { id: 'H8', category: 'Science', question: 'What organ in the human body produces insulin?', answers: ['Pancreas', 'Liver', 'Kidney', 'Heart'], correctIndex: 0 },
    { id: 'H9', category: 'Science', question: 'What is the smallest unit of matter?', answers: ['Atom', 'Molecule', 'Cell', 'Electron'], correctIndex: 0 },
    { id: 'H10', category: 'Science', question: 'What planet has the most moons in our solar system?', answers: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correctIndex: 0 },
    // Geography
    { id: 'H11', category: 'Geography', question: 'What is the longest river in the world?', answers: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], correctIndex: 0 },
    { id: 'H12', category: 'Geography', question: 'What is the capital of Australia?', answers: ['Canberra', 'Sydney', 'Melbourne', 'Brisbane'], correctIndex: 0 },
    { id: 'H13', category: 'Geography', question: 'Which country has the most time zones?', answers: ['France', 'Russia', 'USA', 'China'], correctIndex: 0 },
    { id: 'H14', category: 'Geography', question: 'What is the smallest country in the world?', answers: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'], correctIndex: 0 },
    { id: 'H15', category: 'Geography', question: 'On which continent is the Sahara Desert located?', answers: ['Africa', 'Asia', 'Australia', 'South America'], correctIndex: 0 },
    // Literature
    { id: 'H16', category: 'Literature', question: 'Who wrote "Romeo and Juliet"?', answers: ['William Shakespeare', 'Charles Dickens', 'Jane Austen', 'Mark Twain'], correctIndex: 0 },
    { id: 'H17', category: 'Literature', question: 'In "1984" by George Orwell, what is the name of the totalitarian leader?', answers: ['Big Brother', 'The Controller', 'The Chairman', 'The Director'], correctIndex: 0 },
    { id: 'H18', category: 'Literature', question: 'What is the name of the detective created by Arthur Conan Doyle?', answers: ['Sherlock Holmes', 'Hercule Poirot', 'Miss Marple', 'Philip Marlowe'], correctIndex: 0 },
    // Art & Culture
    { id: 'H19', category: 'Art', question: 'Who painted the Mona Lisa?', answers: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'], correctIndex: 0 },
    { id: 'H20', category: 'Art', question: 'In which city is the Louvre Museum located?', answers: ['Paris', 'London', 'New York', 'Rome'], correctIndex: 0 },
    // Movies & TV
    { id: 'H21', category: 'Movies', question: 'What film won the Academy Award for Best Picture in 2020?', answers: ['Parasite', 'Joker', '1917', 'Once Upon a Time in Hollywood'], correctIndex: 0 },
    { id: 'H22', category: 'Movies', question: 'In "The Matrix", what color pill does Neo take?', answers: ['Red', 'Blue', 'Green', 'Yellow'], correctIndex: 0 },
    { id: 'H23', category: 'TV Shows', question: 'What is the name of the coffee shop in "Friends"?', answers: ['Central Perk', 'The Coffee House', 'Cafe Friends', 'Manhattan Brew'], correctIndex: 0 },
    // Music
    { id: 'H24', category: 'Music', question: 'What was the name of The Beatles\' first album?', answers: ['Please Please Me', 'Abbey Road', 'Rubber Soul', 'Help!'], correctIndex: 0 },
    { id: 'H25', category: 'Music', question: 'What instrument does Yo-Yo Ma famously play?', answers: ['Cello', 'Violin', 'Piano', 'Flute'], correctIndex: 0 },
    // Sports
    { id: 'H26', category: 'Sports', question: 'In what year were the first modern Olympic Games held?', answers: ['1896', '1900', '1892', '1888'], correctIndex: 0 },
    { id: 'H27', category: 'Sports', question: 'What is the diameter of a basketball hoop in inches?', answers: ['18 inches', '16 inches', '20 inches', '22 inches'], correctIndex: 0 },
    // Technology
    { id: 'H28', category: 'Technology', question: 'What year was the first iPhone released?', answers: ['2007', '2005', '2008', '2010'], correctIndex: 0 },
    { id: 'H29', category: 'Technology', question: 'What does HTTP stand for?', answers: ['HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'Hyper Transfer Text Protocol', 'Home Tool Transfer Protocol'], correctIndex: 0 },
    { id: 'H30', category: 'Technology', question: 'Who co-founded Microsoft with Bill Gates?', answers: ['Paul Allen', 'Steve Jobs', 'Steve Wozniak', 'Mark Zuckerberg'], correctIndex: 0 }
];

// ==================== MASTER (PhD Level) ====================
export const TRIVIA_MASTER = [
    // Advanced Science
    { id: 'MA1', category: 'Science', question: 'What is the Schwarzschild radius?', answers: ['The radius of a black hole\'s event horizon', 'The radius of a neutron star', 'The radius of Earth\'s core', 'The radius of the Sun'], correctIndex: 0 },
    { id: 'MA2', category: 'Science', question: 'What particle is responsible for mass according to the Standard Model?', answers: ['Higgs boson', 'Photon', 'Gluon', 'W boson'], correctIndex: 0 },
    { id: 'MA3', category: 'Science', question: 'What is the approximate age of the universe in billions of years?', answers: ['13.8 billion', '10.5 billion', '15.2 billion', '18.0 billion'], correctIndex: 0 },
    { id: 'MA4', category: 'Science', question: 'What is the half-life of Carbon-14?', answers: ['5,730 years', '10,000 years', '1,500 years', '50,000 years'], correctIndex: 0 },
    { id: 'MA5', category: 'Science', question: 'What enzyme unwinds DNA during replication?', answers: ['Helicase', 'Polymerase', 'Ligase', 'Primase'], correctIndex: 0 },
    // Advanced History
    { id: 'MA6', category: 'History', question: 'The Treaty of Westphalia ended which conflict?', answers: ['Thirty Years\' War', 'Hundred Years\' War', 'Seven Years\' War', 'Napoleonic Wars'], correctIndex: 0 },
    { id: 'MA7', category: 'History', question: 'What year was the Magna Carta signed?', answers: ['1215', '1066', '1485', '1300'], correctIndex: 0 },
    { id: 'MA8', category: 'History', question: 'Which empire was ruled by Suleiman the Magnificent?', answers: ['Ottoman Empire', 'Byzantine Empire', 'Mongol Empire', 'Persian Empire'], correctIndex: 0 },
    { id: 'MA9', category: 'History', question: 'What was the primary cause of the Peloponnesian War?', answers: ['Rivalry between Athens and Sparta', 'Persian invasion', 'Trade disputes with Egypt', 'Religious differences'], correctIndex: 0 },
    { id: 'MA10', category: 'History', question: 'Who was the first Holy Roman Emperor?', answers: ['Charlemagne', 'Otto I', 'Frederick Barbarossa', 'Charles V'], correctIndex: 0 },
    // Philosophy & Literature
    { id: 'MA11', category: 'Philosophy', question: 'Who wrote "Thus Spoke Zarathustra"?', answers: ['Friedrich Nietzsche', 'Immanuel Kant', 'Georg Hegel', 'Arthur Schopenhauer'], correctIndex: 0 },
    { id: 'MA12', category: 'Philosophy', question: 'What is the name of Plato\'s allegory about prisoners in a cave?', answers: ['Allegory of the Cave', 'The Republic Parable', 'Shadow Theory', 'Prison of Ignorance'], correctIndex: 0 },
    { id: 'MA13', category: 'Literature', question: 'Who wrote "In Search of Lost Time"?', answers: ['Marcel Proust', 'James Joyce', 'Virginia Woolf', 'Franz Kafka'], correctIndex: 0 },
    { id: 'MA14', category: 'Literature', question: 'What is considered the longest novel ever written by word count?', answers: ['In Search of Lost Time', 'War and Peace', 'Les Miserables', 'Don Quixote'], correctIndex: 0 },
    // Music & Art
    { id: 'MA15', category: 'Music', question: 'How many symphonies did Ludwig van Beethoven compose?', answers: ['9', '7', '10', '12'], correctIndex: 0 },
    { id: 'MA16', category: 'Music', question: 'What musical term describes a gradual increase in volume?', answers: ['Crescendo', 'Decrescendo', 'Forte', 'Piano'], correctIndex: 0 },
    { id: 'MA17', category: 'Art', question: 'What art movement was Salvador Dali associated with?', answers: ['Surrealism', 'Impressionism', 'Cubism', 'Expressionism'], correctIndex: 0 },
    { id: 'MA18', category: 'Art', question: 'In what year was Picasso\'s "Guernica" painted?', answers: ['1937', '1925', '1942', '1950'], correctIndex: 0 },
    // Geography & Politics
    { id: 'MA19', category: 'Geography', question: 'What is the deepest point in the ocean called?', answers: ['Challenger Deep', 'Mariana Trench', 'Puerto Rico Trench', 'Java Trench'], correctIndex: 0 },
    { id: 'MA20', category: 'Politics', question: 'What is the oldest written national constitution still in use?', answers: ['United States Constitution', 'Magna Carta', 'French Constitution', 'Swiss Constitution'], correctIndex: 0 },
    // Economics
    { id: 'MA21', category: 'Economics', question: 'What does GDP stand for?', answers: ['Gross Domestic Product', 'General Domestic Production', 'Gross Development Product', 'General Development Progress'], correctIndex: 0 },
    { id: 'MA22', category: 'Economics', question: 'Who wrote "The Wealth of Nations"?', answers: ['Adam Smith', 'John Maynard Keynes', 'Karl Marx', 'Milton Friedman'], correctIndex: 0 },
    // Language & Linguistics
    { id: 'MA23', category: 'Language', question: 'What is the most spoken language in the world by native speakers?', answers: ['Mandarin Chinese', 'English', 'Spanish', 'Hindi'], correctIndex: 0 },
    { id: 'MA24', category: 'Language', question: 'What is the study of word origins called?', answers: ['Etymology', 'Phonology', 'Morphology', 'Semantics'], correctIndex: 0 },
    // Mathematics
    { id: 'MA25', category: 'Mathematics', question: 'What is Euler\'s number (e) approximately equal to?', answers: ['2.71828', '3.14159', '1.61803', '2.30258'], correctIndex: 0 },
    { id: 'MA26', category: 'Mathematics', question: 'What is the Riemann Hypothesis concerned with?', answers: ['Distribution of prime numbers', 'Fermat\'s theorem', 'Goldbach conjecture', 'Twin primes'], correctIndex: 0 },
    // Medicine
    { id: 'MA27', category: 'Medicine', question: 'What is the oath traditionally taken by physicians?', answers: ['Hippocratic Oath', 'Galenic Oath', 'Medical Pledge', 'Doctors\' Vow'], correctIndex: 0 },
    { id: 'MA28', category: 'Medicine', question: 'What blood type is considered the universal donor?', answers: ['O negative', 'AB positive', 'A positive', 'B negative'], correctIndex: 0 },
    // Space
    { id: 'MA29', category: 'Space', question: 'What is the largest known structure in the universe?', answers: ['Hercules-Corona Borealis Great Wall', 'Sloan Great Wall', 'CfA2 Great Wall', 'Laniakea Supercluster'], correctIndex: 0 },
    { id: 'MA30', category: 'Space', question: 'What is the Fermi Paradox primarily concerned with?', answers: ['The absence of extraterrestrial civilizations', 'The expansion of the universe', 'The nature of dark matter', 'The speed of light limit'], correctIndex: 0 }
];

// Legacy flat list for backwards compatibility
export const TRIVIA_QUESTIONS = [...TRIVIA_EASY, ...TRIVIA_MEDIUM];

// All questions by difficulty
export const ALL_TRIVIA_QUESTIONS = {
    'super-easy': TRIVIA_VERY_EASY,  // Use very-easy questions for super-easy for now
    'very-easy': TRIVIA_VERY_EASY,
    'easy': TRIVIA_EASY,
    'medium': TRIVIA_MEDIUM,
    'hard': TRIVIA_HARD,
    'very-hard': TRIVIA_HARD,  // Use hard questions for very-hard for now
    'genius': TRIVIA_MASTER
};

// Category icons for display
export const CATEGORY_ICONS = {
    'Movies': '🎬',
    'Music': '🎵',
    'TV Shows': '📺',
    'Video Games': '🎮',
    'Sports': '⚽',
    'General': '🧠',
    'Colors': '🎨',
    'Shapes': '🔷',
    'Animals': '🐾',
    'Body': '👤',
    'Numbers': '🔢',
    'Food': '🍕',
    'Nature': '🌳',
    'Disney': '🏰',
    'History': '📜',
    'Science': '🔬',
    'Geography': '🌍',
    'Literature': '📚',
    'Art': '🖼️',
    'Technology': '💻',
    'Philosophy': '💭',
    'Economics': '💰',
    'Language': '🗣️',
    'Mathematics': '📐',
    'Medicine': '⚕️',
    'Space': '🚀',
    'Politics': '🏛️'
};

/**
 * Get random questions from a specific difficulty level
 * @param {string} difficulty - Difficulty level ID
 * @param {number} count - Number of questions to return
 * @param {array} usedIds - Question IDs already used (to avoid repeats)
 * @returns {array} Array of question objects
 */
export function getRandomQuestions(difficulty, count, usedIds = []) {
    const questions = ALL_TRIVIA_QUESTIONS[difficulty] || TRIVIA_MEDIUM;
    const available = questions.filter(q => !usedIds.includes(q.id));
    const pool = available.length >= count ? available : questions;

    // Shuffle and take first 'count' questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Get difficulty order value (for sorting)
 * @param {string} difficulty - Difficulty ID
 * @returns {number} Order value (0-4)
 */
export function getDifficultyOrderValue(difficulty) {
    const order = { 'super-easy': 0, 'very-easy': 1, 'easy': 2, 'medium': 3, 'hard': 4, 'very-hard': 5, 'genius': 6 };
    return order[difficulty] ?? 3;
}
