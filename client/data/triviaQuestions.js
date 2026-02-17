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
    { id: 'VE30', category: 'Disney', question: 'What princess has very long golden hair?', answers: ['Rapunzel', 'Cinderella', 'Ariel', 'Elsa'], correctIndex: 0 },
    // More Animals
    { id: 'VE31', category: 'Animals', question: 'What animal has black and white stripes?', answers: ['Zebra', 'Lion', 'Elephant', 'Bear'], correctIndex: 0 },
    { id: 'VE32', category: 'Animals', question: 'What animal says "quack"?', answers: ['Duck', 'Chicken', 'Cow', 'Dog'], correctIndex: 0 },
    { id: 'VE33', category: 'Animals', question: 'What animal has a shell on its back?', answers: ['Turtle', 'Dog', 'Cat', 'Bird'], correctIndex: 0 },
    { id: 'VE34', category: 'Animals', question: 'What animal is orange and has black stripes?', answers: ['Tiger', 'Lion', 'Bear', 'Wolf'], correctIndex: 0 },
    { id: 'VE35', category: 'Animals', question: 'What animal lives in a hive and makes buzzing sounds?', answers: ['Bee', 'Bird', 'Butterfly', 'Ant'], correctIndex: 0 },
    // More Colors & Shapes
    { id: 'VE36', category: 'Colors', question: 'What color is a strawberry?', answers: ['Red', 'Blue', 'Yellow', 'Green'], correctIndex: 0 },
    { id: 'VE37', category: 'Colors', question: 'What color is chocolate?', answers: ['Brown', 'Black', 'White', 'Red'], correctIndex: 0 },
    { id: 'VE38', category: 'Shapes', question: 'What shape is a wheel?', answers: ['Circle', 'Square', 'Triangle', 'Star'], correctIndex: 0 },
    { id: 'VE39', category: 'Shapes', question: 'How many sides does a square have?', answers: ['4', '3', '5', '6'], correctIndex: 0 },
    // More Food
    { id: 'VE40', category: 'Food', question: 'What do cows give us to drink?', answers: ['Milk', 'Juice', 'Water', 'Soda'], correctIndex: 0 },
    { id: 'VE41', category: 'Food', question: 'What is orange and crunchy that rabbits like?', answers: ['Carrot', 'Apple', 'Banana', 'Grape'], correctIndex: 0 },
    { id: 'VE42', category: 'Food', question: 'What frozen treat comes in a cone?', answers: ['Ice cream', 'Pizza', 'Cake', 'Cookies'], correctIndex: 0 },
    // More Nature
    { id: 'VE43', category: 'Nature', question: 'What comes out at night and shines in the sky?', answers: ['Stars', 'Sun', 'Clouds', 'Rain'], correctIndex: 0 },
    { id: 'VE44', category: 'Nature', question: 'What do flowers need to grow?', answers: ['Water', 'Ice', 'Sand', 'Rocks'], correctIndex: 0 },
    { id: 'VE45', category: 'Nature', question: 'What season is cold with snow?', answers: ['Winter', 'Summer', 'Spring', 'Fall'], correctIndex: 0 },
    // More Disney
    { id: 'VE46', category: 'Disney', question: 'What color is Elsa\'s dress in Frozen?', answers: ['Blue', 'Red', 'Yellow', 'Green'], correctIndex: 0 },
    { id: 'VE47', category: 'Disney', question: 'What is the name of Simba\'s dad in The Lion King?', answers: ['Mufasa', 'Scar', 'Timon', 'Pumbaa'], correctIndex: 0 },
    { id: 'VE48', category: 'Disney', question: 'What princess has a magic carpet?', answers: ['Jasmine', 'Cinderella', 'Ariel', 'Belle'], correctIndex: 0 },
    // Body Parts
    { id: 'VE49', category: 'Body', question: 'What do you use to smell?', answers: ['Nose', 'Eyes', 'Ears', 'Mouth'], correctIndex: 0 },
    { id: 'VE50', category: 'Body', question: 'How many legs do people have?', answers: ['2', '4', '6', '8'], correctIndex: 0 }
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
    { id: 'E30', category: 'Music', question: 'What instrument does a drummer play?', answers: ['Drums', 'Guitar', 'Piano', 'Violin'], correctIndex: 0 },
    // More Movies
    { id: 'E31', category: 'Movies', question: 'In "Shrek", what kind of creature is Shrek?', answers: ['Ogre', 'Troll', 'Giant', 'Goblin'], correctIndex: 0 },
    { id: 'E32', category: 'Movies', question: 'What is the name of the blue fish with memory problems in "Finding Nemo"?', answers: ['Dory', 'Nemo', 'Marlin', 'Gill'], correctIndex: 0 },
    { id: 'E33', category: 'Movies', question: 'In "Moana", what does Moana need to return to Te Fiti?', answers: ['Her heart', 'A necklace', 'A crown', 'A pearl'], correctIndex: 0 },
    { id: 'E34', category: 'Movies', question: 'What is the name of the robot in "Wall-E"?', answers: ['Wall-E', 'Eva', 'Auto', 'M-O'], correctIndex: 0 },
    // More TV Shows
    { id: 'E35', category: 'TV Shows', question: 'In "Dora the Explorer", what is the name of Dora\'s monkey friend?', answers: ['Boots', 'Diego', 'Swiper', 'Backpack'], correctIndex: 0 },
    { id: 'E36', category: 'TV Shows', question: 'What are the names of the Powerpuff Girls?', answers: ['Blossom, Bubbles, Buttercup', 'Rose, Violet, Daisy', 'Red, Blue, Green', 'Star, Moon, Sun'], correctIndex: 0 },
    { id: 'E37', category: 'TV Shows', question: 'In "Teenage Mutant Ninja Turtles", what is their favorite food?', answers: ['Pizza', 'Burgers', 'Tacos', 'Hot dogs'], correctIndex: 0 },
    { id: 'E38', category: 'TV Shows', question: 'What kind of animal is Arthur from the TV show?', answers: ['Aardvark', 'Rabbit', 'Mouse', 'Bear'], correctIndex: 0 },
    // More Video Games
    { id: 'E39', category: 'Video Games', question: 'What do you collect in "Pac-Man"?', answers: ['Dots', 'Coins', 'Stars', 'Rings'], correctIndex: 0 },
    { id: 'E40', category: 'Video Games', question: 'In "Animal Crossing", who runs the island at the beginning?', answers: ['Tom Nook', 'Isabelle', 'K.K. Slider', 'Blathers'], correctIndex: 0 },
    { id: 'E41', category: 'Video Games', question: 'What color is Kirby?', answers: ['Pink', 'Blue', 'Green', 'Yellow'], correctIndex: 0 },
    { id: 'E42', category: 'Video Games', question: 'In "Super Mario", what does Mario collect to get bigger?', answers: ['Mushrooms', 'Stars', 'Coins', 'Flowers'], correctIndex: 0 },
    // Science & Nature
    { id: 'E43', category: 'Science', question: 'What planet do we live on?', answers: ['Earth', 'Mars', 'Venus', 'Jupiter'], correctIndex: 0 },
    { id: 'E44', category: 'Science', question: 'What is the closest star to Earth?', answers: ['The Sun', 'Alpha Centauri', 'Sirius', 'Polaris'], correctIndex: 0 },
    { id: 'E45', category: 'Nature', question: 'What do caterpillars turn into?', answers: ['Butterflies', 'Birds', 'Bees', 'Beetles'], correctIndex: 0 },
    { id: 'E46', category: 'Nature', question: 'How many seasons are there in a year?', answers: ['4', '3', '5', '2'], correctIndex: 0 },
    { id: 'E47', category: 'Animals', question: 'What is a baby dog called?', answers: ['Puppy', 'Kitten', 'Cub', 'Foal'], correctIndex: 0 },
    { id: 'E48', category: 'Animals', question: 'What is a group of lions called?', answers: ['Pride', 'Pack', 'Herd', 'Flock'], correctIndex: 0 },
    // History for kids
    { id: 'E49', category: 'History', question: 'What animal did cowboys ride?', answers: ['Horses', 'Camels', 'Elephants', 'Donkeys'], correctIndex: 0 },
    { id: 'E50', category: 'History', question: 'What did knights wear for protection?', answers: ['Armor', 'Cloaks', 'Robes', 'Leather'], correctIndex: 0 },
    // Geography for kids
    { id: 'E51', category: 'Geography', question: 'What country is home to kangaroos?', answers: ['Australia', 'America', 'Africa', 'Antarctica'], correctIndex: 0 },
    { id: 'E52', category: 'Geography', question: 'What is the largest country in the world?', answers: ['Russia', 'China', 'USA', 'Canada'], correctIndex: 0 },
    // More General
    { id: 'E53', category: 'General', question: 'How many days are in a week?', answers: ['7', '5', '6', '8'], correctIndex: 0 },
    { id: 'E54', category: 'General', question: 'How many months are in a year?', answers: ['12', '10', '11', '14'], correctIndex: 0 },
    { id: 'E55', category: 'General', question: 'What holiday celebrates with fireworks on July 4th in America?', answers: ['Independence Day', 'Memorial Day', 'Labor Day', 'Veterans Day'], correctIndex: 0 },
    // More Sports
    { id: 'E56', category: 'Sports', question: 'In which sport do you hit a shuttlecock?', answers: ['Badminton', 'Tennis', 'Volleyball', 'Squash'], correctIndex: 0 },
    { id: 'E57', category: 'Sports', question: 'What sport uses a puck?', answers: ['Hockey', 'Soccer', 'Baseball', 'Golf'], correctIndex: 0 },
    { id: 'E58', category: 'Sports', question: 'How many bases are there in baseball?', answers: ['4', '3', '5', '6'], correctIndex: 0 },
    // More Music
    { id: 'E59', category: 'Music', question: 'How many strings does a standard guitar have?', answers: ['6', '4', '8', '5'], correctIndex: 0 },
    { id: 'E60', category: 'Music', question: 'What instrument has black and white keys?', answers: ['Piano', 'Guitar', 'Flute', 'Drums'], correctIndex: 0 }
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
    { id: 'M30', category: 'General', question: 'What famous tower is located in Paris?', answers: ['Eiffel Tower', 'Leaning Tower', 'Big Ben', 'Empire State Building'], correctIndex: 0 },
    // More Movies
    { id: 'M31', category: 'Movies', question: 'In "Jurassic Park", what type of dinosaur is the main threat?', answers: ['T-Rex', 'Velociraptor', 'Triceratops', 'Brachiosaurus'], correctIndex: 0 },
    { id: 'M32', category: 'Movies', question: 'What is the name of Thor\'s hammer?', answers: ['Mjolnir', 'Stormbreaker', 'Gungnir', 'Hofund'], correctIndex: 0 },
    { id: 'M33', category: 'Movies', question: 'In "Black Panther", what is the fictional African nation called?', answers: ['Wakanda', 'Zamunda', 'Sokovia', 'Genosha'], correctIndex: 0 },
    { id: 'M34', category: 'Movies', question: 'What does E.T. stand for in the movie title?', answers: ['Extra-Terrestrial', 'Earth Traveler', 'Eternal Traveler', 'Electric Telephone'], correctIndex: 0 },
    // More TV Shows
    { id: 'M35', category: 'TV Shows', question: 'In "The Office" (US), what is the name of the paper company?', answers: ['Dunder Mifflin', 'Paper Inc', 'Scranton Paper', 'Michael Scott Paper'], correctIndex: 0 },
    { id: 'M36', category: 'TV Shows', question: 'What is the name of the dragon queen in "Game of Thrones"?', answers: ['Daenerys Targaryen', 'Cersei Lannister', 'Sansa Stark', 'Arya Stark'], correctIndex: 0 },
    { id: 'M37', category: 'TV Shows', question: 'In "The Simpsons", what instrument does Lisa play?', answers: ['Saxophone', 'Trumpet', 'Piano', 'Violin'], correctIndex: 0 },
    { id: 'M38', category: 'TV Shows', question: 'What animated show features a scientist and his grandson going on adventures?', answers: ['Rick and Morty', 'Family Guy', 'South Park', 'Futurama'], correctIndex: 0 },
    // More Music
    { id: 'M39', category: 'Music', question: 'What artist is known as "The King of Pop"?', answers: ['Michael Jackson', 'Elvis Presley', 'Prince', 'David Bowie'], correctIndex: 0 },
    { id: 'M40', category: 'Music', question: 'Which band performed "Bohemian Rhapsody"?', answers: ['Queen', 'The Beatles', 'Led Zeppelin', 'Pink Floyd'], correctIndex: 0 },
    { id: 'M41', category: 'Music', question: 'What singer is known for the album "1989"?', answers: ['Taylor Swift', 'Adele', 'Beyonce', 'Rihanna'], correctIndex: 0 },
    { id: 'M42', category: 'Music', question: 'What instrument has 88 keys?', answers: ['Piano', 'Organ', 'Accordion', 'Harpsichord'], correctIndex: 0 },
    // More Video Games
    { id: 'M43', category: 'Video Games', question: 'In "Call of Duty", what does the abbreviation "COD" stand for?', answers: ['Call of Duty', 'Combat Operations Division', 'Commandos On Duty', 'Combat Online Defense'], correctIndex: 0 },
    { id: 'M44', category: 'Video Games', question: 'What video game features a battle royale on an island with 100 players?', answers: ['Fortnite', 'Minecraft', 'Call of Duty', 'Apex Legends'], correctIndex: 0 },
    { id: 'M45', category: 'Video Games', question: 'In "GTA", what does GTA stand for?', answers: ['Grand Theft Auto', 'Great Thieves Association', 'Game Time Attack', 'Global Transport Authority'], correctIndex: 0 },
    { id: 'M46', category: 'Video Games', question: 'What Pokemon can evolve into three different forms: Vaporeon, Jolteon, or Flareon?', answers: ['Eevee', 'Pikachu', 'Charmander', 'Bulbasaur'], correctIndex: 0 },
    // Science & Nature
    { id: 'M47', category: 'Science', question: 'What is H2O commonly known as?', answers: ['Water', 'Oxygen', 'Hydrogen', 'Salt'], correctIndex: 0 },
    { id: 'M48', category: 'Science', question: 'What planet is famous for its rings?', answers: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'], correctIndex: 0 },
    { id: 'M49', category: 'Science', question: 'What force keeps us on the ground?', answers: ['Gravity', 'Magnetism', 'Friction', 'Inertia'], correctIndex: 0 },
    { id: 'M50', category: 'Nature', question: 'What is the largest rainforest in the world?', answers: ['Amazon', 'Congo', 'Daintree', 'Tongass'], correctIndex: 0 },
    { id: 'M51', category: 'Animals', question: 'What is the only mammal that can truly fly?', answers: ['Bat', 'Flying squirrel', 'Sugar glider', 'Colugo'], correctIndex: 0 },
    { id: 'M52', category: 'Animals', question: 'What animal is known for changing its color to blend in?', answers: ['Chameleon', 'Gecko', 'Iguana', 'Snake'], correctIndex: 0 },
    // History
    { id: 'M53', category: 'History', question: 'What ship sank in 1912 on its maiden voyage?', answers: ['Titanic', 'Lusitania', 'Britannic', 'Olympic'], correctIndex: 0 },
    { id: 'M54', category: 'History', question: 'Who was the first person to walk on the moon?', answers: ['Neil Armstrong', 'Buzz Aldrin', 'John Glenn', 'Yuri Gagarin'], correctIndex: 0 },
    { id: 'M55', category: 'History', question: 'What ancient wonder was located in Egypt?', answers: ['Great Pyramid of Giza', 'Hanging Gardens', 'Colossus of Rhodes', 'Lighthouse of Alexandria'], correctIndex: 0 },
    // Geography
    { id: 'M56', category: 'Geography', question: 'What is the longest river in Africa?', answers: ['Nile', 'Congo', 'Niger', 'Zambezi'], correctIndex: 0 },
    { id: 'M57', category: 'Geography', question: 'What is the capital of Japan?', answers: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'], correctIndex: 0 },
    { id: 'M58', category: 'Geography', question: 'What mountain is the tallest in the world?', answers: ['Mount Everest', 'K2', 'Kangchenjunga', 'Makalu'], correctIndex: 0 },
    // More Sports
    { id: 'M59', category: 'Sports', question: 'In tennis, what is a score of zero called?', answers: ['Love', 'Nil', 'Zero', 'Duck'], correctIndex: 0 },
    { id: 'M60', category: 'Sports', question: 'What sport is played at Wimbledon?', answers: ['Tennis', 'Golf', 'Cricket', 'Soccer'], correctIndex: 0 }
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
    { id: 'H30', category: 'Technology', question: 'Who co-founded Microsoft with Bill Gates?', answers: ['Paul Allen', 'Steve Jobs', 'Steve Wozniak', 'Mark Zuckerberg'], correctIndex: 0 },
    // More History
    { id: 'H31', category: 'History', question: 'What event started World War I?', answers: ['Assassination of Archduke Franz Ferdinand', 'Invasion of Poland', 'Attack on Pearl Harbor', 'Sinking of the Lusitania'], correctIndex: 0 },
    { id: 'H32', category: 'History', question: 'Who was the British Prime Minister during most of World War II?', answers: ['Winston Churchill', 'Neville Chamberlain', 'Clement Attlee', 'Anthony Eden'], correctIndex: 0 },
    { id: 'H33', category: 'History', question: 'The French Revolution began in which year?', answers: ['1789', '1776', '1799', '1804'], correctIndex: 0 },
    { id: 'H34', category: 'History', question: 'Who discovered America in 1492?', answers: ['Christopher Columbus', 'Amerigo Vespucci', 'Leif Erikson', 'John Cabot'], correctIndex: 0 },
    { id: 'H35', category: 'History', question: 'What was the name of the first artificial satellite launched into space?', answers: ['Sputnik 1', 'Explorer 1', 'Vanguard 1', 'Luna 1'], correctIndex: 0 },
    // More Science
    { id: 'H36', category: 'Science', question: 'What is the most abundant gas in Earth\'s atmosphere?', answers: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon'], correctIndex: 0 },
    { id: 'H37', category: 'Science', question: 'What is the powerhouse of the cell?', answers: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'], correctIndex: 0 },
    { id: 'H38', category: 'Science', question: 'What element has the atomic number 1?', answers: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'], correctIndex: 0 },
    { id: 'H39', category: 'Science', question: 'What is the study of earthquakes called?', answers: ['Seismology', 'Geology', 'Volcanology', 'Tectonics'], correctIndex: 0 },
    { id: 'H40', category: 'Science', question: 'What vitamin is produced when human skin is exposed to sunlight?', answers: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin B12'], correctIndex: 0 },
    // More Geography
    { id: 'H41', category: 'Geography', question: 'What is the capital of Canada?', answers: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], correctIndex: 0 },
    { id: 'H42', category: 'Geography', question: 'Which desert is the largest hot desert in the world?', answers: ['Sahara', 'Arabian', 'Gobi', 'Kalahari'], correctIndex: 0 },
    { id: 'H43', category: 'Geography', question: 'What is the largest island in the world?', answers: ['Greenland', 'Madagascar', 'Borneo', 'New Guinea'], correctIndex: 0 },
    { id: 'H44', category: 'Geography', question: 'Through which city does the Prime Meridian pass?', answers: ['London', 'Paris', 'Berlin', 'Madrid'], correctIndex: 0 },
    { id: 'H45', category: 'Geography', question: 'What is the smallest continent by land area?', answers: ['Australia', 'Europe', 'Antarctica', 'South America'], correctIndex: 0 },
    // More Movies
    { id: 'H46', category: 'Movies', question: 'In "The Godfather", what is the family\'s last name?', answers: ['Corleone', 'Soprano', 'Barzini', 'Tattaglia'], correctIndex: 0 },
    { id: 'H47', category: 'Movies', question: 'What year was the original "Star Wars" film released?', answers: ['1977', '1979', '1975', '1980'], correctIndex: 0 },
    { id: 'H48', category: 'Movies', question: 'Who directed "Pulp Fiction"?', answers: ['Quentin Tarantino', 'Martin Scorsese', 'Steven Spielberg', 'Christopher Nolan'], correctIndex: 0 },
    { id: 'H49', category: 'Movies', question: 'In "Inception", what is used to determine if one is in a dream?', answers: ['A spinning top', 'A watch', 'A coin', 'A dice'], correctIndex: 0 },
    // More Music
    { id: 'H50', category: 'Music', question: 'What classical composer became deaf later in life?', answers: ['Beethoven', 'Mozart', 'Bach', 'Chopin'], correctIndex: 0 },
    { id: 'H51', category: 'Music', question: 'Which rock band had members named John, Paul, George, and Ringo?', answers: ['The Beatles', 'The Rolling Stones', 'Led Zeppelin', 'The Who'], correctIndex: 0 },
    { id: 'H52', category: 'Music', question: 'What is the highest female singing voice?', answers: ['Soprano', 'Alto', 'Mezzo-soprano', 'Contralto'], correctIndex: 0 },
    { id: 'H53', category: 'Music', question: 'Which artist released the album "Thriller"?', answers: ['Michael Jackson', 'Prince', 'Whitney Houston', 'Madonna'], correctIndex: 0 },
    // More Literature
    { id: 'H54', category: 'Literature', question: 'Who wrote "Pride and Prejudice"?', answers: ['Jane Austen', 'Charlotte Bronte', 'Emily Bronte', 'Mary Shelley'], correctIndex: 0 },
    { id: 'H55', category: 'Literature', question: 'What is the first book of the Bible?', answers: ['Genesis', 'Exodus', 'Matthew', 'Revelation'], correctIndex: 0 },
    { id: 'H56', category: 'Literature', question: 'Who wrote "The Great Gatsby"?', answers: ['F. Scott Fitzgerald', 'Ernest Hemingway', 'John Steinbeck', 'William Faulkner'], correctIndex: 0 },
    // More Sports
    { id: 'H57', category: 'Sports', question: 'How long is an Olympic swimming pool in meters?', answers: ['50 meters', '25 meters', '100 meters', '75 meters'], correctIndex: 0 },
    { id: 'H58', category: 'Sports', question: 'What country has won the most FIFA World Cup titles?', answers: ['Brazil', 'Germany', 'Italy', 'Argentina'], correctIndex: 0 },
    { id: 'H59', category: 'Sports', question: 'In golf, what is the term for one stroke under par?', answers: ['Birdie', 'Eagle', 'Bogey', 'Par'], correctIndex: 0 },
    { id: 'H60', category: 'Sports', question: 'What is the national sport of Japan?', answers: ['Sumo wrestling', 'Judo', 'Karate', 'Baseball'], correctIndex: 0 }
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
    { id: 'MA30', category: 'Space', question: 'What is the Fermi Paradox primarily concerned with?', answers: ['The absence of extraterrestrial civilizations', 'The expansion of the universe', 'The nature of dark matter', 'The speed of light limit'], correctIndex: 0 },
    // More Advanced Science
    { id: 'MA31', category: 'Science', question: 'What is the name of the effect where light bends around massive objects?', answers: ['Gravitational lensing', 'Doppler effect', 'Redshift', 'Parallax'], correctIndex: 0 },
    { id: 'MA32', category: 'Science', question: 'What subatomic particles make up a proton?', answers: ['Two up quarks and one down quark', 'Two down quarks and one up quark', 'Three up quarks', 'Three down quarks'], correctIndex: 0 },
    { id: 'MA33', category: 'Science', question: 'What is the name of the boundary around a black hole beyond which nothing can escape?', answers: ['Event horizon', 'Schwarzschild radius', 'Singularity', 'Photon sphere'], correctIndex: 0 },
    { id: 'MA34', category: 'Science', question: 'What is the most common element in the universe?', answers: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'], correctIndex: 0 },
    { id: 'MA35', category: 'Science', question: 'What is the Chandrasekhar limit?', answers: ['Maximum mass of a white dwarf star', 'Maximum mass of a neutron star', 'Minimum mass for nuclear fusion', 'Speed of light in a vacuum'], correctIndex: 0 },
    // More Advanced History
    { id: 'MA36', category: 'History', question: 'What was the capital of the Byzantine Empire?', answers: ['Constantinople', 'Rome', 'Athens', 'Alexandria'], correctIndex: 0 },
    { id: 'MA37', category: 'History', question: 'Who was the first female Prime Minister of the United Kingdom?', answers: ['Margaret Thatcher', 'Theresa May', 'Queen Victoria', 'Queen Elizabeth II'], correctIndex: 0 },
    { id: 'MA38', category: 'History', question: 'The Hundred Years\' War was fought between which two countries?', answers: ['England and France', 'England and Spain', 'France and Germany', 'Spain and Portugal'], correctIndex: 0 },
    { id: 'MA39', category: 'History', question: 'What ancient civilization created the first known writing system?', answers: ['Sumerians', 'Egyptians', 'Chinese', 'Greeks'], correctIndex: 0 },
    { id: 'MA40', category: 'History', question: 'Who was the last Tsar of Russia?', answers: ['Nicholas II', 'Alexander III', 'Peter the Great', 'Ivan the Terrible'], correctIndex: 0 },
    // More Philosophy
    { id: 'MA41', category: 'Philosophy', question: 'What philosophical concept did Descartes express with "Cogito, ergo sum"?', answers: ['I think, therefore I am', 'Knowledge is power', 'The truth will set you free', 'Man is the measure of all things'], correctIndex: 0 },
    { id: 'MA42', category: 'Philosophy', question: 'Who wrote "The Republic" and discussed the concept of philosopher kings?', answers: ['Plato', 'Aristotle', 'Socrates', 'Epicurus'], correctIndex: 0 },
    { id: 'MA43', category: 'Philosophy', question: 'What is the philosophical study of knowledge called?', answers: ['Epistemology', 'Ontology', 'Ethics', 'Aesthetics'], correctIndex: 0 },
    // More Art
    { id: 'MA44', category: 'Art', question: 'What famous painting by Edvard Munch depicts a figure with an agonized expression?', answers: ['The Scream', 'The Starry Night', 'The Persistence of Memory', 'Guernica'], correctIndex: 0 },
    { id: 'MA45', category: 'Art', question: 'What is the name of the art movement that Monet and Renoir were part of?', answers: ['Impressionism', 'Expressionism', 'Cubism', 'Romanticism'], correctIndex: 0 },
    { id: 'MA46', category: 'Art', question: 'Who painted the ceiling of the Sistine Chapel?', answers: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Botticelli'], correctIndex: 0 },
    // More Music
    { id: 'MA47', category: 'Music', question: 'What musical period came after the Baroque era?', answers: ['Classical', 'Romantic', 'Renaissance', 'Modern'], correctIndex: 0 },
    { id: 'MA48', category: 'Music', question: 'Which composer wrote "The Four Seasons"?', answers: ['Vivaldi', 'Bach', 'Handel', 'Mozart'], correctIndex: 0 },
    { id: 'MA49', category: 'Music', question: 'What is the Italian term for playing music very softly?', answers: ['Pianissimo', 'Fortissimo', 'Mezzo-forte', 'Sforzando'], correctIndex: 0 },
    // More Literature
    { id: 'MA50', category: 'Literature', question: 'Who wrote "One Hundred Years of Solitude"?', answers: ['Gabriel Garcia Marquez', 'Jorge Luis Borges', 'Pablo Neruda', 'Isabel Allende'], correctIndex: 0 },
    { id: 'MA51', category: 'Literature', question: 'What is the opening line of "Moby-Dick"?', answers: ['Call me Ishmael', 'It was the best of times', 'In the beginning', 'Last night I dreamt'], correctIndex: 0 },
    { id: 'MA52', category: 'Literature', question: 'Who wrote "Crime and Punishment"?', answers: ['Fyodor Dostoevsky', 'Leo Tolstoy', 'Anton Chekhov', 'Ivan Turgenev'], correctIndex: 0 },
    // More Geography
    { id: 'MA53', category: 'Geography', question: 'What is the driest place on Earth?', answers: ['Atacama Desert', 'Sahara Desert', 'Antarctica Dry Valleys', 'Death Valley'], correctIndex: 0 },
    { id: 'MA54', category: 'Geography', question: 'What two countries share the longest international border?', answers: ['Canada and USA', 'Russia and China', 'Argentina and Chile', 'India and Bangladesh'], correctIndex: 0 },
    { id: 'MA55', category: 'Geography', question: 'What is the deepest lake in the world?', answers: ['Lake Baikal', 'Lake Tanganyika', 'Caspian Sea', 'Lake Superior'], correctIndex: 0 },
    // More Technology
    { id: 'MA56', category: 'Technology', question: 'What programming language was created by Guido van Rossum?', answers: ['Python', 'Java', 'Ruby', 'C++'], correctIndex: 0 },
    { id: 'MA57', category: 'Technology', question: 'What does RAM stand for in computing?', answers: ['Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Runtime Access Memory'], correctIndex: 0 },
    { id: 'MA58', category: 'Technology', question: 'What was the name of the first programmable computer?', answers: ['ENIAC', 'UNIVAC', 'IBM 701', 'Colossus'], correctIndex: 0 },
    // Movies
    { id: 'MA59', category: 'Movies', question: 'Who directed "2001: A Space Odyssey"?', answers: ['Stanley Kubrick', 'Steven Spielberg', 'George Lucas', 'Ridley Scott'], correctIndex: 0 },
    { id: 'MA60', category: 'Movies', question: 'What 1994 film won the Academy Award for Best Picture over "Pulp Fiction" and "Forrest Gump"?', answers: ['Forrest Gump', 'The Shawshank Redemption', 'Pulp Fiction', 'Quiz Show'], correctIndex: 0 }
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

// Theme groups for game customization
export const TRIVIA_THEMES = {
    'entertainment': {
        name: 'Entertainment',
        icon: '🎬',
        description: 'Movies, TV, Music & Gaming',
        categories: ['Movies', 'TV Shows', 'Music', 'Video Games']
    },
    'science-nature': {
        name: 'Science & Nature',
        icon: '🔬',
        description: 'Science, Animals, Nature & Space',
        categories: ['Science', 'Animals', 'Nature', 'Space']
    },
    'history-world': {
        name: 'History & World',
        icon: '🌍',
        description: 'History, Geography, Literature & Art',
        categories: ['History', 'Geography', 'Literature', 'Art']
    },
    'kids-fun': {
        name: 'Kids & Fun',
        icon: '🎈',
        description: 'Colors, Shapes, Food, Disney & more',
        categories: ['Colors', 'Shapes', 'Food', 'Disney', 'Body', 'Numbers']
    },
    'general': {
        name: 'General Knowledge',
        icon: '🧠',
        description: 'Sports, Technology & General facts',
        categories: ['General', 'Sports', 'Technology', 'Mathematics', 'Medicine', 'Philosophy', 'Economics', 'Language', 'Politics']
    }
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

/**
 * Get categories included in selected themes
 * @param {array} themeIds - Array of theme IDs (e.g., ['entertainment', 'science-nature']) or ['all']
 * @returns {array} Array of category names
 */
export function getCategoriesFromThemes(themeIds) {
    if (!themeIds || themeIds.length === 0 || themeIds.includes('all')) {
        // Return all categories
        return Object.keys(CATEGORY_ICONS);
    }

    const categories = new Set();
    themeIds.forEach(themeId => {
        const theme = TRIVIA_THEMES[themeId];
        if (theme) {
            theme.categories.forEach(cat => categories.add(cat));
        }
    });
    return Array.from(categories);
}

/**
 * Get random questions filtered by themes
 * @param {string} difficulty - Difficulty level ID
 * @param {number} count - Number of questions to return
 * @param {array} themeIds - Theme IDs to filter by (or ['all'])
 * @param {array} usedIds - Question IDs already used (to avoid repeats)
 * @returns {array} Array of question objects
 */
export function getRandomQuestionsByThemes(difficulty, count, themeIds = ['all'], usedIds = []) {
    const questions = ALL_TRIVIA_QUESTIONS[difficulty] || TRIVIA_MEDIUM;
    const allowedCategories = getCategoriesFromThemes(themeIds);

    // Filter by category and not used
    const filtered = questions.filter(q =>
        allowedCategories.includes(q.category) && !usedIds.includes(q.id)
    );

    // If not enough filtered questions, use all from allowed categories (allow repeats)
    const pool = filtered.length >= count ? filtered :
        questions.filter(q => allowedCategories.includes(q.category));

    // Shuffle and take first 'count' questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
