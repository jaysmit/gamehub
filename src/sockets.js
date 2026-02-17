const { v4: uuidv4 } = require('uuid');

// In-memory room store (rooms are ephemeral — no need to persist them)
const rooms = new Map();

// Trivia questions bank organized by difficulty level
// Very Easy (ages 3-7), Easy (7-12), Medium (12-18), Hard (18+), Master (PhD)
const TRIVIA_QUESTIONS_BY_DIFFICULTY = {
  'super-easy': [
    // Very basic yes/no and animal sound questions for toddlers (ages 2-4) - UNIQUE to this level
    { id: 'SE1', category: 'Animals', question: 'What says "moo"?', answers: ['Cow', 'Dog', 'Cat', 'Bird'], correctIndex: 0 },
    { id: 'SE2', category: 'Animals', question: 'What says "oink"?', answers: ['Pig', 'Dog', 'Cat', 'Bird'], correctIndex: 0 },
    { id: 'SE3', category: 'Animals', question: 'What says "quack"?', answers: ['Duck', 'Dog', 'Cat', 'Cow'], correctIndex: 0 },
    { id: 'SE4', category: 'Animals', question: 'What says "baa"?', answers: ['Sheep', 'Pig', 'Duck', 'Horse'], correctIndex: 0 },
    { id: 'SE5', category: 'Animals', question: 'What says "neigh"?', answers: ['Horse', 'Cow', 'Pig', 'Sheep'], correctIndex: 0 },
    { id: 'SE6', category: 'Animals', question: 'What says "woof"?', answers: ['Dog', 'Cat', 'Bird', 'Cow'], correctIndex: 0 },
    { id: 'SE7', category: 'Animals', question: 'What says "meow"?', answers: ['Cat', 'Dog', 'Bird', 'Pig'], correctIndex: 0 },
    { id: 'SE8', category: 'Animals', question: 'What says "roar"?', answers: ['Lion', 'Mouse', 'Fish', 'Bunny'], correctIndex: 0 },
    { id: 'SE9', category: 'YesNo', question: 'Is the sun hot?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE10', category: 'YesNo', question: 'Is ice cold?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE11', category: 'YesNo', question: 'Do fish swim?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE12', category: 'YesNo', question: 'Do birds fly?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE13', category: 'YesNo', question: 'Is snow white?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE14', category: 'YesNo', question: 'Do dogs bark?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE15', category: 'YesNo', question: 'Is rain wet?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE16', category: 'YesNo', question: 'Do cars have wheels?', answers: ['Yes', 'No'], correctIndex: 0 },
    { id: 'SE17', category: 'Simple', question: 'What is fluffy and says "meow"?', answers: ['Cat', 'Dog', 'Bird', 'Fish'], correctIndex: 0 },
    { id: 'SE18', category: 'Simple', question: 'What flies in the sky?', answers: ['Bird', 'Fish', 'Cat', 'Dog'], correctIndex: 0 },
    { id: 'SE19', category: 'Simple', question: 'What do you sleep in?', answers: ['Bed', 'Car', 'Tree', 'Pool'], correctIndex: 0 },
    { id: 'SE20', category: 'Simple', question: 'What do you eat with?', answers: ['Spoon', 'Shoe', 'Hat', 'Book'], correctIndex: 0 }
  ],
  'very-easy': [
    // Colors, shapes, counting for young children (ages 5-7) - UNIQUE to this level
    { id: 'VE1', category: 'Colors', question: 'What color is a banana?', answers: ['Yellow', 'Blue', 'Red', 'Green', 'Purple', 'Orange'], correctIndex: 0 },
    { id: 'VE2', category: 'Colors', question: 'What color is grass?', answers: ['Green', 'Blue', 'Yellow', 'Red', 'Purple', 'Orange'], correctIndex: 0 },
    { id: 'VE3', category: 'Colors', question: 'What color is the sky on a sunny day?', answers: ['Blue', 'Red', 'Green', 'Purple', 'Yellow', 'Orange'], correctIndex: 0 },
    { id: 'VE4', category: 'Colors', question: 'What color is a fire truck?', answers: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], correctIndex: 0 },
    { id: 'VE5', category: 'Shapes', question: 'How many sides does a triangle have?', answers: ['3', '4', '5', '6', '2', '7'], correctIndex: 0 },
    { id: 'VE6', category: 'Shapes', question: 'What shape is a ball?', answers: ['Round', 'Square', 'Triangle', 'Rectangle', 'Star', 'Heart'], correctIndex: 0 },
    { id: 'VE7', category: 'Shapes', question: 'How many sides does a square have?', answers: ['4', '3', '5', '6', '2', '7'], correctIndex: 0 },
    { id: 'VE8', category: 'Animals', question: 'What animal has a long trunk?', answers: ['Elephant', 'Dog', 'Cat', 'Bird', 'Fish', 'Lion'], correctIndex: 0 },
    { id: 'VE9', category: 'Animals', question: 'What animal has a long neck?', answers: ['Giraffe', 'Dog', 'Cat', 'Pig', 'Fish', 'Lion'], correctIndex: 0 },
    { id: 'VE10', category: 'Animals', question: 'What animal hops?', answers: ['Rabbit', 'Fish', 'Snake', 'Cow', 'Dog', 'Cat'], correctIndex: 0 },
    { id: 'VE11', category: 'Body', question: 'How many eyes do you have?', answers: ['2', '1', '3', '4', '5', '6'], correctIndex: 0 },
    { id: 'VE12', category: 'Body', question: 'How many fingers are on one hand?', answers: ['5', '4', '3', '10', '6', '2'], correctIndex: 0 },
    { id: 'VE13', category: 'Body', question: 'How many ears do you have?', answers: ['2', '1', '3', '4', '5', '6'], correctIndex: 0 },
    { id: 'VE14', category: 'Numbers', question: 'What comes after 1, 2, 3?', answers: ['4', '5', '6', '7', '8', '9'], correctIndex: 0 },
    { id: 'VE15', category: 'Numbers', question: 'How many legs does a dog have?', answers: ['4', '2', '6', '8', '3', '5'], correctIndex: 0 },
    { id: 'VE16', category: 'Food', question: 'What fruit is red and grows on trees?', answers: ['Apple', 'Banana', 'Orange', 'Grape', 'Lemon', 'Lime'], correctIndex: 0 },
    { id: 'VE17', category: 'Nature', question: 'The sun comes out during the...?', answers: ['Day', 'Night', 'Evening', 'Never', 'Midnight', 'Dawn'], correctIndex: 0 },
    { id: 'VE18', category: 'Nature', question: 'Snow is what color?', answers: ['White', 'Blue', 'Yellow', 'Green', 'Red', 'Pink'], correctIndex: 0 },
    { id: 'VE19', category: 'Disney', question: 'Mickey Mouse has two big...?', answers: ['Ears', 'Noses', 'Feet', 'Hands', 'Eyes', 'Teeth'], correctIndex: 0 },
    { id: 'VE20', category: 'Disney', question: 'In The Lion King, Simba is a...?', answers: ['Lion', 'Zebra', 'Bird', 'Elephant', 'Giraffe', 'Hippo'], correctIndex: 0 }
  ],
  'easy': [
    { id: 'E1', category: 'Movies', question: 'Which Disney movie features a character named Simba?', answers: ['The Lion King', 'Frozen', 'Moana', 'Aladdin', 'Tarzan', 'Bambi'], correctIndex: 0 },
    { id: 'E2', category: 'Movies', question: 'What is the name of the snowman in "Frozen"?', answers: ['Olaf', 'Sven', 'Kristoff', 'Marshmallow', 'Frosty', 'Snowy'], correctIndex: 0 },
    { id: 'E3', category: 'Movies', question: 'In "Toy Story", what kind of toy is Woody?', answers: ['Cowboy', 'Astronaut', 'Dinosaur', 'Soldier', 'Robot', 'Superhero'], correctIndex: 0 },
    { id: 'E4', category: 'Movies', question: 'What color is the fish Nemo?', answers: ['Orange and white', 'Blue and yellow', 'Red and black', 'Green and purple', 'Pink', 'Yellow'], correctIndex: 0 },
    { id: 'E5', category: 'TV Shows', question: 'What is SpongeBob SquarePants\'s pet snail named?', answers: ['Gary', 'Larry', 'Barry', 'Harry', 'Terry', 'Jerry'], correctIndex: 0 },
    { id: 'E6', category: 'Video Games', question: 'What is the name of Mario\'s brother?', answers: ['Luigi', 'Wario', 'Waluigi', 'Toad', 'Yoshi', 'Bowser'], correctIndex: 0 },
    { id: 'E7', category: 'Video Games', question: 'What color is Sonic the Hedgehog?', answers: ['Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Orange'], correctIndex: 0 },
    { id: 'E8', category: 'Video Games', question: 'In Pokemon, what type is Pikachu?', answers: ['Electric', 'Fire', 'Water', 'Grass', 'Normal', 'Flying'], correctIndex: 0 },
    { id: 'E9', category: 'Animals', question: 'What is the largest animal on Earth?', answers: ['Blue whale', 'Elephant', 'Giraffe', 'Great white shark', 'Hippo', 'Bear'], correctIndex: 0 },
    { id: 'E10', category: 'Animals', question: 'How many legs does a spider have?', answers: ['8', '6', '10', '4', '12', '7'], correctIndex: 0 },
    { id: 'E11', category: 'Animals', question: 'What is the fastest land animal?', answers: ['Cheetah', 'Lion', 'Horse', 'Gazelle', 'Leopard', 'Dog'], correctIndex: 0 },
    { id: 'E12', category: 'Sports', question: 'How many players are on a soccer team on the field?', answers: ['11', '10', '9', '12', '8', '7'], correctIndex: 0 },
    { id: 'E13', category: 'General', question: 'What planet is known as the "Red Planet"?', answers: ['Mars', 'Venus', 'Jupiter', 'Saturn', 'Mercury', 'Neptune'], correctIndex: 0 },
    { id: 'E14', category: 'General', question: 'How many continents are there on Earth?', answers: ['7', '6', '5', '8', '9', '4'], correctIndex: 0 },
    { id: 'E15', category: 'General', question: 'What is the largest ocean on Earth?', answers: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Southern', 'Mediterranean'], correctIndex: 0 },
    { id: 'E16', category: 'Music', question: 'What Disney song has lyrics "Let it go, let it go"?', answers: ['Let It Go', 'Into the Unknown', 'Show Yourself', 'Frozen Heart', 'Build a Snowman', 'Open Door'], correctIndex: 0 },
    { id: 'E17', category: 'Sports', question: 'How many rings are in the Olympic symbol?', answers: ['5', '4', '6', '7', '3', '8'], correctIndex: 0 },
    { id: 'E18', category: 'Video Games', question: 'In Minecraft, what explodes when it gets close?', answers: ['Creeper', 'Zombie', 'Skeleton', 'Enderman', 'Spider', 'Witch'], correctIndex: 0 },
    { id: 'E19', category: 'General', question: 'How many colors are in a rainbow?', answers: ['7', '6', '5', '8', '9', '10'], correctIndex: 0 },
    { id: 'E20', category: 'General', question: 'What do bees make?', answers: ['Honey', 'Milk', 'Silk', 'Wax', 'Nectar', 'Pollen'], correctIndex: 0 }
  ],
  'medium': [
    { id: 'M1', category: 'Movies', question: 'Which superhero is known as the "Dark Knight"?', answers: ['Batman', 'Superman', 'Spider-Man', 'Iron Man', 'Thor', 'Captain America'], correctIndex: 0 },
    { id: 'M2', category: 'Movies', question: 'In Harry Potter, what sport do wizards play on broomsticks?', answers: ['Quidditch', 'Broomball', 'Wizardball', 'Flyball', 'Seekers', 'Snitchball'], correctIndex: 0 },
    { id: 'M3', category: 'TV Shows', question: 'In Stranger Things, what is Eleven\'s favorite food?', answers: ['Eggo waffles', 'Pizza', 'Ice cream', 'Burgers', 'Fries', 'Chicken nuggets'], correctIndex: 0 },
    { id: 'M4', category: 'Movies', question: 'What is Baby Yoda\'s real name in The Mandalorian?', answers: ['Grogu', 'Din', 'Mando', 'Yoda', 'Luke', 'Ben'], correctIndex: 0 },
    { id: 'M5', category: 'Music', question: 'Which K-pop group performed "Dynamite"?', answers: ['BTS', 'BLACKPINK', 'EXO', 'TWICE', 'Stray Kids', 'NCT'], correctIndex: 0 },
    { id: 'M6', category: 'Music', question: 'Which singer is known for "Bad Guy"?', answers: ['Billie Eilish', 'Ariana Grande', 'Dua Lipa', 'Olivia Rodrigo', 'Doja Cat', 'SZA'], correctIndex: 0 },
    { id: 'M7', category: 'Sports', question: 'What country won the 2022 FIFA World Cup?', answers: ['Argentina', 'France', 'Brazil', 'Germany', 'Spain', 'England'], correctIndex: 0 },
    { id: 'M8', category: 'General', question: 'What is the hardest natural substance on Earth?', answers: ['Diamond', 'Gold', 'Iron', 'Steel', 'Titanium', 'Platinum'], correctIndex: 0 },
    { id: 'M9', category: 'TV Shows', question: 'What Netflix show features "Red Light, Green Light"?', answers: ['Squid Game', 'Money Heist', 'All of Us Are Dead', 'Sweet Home', 'Hellbound', 'The Glory'], correctIndex: 0 },
    { id: 'M10', category: 'Video Games', question: 'In Fortnite, what is the shrinking danger zone called?', answers: ['The Storm', 'The Circle', 'The Zone', 'The Ring', 'The Wall', 'The Fog'], correctIndex: 0 },
    { id: 'M11', category: 'Movies', question: 'What superhero wears a red and gold suit of armor?', answers: ['Iron Man', 'Thor', 'Captain America', 'Hulk', 'Black Panther', 'Ant-Man'], correctIndex: 0 },
    { id: 'M12', category: 'General', question: 'What famous tower is located in Paris?', answers: ['Eiffel Tower', 'Leaning Tower', 'Big Ben', 'Empire State', 'Burj Khalifa', 'CN Tower'], correctIndex: 0 },
    { id: 'M13', category: 'General', question: 'What is the largest planet in our solar system?', answers: ['Jupiter', 'Saturn', 'Neptune', 'Uranus', 'Earth', 'Mars'], correctIndex: 0 },
    { id: 'M14', category: 'Music', question: 'Which rapper is known as "Slim Shady"?', answers: ['Eminem', 'Drake', 'Kanye West', 'Snoop Dogg', 'Jay-Z', 'Lil Wayne'], correctIndex: 0 },
    { id: 'M15', category: 'Sports', question: 'What sport uses a puck?', answers: ['Hockey', 'Lacrosse', 'Curling', 'Field Hockey', 'Polo', 'Cricket'], correctIndex: 0 },
    { id: 'M16', category: 'Movies', question: 'In "The Incredibles", what is the family\'s last name?', answers: ['Parr', 'Smith', 'Jones', 'Super', 'Powers', 'Strong'], correctIndex: 0 },
    { id: 'M17', category: 'TV Shows', question: 'In Avatar: The Last Airbender, what element does Aang master first?', answers: ['Air', 'Water', 'Earth', 'Fire', 'Metal', 'Lightning'], correctIndex: 0 },
    { id: 'M18', category: 'General', question: 'What gas do plants breathe in?', answers: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen', 'Helium', 'Methane'], correctIndex: 0 },
    { id: 'M19', category: 'Video Games', question: 'In Roblox, what is the in-game currency called?', answers: ['Robux', 'Coins', 'Gems', 'Bucks', 'Credits', 'Tokens'], correctIndex: 0 },
    { id: 'M20', category: 'Sports', question: 'What color belt is highest in karate?', answers: ['Black', 'White', 'Red', 'Brown', 'Blue', 'Green'], correctIndex: 0 }
  ],
  'hard': [
    { id: 'H1', category: 'Science', question: 'What is the chemical symbol for gold?', answers: ['Au', 'Ag', 'Fe', 'Cu', 'Pb', 'Hg'], correctIndex: 0 },
    { id: 'H2', category: 'History', question: 'In what year did World War II end?', answers: ['1945', '1944', '1946', '1943', '1947', '1942'], correctIndex: 0 },
    { id: 'H3', category: 'Geography', question: 'What is the smallest country in the world by area?', answers: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein', 'Malta', 'Andorra'], correctIndex: 0 },
    { id: 'H4', category: 'Science', question: 'What is the speed of light in a vacuum (km/s)?', answers: ['299,792', '299,000', '300,000', '298,000', '301,000', '295,000'], correctIndex: 0 },
    { id: 'H5', category: 'Literature', question: 'Who wrote "1984"?', answers: ['George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'H.G. Wells', 'Arthur Clarke', 'Isaac Asimov'], correctIndex: 0 },
    { id: 'H6', category: 'History', question: 'Who was the first person to walk on the moon?', answers: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins', 'John Glenn', 'Alan Shepard', 'Yuri Gagarin'], correctIndex: 0 },
    { id: 'H7', category: 'Science', question: 'What is the powerhouse of the cell?', answers: ['Mitochondria', 'Nucleus', 'Ribosome', 'Endoplasmic reticulum', 'Golgi apparatus', 'Lysosome'], correctIndex: 0 },
    { id: 'H8', category: 'Geography', question: 'What is the longest river in the world?', answers: ['Nile', 'Amazon', 'Yangtze', 'Mississippi', 'Congo', 'Mekong'], correctIndex: 0 },
    { id: 'H9', category: 'Art', question: 'Who painted the Mona Lisa?', answers: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Botticelli', 'Caravaggio', 'Titian'], correctIndex: 0 },
    { id: 'H10', category: 'Science', question: 'What element has the atomic number 1?', answers: ['Hydrogen', 'Helium', 'Lithium', 'Carbon', 'Oxygen', 'Nitrogen'], correctIndex: 0 },
    { id: 'H11', category: 'History', question: 'What ancient wonder was located in Alexandria, Egypt?', answers: ['Lighthouse', 'Hanging Gardens', 'Colossus', 'Mausoleum', 'Temple of Artemis', 'Statue of Zeus'], correctIndex: 0 },
    { id: 'H12', category: 'Geography', question: 'What is the capital of Australia?', answers: ['Canberra', 'Sydney', 'Melbourne', 'Perth', 'Brisbane', 'Adelaide'], correctIndex: 0 },
    { id: 'H13', category: 'Science', question: 'What is the most abundant gas in Earth\'s atmosphere?', answers: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon', 'Hydrogen', 'Helium'], correctIndex: 0 },
    { id: 'H14', category: 'Literature', question: 'Who wrote "Romeo and Juliet"?', answers: ['Shakespeare', 'Chaucer', 'Milton', 'Dickens', 'Austen', 'Hemingway'], correctIndex: 0 },
    { id: 'H15', category: 'Music', question: 'What composer wrote the "Moonlight Sonata"?', answers: ['Beethoven', 'Mozart', 'Bach', 'Chopin', 'Brahms', 'Tchaikovsky'], correctIndex: 0 },
    { id: 'H16', category: 'History', question: 'In what year did the Berlin Wall fall?', answers: ['1989', '1990', '1988', '1991', '1987', '1992'], correctIndex: 0 },
    { id: 'H17', category: 'Science', question: 'What is the largest organ in the human body?', answers: ['Skin', 'Liver', 'Brain', 'Heart', 'Lungs', 'Intestines'], correctIndex: 0 },
    { id: 'H18', category: 'Geography', question: 'Mount Everest is located between which two countries?', answers: ['Nepal and China', 'India and China', 'Nepal and India', 'Tibet and Nepal', 'China and Bhutan', 'India and Tibet'], correctIndex: 0 },
    { id: 'H19', category: 'Art', question: 'Which artist cut off his own ear?', answers: ['Van Gogh', 'Picasso', 'Monet', 'Rembrandt', 'Dali', 'Warhol'], correctIndex: 0 },
    { id: 'H20', category: 'Science', question: 'What is the chemical formula for water?', answers: ['H2O', 'CO2', 'NaCl', 'O2', 'H2O2', 'CH4'], correctIndex: 0 }
  ],
  'very-hard': [
    // Challenging adult-level questions - distinct from 'hard' (19+)
    { id: 'VH1', category: 'Science', question: 'What is the SI unit of electrical resistance?', answers: ['Ohm', 'Watt', 'Volt', 'Ampere', 'Farad', 'Henry'], correctIndex: 0 },
    { id: 'VH2', category: 'History', question: 'In what year was the Magna Carta signed?', answers: ['1215', '1066', '1453', '1776', '1492', '1189'], correctIndex: 0 },
    { id: 'VH3', category: 'Geography', question: 'Which country has the longest coastline in the world?', answers: ['Canada', 'Russia', 'Indonesia', 'Australia', 'Norway', 'USA'], correctIndex: 0 },
    { id: 'VH4', category: 'Science', question: 'What is the atomic number of carbon?', answers: ['6', '12', '8', '14', '4', '7'], correctIndex: 0 },
    { id: 'VH5', category: 'Literature', question: 'Who wrote "War and Peace"?', answers: ['Leo Tolstoy', 'Fyodor Dostoevsky', 'Anton Chekhov', 'Ivan Turgenev', 'Nikolai Gogol', 'Boris Pasternak'], correctIndex: 0 },
    { id: 'VH6', category: 'History', question: 'Which empire was ruled by Genghis Khan?', answers: ['Mongol Empire', 'Ottoman Empire', 'Roman Empire', 'Persian Empire', 'Byzantine Empire', 'Han Dynasty'], correctIndex: 0 },
    { id: 'VH7', category: 'Science', question: 'What type of bond involves sharing electrons?', answers: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen', 'Van der Waals', 'Dipole'], correctIndex: 0 },
    { id: 'VH8', category: 'Geography', question: 'What is the deepest lake in the world?', answers: ['Lake Baikal', 'Lake Superior', 'Lake Tanganyika', 'Caspian Sea', 'Lake Victoria', 'Lake Michigan'], correctIndex: 0 },
    { id: 'VH9', category: 'Art', question: 'Which art movement did Claude Monet help found?', answers: ['Impressionism', 'Cubism', 'Surrealism', 'Expressionism', 'Realism', 'Baroque'], correctIndex: 0 },
    { id: 'VH10', category: 'Science', question: 'What is the main component of natural gas?', answers: ['Methane', 'Propane', 'Butane', 'Ethane', 'Hydrogen', 'Carbon dioxide'], correctIndex: 0 },
    { id: 'VH11', category: 'History', question: 'Who was the first Roman Emperor?', answers: ['Augustus', 'Julius Caesar', 'Nero', 'Caligula', 'Tiberius', 'Marcus Aurelius'], correctIndex: 0 },
    { id: 'VH12', category: 'Geography', question: 'Which desert is the largest hot desert in the world?', answers: ['Sahara', 'Arabian', 'Gobi', 'Kalahari', 'Mojave', 'Atacama'], correctIndex: 0 },
    { id: 'VH13', category: 'Science', question: 'What vitamin is produced when skin is exposed to sunlight?', answers: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin E', 'Vitamin K', 'Vitamin B12'], correctIndex: 0 },
    { id: 'VH14', category: 'Literature', question: 'Who wrote "The Divine Comedy"?', answers: ['Dante Alighieri', 'Giovanni Boccaccio', 'Petrarch', 'Virgil', 'Homer', 'Ovid'], correctIndex: 0 },
    { id: 'VH15', category: 'Music', question: 'Which composer wrote "The Four Seasons"?', answers: ['Vivaldi', 'Bach', 'Handel', 'Mozart', 'Haydn', 'Beethoven'], correctIndex: 0 },
    { id: 'VH16', category: 'History', question: 'In what year did the French Revolution begin?', answers: ['1789', '1776', '1799', '1804', '1815', '1848'], correctIndex: 0 },
    { id: 'VH17', category: 'Science', question: 'What is the largest moon of Saturn?', answers: ['Titan', 'Europa', 'Ganymede', 'Callisto', 'Io', 'Triton'], correctIndex: 0 },
    { id: 'VH18', category: 'Geography', question: 'Which country has the most islands in the world?', answers: ['Sweden', 'Finland', 'Norway', 'Indonesia', 'Philippines', 'Japan'], correctIndex: 0 },
    { id: 'VH19', category: 'Art', question: 'Who sculpted "The Thinker"?', answers: ['Auguste Rodin', 'Michelangelo', 'Donatello', 'Bernini', 'Canova', 'Henry Moore'], correctIndex: 0 },
    { id: 'VH20', category: 'Science', question: 'What is the process by which plants make food using sunlight?', answers: ['Photosynthesis', 'Respiration', 'Fermentation', 'Oxidation', 'Transpiration', 'Digestion'], correctIndex: 0 }
  ],
  'genius': [
    // Expert-level questions
    { id: 'G1', category: 'Science', question: 'What is the Heisenberg Uncertainty Principle related to?', answers: ['Quantum mechanics', 'Relativity', 'Thermodynamics', 'Electromagnetism', 'Nuclear physics', 'Optics'], correctIndex: 0 },
    { id: 'G2', category: 'Philosophy', question: 'Who wrote "Critique of Pure Reason"?', answers: ['Immanuel Kant', 'Hegel', 'Nietzsche', 'Descartes', 'Plato', 'Aristotle'], correctIndex: 0 },
    { id: 'G3', category: 'History', question: 'The Treaty of Westphalia (1648) ended which war?', answers: ['Thirty Years War', 'Hundred Years War', 'Seven Years War', 'Napoleonic Wars', 'English Civil War', 'War of Roses'], correctIndex: 0 },
    { id: 'G4', category: 'Science', question: 'What is the Chandrasekhar limit approximately equal to?', answers: ['1.4 solar masses', '2.0 solar masses', '1.0 solar masses', '0.5 solar masses', '3.0 solar masses', '2.5 solar masses'], correctIndex: 0 },
    { id: 'G5', category: 'Literature', question: 'Who wrote "Ulysses" (1922)?', answers: ['James Joyce', 'Virginia Woolf', 'T.S. Eliot', 'F. Scott Fitzgerald', 'Ernest Hemingway', 'William Faulkner'], correctIndex: 0 },
    { id: 'G6', category: 'Math', question: 'What is Euler\'s number (e) approximately equal to?', answers: ['2.71828', '3.14159', '1.61803', '2.30258', '1.41421', '2.50000'], correctIndex: 0 },
    { id: 'G7', category: 'Science', question: 'What particle is responsible for mass in the Standard Model?', answers: ['Higgs boson', 'Photon', 'Gluon', 'Graviton', 'W boson', 'Z boson'], correctIndex: 0 },
    { id: 'G8', category: 'History', question: 'What was the name of the first successful English colony in America?', answers: ['Jamestown', 'Plymouth', 'Roanoke', 'Boston', 'Williamsburg', 'Philadelphia'], correctIndex: 0 },
    { id: 'G9', category: 'Science', question: 'What is the half-life of Carbon-14 (years)?', answers: ['5,730', '4,500', '6,000', '5,000', '7,000', '8,000'], correctIndex: 0 },
    { id: 'G10', category: 'Art', question: 'What art movement did Marcel Duchamp help found?', answers: ['Dadaism', 'Surrealism', 'Cubism', 'Futurism', 'Pop Art', 'Minimalism'], correctIndex: 0 },
    { id: 'G11', category: 'Science', question: 'What is the Schwarzschild radius related to?', answers: ['Black holes', 'Neutron stars', 'White dwarfs', 'Pulsars', 'Quasars', 'Supernovae'], correctIndex: 0 },
    { id: 'G12', category: 'Philosophy', question: 'What is the "Ship of Theseus" paradox about?', answers: ['Identity', 'Time', 'Space', 'Causality', 'Knowledge', 'Ethics'], correctIndex: 0 },
    { id: 'G13', category: 'History', question: 'Who was the last Tsar of Russia?', answers: ['Nicholas II', 'Alexander III', 'Nicholas I', 'Alexander II', 'Paul I', 'Peter III'], correctIndex: 0 },
    { id: 'G14', category: 'Science', question: 'What is the Planck length approximately (meters)?', answers: ['1.6 x 10^-35', '1.6 x 10^-30', '1.6 x 10^-40', '1.6 x 10^-25', '1.6 x 10^-20', '1.6 x 10^-45'], correctIndex: 0 },
    { id: 'G15', category: 'Literature', question: 'Who wrote "The Brothers Karamazov"?', answers: ['Dostoevsky', 'Tolstoy', 'Chekhov', 'Gogol', 'Turgenev', 'Pushkin'], correctIndex: 0 },
    { id: 'G16', category: 'Science', question: 'What is the Coriolis effect primarily caused by?', answers: ['Earth\'s rotation', 'Moon\'s gravity', 'Sun\'s radiation', 'Magnetic field', 'Atmospheric pressure', 'Ocean currents'], correctIndex: 0 },
    { id: 'G17', category: 'History', question: 'The Taiping Rebellion occurred in which country?', answers: ['China', 'Japan', 'India', 'Vietnam', 'Korea', 'Philippines'], correctIndex: 0 },
    { id: 'G18', category: 'Math', question: 'What is the golden ratio (phi) approximately equal to?', answers: ['1.618', '1.414', '2.718', '3.141', '1.732', '2.236'], correctIndex: 0 },
    { id: 'G19', category: 'Science', question: 'What is CRISPR primarily used for?', answers: ['Gene editing', 'Protein synthesis', 'Cell division', 'DNA replication', 'RNA transcription', 'Mutation detection'], correctIndex: 0 },
    { id: 'G20', category: 'Philosophy', question: 'Who proposed the "Veil of Ignorance" thought experiment?', answers: ['John Rawls', 'Robert Nozick', 'Peter Singer', 'John Stuart Mill', 'Immanuel Kant', 'Jeremy Bentham'], correctIndex: 0 }
  ]
};

// Flatten all trivia questions for legacy support and speed rounds
const TRIVIA_QUESTIONS = [
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['super-easy'],
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['very-easy'],
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['easy'],
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['medium'],
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['hard'],
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['very-hard'],
  ...TRIVIA_QUESTIONS_BY_DIFFICULTY['genius']
];

// Legacy trivia questions bank (keeping for backwards compatibility with existing code)
const TRIVIA_QUESTIONS_LEGACY = [
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
const TRIVIA_QUESTION_DURATION = 20000;  // 20 seconds per question
const TRIVIA_SPEED_ROUND_DURATION = 60000;  // 60 seconds total for speed round
const TRIVIA_SPEED_WRONG_DELAY = 3000;  // 3 seconds delay after wrong answer in speed round
const TRIVIA_SPEED_CORRECT_DELAY = 1000;  // 1 second delay after correct answer to show green feedback
const TRIVIA_REVEAL_DURATION = 3000;  // 3 seconds to show correct answer
const TRIVIA_SPEED_REVEAL_DURATION = 1500;  // 1.5 seconds reveal in speed round (faster)
const TRIVIA_BASE_POINTS = 100;

// Trivia theme definitions (category groupings for game customization)
const TRIVIA_THEMES = {
  'entertainment': ['Movies', 'TV Shows', 'Music', 'Video Games'],
  'science-nature': ['Science', 'Animals', 'Nature', 'Space'],
  'history-world': ['History', 'Geography', 'Literature', 'Art'],
  'kids-fun': ['Colors', 'Shapes', 'Food', 'Disney', 'Body', 'Numbers'],
  'general': ['General', 'Sports', 'Technology', 'Mathematics', 'Medicine', 'Philosophy', 'Economics', 'Language', 'Politics']
};

// Get categories from theme IDs
function getCategoriesFromThemes(themeIds) {
  if (!themeIds || themeIds.length === 0 || themeIds.includes('all')) {
    return null; // null means all categories
  }
  const categories = new Set();
  themeIds.forEach(themeId => {
    const themeCats = TRIVIA_THEMES[themeId];
    if (themeCats) {
      themeCats.forEach(cat => categories.add(cat));
    }
  });
  return Array.from(categories);
}
const TRIVIA_TIME_BONUS_MAX = 50;
const TRIVIA_GRACE_PERIOD = 2000;  // 2 seconds of max points before depletion starts
const TRIVIA_SPEED_MULTIPLIER = 2;
const TRIVIA_SPEED_FIXED_POINTS = 200;  // Fixed points per correct answer in speed round

// Quick Math game constants
const MATH_RULES_DURATION_ROUND1 = 10000;  // 10 seconds for first round (full rules)
const MATH_RULES_DURATION_NORMAL = 3000;   // 3 seconds for rounds 2-3
const MATH_RULES_DURATION_SPEED = 5000;    // 5 seconds for speed round announcement
const MATH_QUESTION_DURATION = 20000;  // 20 seconds per question
const MATH_SPEED_ROUND_DURATION = 60000;  // 60 seconds total for speed round
const MATH_SPEED_WRONG_DELAY = 3000;  // 3 seconds delay after wrong answer in speed round
const MATH_SPEED_CORRECT_DELAY = 1000;  // 1 second delay after correct answer
const MATH_REVEAL_DURATION = 3000;  // 3 seconds to show correct answer
const MATH_BASE_POINTS = 100;
const MATH_TIME_BONUS_MAX = 50;
const MATH_GRACE_PERIOD = 2000;  // 2 seconds of max points before depletion starts
const MATH_SPEED_MULTIPLIER = 2;
const MATH_SPEED_FIXED_POINTS = 200;  // Fixed points per correct answer in speed round

// Difficulty settings
const DEFAULT_DIFFICULTY = 'medium';
const DIFFICULTY_LEVELS = ['super-easy', 'very-easy', 'easy', 'medium', 'hard', 'very-hard', 'genius'];

// Math questions by difficulty level
// Super Easy (2-4): Counting, what comes before/after X, up to 10
// Very Easy (5-7): Addition/subtraction up to 12, only +/- 1 or 2
// Easy (8-11): Addition/subtraction up to 100 (+/- no more than 10), basic multiplication/division
// Medium (12-15): Harder addition/subtraction, medium multiplication/division
// Hard (16-18): Three-digit math, advanced times tables, complex division
// Very Hard (19+): Large operations, percentages, squares
// Genius: Complex math, cubes, square roots, mixed operations
const MATH_QUESTIONS_BY_DIFFICULTY = {
  'super-easy': [
    // Counting - what comes after (ages 2-4)
    { id: 'SE1', category: 'Counting', question: 'What comes after 1?', answer: 2 },
    { id: 'SE2', category: 'Counting', question: 'What comes after 2?', answer: 3 },
    { id: 'SE3', category: 'Counting', question: 'What comes after 3?', answer: 4 },
    { id: 'SE4', category: 'Counting', question: 'What comes after 4?', answer: 5 },
    { id: 'SE5', category: 'Counting', question: 'What comes after 5?', answer: 6 },
    { id: 'SE6', category: 'Counting', question: 'What comes after 6?', answer: 7 },
    { id: 'SE7', category: 'Counting', question: 'What comes after 7?', answer: 8 },
    { id: 'SE8', category: 'Counting', question: 'What comes after 8?', answer: 9 },
    { id: 'SE9', category: 'Counting', question: 'What comes after 9?', answer: 10 },
    // Counting - what comes before
    { id: 'SE10', category: 'Counting', question: 'What comes before 2?', answer: 1 },
    { id: 'SE11', category: 'Counting', question: 'What comes before 3?', answer: 2 },
    { id: 'SE12', category: 'Counting', question: 'What comes before 4?', answer: 3 },
    { id: 'SE13', category: 'Counting', question: 'What comes before 5?', answer: 4 },
    { id: 'SE14', category: 'Counting', question: 'What comes before 6?', answer: 5 },
    { id: 'SE15', category: 'Counting', question: 'What comes before 7?', answer: 6 },
    { id: 'SE16', category: 'Counting', question: 'What comes before 8?', answer: 7 },
    { id: 'SE17', category: 'Counting', question: 'What comes before 9?', answer: 8 },
    { id: 'SE18', category: 'Counting', question: 'What comes before 10?', answer: 9 },
    // More counting variety
    { id: 'SE19', category: 'Counting', question: 'What number is after 0?', answer: 1 },
    { id: 'SE20', category: 'Counting', question: 'What number is before 1?', answer: 0 },
    { id: 'SE21', category: 'Counting', question: 'Count: 1, 2, ...?', answer: 3 },
    { id: 'SE22', category: 'Counting', question: 'Count: 2, 3, ...?', answer: 4 },
    { id: 'SE23', category: 'Counting', question: 'Count: 3, 4, ...?', answer: 5 },
    { id: 'SE24', category: 'Counting', question: 'Count: 4, 5, ...?', answer: 6 },
    { id: 'SE25', category: 'Counting', question: 'Count: 5, 6, ...?', answer: 7 },
    { id: 'SE26', category: 'Counting', question: 'Count: 6, 7, ...?', answer: 8 },
    { id: 'SE27', category: 'Counting', question: 'Count: 7, 8, ...?', answer: 9 },
    { id: 'SE28', category: 'Counting', question: 'Count: 8, 9, ...?', answer: 10 },
    { id: 'SE29', category: 'Counting', question: 'What comes after 0?', answer: 1 },
    { id: 'SE30', category: 'Counting', question: 'Count: 0, 1, ...?', answer: 2 }
  ],
  'very-easy': [
    // Addition +1 or +2 only (ages 5-7)
    { id: 'VE1', category: 'Addition', question: '1 + 1', answer: 2 },
    { id: 'VE2', category: 'Addition', question: '2 + 1', answer: 3 },
    { id: 'VE3', category: 'Addition', question: '3 + 1', answer: 4 },
    { id: 'VE4', category: 'Addition', question: '4 + 1', answer: 5 },
    { id: 'VE5', category: 'Addition', question: '5 + 1', answer: 6 },
    { id: 'VE6', category: 'Addition', question: '6 + 1', answer: 7 },
    { id: 'VE7', category: 'Addition', question: '7 + 1', answer: 8 },
    { id: 'VE8', category: 'Addition', question: '8 + 1', answer: 9 },
    { id: 'VE9', category: 'Addition', question: '9 + 1', answer: 10 },
    { id: 'VE10', category: 'Addition', question: '10 + 1', answer: 11 },
    { id: 'VE11', category: 'Addition', question: '1 + 2', answer: 3 },
    { id: 'VE12', category: 'Addition', question: '2 + 2', answer: 4 },
    { id: 'VE13', category: 'Addition', question: '3 + 2', answer: 5 },
    { id: 'VE14', category: 'Addition', question: '4 + 2', answer: 6 },
    { id: 'VE15', category: 'Addition', question: '5 + 2', answer: 7 },
    { id: 'VE16', category: 'Addition', question: '6 + 2', answer: 8 },
    { id: 'VE17', category: 'Addition', question: '7 + 2', answer: 9 },
    { id: 'VE18', category: 'Addition', question: '8 + 2', answer: 10 },
    { id: 'VE19', category: 'Addition', question: '9 + 2', answer: 11 },
    { id: 'VE20', category: 'Addition', question: '10 + 2', answer: 12 },
    // Subtraction -1 or -2 only
    { id: 'VE21', category: 'Subtraction', question: '3 - 1', answer: 2 },
    { id: 'VE22', category: 'Subtraction', question: '4 - 1', answer: 3 },
    { id: 'VE23', category: 'Subtraction', question: '5 - 1', answer: 4 },
    { id: 'VE24', category: 'Subtraction', question: '6 - 1', answer: 5 },
    { id: 'VE25', category: 'Subtraction', question: '7 - 1', answer: 6 },
    { id: 'VE26', category: 'Subtraction', question: '8 - 1', answer: 7 },
    { id: 'VE27', category: 'Subtraction', question: '9 - 1', answer: 8 },
    { id: 'VE28', category: 'Subtraction', question: '10 - 1', answer: 9 },
    { id: 'VE29', category: 'Subtraction', question: '5 - 2', answer: 3 },
    { id: 'VE30', category: 'Subtraction', question: '6 - 2', answer: 4 },
    { id: 'VE31', category: 'Subtraction', question: '7 - 2', answer: 5 },
    { id: 'VE32', category: 'Subtraction', question: '8 - 2', answer: 6 },
    { id: 'VE33', category: 'Subtraction', question: '9 - 2', answer: 7 },
    { id: 'VE34', category: 'Subtraction', question: '10 - 2', answer: 8 },
    { id: 'VE35', category: 'Subtraction', question: '11 - 2', answer: 9 },
    { id: 'VE36', category: 'Subtraction', question: '12 - 2', answer: 10 }
  ],
  'easy': [
    // Addition up to 100, adding no more than 10 (ages 8-11)
    { id: 'E1', category: 'Addition', question: '10 + 5', answer: 15 },
    { id: 'E2', category: 'Addition', question: '15 + 5', answer: 20 },
    { id: 'E3', category: 'Addition', question: '20 + 10', answer: 30 },
    { id: 'E4', category: 'Addition', question: '25 + 5', answer: 30 },
    { id: 'E5', category: 'Addition', question: '30 + 10', answer: 40 },
    { id: 'E6', category: 'Addition', question: '45 + 5', answer: 50 },
    { id: 'E7', category: 'Addition', question: '50 + 10', answer: 60 },
    { id: 'E8', category: 'Addition', question: '55 + 5', answer: 60 },
    { id: 'E9', category: 'Addition', question: '60 + 10', answer: 70 },
    { id: 'E10', category: 'Addition', question: '75 + 5', answer: 80 },
    { id: 'E11', category: 'Addition', question: '80 + 10', answer: 90 },
    { id: 'E12', category: 'Addition', question: '90 + 10', answer: 100 },
    // Subtraction up to 100, subtracting no more than 10
    { id: 'E13', category: 'Subtraction', question: '20 - 5', answer: 15 },
    { id: 'E14', category: 'Subtraction', question: '30 - 10', answer: 20 },
    { id: 'E15', category: 'Subtraction', question: '40 - 5', answer: 35 },
    { id: 'E16', category: 'Subtraction', question: '50 - 10', answer: 40 },
    { id: 'E17', category: 'Subtraction', question: '55 - 5', answer: 50 },
    { id: 'E18', category: 'Subtraction', question: '60 - 10', answer: 50 },
    { id: 'E19', category: 'Subtraction', question: '75 - 5', answer: 70 },
    { id: 'E20', category: 'Subtraction', question: '80 - 10', answer: 70 },
    { id: 'E21', category: 'Subtraction', question: '90 - 5', answer: 85 },
    { id: 'E22', category: 'Subtraction', question: '100 - 10', answer: 90 },
    // Basic multiplication (simple times tables)
    { id: 'E23', category: 'Multiplication', question: '2 x 2', answer: 4 },
    { id: 'E24', category: 'Multiplication', question: '3 x 2', answer: 6 },
    { id: 'E25', category: 'Multiplication', question: '5 x 2', answer: 10 },
    { id: 'E26', category: 'Multiplication', question: '6 x 1', answer: 6 },
    { id: 'E27', category: 'Multiplication', question: '4 x 2', answer: 8 },
    { id: 'E28', category: 'Multiplication', question: '5 x 1', answer: 5 },
    // Easy division
    { id: 'E29', category: 'Division', question: '4 / 2', answer: 2 },
    { id: 'E30', category: 'Division', question: '2 / 1', answer: 2 },
    { id: 'E31', category: 'Division', question: '3 / 3', answer: 1 },
    { id: 'E32', category: 'Division', question: '6 / 2', answer: 3 },
    { id: 'E33', category: 'Division', question: '8 / 2', answer: 4 },
    { id: 'E34', category: 'Division', question: '10 / 2', answer: 5 }
  ],
  'medium': [
    // Harder addition (ages 12-15)
    { id: 'M1', category: 'Addition', question: '24 + 85', answer: 109 },
    { id: 'M2', category: 'Addition', question: '37 + 48', answer: 85 },
    { id: 'M3', category: 'Addition', question: '56 + 67', answer: 123 },
    { id: 'M4', category: 'Addition', question: '78 + 45', answer: 123 },
    { id: 'M5', category: 'Addition', question: '89 + 34', answer: 123 },
    { id: 'M6', category: 'Addition', question: '65 + 78', answer: 143 },
    { id: 'M7', category: 'Addition', question: '47 + 86', answer: 133 },
    { id: 'M8', category: 'Addition', question: '93 + 58', answer: 151 },
    // Harder subtraction
    { id: 'M9', category: 'Subtraction', question: '200 - 120', answer: 80 },
    { id: 'M10', category: 'Subtraction', question: '321 - 29', answer: 292 },
    { id: 'M11', category: 'Subtraction', question: '150 - 75', answer: 75 },
    { id: 'M12', category: 'Subtraction', question: '245 - 67', answer: 178 },
    { id: 'M13', category: 'Subtraction', question: '180 - 95', answer: 85 },
    { id: 'M14', category: 'Subtraction', question: '300 - 145', answer: 155 },
    { id: 'M15', category: 'Subtraction', question: '275 - 89', answer: 186 },
    { id: 'M16', category: 'Subtraction', question: '400 - 225', answer: 175 },
    // Medium multiplication
    { id: 'M17', category: 'Multiplication', question: '6 x 7', answer: 42 },
    { id: 'M18', category: 'Multiplication', question: '8 x 6', answer: 48 },
    { id: 'M19', category: 'Multiplication', question: '7 x 8', answer: 56 },
    { id: 'M20', category: 'Multiplication', question: '9 x 6', answer: 54 },
    { id: 'M21', category: 'Multiplication', question: '8 x 7', answer: 56 },
    { id: 'M22', category: 'Multiplication', question: '9 x 7', answer: 63 },
    { id: 'M23', category: 'Multiplication', question: '12 x 5', answer: 60 },
    { id: 'M24', category: 'Multiplication', question: '11 x 6', answer: 66 },
    // Medium division
    { id: 'M25', category: 'Division', question: '24 / 3', answer: 8 },
    { id: 'M26', category: 'Division', question: '64 / 8', answer: 8 },
    { id: 'M27', category: 'Division', question: '42 / 6', answer: 7 },
    { id: 'M28', category: 'Division', question: '56 / 7', answer: 8 },
    { id: 'M29', category: 'Division', question: '72 / 9', answer: 8 },
    { id: 'M30', category: 'Division', question: '48 / 6', answer: 8 }
  ],
  'hard': [
    // Three-digit addition (ages 16-18)
    { id: 'H1', category: 'Addition', question: '125 + 275', answer: 400 },
    { id: 'H2', category: 'Addition', question: '348 + 152', answer: 500 },
    { id: 'H3', category: 'Addition', question: '467 + 233', answer: 700 },
    { id: 'H4', category: 'Addition', question: '189 + 211', answer: 400 },
    { id: 'H5', category: 'Addition', question: '356 + 244', answer: 600 },
    { id: 'H6', category: 'Addition', question: '478 + 322', answer: 800 },
    { id: 'H7', category: 'Addition', question: '567 + 233', answer: 800 },
    // Three-digit subtraction
    { id: 'H8', category: 'Subtraction', question: '500 - 237', answer: 263 },
    { id: 'H9', category: 'Subtraction', question: '600 - 345', answer: 255 },
    { id: 'H10', category: 'Subtraction', question: '700 - 428', answer: 272 },
    { id: 'H11', category: 'Subtraction', question: '800 - 456', answer: 344 },
    { id: 'H12', category: 'Subtraction', question: '450 - 178', answer: 272 },
    { id: 'H13', category: 'Subtraction', question: '625 - 389', answer: 236 },
    { id: 'H14', category: 'Subtraction', question: '750 - 467', answer: 283 },
    // Advanced times tables (11-15)
    { id: 'H15', category: 'Multiplication', question: '12 x 11', answer: 132 },
    { id: 'H16', category: 'Multiplication', question: '13 x 7', answer: 91 },
    { id: 'H17', category: 'Multiplication', question: '14 x 6', answer: 84 },
    { id: 'H18', category: 'Multiplication', question: '15 x 8', answer: 120 },
    { id: 'H19', category: 'Multiplication', question: '12 x 12', answer: 144 },
    { id: 'H20', category: 'Multiplication', question: '13 x 9', answer: 117 },
    { id: 'H21', category: 'Multiplication', question: '14 x 7', answer: 98 },
    { id: 'H22', category: 'Multiplication', question: '15 x 9', answer: 135 },
    // Division with larger numbers
    { id: 'H23', category: 'Division', question: '144 / 12', answer: 12 },
    { id: 'H24', category: 'Division', question: '117 / 9', answer: 13 },
    { id: 'H25', category: 'Division', question: '98 / 7', answer: 14 },
    { id: 'H26', category: 'Division', question: '120 / 8', answer: 15 },
    { id: 'H27', category: 'Division', question: '132 / 11', answer: 12 },
    { id: 'H28', category: 'Division', question: '91 / 7', answer: 13 },
    { id: 'H29', category: 'Division', question: '108 / 9', answer: 12 },
    { id: 'H30', category: 'Division', question: '156 / 12', answer: 13 }
  ],
  'very-hard': [
    // Large number operations (ages 19+)
    { id: 'VH1', category: 'Addition', question: '789 + 456', answer: 1245 },
    { id: 'VH2', category: 'Addition', question: '867 + 589', answer: 1456 },
    { id: 'VH3', category: 'Addition', question: '945 + 678', answer: 1623 },
    { id: 'VH4', category: 'Addition', question: '1250 + 875', answer: 2125 },
    { id: 'VH5', category: 'Addition', question: '1456 + 789', answer: 2245 },
    // Four-digit subtraction
    { id: 'VH6', category: 'Subtraction', question: '1000 - 673', answer: 327 },
    { id: 'VH7', category: 'Subtraction', question: '1500 - 867', answer: 633 },
    { id: 'VH8', category: 'Subtraction', question: '2000 - 1234', answer: 766 },
    { id: 'VH9', category: 'Subtraction', question: '1750 - 975', answer: 775 },
    { id: 'VH10', category: 'Subtraction', question: '2500 - 1678', answer: 822 },
    // Two-digit multiplication
    { id: 'VH11', category: 'Multiplication', question: '17 x 14', answer: 238 },
    { id: 'VH12', category: 'Multiplication', question: '19 x 13', answer: 247 },
    { id: 'VH13', category: 'Multiplication', question: '23 x 15', answer: 345 },
    { id: 'VH14', category: 'Multiplication', question: '25 x 18', answer: 450 },
    { id: 'VH15', category: 'Multiplication', question: '32 x 16', answer: 512 },
    { id: 'VH16', category: 'Multiplication', question: '24 x 24', answer: 576 },
    { id: 'VH17', category: 'Multiplication', question: '35 x 25', answer: 875 },
    // Percentages
    { id: 'VH18', category: 'Percentage', question: '15% of 400', answer: 60 },
    { id: 'VH19', category: 'Percentage', question: '25% of 360', answer: 90 },
    { id: 'VH20', category: 'Percentage', question: '30% of 250', answer: 75 },
    { id: 'VH21', category: 'Percentage', question: '40% of 175', answer: 70 },
    { id: 'VH22', category: 'Percentage', question: '75% of 120', answer: 90 },
    // Division with larger numbers
    { id: 'VH23', category: 'Division', question: '225 / 15', answer: 15 },
    { id: 'VH24', category: 'Division', question: '324 / 18', answer: 18 },
    { id: 'VH25', category: 'Division', question: '400 / 25', answer: 16 },
    { id: 'VH26', category: 'Division', question: '576 / 24', answer: 24 },
    { id: 'VH27', category: 'Division', question: '625 / 25', answer: 25 },
    // Squares
    { id: 'VH28', category: 'Squares', question: '15 squared', answer: 225 },
    { id: 'VH29', category: 'Squares', question: '18 squared', answer: 324 },
    { id: 'VH30', category: 'Squares', question: '22 squared', answer: 484 }
  ],
  'genius': [
    // Complex multiplication (shifted from old master)
    { id: 'G1', category: 'Multiplication', question: '37 x 43', answer: 1591 },
    { id: 'G2', category: 'Multiplication', question: '56 x 78', answer: 4368 },
    { id: 'G3', category: 'Multiplication', question: '64 x 125', answer: 8000 },
    { id: 'G4', category: 'Multiplication', question: '99 x 99', answer: 9801 },
    { id: 'G5', category: 'Multiplication', question: '125 x 8', answer: 1000 },
    // Squares and cubes
    { id: 'G6', category: 'Squares', question: '17 squared', answer: 289 },
    { id: 'G7', category: 'Squares', question: '19 squared', answer: 361 },
    { id: 'G8', category: 'Squares', question: '21 squared', answer: 441 },
    { id: 'G9', category: 'Cubes', question: '5 cubed', answer: 125 },
    { id: 'G10', category: 'Cubes', question: '6 cubed', answer: 216 },
    // Complex percentages
    { id: 'G11', category: 'Percentage', question: '35% of 240', answer: 84 },
    { id: 'G12', category: 'Percentage', question: '12.5% of 400', answer: 50 },
    { id: 'G13', category: 'Percentage', question: '75% of 320', answer: 240 },
    { id: 'G14', category: 'Percentage', question: '8% of 1250', answer: 100 },
    { id: 'G15', category: 'Percentage', question: '125% of 80', answer: 100 },
    // Square roots
    { id: 'G16', category: 'Square Roots', question: 'Square root of 169', answer: 13 },
    { id: 'G17', category: 'Square Roots', question: 'Square root of 225', answer: 15 },
    { id: 'G18', category: 'Square Roots', question: 'Square root of 289', answer: 17 },
    { id: 'G19', category: 'Square Roots', question: 'Square root of 324', answer: 18 },
    { id: 'G20', category: 'Square Roots', question: 'Square root of 400', answer: 20 },
    // Complex division
    { id: 'G21', category: 'Division', question: '1728 / 12', answer: 144 },
    { id: 'G22', category: 'Division', question: '2025 / 45', answer: 45 },
    { id: 'G23', category: 'Division', question: '3600 / 75', answer: 48 },
    { id: 'G24', category: 'Division', question: '4096 / 64', answer: 64 },
    // Mixed operations
    { id: 'G25', category: 'Mixed', question: '(15 x 12) + 20', answer: 200 },
    { id: 'G26', category: 'Mixed', question: '(144 / 12) x 5', answer: 60 },
    { id: 'G27', category: 'Mixed', question: '(25 x 4) - 50', answer: 50 },
    { id: 'G28', category: 'Mixed', question: '(100 - 36) / 8', answer: 8 },
    { id: 'G29', category: 'Mixed', question: '(7 x 8) + (9 x 6)', answer: 110 },
    { id: 'G30', category: 'Mixed', question: '(12 x 12) - 44', answer: 100 }
  ]
};

// Legacy flat list for backwards compatibility
const MATH_QUESTIONS = [...MATH_QUESTIONS_BY_DIFFICULTY['medium']];

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

// Pictionary game constants
const PICTIONARY_DEFAULT_DRAWER_TIME = 60; // Default 60 seconds per drawer (can be customized via game config)

// Pictionary word banks by difficulty
const PICTIONARY_WORDS_BY_DIFFICULTY = {
  'super-easy': [
    // Very simple shapes and objects for toddlers (ages 2-4) - UNIQUE to this level
    // Basic shapes they can draw
    'SUN', 'MOON', 'STAR', 'BALL', 'HEART', 'CIRCLE',
    // Simple familiar objects
    'HAT', 'SHOE', 'BABY', 'MOM', 'DAD', 'BOY', 'GIRL',
    // Easy animals (one word, simple shapes)
    'CAT', 'DOG', 'BUG', 'ANT', 'BEE',
    // Food
    'APPLE', 'EGG', 'PIE',
    // Very basic items
    'BED', 'BOX', 'KEY', 'CUP'
  ],
  'very-easy': [
    // Simple words for young children (ages 5-7) - UNIQUE to this level
    // Animals (different from super-easy)
    'FISH', 'BIRD', 'COW', 'PIG', 'DUCK', 'FROG', 'HORSE', 'SHEEP', 'MOUSE', 'SNAKE',
    // Nature (different from super-easy)
    'TREE', 'FLOWER', 'RAIN', 'CLOUD', 'SNOW', 'RAINBOW', 'LEAF', 'GRASS',
    // Objects
    'HOUSE', 'CAR', 'BUS', 'BOAT', 'TRAIN', 'PLANE',
    // Food (different from super-easy)
    'BANANA', 'PIZZA', 'ICE CREAM', 'COOKIE', 'CAKE', 'BREAD',
    // Body parts
    'HAND', 'FOOT', 'EYE', 'NOSE', 'MOUTH', 'EAR', 'TEETH',
    // Simple items (different from super-easy)
    'CHAIR', 'TABLE', 'DOOR', 'WINDOW', 'BOOK', 'PEN', 'SPOON', 'FORK'
  ],
  'easy': [
    // Animals (ages 8-11) - UNIQUE to this level (no duplicates from very-easy)
    'ELEPHANT', 'GIRAFFE', 'LION', 'MONKEY', 'TURTLE', 'RABBIT', 'BUTTERFLY', 'SPIDER', 'DOLPHIN',
    'PENGUIN', 'KANGAROO', 'BEAR', 'CHICKEN', 'OWL', 'SHARK', 'WHALE', 'OCTOPUS', 'ZEBRA', 'HIPPO', 'CROCODILE',
    // Objects (no TRAIN - that's in very-easy)
    'BICYCLE', 'AIRPLANE', 'HELICOPTER', 'ROCKET', 'UMBRELLA', 'CAMERA', 'TELEPHONE', 'COMPUTER', 'GUITAR',
    'PIANO', 'DRUM', 'CLOCK', 'LAMP', 'MIRROR', 'SCISSORS', 'HAMMER', 'LADDER', 'TELESCOPE', 'ROBOT',
    // Places/Things
    'CASTLE', 'MOUNTAIN', 'BEACH', 'ISLAND', 'VOLCANO', 'WATERFALL', 'BRIDGE', 'LIGHTHOUSE', 'TENT', 'IGLOO',
    // Food
    'HAMBURGER', 'HOT DOG', 'SANDWICH', 'POPCORN', 'DONUT', 'CUPCAKE', 'PANCAKE', 'SPAGHETTI', 'TACO', 'SUSHI',
    // Activities
    'SWIMMING', 'RUNNING', 'SLEEPING', 'READING', 'DANCING', 'SINGING', 'COOKING', 'PAINTING', 'FISHING', 'CAMPING'
  ],
  'medium': [
    'TREASURE', 'UNICORN', 'DRAGON', 'PIRATE', 'NINJA', 'ASTRONAUT', 'MERMAID', 'WIZARD', 'VAMPIRE', 'ZOMBIE',
    'DINOSAUR', 'TORNADO', 'EARTHQUAKE', 'AVALANCHE', 'HURRICANE', 'LIGHTNING', 'METEOR', 'ECLIPSE', 'CONSTELLATION', 'GALAXY',
    'SKATEBOARD', 'SURFBOARD', 'PARACHUTE', 'TRAMPOLINE', 'ROLLERCOASTER', 'FERRIS WHEEL', 'BOWLING', 'ARCHERY', 'KARATE', 'GYMNASTICS',
    'BIRTHDAY PARTY', 'WEDDING', 'GRADUATION', 'HALLOWEEN', 'CHRISTMAS TREE', 'FIREWORKS', 'PARADE', 'CARNIVAL', 'CIRCUS', 'CONCERT',
    'JUGGLING', 'SNOWBOARDING', 'SKYDIVING', 'SCUBA DIVING', 'ROCK CLIMBING', 'BUNGEE JUMPING', 'HORSEBACK RIDING', 'ICE SKATING', 'SURFING', 'SKIING',
    'MAGICIAN', 'SUPERHERO', 'DETECTIVE', 'SCIENTIST', 'FIREFIGHTER', 'CHEF', 'PHOTOGRAPHER', 'ARTIST', 'MUSICIAN', 'ATHLETE'
  ],
  'hard': [
    // Abstract concepts
    'JEALOUSY', 'FREEDOM', 'CURIOSITY', 'PATIENCE', 'COURAGE', 'WISDOM', 'CHAOS', 'HARMONY', 'NOSTALGIA', 'AMBITION',
    // Phrases - Actions
    'RUNNING LATE', 'WAKING UP EARLY', 'STUCK IN TRAFFIC', 'WAITING IN LINE', 'LOSING YOUR KEYS', 'CHECKING YOUR PHONE', 'MAKING A WISH', 'BREAKING A PROMISE', 'KEEPING A SECRET', 'TELLING A LIE',
    // Phrases - Situations
    'FIRST DATE', 'JOB INTERVIEW', 'AWKWARD SILENCE', 'SURPRISE PARTY', 'BLIND DATE', 'ROAD TRIP', 'POWER OUTAGE', 'TRAFFIC JAM', 'FIRE DRILL', 'FLASH MOB',
    // Phrases - States
    'HAVING A BAD DAY', 'FEELING HOMESICK', 'STAGE FRIGHT', 'WRITERS BLOCK', 'MONDAY MORNING', 'FRIDAY NIGHT', 'SLEEPWALKING', 'DAYDREAMING', 'MULTITASKING', 'PROCRASTINATING',
    // Compound concepts
    'TIME TRAVEL', 'GLOBAL WARMING', 'SOCIAL MEDIA', 'VIRTUAL REALITY', 'ARTIFICIAL INTELLIGENCE', 'SPACE STATION', 'BLACK HOLE', 'PARALLEL UNIVERSE', 'DEJA VU', 'KARMA',
    // Scenarios
    'CATCHING A FLIGHT', 'MISSING THE BUS', 'ORDERING TAKEOUT', 'WORKING FROM HOME', 'BINGE WATCHING', 'ONLINE SHOPPING', 'VIDEO CALL', 'SELFIE STICK', 'ESCAPE ROOM', 'TREASURE HUNT'
  ],
  'very-hard': [
    // Advanced abstract concepts (ages 19+) - UNIQUE to this level
    'DEMOCRACY', 'CAPITALISM', 'EVOLUTION', 'GRAVITY', 'INFINITY', 'ETERNITY', 'DESTINY', 'FATE', 'IRONY', 'PARADOX',
    // Professional scenarios
    'CORPORATE MEETING', 'BUDGET CRISIS', 'HOSTILE TAKEOVER', 'STOCK MARKET CRASH', 'MIDLIFE CRISIS', 'QUARTER-LIFE CRISIS', 'IDENTITY THEFT', 'CULTURE SHOCK', 'IMPOSTOR SYNDROME', 'BURNOUT',
    // Modern life challenges
    'CANCEL CULTURE', 'CLICKBAIT', 'VIRAL VIDEO', 'INFLUENCER', 'CRYPTOCURRENCY', 'ALGORITHM', 'DATA PRIVACY', 'CARBON FOOTPRINT', 'GENTRIFICATION', 'INFLATION',
    // Complex emotions and states
    'EXISTENTIAL CRISIS', 'COGNITIVE DISSONANCE', 'BUYERS REMORSE', 'ANALYSIS PARALYSIS', 'DECISION FATIGUE', 'INFORMATION OVERLOAD', 'LEARNED HELPLESSNESS', 'COMFORT ZONE', 'GLASS CEILING', 'RAT RACE'
  ],
  'genius': [
    // Idioms and sayings
    'THE EARLY BIRD CATCHES THE WORM', 'DONT CRY OVER SPILLED MILK', 'WALKING ON THIN ICE', 'PIECE OF CAKE', 'BREAK A LEG', 'COSTS AN ARM AND A LEG', 'ELEPHANT IN THE ROOM', 'RAINING CATS AND DOGS', 'WHEN PIGS FLY', 'KILL TWO BIRDS WITH ONE STONE',
    'LET THE CAT OUT OF THE BAG', 'BARKING UP THE WRONG TREE', 'BITE THE BULLET', 'BURNING THE MIDNIGHT OIL', 'HIT THE NAIL ON THE HEAD', 'JUMP ON THE BANDWAGON', 'ONCE IN A BLUE MOON', 'SPILL THE BEANS', 'THE BALL IS IN YOUR COURT', 'THROW IN THE TOWEL',
    // Complex scenarios
    'CAUGHT BETWEEN A ROCK AND A HARD PLACE', 'TURNING OVER A NEW LEAF', 'BURNING BRIDGES', 'CROSSING THE FINISH LINE', 'CLIMBING THE CORPORATE LADDER', 'PASSING THE TORCH', 'OPENING A CAN OF WORMS', 'STIRRING THE POT', 'READING BETWEEN THE LINES', 'THINKING OUTSIDE THE BOX',
    // Abstract phrases
    'DIAMOND IN THE ROUGH', 'NEEDLE IN A HAYSTACK', 'TIP OF THE ICEBERG', 'LIGHT AT THE END OF THE TUNNEL', 'WOLF IN SHEEPS CLOTHING', 'BLESSING IN DISGUISE', 'SILVER LINING', 'DOUBLE EDGED SWORD', 'SLIPPERY SLOPE', 'DOMINO EFFECT',
    // Complex actions
    'PUTTING ALL YOUR EGGS IN ONE BASKET', 'BEATING AROUND THE BUSH', 'BITING OFF MORE THAN YOU CAN CHEW', 'GETTING YOUR DUCKS IN A ROW', 'HITTING THE GROUND RUNNING', 'LEAVING NO STONE UNTURNED', 'PLAYING DEVILS ADVOCATE', 'SEEING EYE TO EYE', 'STEALING SOMEONES THUNDER', 'TAKING THE BULL BY THE HORNS'
  ]
};

// Difficulty labels for word options
const DIFFICULTY_LABELS = {
  'super-easy': 'Super Easy',
  'very-easy': 'Very Easy',
  'easy': 'Easy',
  'medium': 'Medium',
  'hard': 'Hard',
  'very-hard': 'Very Hard',
  'genius': 'Genius'
};

// Legacy word list (fallback)
const PICTIONARY_WORDS = PICTIONARY_WORDS_BY_DIFFICULTY['medium'];

// Track disconnected players in their grace period so we can cancel removal on rejoin
// Key: "roomId:playerName", Value: { timer }
const disconnectedPlayers = new Map();

// Track expelled players who can still rejoin (after grace period but within extended window)
// Key: "roomId:playerName", Value: { playerData, rejoinToken, timer, expiredAt }
const expelledPlayers = new Map();

// Track players who haven't selected an avatar yet
// Key: "roomId:playerName", Value: { timer }
const avatarSelectionTimers = new Map();

// Track which room each master owns (for detecting when master joins another room)
// Key: masterName, Value: roomId
const masterRooms = new Map();

const GRACE_PERIOD_MS = 180000; // 3 minutes before marking as expelled
const EXPELLED_REJOIN_WINDOW_MS = 600000; // 10 minutes to rejoin after being expelled
const AVATAR_SELECTION_TIMEOUT_MS = 120000; // 2 minutes to select avatar

// --- Multi-round Pictionary helpers ---

function computeDrawingOrder(players) {
  return players
    .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, tiebreaker: Math.random() }))
    .sort((a, b) => b.score - a.score || a.tiebreaker - b.tiebreaker)
    .map(({ name, avatar }) => ({ name, avatar }));
}

function pickWord(usedWords, difficulty = 'medium') {
  const words = PICTIONARY_WORDS_BY_DIFFICULTY[difficulty] || PICTIONARY_WORDS_BY_DIFFICULTY['medium'];
  const available = words.filter(w => !usedWords.includes(w));
  const pool = available.length > 0 ? available : words;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Get player's effective difficulty (individual override or room default)
function getPlayerDifficulty(playerName, room) {
  if (room.playerDifficulties && room.playerDifficulties[playerName]) {
    return room.playerDifficulties[playerName];
  }
  return room.difficulty || DEFAULT_DIFFICULTY;
}

// Get difficulty range for all active players in the room
function getDifficultyRange(room) {
  const activePlayers = room.players.filter(p => p.connected !== false);
  if (activePlayers.length === 0) {
    return { lowest: 'medium', highest: 'medium' };
  }

  const difficulties = activePlayers.map(p => getPlayerDifficulty(p.name, room));
  const indices = difficulties.map(d => DIFFICULTY_LEVELS.indexOf(d));
  const minIdx = Math.min(...indices);
  const maxIdx = Math.max(...indices);

  return {
    lowest: DIFFICULTY_LEVELS[minIdx >= 0 ? minIdx : 2],
    highest: DIFFICULTY_LEVELS[maxIdx >= 0 ? maxIdx : 2]
  };
}

// Generate word options for drawer spanning difficulty range
function getWordOptions(room, usedWords = [], count = 3) {
  const { lowest, highest } = getDifficultyRange(room);
  const lowestIdx = DIFFICULTY_LEVELS.indexOf(lowest);
  const highestIdx = DIFFICULTY_LEVELS.indexOf(highest);

  // Build list of difficulties to pull from
  const difficultiesToUse = [];
  for (let i = lowestIdx; i <= highestIdx; i++) {
    difficultiesToUse.push(DIFFICULTY_LEVELS[i]);
  }

  // If not enough difficulties, expand range
  while (difficultiesToUse.length < count && difficultiesToUse.length < DIFFICULTY_LEVELS.length) {
    const lastIdx = DIFFICULTY_LEVELS.indexOf(difficultiesToUse[difficultiesToUse.length - 1]);
    if (lastIdx < DIFFICULTY_LEVELS.length - 1) {
      difficultiesToUse.push(DIFFICULTY_LEVELS[lastIdx + 1]);
    } else {
      const firstIdx = DIFFICULTY_LEVELS.indexOf(difficultiesToUse[0]);
      if (firstIdx > 0) {
        difficultiesToUse.unshift(DIFFICULTY_LEVELS[firstIdx - 1]);
      } else {
        break;
      }
    }
  }

  const options = [];
  const usedInOptions = [...usedWords];

  // Try to get one word from each difficulty first
  for (const diff of difficultiesToUse) {
    if (options.length >= count) break;
    const word = pickWord(usedInOptions, diff);
    if (word) {
      options.push({
        word,
        difficulty: diff,
        difficultyLabel: DIFFICULTY_LABELS[diff] || diff
      });
      usedInOptions.push(word);
    }
  }

  // Fill remaining slots if needed
  while (options.length < count) {
    const diff = difficultiesToUse[Math.floor(Math.random() * difficultiesToUse.length)];
    const word = pickWord(usedInOptions, diff);
    if (word) {
      options.push({
        word,
        difficulty: diff,
        difficultyLabel: DIFFICULTY_LABELS[diff] || diff
      });
      usedInOptions.push(word);
    } else {
      break; // No more words available
    }
  }

  // Sort by difficulty (easiest first)
  options.sort((a, b) => DIFFICULTY_LEVELS.indexOf(a.difficulty) - DIFFICULTY_LEVELS.indexOf(b.difficulty));

  return options;
}

function startRound(io, room, roomId) {
  // Generate word options for the drawer
  const wordOptions = getWordOptions(room, room.game.usedWords);
  room.game.wordOptions = wordOptions;
  room.game.wordSelected = false;
  room.game.currentWord = null; // Word not set until drawer picks

  io.to(roomId).emit('gameStarted', {
    drawerName: room.game.drawerName,
    currentRound: room.game.currentRound,
    totalRounds: room.game.totalRounds,
    currentPickValue: room.game.currentPickValue
  });

  const drawerPlayer = room.players.find(p => p.name === room.game.drawerName);
  if (drawerPlayer) {
    // Send word options instead of a single word
    io.to(drawerPlayer.socketId).emit('wordOptions', { options: wordOptions });
  }

  // Timer starts when drawer selects a word (handled in selectWord handler)
  // But set a backup timeout in case drawer doesn't select
  room.game.wordSelectionTimeout = setTimeout(() => {
    if (room.game && !room.game.wordSelected) {
      // Auto-select the first (easiest) word if drawer doesn't pick
      const autoWord = wordOptions[0];
      if (autoWord) {
        room.game.currentWord = autoWord.word;
        room.game.wordSelected = true;
        room.game.usedWords.push(autoWord.word);
        room.game.drawerLockedDifficulty = autoWord.difficulty; // Lock drawer to auto-selected difficulty

        const drawer = room.players.find(p => p.name === room.game.drawerName);
        if (drawer) {
          io.to(drawer.socketId).emit('yourWord', { word: autoWord.word, autoSelected: true });
        }

        // Now start the game timer (use config or default)
        const drawerTimeMs = (room.game.config?.drawerTime || PICTIONARY_DEFAULT_DRAWER_TIME) * 1000;
        const endTime = Date.now() + drawerTimeMs;
        room.game.timerEndTime = endTime;
        room.game.timerRemainingMs = null;
        io.to(roomId).emit('gameTimerStart', { endTime });
      }
    }
  }, 15000); // 15 seconds to pick (10s countdown + 5s buffer)
}

function advanceRound(io, room, roomId) {
  if (!room.game || !room.game.drawingOrder) {
    console.error('[PICTIONARY] advanceRound called with missing game or drawingOrder');
    return;
  }
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

  // Clear any existing word selection timeout
  if (room.game.wordSelectionTimeout) {
    clearTimeout(room.game.wordSelectionTimeout);
  }

  // Generate word options for the new drawer
  const wordOptions = getWordOptions(room, room.game.usedWords);
  room.game.wordOptions = wordOptions;
  room.game.wordSelected = false;
  room.game.currentWord = null;
  room.game.drawerName = drawer.name;
  room.game.drawerLockedDifficulty = null; // Reset locked difficulty for new drawer
  room.game.currentPickValue = 100;

  io.to(roomId).emit('nextRound', {
    drawerName: drawer.name,
    currentRound: room.game.currentRound,
    totalRounds: room.game.totalRounds,
    currentPickValue: 100
  });

  const drawerPlayer = room.players.find(p => p.name === drawer.name);
  if (drawerPlayer) {
    // Send word options instead of a single word
    io.to(drawerPlayer.socketId).emit('wordOptions', { options: wordOptions });
  }

  // Timer starts when drawer selects a word (handled in selectWord handler)
  // Set a backup timeout in case drawer doesn't select
  room.game.wordSelectionTimeout = setTimeout(() => {
    if (room.game && !room.game.wordSelected) {
      // Auto-select the first (easiest) word if drawer doesn't pick
      const autoWord = wordOptions[0];
      if (autoWord) {
        room.game.currentWord = autoWord.word;
        room.game.wordSelected = true;
        room.game.usedWords.push(autoWord.word);
        room.game.drawerLockedDifficulty = autoWord.difficulty; // Lock drawer to auto-selected difficulty

        const newDrawer = room.players.find(p => p.name === room.game.drawerName);
        if (newDrawer) {
          io.to(newDrawer.socketId).emit('yourWord', { word: autoWord.word, autoSelected: true });
        }

        // Now start the game timer (use config or default)
        const drawerTimeMs = (room.game.config?.drawerTime || PICTIONARY_DEFAULT_DRAWER_TIME) * 1000;
        const endTime = Date.now() + drawerTimeMs;
        room.game.timerEndTime = endTime;
        room.game.timerRemainingMs = null;
        io.to(roomId).emit('gameTimerStart', { endTime });
      }
    }
  }, 15000);
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

function getRandomTriviaQuestions(countOrDifficulty, countOrUsedIds = [], usedIdsParam = [], allowedCategories = null) {
  // Support both old signature (count, usedIds) and new signature (difficulty, count, usedIds, allowedCategories)
  let difficulty, count, usedIds;

  if (typeof countOrDifficulty === 'string') {
    // New signature: getRandomTriviaQuestions(difficulty, count, usedIds, allowedCategories)
    difficulty = countOrDifficulty;
    count = countOrUsedIds;
    usedIds = usedIdsParam || [];
    // allowedCategories passed as 4th param
  } else {
    // Legacy signature: getRandomTriviaQuestions(count, usedIds)
    difficulty = null;
    count = countOrDifficulty;
    usedIds = countOrUsedIds || [];
  }

  // Get question pool based on difficulty
  let pool;
  if (difficulty && TRIVIA_QUESTIONS_BY_DIFFICULTY[difficulty]) {
    pool = TRIVIA_QUESTIONS_BY_DIFFICULTY[difficulty];
    console.log(`[TRIVIA Q-SELECT] Using difficulty pool '${difficulty}' with ${pool.length} questions, ${usedIds.length} already used`);
  } else {
    // Use all questions for legacy or unknown difficulty
    pool = TRIVIA_QUESTIONS;
    console.log(`[TRIVIA Q-SELECT] WARNING: Falling back to ALL questions pool (difficulty: ${difficulty})`);
  }

  // Filter by allowed categories if specified
  if (allowedCategories && allowedCategories.length > 0) {
    pool = pool.filter(q => allowedCategories.includes(q.category));
    console.log(`[TRIVIA Q-SELECT] Filtered to ${pool.length} questions for categories: ${allowedCategories.join(', ')}`);
  }

  // First, get questions that haven't been used yet
  const available = pool.filter(q => !usedIds.includes(q.id));
  const shuffledAvailable = [...available].sort(() => Math.random() - 0.5);

  let selected = [];

  if (shuffledAvailable.length >= count) {
    // Enough unused questions - just take what we need
    selected = shuffledAvailable.slice(0, count);
  } else {
    // Not enough unused questions - use all available first, then supplement with oldest used
    selected = [...shuffledAvailable];

    const stillNeeded = count - selected.length;
    if (stillNeeded > 0) {
      // Get questions that were used (prioritize oldest used by order in usedIds)
      const alreadyUsed = pool.filter(q => usedIds.includes(q.id));
      // Sort by when they were used (earlier in usedIds = used longer ago)
      alreadyUsed.sort((a, b) => usedIds.indexOf(a.id) - usedIds.indexOf(b.id));

      // Take the oldest used questions we need
      const supplemental = alreadyUsed.slice(0, stillNeeded);
      selected = [...selected, ...supplemental];

      console.log(`[TRIVIA Q-SELECT] WARNING: Pool exhausted for '${difficulty}'. Reusing ${stillNeeded} oldest questions.`);
    }
  }

  // Final shuffle to mix any reused questions
  selected = selected.sort(() => Math.random() - 0.5);

  console.log(`[TRIVIA Q-SELECT] Selected ${selected.length} questions for '${difficulty}': ${selected.map(q => q.id).join(', ')}`);
  return selected;
}

// Group players by their difficulty setting and return sorted groups (easiest first)
function getPlayersGroupedByDifficulty(room) {
  const activePlayers = room.players.filter(p => p.connected !== false);
  const groups = {};

  // Initialize groups for all difficulty levels
  DIFFICULTY_LEVELS.forEach(diff => {
    groups[diff] = [];
  });

  // Assign players to groups based on their difficulty
  activePlayers.forEach(player => {
    const playerDiff = getPlayerDifficulty(player.name, room);
    groups[playerDiff].push(player);
  });

  // Return only non-empty groups, sorted by difficulty (easiest first)
  const sortedGroups = [];
  DIFFICULTY_LEVELS.forEach(diff => {
    if (groups[diff].length > 0) {
      sortedGroups.push({
        difficulty: diff,
        players: groups[diff],
        playerNames: groups[diff].map(p => p.name)
      });
    }
  });

  return sortedGroups;
}

// Get display label for difficulty
function getDifficultyLabel(difficulty) {
  // Use the centralized DIFFICULTY_LABELS constant
  return DIFFICULTY_LABELS[difficulty] || 'Medium';
}

function calculateTriviaPoints(answerTimestamp, questionStartTime, questionDuration, isSpeedRound) {
  const timeTaken = answerTimestamp - questionStartTime;
  const maxTime = questionDuration;

  // Time bonus: max points during grace period, then depletes to 0
  let timeBonus;
  if (timeTaken <= TRIVIA_GRACE_PERIOD) {
    timeBonus = TRIVIA_TIME_BONUS_MAX;  // Full bonus during grace period
  } else {
    const depletionTime = maxTime - TRIVIA_GRACE_PERIOD;
    const timeIntoDepletion = timeTaken - TRIVIA_GRACE_PERIOD;
    const timeRatio = Math.max(0, 1 - (timeIntoDepletion / depletionTime));
    timeBonus = Math.floor(timeRatio * TRIVIA_TIME_BONUS_MAX);
  }

  const basePoints = TRIVIA_BASE_POINTS + timeBonus;
  return isSpeedRound ? basePoints * TRIVIA_SPEED_MULTIPLIER : basePoints;
}

// Helper function to determine questions per round based on group count
function getQuestionsPerRoundForGroupCount(groupCount) {
  if (groupCount === 1) return 10;
  if (groupCount === 2) return 8;
  if (groupCount === 3) return 6;
  return 5; // 4+ groups minimum
}

function startTriviaRound(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  const roundIndex = game.currentRound - 1;
  const isSpeedRound = game.currentRound === 4;

  game.isSpeedRound = isSpeedRound;
  game.currentQuestionIndex = 0;
  game.phase = 'rules';

  // Set up difficulty groups for non-speed rounds
  if (!isSpeedRound) {
    // Debug: Log room difficulty settings
    console.log(`[TRIVIA] Room difficulty: ${room.difficulty}, playerDifficulties:`, JSON.stringify(room.playerDifficulties));
    room.players.forEach(p => {
      console.log(`[TRIVIA] Player ${p.name} effective difficulty: ${getPlayerDifficulty(p.name, room)}`);
    });

    game.difficultyGroups = getPlayersGroupedByDifficulty(room);
    game.currentGroupIndex = 0;
    game.groupAnswers = {};  // Track answers per group: { groupIndex: { playerName: answer } }
    console.log(`[TRIVIA] Difficulty groups: ${game.difficultyGroups.map(g => `${g.difficulty}(${g.players.length}): ${g.playerNames.join(', ')}`).join(' | ')}`);

    // Dynamic question count based on number of groups
    const groupCount = game.difficultyGroups.length;
    const questionsPerGroup = getQuestionsPerRoundForGroupCount(groupCount);
    console.log(`[TRIVIA] Group count: ${groupCount}, questions per group: ${questionsPerGroup}`);

    // Get allowed categories from game config (theme filtering)
    console.log(`[TRIVIA] game.config:`, JSON.stringify(game.config));
    console.log(`[TRIVIA] game.config?.themes:`, JSON.stringify(game.config?.themes));
    const allowedCategories = getCategoriesFromThemes(game.config?.themes);
    console.log(`[TRIVIA] allowedCategories:`, JSON.stringify(allowedCategories));

    // Generate questions for each group from their difficulty pool
    game.roundQuestionsByGroup = {};
    game.difficultyGroups.forEach((group, groupIndex) => {
      const difficulty = group.difficulty;
      const usedIds = game.usedQuestionIdsByDifficulty[difficulty] || [];
      const questions = getRandomTriviaQuestions(difficulty, questionsPerGroup, usedIds, allowedCategories);
      game.roundQuestionsByGroup[groupIndex] = questions;

      // Track used IDs per difficulty
      questions.forEach(q => {
        if (!game.usedQuestionIdsByDifficulty[difficulty]) {
          game.usedQuestionIdsByDifficulty[difficulty] = [];
        }
        game.usedQuestionIdsByDifficulty[difficulty].push(q.id);
      });

      // Debug: Log first question for each group to verify uniqueness
      const firstQ = questions[0];
      console.log(`[TRIVIA] Group ${groupIndex} (${difficulty}): ${questions.length} questions - First Q: "${firstQ?.question}" (ID: ${firstQ?.id})`);
    });

    // Also keep a reference to total questions in round (based on first group, they should all be same)
    game.questionsInRound = questionsPerGroup;
    game.roundQuestions = game.roundQuestionsByGroup[0] || [];  // Legacy reference for recap
  }

  // For speed round, generate per-difficulty question pools
  if (isSpeedRound) {
    // Get allowed categories from game config (theme filtering)
    const allowedCategories = getCategoriesFromThemes(game.config?.themes);

    // Generate 30 questions for each difficulty level
    game.speedRoundQuestionsByDifficulty = {};
    DIFFICULTY_LEVELS.forEach(difficulty => {
      const usedIds = game.usedQuestionIdsByDifficulty[difficulty] || [];
      const questions = getRandomTriviaQuestions(difficulty, 30, usedIds, allowedCategories);

      // Pre-shuffle answers for each question
      game.speedRoundQuestionsByDifficulty[difficulty] = questions.map(q => {
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

      console.log(`[TRIVIA] Speed round: ${questions.length} questions for ${difficulty}`);
    });

    // Initialize per-player progress tracking for speed round
    game.playerProgress = {};
    room.players.forEach(p => {
      const playerDifficulty = getPlayerDifficulty(p.name, room);
      game.playerProgress[p.name] = {
        currentQuestionIndex: 0,
        correctAnswers: [],  // Array of { questionIndex, points }
        wrongAnswers: [],    // Array of { questionIndex }
        totalPoints: 0,
        isWaiting: false,    // True when player is in 2s wrong answer delay
        difficulty: playerDifficulty  // Track player's difficulty for speed round
      };
    });

    // Keep legacy shuffledQuestions as reference (use medium difficulty as fallback)
    game.shuffledQuestions = game.speedRoundQuestionsByDifficulty['medium'] || [];
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

  // Include difficulty groups info for client display
  const difficultyGroupsInfo = !isSpeedRound && game.difficultyGroups ?
    game.difficultyGroups.map(g => ({
      difficulty: g.difficulty,
      label: getDifficultyLabel(g.difficulty),
      playerNames: g.playerNames
    })) : null;

  const questionsInRound = isSpeedRound ? '∞' : (game.questionsInRound || game.questionsPerRound[roundIndex]);

  io.to(roomId).emit('triviaRulesStart', {
    rulesEndTime,
    round: game.currentRound,
    totalRounds: game.totalRounds,
    isSpeedRound,
    questionsInRound,
    speedRoundEndTime,
    readyPlayers: [],
    difficultyGroups: difficultyGroupsInfo
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
      showTriviaRecap(io, room, roomId);
      return;
    }
  }

  // For non-speed rounds with difficulty groups
  if (!game.isSpeedRound && game.difficultyGroups && game.difficultyGroups.length > 0) {
    // Check if round is complete (use questions per group, not single array)
    const questionsPerGroup = game.questionsInRound || 5;
    if (questionIndex >= questionsPerGroup) {
      showTriviaRecap(io, room, roomId);
      return;
    }

    // Prepare shuffled questions for ALL groups at this question index
    game.currentQuestionsByGroup = {};
    game.difficultyGroups.forEach((group, groupIndex) => {
      const groupQuestions = game.roundQuestionsByGroup[groupIndex];
      if (groupQuestions && groupQuestions[questionIndex]) {
        const question = groupQuestions[questionIndex];
        const correctAnswer = question.answers[question.correctIndex];
        const shuffledAnswers = shuffleArray(question.answers);
        const shuffledCorrectIndex = shuffledAnswers.indexOf(correctAnswer);

        game.currentQuestionsByGroup[groupIndex] = {
          ...question,
          shuffledAnswers,
          shuffledCorrectIndex,
          correctAnswer,
          difficulty: group.difficulty,
          difficultyLabel: getDifficultyLabel(group.difficulty)
        };
      }
    });

    // Legacy: set currentQuestion to first group's question for backwards compatibility
    game.currentQuestion = game.currentQuestionsByGroup[0];
    game.questionStartTime = Date.now();
    game.answers = {};
    game.phase = 'question';

    game.currentGroupIndex = 0;
    startGroupTurn(io, room, roomId);
  } else {
    // Speed round or no groups: legacy behavior
    // Check if round is complete
    if (questionIndex >= game.roundQuestions.length) {
      showTriviaRecap(io, room, roomId);
      return;
    }

    const question = game.roundQuestions[questionIndex];

    // Shuffle answers and track new correct index
    const correctAnswer = question.answers[question.correctIndex];
    const shuffledAnswers = shuffleArray(question.answers);
    const shuffledCorrectIndex = shuffledAnswers.indexOf(correctAnswer);

    // Store question with shuffled data
    game.currentQuestion = {
      ...question,
      shuffledAnswers,
      shuffledCorrectIndex
    };
    game.questionStartTime = Date.now();
    game.answers = {};
    game.phase = 'question';

    let questionDuration;
    if (game.isSpeedRound && game.speedRoundEndTime) {
      const timeRemaining = game.speedRoundEndTime - Date.now();
      questionDuration = Math.min(TRIVIA_SPEED_QUESTION_DURATION, timeRemaining);
      if (questionDuration <= 0) {
        showTriviaRecap(io, room, roomId);
        return;
      }
    } else {
      questionDuration = TRIVIA_QUESTION_DURATION;
    }

    const questionEndTime = Date.now() + questionDuration;
    game.questionEndTime = questionEndTime;

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

    game.questionTimer = setTimeout(() => {
      if (room.game && room.game.gameType === 'trivia') {
        revealTriviaAnswer(io, room, roomId);
      }
    }, questionDuration);
  }
}

// Start a turn for the current difficulty group
function startGroupTurn(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  const groups = game.difficultyGroups;
  const currentGroupIdx = game.currentGroupIndex;

  if (currentGroupIdx >= groups.length) {
    // All groups have answered - reveal the answer
    revealTriviaAnswer(io, room, roomId);
    return;
  }

  const currentGroup = groups[currentGroupIdx];
  const questionDuration = TRIVIA_QUESTION_DURATION;
  const questionEndTime = Date.now() + questionDuration;
  game.questionEndTime = questionEndTime;
  game.groupStartTime = Date.now();  // Track when this group's turn started

  // Get group-specific question for logging
  const groupQuestion = game.currentQuestionsByGroup[currentGroupIdx];
  console.log(`[TRIVIA] Starting turn for group ${currentGroupIdx} (${currentGroup.difficulty}): "${groupQuestion?.question}" -> ${currentGroup.playerNames.join(', ')}`);

  // Build group info for all players
  const groupInfo = {
    currentGroup: {
      difficulty: currentGroup.difficulty,
      label: getDifficultyLabel(currentGroup.difficulty),
      playerNames: currentGroup.playerNames
    },
    currentGroupIndex: currentGroupIdx,
    totalGroups: groups.length,
    allGroups: groups.map((g, idx) => ({
      difficulty: g.difficulty,
      label: getDifficultyLabel(g.difficulty),
      playerNames: g.playerNames,
      isActive: idx === currentGroupIdx,
      isCompleted: idx < currentGroupIdx
    }))
  };

  // Get group-specific question from currentQuestionsByGroup
  const question = game.currentQuestionsByGroup[currentGroupIdx] || game.currentQuestion;
  const totalQuestionsInRound = game.questionsInRound || game.roundQuestions.length;

  // Send question to active group players (with their difficulty-specific question)
  currentGroup.players.forEach(player => {
    if (player.socketId) {
      io.to(player.socketId).emit('triviaQuestion', {
        question: question.question,
        answers: question.shuffledAnswers,
        category: question.category,
        questionEndTime,
        questionNumber: game.currentQuestionIndex + 1,
        totalQuestions: totalQuestionsInRound,
        round: game.currentRound,
        totalRounds: game.totalRounds,
        isSpeedRound: false,
        isActiveGroup: true,
        groupInfo,
        difficulty: question.difficulty,
        difficultyLabel: question.difficultyLabel
      });
    }
  });

  // Send waiting state to players NOT in current group
  const waitingPlayers = room.players.filter(p =>
    p.connected !== false && !currentGroup.playerNames.includes(p.name)
  );

  waitingPlayers.forEach(player => {
    if (player.socketId) {
      io.to(player.socketId).emit('triviaGroupWaiting', {
        questionNumber: game.currentQuestionIndex + 1,
        totalQuestions: totalQuestionsInRound,
        round: game.currentRound,
        totalRounds: game.totalRounds,
        groupInfo,
        waitingFor: {
          difficulty: currentGroup.difficulty,
          label: getDifficultyLabel(currentGroup.difficulty),
          playerNames: currentGroup.playerNames
        }
      });
    }
  });

  // Set timer for group timeout
  game.questionTimer = setTimeout(() => {
    if (room.game && room.game.gameType === 'trivia') {
      advanceToNextGroup(io, room, roomId);
    }
  }, questionDuration);
}

// Advance to the next difficulty group or reveal answer
function advanceToNextGroup(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;

  // Safety check for required properties
  if (!game.difficultyGroups || game.currentGroupIndex === undefined) {
    console.error('[TRIVIA] advanceToNextGroup called with missing difficultyGroups or currentGroupIndex');
    return;
  }

  // Clear any existing timer
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.currentGroupIndex++;

  console.log(`[TRIVIA] Advancing to group ${game.currentGroupIndex} of ${game.difficultyGroups.length}`);

  if (game.currentGroupIndex >= game.difficultyGroups.length) {
    // All groups have answered - reveal the answer
    revealTriviaAnswer(io, room, roomId);
  } else {
    // Start next group's turn
    startGroupTurn(io, room, roomId);
  }
}

function revealTriviaAnswer(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'trivia') return;

  const game = room.game;
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.phase = 'reveal';

  // For difficulty groups, validate each player against their group's question
  const questionDuration = game.isSpeedRound ? TRIVIA_SPEED_QUESTION_DURATION : TRIVIA_QUESTION_DURATION;
  const hasGroupQuestions = !game.isSpeedRound && game.currentQuestionsByGroup && game.difficultyGroups;

  // Build a map of player to their group index
  const playerToGroupIndex = {};
  if (hasGroupQuestions) {
    game.difficultyGroups.forEach((group, groupIndex) => {
      group.playerNames.forEach(name => {
        playerToGroupIndex[name] = groupIndex;
      });
    });
  }

  // Calculate points for each player - validate against their group's question
  const playerResults = {};
  Object.entries(game.answers).forEach(([playerName, answerData]) => {
    let correctIndex, question;

    if (hasGroupQuestions) {
      const groupIndex = playerToGroupIndex[playerName];
      question = game.currentQuestionsByGroup[groupIndex] || game.currentQuestion;
      correctIndex = question.shuffledCorrectIndex;
    } else {
      question = game.currentQuestion;
      correctIndex = question.shuffledCorrectIndex;
    }

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
      pointsEarned,
      groupIndex: playerToGroupIndex[playerName]
    };
  });

  // Track question in history with per-group data for recap
  if (hasGroupQuestions) {
    // New structure: groupData array with each group's question and results
    const groupData = game.difficultyGroups.map((group, groupIndex) => {
      const groupQuestion = game.currentQuestionsByGroup[groupIndex];
      const groupPlayerResults = {};

      // Get results for players in this group
      group.playerNames.forEach(name => {
        if (playerResults[name]) {
          groupPlayerResults[name] = playerResults[name];
        }
      });

      return {
        groupIndex,
        difficulty: group.difficulty,
        difficultyLabel: getDifficultyLabel(group.difficulty),
        question: groupQuestion.question,
        category: groupQuestion.category,
        correctAnswer: groupQuestion.correctAnswer,
        correctIndex: groupQuestion.shuffledCorrectIndex,
        answers: groupQuestion.shuffledAnswers,
        playerResults: groupPlayerResults,
        playerNames: group.playerNames
      };
    });

    game.questionHistory.push({
      questionNumber: game.currentQuestionIndex + 1,
      groupData
    });
  } else {
    // Legacy structure for speed round or no groups
    const question = game.currentQuestion;
    game.questionHistory.push({
      question: question.question,
      category: question.category,
      correctIndex: question.shuffledCorrectIndex,
      correctAnswer: question.shuffledAnswers[question.shuffledCorrectIndex],
      answers: question.shuffledAnswers,
      playerResults
    });
  }

  // Broadcast updated scores
  io.to(roomId).emit('scoresUpdated', { players: room.players });

  // For reveal, send per-group data if applicable
  const totalQuestionsInRound = game.questionsInRound || game.roundQuestions.length;

  if (hasGroupQuestions) {
    // Send group-specific reveal data to each player
    game.difficultyGroups.forEach((group, groupIndex) => {
      const groupQuestion = game.currentQuestionsByGroup[groupIndex];
      const groupPlayerResults = {};
      group.playerNames.forEach(name => {
        if (playerResults[name]) {
          groupPlayerResults[name] = playerResults[name];
        }
      });

      group.players.forEach(player => {
        if (player.socketId) {
          io.to(player.socketId).emit('triviaReveal', {
            correctIndex: groupQuestion.shuffledCorrectIndex,
            correctAnswer: groupQuestion.correctAnswer,
            playerResults: groupPlayerResults,
            questionNumber: game.currentQuestionIndex + 1,
            totalQuestions: totalQuestionsInRound,
            difficulty: group.difficulty,
            difficultyLabel: getDifficultyLabel(group.difficulty)
          });
        }
      });
    });
  } else {
    const question = game.currentQuestion;
    io.to(roomId).emit('triviaReveal', {
      correctIndex: question.shuffledCorrectIndex,
      correctAnswer: question.shuffledAnswers[question.shuffledCorrectIndex],
      playerResults,
      questionNumber: game.currentQuestionIndex + 1,
      totalQuestions: game.isSpeedRound ? '∞' : game.roundQuestions.length
    });
  }

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
  // Use dynamic questions per round based on group count, default to 5
  const questionsPerRound = game.questionsInRound || 5;

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
    } else if (qh.groupData) {
      // New structure: per-group question data
      qh.groupData.forEach(gd => {
        Object.entries(gd.playerResults || {}).forEach(([playerName, result]) => {
          if (result.pointsEarned > 0) {
            if (!roundScores[playerName]) roundScores[playerName] = [];
            roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
          }
        });
      });
      questionsInRound++;
      if (questionsInRound >= questionsPerRound && currentRound < 3) {
        currentRound++;
        questionsInRound = 0;
      }
    } else if (qh.playerResults) {
      // Legacy structure for backwards compatibility
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

  // Get player's difficulty and their question pool
  const playerDifficulty = progress.difficulty || 'medium';
  const playerQuestions = game.speedRoundQuestionsByDifficulty[playerDifficulty] || game.shuffledQuestions || [];

  console.log(`[SPEED] ${player.name} (${playerDifficulty}): questionIndex=${progress.currentQuestionIndex}, totalQuestions=${playerQuestions.length}`);

  // Check if player has completed all questions
  if (progress.currentQuestionIndex >= playerQuestions.length) {
    // Player finished all questions - they wait for others/timer
    io.to(player.socketId).emit('speedRoundWaiting', {
      message: 'All questions answered! Waiting for time to run out...',
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length,
      correctCount: progress.correctAnswers.length,
      totalPoints: progress.totalPoints
    });
    return;
  }

  const question = playerQuestions[progress.currentQuestionIndex];

  io.to(player.socketId).emit('speedRoundQuestion', {
    question: question.question,
    answers: question.shuffledAnswers,
    category: question.category,
    questionNumber: progress.currentQuestionIndex + 1,
    speedRoundEndTime: game.speedRoundEndTime,
    difficulty: playerDifficulty,
    difficultyLabel: getDifficultyLabel(playerDifficulty)
  });
}

function handleSpeedRoundAnswer(io, room, roomId, player, answerIndex) {
  if (!room.game || !room.game.isSpeedRound || room.game.phase !== 'speedRound') return;

  const game = room.game;
  const progress = game.playerProgress[player.name];
  if (!progress || progress.isWaiting) return;  // Ignore if player is in wrong answer delay

  // Get player's difficulty and their question pool
  const playerDifficulty = progress.difficulty || 'medium';
  const playerQuestions = game.speedRoundQuestionsByDifficulty[playerDifficulty] || game.shuffledQuestions || [];

  const questionIndex = progress.currentQuestionIndex;
  if (questionIndex >= playerQuestions.length) return;

  const question = playerQuestions[questionIndex];
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

function getRandomMathQuestions(difficultyOrCount, countOrUsedIds = [], usedIds = []) {
  // Handle legacy call signature (count, usedIds)
  if (typeof difficultyOrCount === 'number') {
    const count = difficultyOrCount;
    const legacyUsedIds = countOrUsedIds || [];
    const available = MATH_QUESTIONS.filter(q => !legacyUsedIds.includes(q.id));
    const shuffledAvailable = [...available].sort(() => Math.random() - 0.5);

    if (shuffledAvailable.length >= count) {
      return shuffledAvailable.slice(0, count);
    }

    // Not enough - supplement with oldest used
    let selected = [...shuffledAvailable];
    const stillNeeded = count - selected.length;
    if (stillNeeded > 0) {
      const alreadyUsed = MATH_QUESTIONS.filter(q => legacyUsedIds.includes(q.id));
      alreadyUsed.sort((a, b) => legacyUsedIds.indexOf(a.id) - legacyUsedIds.indexOf(b.id));
      selected = [...selected, ...alreadyUsed.slice(0, stillNeeded)];
      console.log(`[MATH Q-SELECT] WARNING: Pool exhausted. Reusing ${stillNeeded} oldest questions.`);
    }
    return selected.sort(() => Math.random() - 0.5);
  }

  // New signature: (difficulty, count, usedIds)
  const difficulty = difficultyOrCount;
  const count = countOrUsedIds;
  const pool = MATH_QUESTIONS_BY_DIFFICULTY[difficulty] || MATH_QUESTIONS_BY_DIFFICULTY['medium'];
  const safeUsedIds = usedIds || [];

  console.log(`[MATH Q-SELECT] Using difficulty pool '${difficulty}' with ${pool.length} questions, ${safeUsedIds.length} already used`);

  const available = pool.filter(q => !safeUsedIds.includes(q.id));
  const shuffledAvailable = [...available].sort(() => Math.random() - 0.5);

  let selected = [];

  if (shuffledAvailable.length >= count) {
    selected = shuffledAvailable.slice(0, count);
  } else {
    // Not enough unused questions - use all available first, then supplement with oldest used
    selected = [...shuffledAvailable];

    const stillNeeded = count - selected.length;
    if (stillNeeded > 0) {
      const alreadyUsed = pool.filter(q => safeUsedIds.includes(q.id));
      alreadyUsed.sort((a, b) => safeUsedIds.indexOf(a.id) - safeUsedIds.indexOf(b.id));
      selected = [...selected, ...alreadyUsed.slice(0, stillNeeded)];
      console.log(`[MATH Q-SELECT] WARNING: Pool exhausted for '${difficulty}'. Reusing ${stillNeeded} oldest questions.`);
    }
  }

  // Final shuffle
  selected = selected.sort(() => Math.random() - 0.5);
  console.log(`[MATH Q-SELECT] Selected ${selected.length} questions for '${difficulty}': ${selected.map(q => q.id).join(', ')}`);
  return selected;
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

  // Time bonus: max points during grace period, then depletes to 0
  let timeBonus;
  if (timeTaken <= MATH_GRACE_PERIOD) {
    timeBonus = MATH_TIME_BONUS_MAX;  // Full bonus during grace period
  } else {
    const depletionTime = maxTime - MATH_GRACE_PERIOD;
    const timeIntoDepletion = timeTaken - MATH_GRACE_PERIOD;
    const timeRatio = Math.max(0, 1 - (timeIntoDepletion / depletionTime));
    timeBonus = Math.floor(timeRatio * MATH_TIME_BONUS_MAX);
  }

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

  // Set up difficulty groups for non-speed rounds
  if (!isSpeedRound) {
    // Log player difficulties for debugging
    console.log(`[MATH] Room difficulty: ${room.difficulty}, playerDifficulties:`, room.playerDifficulties);
    room.players.forEach(p => {
      console.log(`[MATH] Player ${p.name} effective difficulty: ${getPlayerDifficulty(p.name, room)}`);
    });

    game.difficultyGroups = getPlayersGroupedByDifficulty(room);
    game.currentGroupIndex = 0;
    game.groupAnswers = {};
    console.log(`[MATH] Difficulty groups: ${game.difficultyGroups.map(g => `${g.difficulty}(${g.players.length}: ${g.playerNames.join(', ')})`).join(', ')}`);

    // Calculate questions per round based on group count (same as Trivia)
    const groupCount = game.difficultyGroups.length;
    const questionsPerGroup = getQuestionsPerRoundForGroupCount(groupCount);
    game.questionsPerRound[roundIndex] = questionsPerGroup;

    // Generate questions per group from their difficulty pool
    game.roundQuestionsByGroup = {};
    game.difficultyGroups.forEach((group, groupIndex) => {
      const difficulty = group.difficulty;
      const usedIds = game.usedQuestionIdsByDifficulty[difficulty] || [];
      const groupQuestions = getRandomMathQuestions(difficulty, questionsPerGroup, usedIds);

      game.roundQuestionsByGroup[groupIndex] = groupQuestions;
      console.log(`[MATH] Group ${groupIndex} (${difficulty}): Generated ${groupQuestions.length} questions - first: "${groupQuestions[0]?.question}"`);

      // Track used question IDs per difficulty
      groupQuestions.forEach(q => {
        if (!game.usedQuestionIdsByDifficulty[difficulty]) {
          game.usedQuestionIdsByDifficulty[difficulty] = [];
        }
        game.usedQuestionIdsByDifficulty[difficulty].push(q.id);
      });
    });

    console.log(`[MATH] Generated ${questionsPerGroup} questions per group for ${groupCount} groups`);
  }

  const questionsInRound = isSpeedRound ? 30 : game.questionsPerRound[roundIndex];

  if (isSpeedRound) {
    // Log room difficulty settings for debugging
    console.log(`[MATH SPEED] Room difficulty: ${room.difficulty}, playerDifficulties:`, JSON.stringify(room.playerDifficulties));

    // Speed round: generate individual shuffled question lists per player
    // This ensures each player gets their own sequence even if they share the same difficulty
    game.playerProgress = {};
    room.players.forEach(p => {
      const playerDifficulty = getPlayerDifficulty(p.name, room);
      console.log(`[MATH SPEED] Player ${p.name} assigned difficulty: ${playerDifficulty} (override: ${room.playerDifficulties?.[p.name] || 'none'})`);

      // Get questions for this player's difficulty and shuffle them
      const usedIds = game.usedQuestionIdsByDifficulty[playerDifficulty] || [];
      const questions = getRandomMathQuestions(playerDifficulty, 30, usedIds);
      const playerQuestions = questions.map(q => {
        const options = generateSpeedRoundOptions(q.answer);
        const correctIndex = options.indexOf(q.answer);
        return { ...q, options, correctIndex };
      });

      game.playerProgress[p.name] = {
        currentQuestionIndex: 0,
        correctAnswers: [],
        wrongAnswers: [],
        totalPoints: 0,
        isWaiting: false,
        difficulty: playerDifficulty,
        questions: playerQuestions  // Each player gets their own shuffled question list
      };

      console.log(`[MATH SPEED] ${p.name} first question: "${playerQuestions[0]?.question}"`);
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

  // Include difficulty groups info for client display
  const difficultyGroupsInfo = !isSpeedRound && game.difficultyGroups ?
    game.difficultyGroups.map(g => ({
      difficulty: g.difficulty,
      label: getDifficultyLabel(g.difficulty),
      playerNames: g.playerNames
    })) : null;

  io.to(roomId).emit('mathRulesStart', {
    rulesEndTime,
    round: game.currentRound,
    totalRounds: game.totalRounds,
    isSpeedRound,
    questionsInRound: isSpeedRound ? 30 : questionsInRound,
    speedRoundEndTime,
    readyPlayers: [],
    difficultyGroups: difficultyGroupsInfo
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

  // Check end condition - use per-group questions if available
  const questionsInRound = game.roundQuestionsByGroup?.[0]?.length || game.roundQuestions?.length || 0;
  if (questionIndex >= questionsInRound) {
    showMathRecap(io, room, roomId);
    return;
  }

  game.questionStartTime = Date.now();
  game.answers = {};
  game.phase = 'question';

  // For non-speed rounds with difficulty groups, prepare per-group questions
  if (!game.isSpeedRound && game.difficultyGroups && game.difficultyGroups.length > 0) {
    // Prepare currentQuestionsByGroup for this question index
    game.currentQuestionsByGroup = {};
    game.difficultyGroups.forEach((group, groupIndex) => {
      const groupQuestions = game.roundQuestionsByGroup[groupIndex];
      if (groupQuestions && groupQuestions[questionIndex]) {
        const question = groupQuestions[questionIndex];
        game.currentQuestionsByGroup[groupIndex] = {
          question,
          difficulty: group.difficulty,
          difficultyLabel: getDifficultyLabel(group.difficulty)
        };
      }
    });

    game.currentGroupIndex = 0;
    startMathGroupTurn(io, room, roomId);
  } else {
    // Speed round or no groups: send to everyone (legacy behavior)
    const question = game.roundQuestions ? game.roundQuestions[questionIndex] : null;
    if (!question) return;

    game.currentQuestion = question;
    const questionDuration = MATH_QUESTION_DURATION;
    const questionEndTime = Date.now() + questionDuration;
    game.questionEndTime = questionEndTime;

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
}

// Start a turn for the current difficulty group (Math)
function startMathGroupTurn(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  const groups = game.difficultyGroups;
  const currentGroupIdx = game.currentGroupIndex;

  if (currentGroupIdx >= groups.length) {
    // All groups have answered - reveal the answer
    revealMathAnswer(io, room, roomId);
    return;
  }

  const currentGroup = groups[currentGroupIdx];
  const questionDuration = MATH_QUESTION_DURATION;
  const questionEndTime = Date.now() + questionDuration;
  game.questionEndTime = questionEndTime;
  game.groupStartTime = Date.now();

  console.log(`[MATH] Starting turn for group ${currentGroup.difficulty} (${currentGroup.players.length} players)`);

  // Build group info for all players
  const groupInfo = {
    currentGroup: {
      difficulty: currentGroup.difficulty,
      label: getDifficultyLabel(currentGroup.difficulty),
      playerNames: currentGroup.playerNames
    },
    currentGroupIndex: currentGroupIdx,
    totalGroups: groups.length,
    allGroups: groups.map((g, idx) => ({
      difficulty: g.difficulty,
      label: getDifficultyLabel(g.difficulty),
      playerNames: g.playerNames,
      isActive: idx === currentGroupIdx,
      isCompleted: idx < currentGroupIdx
    }))
  };

  // Get the group-specific question
  const groupQuestionData = game.currentQuestionsByGroup[currentGroupIdx];
  const question = groupQuestionData?.question;
  const totalQuestionsInRound = game.roundQuestionsByGroup[0]?.length || game.questionsPerRound[game.currentRound - 1];

  if (!question) {
    console.log(`[MATH] No question found for group ${currentGroupIdx}`);
    advanceToNextMathGroup(io, room, roomId);
    return;
  }

  console.log(`[MATH] Sending Q${game.currentQuestionIndex + 1} to group ${currentGroupIdx} (${groupQuestionData.difficulty}): "${question.question}" -> ${currentGroup.playerNames.join(', ')}`);

  // Send question to active group players with their difficulty-specific question
  currentGroup.players.forEach(player => {
    if (player.socketId) {
      io.to(player.socketId).emit('mathQuestion', {
        question: question.question,
        category: question.category,
        questionEndTime,
        questionNumber: game.currentQuestionIndex + 1,
        totalQuestions: totalQuestionsInRound,
        round: game.currentRound,
        totalRounds: game.totalRounds,
        isSpeedRound: false,
        isActiveGroup: true,
        groupInfo,
        difficulty: groupQuestionData.difficulty,
        difficultyLabel: groupQuestionData.difficultyLabel
      });
    }
  });

  // Send waiting state to players NOT in current group
  const waitingPlayers = room.players.filter(p =>
    p.connected !== false && !currentGroup.playerNames.includes(p.name)
  );

  waitingPlayers.forEach(player => {
    if (player.socketId) {
      io.to(player.socketId).emit('mathGroupWaiting', {
        questionNumber: game.currentQuestionIndex + 1,
        totalQuestions: totalQuestionsInRound,
        round: game.currentRound,
        totalRounds: game.totalRounds,
        groupInfo,
        waitingFor: {
          difficulty: currentGroup.difficulty,
          label: getDifficultyLabel(currentGroup.difficulty),
          playerNames: currentGroup.playerNames
        }
      });
    }
  });

  // Set timer for group timeout
  game.questionTimer = setTimeout(() => {
    if (room.game && room.game.gameType === 'quickmath') {
      advanceToNextMathGroup(io, room, roomId);
    }
  }, questionDuration);
}

// Advance to the next difficulty group or reveal answer (Math)
function advanceToNextMathGroup(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;

  // Safety check for required properties
  if (!game.difficultyGroups || game.currentGroupIndex === undefined) {
    console.error('[MATH] advanceToNextMathGroup called with missing difficultyGroups or currentGroupIndex');
    return;
  }

  // Clear any existing timer
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.currentGroupIndex++;

  console.log(`[MATH] Advancing to group ${game.currentGroupIndex} of ${game.difficultyGroups.length}`);

  if (game.currentGroupIndex >= game.difficultyGroups.length) {
    // All groups have answered - reveal the answer
    revealMathAnswer(io, room, roomId);
  } else {
    // Start next group's turn
    startMathGroupTurn(io, room, roomId);
  }
}

function revealMathAnswer(io, room, roomId) {
  if (!room.game || room.game.gameType !== 'quickmath') return;

  const game = room.game;
  if (game.questionTimer) {
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  game.phase = 'reveal';
  const questionDuration = MATH_QUESTION_DURATION;

  // Build per-group results for the new structure
  const groupData = [];
  const allPlayerResults = {};

  if (game.difficultyGroups && game.currentQuestionsByGroup) {
    // Per-group questions - validate against each group's specific question
    game.difficultyGroups.forEach((group, groupIndex) => {
      const groupQuestionData = game.currentQuestionsByGroup[groupIndex];
      if (!groupQuestionData) return;

      const question = groupQuestionData.question;
      const correctAnswer = question.answer;
      const groupPlayerResults = {};

      group.playerNames.forEach(playerName => {
        const answerData = game.answers[playerName];
        let isCorrect = false;
        let pointsEarned = 0;

        if (answerData) {
          isCorrect = answerData.answer === correctAnswer;
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
        }

        groupPlayerResults[playerName] = {
          answer: answerData?.answer,
          isCorrect,
          pointsEarned
        };
        allPlayerResults[playerName] = groupPlayerResults[playerName];
      });

      groupData.push({
        groupIndex,
        difficulty: groupQuestionData.difficulty,
        difficultyLabel: groupQuestionData.difficultyLabel,
        question: question.question,
        category: question.category,
        correctAnswer,
        playerResults: groupPlayerResults
      });
    });

    game.questionHistory.push({
      questionNumber: game.currentQuestionIndex + 1,
      groupData
    });
  } else {
    // Legacy single question for all
    const question = game.currentQuestion;
    const correctAnswer = question?.answer;

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

      allPlayerResults[playerName] = {
        answer: answerData.answer,
        isCorrect,
        pointsEarned
      };
    });

    game.questionHistory.push({
      question: question?.question,
      category: question?.category,
      correctAnswer,
      playerResults: allPlayerResults
    });
  }

  io.to(roomId).emit('scoresUpdated', { players: room.players });

  const totalQuestionsInRound = game.roundQuestionsByGroup?.[0]?.length || game.roundQuestions?.length || game.questionsPerRound[game.currentRound - 1];

  // Build correct answers by player for individual display
  const correctAnswersByPlayer = {};
  if (groupData.length > 0) {
    groupData.forEach(gd => {
      Object.keys(gd.playerResults || {}).forEach(playerName => {
        correctAnswersByPlayer[playerName] = gd.correctAnswer;
      });
    });
  } else if (game.currentQuestion) {
    room.players.forEach(p => {
      correctAnswersByPlayer[p.name] = game.currentQuestion.answer;
    });
  }

  io.to(roomId).emit('mathReveal', {
    groupData: groupData.length > 0 ? groupData : null,
    playerResults: allPlayerResults,
    correctAnswersByPlayer,
    questionNumber: game.currentQuestionIndex + 1,
    totalQuestions: totalQuestionsInRound
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

  // Calculate questions in this round
  const questionsInRound = game.roundQuestionsByGroup?.[0]?.length || game.roundQuestions?.length || game.questionsPerRound[game.currentRound - 1];
  const roundStartIndex = game.questionHistory.length - questionsInRound;
  const roundHistory = game.questionHistory.slice(roundStartIndex);

  io.to(roomId).emit('mathRecap', {
    round: game.currentRound,
    totalRounds: game.totalRounds,
    standings,
    questionHistory: roundHistory,
    isLastRound: game.currentRound >= game.totalRounds,
    difficultyGroups: game.difficultyGroups ? game.difficultyGroups.map(g => ({
      difficulty: g.difficulty,
      label: getDifficultyLabel(g.difficulty),
      playerNames: g.playerNames
    })) : null
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
  // Dynamic questions per round based on group count
  const firstRoundQuestionsCount = game.questionHistory.find(qh => qh.groupData || qh.playerResults)?.groupData
    ? game.roundQuestionsByGroup?.[0]?.length || 5
    : 5;

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
    } else if (qh.groupData) {
      // New per-group question structure
      qh.groupData.forEach(gd => {
        Object.entries(gd.playerResults || {}).forEach(([playerName, result]) => {
          if (result.pointsEarned > 0) {
            if (!roundScores[playerName]) roundScores[playerName] = [];
            roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
          }
        });
      });
      questionsInRound++;
      if (questionsInRound >= firstRoundQuestionsCount && currentRound < 3) {
        currentRound++;
        questionsInRound = 0;
      }
    } else if (qh.playerResults) {
      // Legacy single question structure
      Object.entries(qh.playerResults).forEach(([playerName, result]) => {
        if (result.pointsEarned > 0) {
          if (!roundScores[playerName]) roundScores[playerName] = [];
          roundScores[playerName].push({ round: currentRound, points: result.pointsEarned });
        }
      });
      questionsInRound++;
      if (questionsInRound >= firstRoundQuestionsCount && currentRound < 3) {
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

  // Use the player's individual question list
  const playerDifficulty = progress.difficulty || 'medium';
  const playerQuestions = progress.questions || [];

  console.log(`[MATH SPEED SEND] ${player.name}: difficulty=${playerDifficulty}, questionCount=${playerQuestions.length}`);

  if (progress.currentQuestionIndex >= playerQuestions.length) {
    io.to(player.socketId).emit('speedRoundWaiting', {
      message: 'All questions answered! Waiting for time to run out...',
      questionsAnswered: progress.correctAnswers.length + progress.wrongAnswers.length,
      correctCount: progress.correctAnswers.length,
      totalPoints: progress.totalPoints
    });
    return;
  }

  const question = playerQuestions[progress.currentQuestionIndex];

  console.log(`[MATH SPEED] Sending Q${progress.currentQuestionIndex + 1} to ${player.name} (${playerDifficulty}): "${question.question}"`);

  io.to(player.socketId).emit('speedRoundQuestion', {
    question: question.question,
    answers: question.options,
    category: question.category,
    questionNumber: progress.currentQuestionIndex + 1,
    speedRoundEndTime: game.speedRoundEndTime,
    difficulty: playerDifficulty,
    difficultyLabel: getDifficultyLabel(playerDifficulty)
  });
}

function handleMathSpeedRoundAnswer(io, room, roomId, player, answerIndex) {
  if (!room.game || !room.game.isSpeedRound || room.game.phase !== 'speedRound') return;

  const game = room.game;
  const progress = game.playerProgress[player.name];
  if (!progress || progress.isWaiting) return;

  // Use the player's individual question list
  const playerQuestions = progress.questions || [];

  const questionIndex = progress.currentQuestionIndex;
  if (questionIndex >= playerQuestions.length) return;

  const question = playerQuestions[questionIndex];
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

    // --- Clock Synchronization ---
    // Responds with server time to allow clients to calculate clock offset
    socket.on('requestServerTime', (data) => {
      socket.emit('serverTime', {
        serverTime: Date.now(),
        clientSendTime: data.clientSendTime
      });
    });

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
      const rejoinToken = uuidv4(); // Generate unique rejoin token for this player
      const room = {
        id: roomId,
        name: data.roomName,
        master: data.playerName,
        players: [{ name: data.playerName, isMaster: true, avatar: data.avatar || 'meta', socketId: socket.id, connected: true, score: 0, rejoinToken }],
        selectedGames: [],
        difficulty: DEFAULT_DIFFICULTY,
        playerDifficulties: {}  // Map of playerName -> difficultyId for individual overrides
      };

      rooms.set(roomId, room);
      masterRooms.set(data.playerName, roomId);
      socket.join(roomId);
      socket.emit('roomCreated', { ...room, rejoinToken }); // Include rejoin token in response
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
          console.log(`Master ${data.playerName} removed from room ${roomId} for not selecting an avatar in 2 minutes - room closed`);
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
      const rejoinToken = uuidv4(); // Generate unique rejoin token for this player
      room.players.push({ name: data.playerName, isMaster: false, avatar, socketId: socket.id, connected: true, score: 0, rejoinToken });
      socket.join(data.roomId);

      // Tell the joining player the full room state (include their rejoin token)
      socket.emit('roomJoined', { ...room, rejoinToken });
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
          console.log(`${data.playerName} removed from room ${data.roomId} for not selecting an avatar in 2 minutes`);

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
      const { roomId, playerName, avatar, rejoinToken } = data;
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit('rejoinFailed', { message: 'Room no longer exists' });
        return;
      }

      let player = room.players.find(p => p.name === playerName);

      // If player not found in room, check expelled players cache
      if (!player) {
        const expelledKey = `${roomId}:${playerName}`;
        const expelled = expelledPlayers.get(expelledKey);

        if (expelled && expelled.playerData) {
          // Verify rejoin token if provided (optional extra security)
          if (rejoinToken && expelled.playerData.rejoinToken && rejoinToken !== expelled.playerData.rejoinToken) {
            socket.emit('rejoinFailed', { message: 'Invalid rejoin token' });
            return;
          }

          // Check if name is now taken by someone else
          const nameTaken = room.players.some(p => p.name.toLowerCase() === playerName.toLowerCase());
          if (nameTaken) {
            socket.emit('rejoinFailed', { message: 'Your name has been taken by another player' });
            return;
          }

          // Restore player from expelled cache
          player = {
            name: expelled.playerData.name,
            avatar: expelled.playerData.avatar,
            score: expelled.playerData.score || 0,
            socketId: socket.id,
            connected: true,
            rejoinToken: expelled.playerData.rejoinToken
          };
          room.players.push(player);

          // Clear expelled timer and remove from cache
          clearTimeout(expelled.timer);
          expelledPlayers.delete(expelledKey);

          console.log(`${playerName} restored from expelled cache to room ${roomId} with score ${player.score}`);

          // Notify other players
          io.to(roomId).emit('playerRejoined', { roomId, playerName, avatar: player.avatar, score: player.score });
        } else {
          socket.emit('rejoinFailed', { message: 'You are no longer in this room' });
          return;
        }
      } else {
        // Player still in room - cancel grace period timer if pending
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
      }

      socket.join(roomId);

      // Send full room state back to the rejoining player (include gameHistory)
      socket.emit('rejoinSuccess', { ...room, gameHistory: room.gameHistory || [] });

      // If there's an active game, send game sync data based on game type
      if (room.game) {
        const game = room.game;

        if (game.gameType === 'trivia') {
          // Send Trivia-specific sync data
          const hasAnswered = game.answers && game.answers[playerName] !== undefined;
          const answeredPlayers = game.answers ? Object.keys(game.answers) : [];

          const triviaSync = {
            gameType: 'trivia',
            phase: game.phase,
            currentRound: game.currentRound,
            totalRounds: game.totalRounds,
            isSpeedRound: game.isSpeedRound,
            questionNumber: game.currentQuestionIndex + 1,
            totalQuestions: game.isSpeedRound ? '∞' : (game.roundQuestions ? game.roundQuestions.length : 0),
            hasAnswered,
            answeredPlayers,
            standings: room.players
              .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
              .sort((a, b) => b.score - a.score)
          };

          // Include question data if in question phase
          if (game.phase === 'question' && game.currentQuestion) {
            triviaSync.question = game.currentQuestion.question;
            triviaSync.category = game.currentQuestion.category;
            triviaSync.answers = game.currentQuestion.shuffledAnswers;
            triviaSync.questionEndTime = game.questionEndTime;
          }

          // Include recap data if in recap phase
          if (game.phase === 'recap') {
            const questionsInRound = game.roundQuestionsByGroup?.[0]?.length || game.roundQuestions?.length || game.questionsPerRound[game.currentRound - 1];
            const roundStartIndex = game.questionHistory.length - questionsInRound;
            const roundHistory = game.questionHistory.slice(roundStartIndex);
            triviaSync.recapData = {
              questionHistory: roundHistory,
              isLastRound: game.currentRound >= game.totalRounds
            };
          }

          socket.emit('triviaSync', triviaSync);
          console.log(`[REJOIN] Sent triviaSync for ${playerName}, phase: ${game.phase}`);

        } else if (game.gameType === 'quickmath') {
          // Send Quick Math-specific sync data
          const hasAnswered = game.answers && game.answers[playerName] !== undefined;
          const answeredPlayers = game.answers ? Object.keys(game.answers) : [];

          const mathSync = {
            gameType: 'quickmath',
            phase: game.phase,
            currentRound: game.currentRound,
            totalRounds: game.totalRounds,
            isSpeedRound: game.isSpeedRound,
            questionNumber: game.currentQuestionIndex + 1,
            totalQuestions: game.isSpeedRound ? '∞' : (game.roundQuestionsByGroup?.[0]?.length || game.roundQuestions?.length || 0),
            hasAnswered,
            answeredPlayers,
            standings: room.players
              .map(p => ({ name: p.name, avatar: p.avatar, score: p.score || 0, connected: p.connected !== false }))
              .sort((a, b) => b.score - a.score)
          };

          // Include question data if in question phase
          if (game.phase === 'question') {
            const playerDifficulty = getPlayerDifficulty(playerName, room);
            const groupIndex = game.difficultyGroups?.findIndex(g => g.difficulty === playerDifficulty);
            const currentGroupQuestion = game.currentQuestionsByGroup?.[groupIndex];

            if (currentGroupQuestion) {
              mathSync.question = currentGroupQuestion.question;
              mathSync.category = currentGroupQuestion.category;
              mathSync.questionEndTime = game.questionEndTime;
            }
          }

          // Include recap data if in recap phase
          if (game.phase === 'recap') {
            const questionsInRound = game.roundQuestionsByGroup?.[0]?.length || game.roundQuestions?.length || game.questionsPerRound[game.currentRound - 1];
            const roundStartIndex = game.questionHistory.length - questionsInRound;
            const roundHistory = game.questionHistory.slice(roundStartIndex);
            mathSync.recapData = {
              questionHistory: roundHistory,
              isLastRound: game.currentRound >= game.totalRounds
            };
          }

          socket.emit('mathSync', mathSync);
          console.log(`[REJOIN] Sent mathSync for ${playerName}, phase: ${game.phase}`);

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

          // If this player is the drawer, send them their word
          if (game.drawerName === playerName) {
            socket.emit('yourWord', { word: game.currentWord });

            // If game was paused because drawer disconnected, resume it
            if (game.paused && game.timerRemainingMs > 0) {
              console.log(`[PICTIONARY] Drawer ${playerName} reconnected, resuming game with ${game.timerRemainingMs}ms remaining`);

              // Resume the timer
              game.paused = false;
              game.timerEndTime = Date.now() + game.timerRemainingMs;
              game.timerRemainingMs = null;
              delete game.drawerDisconnectedAt;

              // Notify all players to resume
              io.to(roomId).emit('gameResumed', {
                drawerName: playerName,
                timerEndTime: game.timerEndTime
              });
            }
          }
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

        // Include group info if using difficulty groups
        if (game.difficultyGroups && game.difficultyGroups.length > 0) {
          const currentGroup = game.difficultyGroups[game.currentGroupIndex];
          const isActiveGroup = currentGroup && currentGroup.playerNames.includes(player.name);

          triviaSync.groupInfo = {
            currentGroup: currentGroup ? {
              difficulty: currentGroup.difficulty,
              label: getDifficultyLabel(currentGroup.difficulty),
              playerNames: currentGroup.playerNames
            } : null,
            currentGroupIndex: game.currentGroupIndex,
            totalGroups: game.difficultyGroups.length,
            allGroups: game.difficultyGroups.map((g, idx) => ({
              difficulty: g.difficulty,
              label: getDifficultyLabel(g.difficulty),
              playerNames: g.playerNames,
              isActive: idx === game.currentGroupIndex,
              isCompleted: idx < game.currentGroupIndex
            }))
          };
          triviaSync.isActiveGroup = isActiveGroup;

          // If player is not in active group, set phase to groupWaiting
          if (!isActiveGroup && game.phase === 'question') {
            triviaSync.phase = 'groupWaiting';
            triviaSync.waitingFor = {
              difficulty: currentGroup?.difficulty,
              label: currentGroup ? getDifficultyLabel(currentGroup.difficulty) : 'Unknown',
              playerNames: currentGroup?.playerNames || []
            };
          }
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

        // Include group info if using difficulty groups
        if (game.difficultyGroups && game.difficultyGroups.length > 0) {
          const currentGroup = game.difficultyGroups[game.currentGroupIndex];
          const isActiveGroup = currentGroup && currentGroup.playerNames.includes(player.name);

          mathSync.groupInfo = {
            currentGroup: currentGroup ? {
              difficulty: currentGroup.difficulty,
              label: getDifficultyLabel(currentGroup.difficulty),
              playerNames: currentGroup.playerNames
            } : null,
            currentGroupIndex: game.currentGroupIndex,
            totalGroups: game.difficultyGroups.length,
            allGroups: game.difficultyGroups.map((g, idx) => ({
              difficulty: g.difficulty,
              label: getDifficultyLabel(g.difficulty),
              playerNames: g.playerNames,
              isActive: idx === game.currentGroupIndex,
              isCompleted: idx < game.currentGroupIndex
            }))
          };
          mathSync.isActiveGroup = isActiveGroup;

          // If player is not in active group, set phase to groupWaiting
          if (!isActiveGroup && game.phase === 'question') {
            mathSync.phase = 'groupWaiting';
            mathSync.waitingFor = {
              difficulty: currentGroup?.difficulty,
              label: currentGroup ? getDifficultyLabel(currentGroup.difficulty) : 'Unknown',
              playerNames: currentGroup?.playerNames || []
            };
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

    // --- Set Room Difficulty (Master only) ---
    socket.on('setRoomDifficulty', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Only master can change difficulty
      const player = room.players.find(p => p.socketId === socket.id);
      if (!player || player.name !== room.master) {
        socket.emit('error', { message: 'Only the room master can change difficulty' });
        return;
      }

      // Cannot change during game
      if (room.game) {
        socket.emit('error', { message: 'Cannot change difficulty during a game' });
        return;
      }

      // Validate difficulty
      if (!DIFFICULTY_LEVELS.includes(data.difficulty)) {
        socket.emit('error', { message: 'Invalid difficulty level' });
        return;
      }

      room.difficulty = data.difficulty;

      // If applyToAll is true, clear individual overrides
      if (data.applyToAll) {
        room.playerDifficulties = {};
      }

      io.to(data.roomId).emit('difficultyUpdated', {
        roomId: data.roomId,
        roomDifficulty: room.difficulty,
        playerDifficulties: room.playerDifficulties
      });

      console.log(`Room ${data.roomId} difficulty set to ${data.difficulty} by ${player.name}`);
    });

    // --- Set Player Difficulty (Master only) ---
    socket.on('setPlayerDifficulty', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) {
        socket.emit('error', { message: 'Room not found' });
        return;
      }

      // Only master can change difficulty
      const player = room.players.find(p => p.socketId === socket.id);
      if (!player || player.name !== room.master) {
        socket.emit('error', { message: 'Only the room master can change player difficulty' });
        return;
      }

      // Cannot change during game
      if (room.game) {
        socket.emit('error', { message: 'Cannot change difficulty during a game' });
        return;
      }

      // Check target player exists
      const targetPlayer = room.players.find(p => p.name === data.playerName);
      if (!targetPlayer) {
        socket.emit('error', { message: 'Player not found' });
        return;
      }

      // Validate difficulty
      if (!DIFFICULTY_LEVELS.includes(data.difficulty)) {
        socket.emit('error', { message: 'Invalid difficulty level' });
        return;
      }

      // Set individual difficulty (or remove override if same as room default)
      if (data.difficulty === room.difficulty) {
        delete room.playerDifficulties[data.playerName];
        console.log(`[DIFFICULTY] Player ${data.playerName} set to room default (${room.difficulty}) - removed override`);
      } else {
        room.playerDifficulties[data.playerName] = data.difficulty;
        console.log(`[DIFFICULTY] Player ${data.playerName} set to ${data.difficulty} (room default: ${room.difficulty})`);
      }

      console.log(`[DIFFICULTY] Current playerDifficulties:`, room.playerDifficulties);

      io.to(data.roomId).emit('difficultyUpdated', {
        roomId: data.roomId,
        roomDifficulty: room.difficulty,
        playerDifficulties: room.playerDifficulties
      });

      console.log(`Player ${data.playerName} difficulty set to ${data.difficulty} in room ${data.roomId}`);
    });

    // --- Toggle Game Selection (legacy - opens settings modal on client) ---
    socket.on('toggleGame', (data) => {
      // Legacy handler - client now uses updateGameConfig/removeGame
      // Keep for backward compatibility
      const room = rooms.get(data.roomId);
      if (!room) return;

      const index = room.selectedGames.findIndex(g =>
        (typeof g === 'object' ? g.gameId : g) === data.gameId
      );
      if (index > -1) {
        room.selectedGames.splice(index, 1);
      } else {
        room.selectedGames.push({ gameId: data.gameId, config: {} });
      }

      io.to(data.roomId).emit('gamesUpdated', { roomId: data.roomId, selectedGames: room.selectedGames });
    });

    // --- Update Game Config (add or update game with settings) ---
    socket.on('updateGameConfig', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const { gameId, config } = data;
      console.log(`[UPDATE CONFIG] Room ${data.roomId} - gameId: ${gameId}, config:`, JSON.stringify(config));
      const index = room.selectedGames.findIndex(g =>
        (typeof g === 'object' ? g.gameId : g) === gameId
      );

      if (index > -1) {
        // Update existing
        room.selectedGames[index] = { gameId, config };
      } else {
        // Add new
        room.selectedGames.push({ gameId, config });
      }

      io.to(data.roomId).emit('gamesUpdated', { roomId: data.roomId, selectedGames: room.selectedGames });
    });

    // --- Remove Game from Queue ---
    socket.on('removeGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      const { gameId } = data;
      room.selectedGames = room.selectedGames.filter(g =>
        (typeof g === 'object' ? g.gameId : g) !== gameId
      );

      io.to(data.roomId).emit('gamesUpdated', { roomId: data.roomId, selectedGames: room.selectedGames });
    });

    // --- Start Game ---
    socket.on('startGame', (data) => {
      const room = rooms.get(data.roomId);
      if (!room) return;

      // Get first selected game (handle both old and new format)
      const firstGame = room.selectedGames[0];
      const firstGameId = typeof firstGame === 'object' ? firstGame.gameId : firstGame;
      const gameConfig = typeof firstGame === 'object' ? (firstGame.config || {}) : {};

      console.log(`[START GAME] Room ${data.roomId} - selectedGames:`, JSON.stringify(room.selectedGames));
      console.log(`[START GAME] firstGame:`, JSON.stringify(firstGame));
      console.log(`[START GAME] gameConfig:`, JSON.stringify(gameConfig));

      // Determine game type from the FIRST selected game
      // Game ID 1 = Trivia Master, Game ID 2 = Drawing Battle (Pictionary), Game ID 5 = Quick Math
      let gameType = 'pictionary'; // default
      if (firstGameId === 1) {
        gameType = 'trivia';
      } else if (firstGameId === 5) {
        gameType = 'quickmath';
      } else if (firstGameId === 2) {
        gameType = 'pictionary';
      }

      if (gameType === 'quickmath') {
        // Initialize Quick Math game with per-difficulty question tracking
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
          usedQuestionIdsByDifficulty: {
            'super-easy': [], 'very-easy': [], 'easy': [], 'medium': [], 'hard': [], 'very-hard': [], 'genius': []
          },
          currentQuestionsByGroup: {},
          roundQuestionsByGroup: {},
          speedRoundQuestionsByDifficulty: {},
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
        // Initialize Trivia game with per-difficulty question tracking
        room.game = {
          gameType: 'trivia',
          config: gameConfig,  // Store game config (themes, etc.)
          currentRound: 1,
          totalRounds: 4,
          questionsPerRound: [5, 5, 5, 10],  // Default - will be overridden based on group count
          currentQuestionIndex: 0,
          currentQuestion: null,
          currentQuestionsByGroup: {},  // Per-group questions at current index
          questionEndTime: null,
          rulesEndTime: null,
          phase: 'rules',
          answers: {},
          questionHistory: [],
          roundQuestions: [],
          roundQuestionsByGroup: {},  // Per-group question arrays
          isSpeedRound: false,
          usedQuestionIdsByDifficulty: {
            'super-easy': [],
            'very-easy': [],
            'easy': [],
            'medium': [],
            'hard': [],
            'very-hard': [],
            'genius': []
          },
          speedRoundQuestionsByDifficulty: {},  // Per-difficulty question pools for speed round
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

        // Reset player scores
        room.players.forEach(p => { p.score = 0; });

        room.game = {
          gameType: 'pictionary',
          config: gameConfig,  // Store game config (drawerTime, etc.)
          drawingOrder,
          currentDrawerIndex: 0,
          currentRound: 1,
          totalRounds: drawingOrder.length,
          drawerName: drawingOrder[0].name,
          currentWord: null,  // Word set when drawer picks from options
          usedWords: [],
          wordOptions: null,
          wordSelected: false,
          roundScores: {},
          currentPickValue: 100,
          timerEndTime: null,
          timerRemainingMs: null,
          wordSelectionTimeout: null
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

    // --- Select Word (Pictionary - drawer picks from options) ---
    socket.on('selectWord', (data) => {
      const room = rooms.get(data.roomId);
      if (!room || !room.game || room.game.gameType !== 'pictionary') return;

      // Validate sender is the drawer
      const sender = room.players.find(p => p.socketId === socket.id);
      if (!sender || sender.name !== room.game.drawerName) return;

      // Check if word already selected
      if (room.game.wordSelected) return;

      // Validate the selected word is from the options
      const selectedOption = room.game.wordOptions?.find(opt => opt.word === data.word);
      if (!selectedOption) return;

      // Clear the auto-selection timeout
      if (room.game.wordSelectionTimeout) {
        clearTimeout(room.game.wordSelectionTimeout);
        room.game.wordSelectionTimeout = null;
      }

      // Set the word and lock the drawer to this difficulty for the rest of their turn
      room.game.currentWord = data.word;
      room.game.wordSelected = true;
      room.game.usedWords.push(data.word);
      room.game.drawerLockedDifficulty = selectedOption.difficulty;

      // Send the selected word back to the drawer
      io.to(sender.socketId).emit('yourWord', { word: data.word });

      // Start the game timer now (use config or default)
      console.log(`[SELECT WORD] room.game.config:`, JSON.stringify(room.game.config));
      const drawerTimeMs = (room.game.config?.drawerTime || PICTIONARY_DEFAULT_DRAWER_TIME) * 1000;
      console.log(`[SELECT WORD] Using drawer time: ${drawerTimeMs}ms (${drawerTimeMs/1000}s)`);
      const endTime = Date.now() + drawerTimeMs;
      room.game.timerEndTime = endTime;
      room.game.timerRemainingMs = null;
      io.to(data.roomId).emit('gameTimerStart', { endTime });

      console.log(`Drawer ${sender.name} selected word: ${data.word} (${selectedOption.difficultyLabel}) - locked to ${selectedOption.difficulty} difficulty`);
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

      // After 2s announcement, pick new word from the drawer's locked difficulty and continue drawing
      setTimeout(() => {
        if (!room.game) return;
        room.game.paused = false;
        const endTime = Date.now() + (room.game.timerRemainingMs || 0);
        room.game.timerEndTime = endTime;
        room.game.timerRemainingMs = null;
        // Use the drawer's locked difficulty for subsequent words
        const lockedDiff = room.game.drawerLockedDifficulty || 'medium';
        const newWord = pickWord(room.game.usedWords, lockedDiff);
        room.game.usedWords.push(newWord);
        room.game.currentWord = newWord;

        console.log(`[PICTIONARY] New word for ${room.game.drawerName} (locked to ${lockedDiff}): ${newWord}`);

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

      // Clean up player's difficulty override
      if (room.playerDifficulties) {
        delete room.playerDifficulties[data.playerName];
      }

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

      // Clean up player's difficulty override
      if (room.playerDifficulties) {
        delete room.playerDifficulties[playerName];
      }

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

      // For group turns, verify sender is in active group
      if (game.difficultyGroups && game.difficultyGroups.length > 0) {
        const currentGroup = game.difficultyGroups[game.currentGroupIndex];
        if (!currentGroup || !currentGroup.playerNames.includes(sender.name)) {
          // Player is not in active group, ignore answer
          console.log(`[TRIVIA] Ignoring answer from ${sender.name} - not in active group ${currentGroup?.difficulty}`);
          return;
        }
      }

      // Record answer with timestamp
      game.answers[sender.name] = {
        answerIndex: data.answerIndex,
        timestamp: Date.now()
      };

      // Notify all players that this player answered
      io.to(data.roomId).emit('triviaAnswerReceived', {
        playerName: sender.name
      });

      // For group turns, check if all players in current group have answered
      if (game.difficultyGroups && game.difficultyGroups.length > 0) {
        const currentGroup = game.difficultyGroups[game.currentGroupIndex];
        const groupPlayerNames = currentGroup.playerNames;
        const groupAnsweredCount = groupPlayerNames.filter(name => game.answers[name]).length;

        console.log(`[TRIVIA] Group ${currentGroup.difficulty}: ${groupAnsweredCount}/${groupPlayerNames.length} answered`);

        if (groupAnsweredCount >= groupPlayerNames.length) {
          // All players in current group answered, advance to next group
          advanceToNextGroup(io, room, data.roomId);
        }
        return;
      }

      // Legacy behavior: check if all connected players have answered
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
        console.log(`[DEV] Room difficulty: ${room.difficulty}, playerDifficulties:`, JSON.stringify(room.playerDifficulties));

        // Initialize player progress with individual question lists per player
        game.playerProgress = {};
        room.players.forEach(player => {
          const playerDifficulty = getPlayerDifficulty(player.name, room);
          console.log(`[DEV] Player ${player.name} difficulty: ${playerDifficulty}`);

          // Get questions for this player's difficulty and shuffle them
          const usedIds = game.usedQuestionIdsByDifficulty?.[playerDifficulty] || [];
          const questions = getRandomMathQuestions(playerDifficulty, 30, usedIds);
          const playerQuestions = questions.map(q => {
            const options = generateSpeedRoundOptions(q.answer);
            const correctIndex = options.indexOf(q.answer);
            return { ...q, options, correctIndex };
          });

          game.playerProgress[player.name] = {
            currentQuestionIndex: 0,
            correctAnswers: [],
            wrongAnswers: [],
            totalPoints: 0,
            isWaiting: false,
            difficulty: playerDifficulty,
            questions: playerQuestions
          };

          console.log(`[DEV] ${player.name} first question: "${playerQuestions[0]?.question}"`);
        });

        // Initialize speed round state
        game.phase = 'speedRound';
        game.speedRoundEndTime = Date.now() + MATH_SPEED_ROUND_DURATION;

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

      // For group turns, verify sender is in active group
      if (game.difficultyGroups && game.difficultyGroups.length > 0) {
        const currentGroup = game.difficultyGroups[game.currentGroupIndex];
        if (!currentGroup || !currentGroup.playerNames.includes(sender.name)) {
          // Player is not in active group, ignore answer
          console.log(`[MATH] Ignoring answer from ${sender.name} - not in active group ${currentGroup?.difficulty}`);
          return;
        }
      }

      // Record answer with timestamp (answer is a number, not an index)
      game.answers[sender.name] = {
        answer: data.answer,
        timestamp: Date.now()
      };

      // Notify all players that this player answered
      io.to(data.roomId).emit('mathAnswerReceived', {
        playerName: sender.name
      });

      // For group turns, check if all players in current group have answered
      if (game.difficultyGroups && game.difficultyGroups.length > 0) {
        const currentGroup = game.difficultyGroups[game.currentGroupIndex];
        const groupPlayerNames = currentGroup.playerNames;
        const groupAnsweredCount = groupPlayerNames.filter(name => game.answers[name]).length;

        console.log(`[MATH] Group ${currentGroup.difficulty}: ${groupAnsweredCount}/${groupPlayerNames.length} answered`);

        if (groupAnsweredCount >= groupPlayerNames.length) {
          // All players in current group answered, advance to next group
          advanceToNextMathGroup(io, room, data.roomId);
        }
        return;
      }

      // Legacy behavior: check if all connected players have answered
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

        // If disconnecting player is current drawer during active Pictionary game, PAUSE instead of skip
        if (room.game && room.game.gameType === 'pictionary' && room.game.drawerName === player.name) {
          try {
            // Pause the game instead of ending the round
            if (room.game.timerEndTime && !room.game.paused) {
              room.game.paused = true;
              room.game.timerRemainingMs = Math.max(0, room.game.timerEndTime - Date.now());
              room.game.timerEndTime = null;
              room.game.drawerDisconnectedAt = Date.now();

              console.log(`[PICTIONARY] Drawer ${player.name} disconnected, pausing game with ${room.game.timerRemainingMs}ms remaining`);

              io.to(roomId).emit('gamePaused', {
                reason: 'drawer_disconnected',
                drawerName: player.name,
                remainingMs: room.game.timerRemainingMs
              });
            }
          } catch (err) {
            console.error(`[PICTIONARY] Error handling drawer disconnect for ${player.name}:`, err);
          }
        }

        // Handle Trivia/QuickMath disconnect - check if we need to advance because all remaining players answered
        if (room.game && (room.game.gameType === 'trivia' || room.game.gameType === 'quickmath')) {
          try {
            const game = room.game;

            // For group-based games during question phase, check if disconnected player was blocking progress
            if (game.phase === 'question' && game.difficultyGroups && game.currentGroupIndex !== undefined) {
              const currentGroup = game.difficultyGroups[game.currentGroupIndex];
              if (currentGroup && currentGroup.playerNames && currentGroup.playerNames.includes(player.name)) {
                // Player was in active group - check if all remaining connected players in group answered
                const connectedGroupPlayers = currentGroup.playerNames.filter(name => {
                  const p = room.players.find(pl => pl.name === name);
                  return p && p.connected !== false && p.name !== player.name; // Exclude disconnecting player
                });
                const answeredCount = connectedGroupPlayers.filter(name => game.answers && game.answers[name]).length;

                console.log(`[${game.gameType.toUpperCase()}] Player ${player.name} disconnected from group ${currentGroup.difficulty}. ${answeredCount}/${connectedGroupPlayers.length} remaining answered.`);

                // If all remaining connected players answered, advance
                if (connectedGroupPlayers.length > 0 && answeredCount >= connectedGroupPlayers.length) {
                  if (game.gameType === 'trivia') {
                    advanceToNextGroup(io, room, roomId);
                  } else {
                    advanceToNextMathGroup(io, room, roomId);
                  }
                }
              }
            }

            console.log(`[${game.gameType.toUpperCase()}] Player ${player.name} disconnected during game, phase: ${game.phase || 'unknown'}`);
          } catch (err) {
            console.error(`[${room.game.gameType?.toUpperCase() || 'GAME'}] Error handling disconnect for ${player.name}:`, err);
          }
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

          // Find player data before removing (for expelled players cache)
          const playerToExpel = currentRoom.players.find(p => p.name === player.name);

          // Remove the player
          currentRoom.players = currentRoom.players.filter(p => p.name !== player.name);
          console.log(`Grace period expired — ${player.name} removed from room ${roomId}`);

          // If this was the drawer in a paused Pictionary game, skip their turn and advance
          if (currentRoom.game && currentRoom.game.gameType === 'pictionary' &&
              currentRoom.game.paused && currentRoom.game.drawerName === player.name) {
            try {
              console.log(`[PICTIONARY] Drawer ${player.name} grace period expired, skipping turn`);

              currentRoom.game.paused = false;
              currentRoom.game.timerRemainingMs = null;

              // Emit round result with no winner
              io.to(roomId).emit('roundResult', {
                winnerName: null,
                points: 0,
                currentRound: currentRoom.game.currentRound,
                totalRounds: currentRoom.game.totalRounds,
                reason: 'drawer_left'
              });

              // Advance to next round after delay
              setTimeout(() => {
                try {
                  if (currentRoom.game && currentRoom.game.gameType === 'pictionary') {
                    advanceRound(io, currentRoom, roomId);
                  }
                } catch (err) {
                  console.error(`[PICTIONARY] Error advancing round after drawer left:`, err);
                }
              }, 3000);
            } catch (err) {
              console.error(`[PICTIONARY] Error handling drawer grace period expiry for ${player.name}:`, err);
            }
          }

          // Save to expelled players so they can rejoin within extended window
          if (playerToExpel) {
            const expelledKey = `${roomId}:${player.name}`;
            const expelledTimer = setTimeout(() => {
              expelledPlayers.delete(expelledKey);
              console.log(`Expelled player ${player.name} rejoin window expired for room ${roomId}`);
            }, EXPELLED_REJOIN_WINDOW_MS);

            expelledPlayers.set(expelledKey, {
              playerData: {
                name: playerToExpel.name,
                avatar: playerToExpel.avatar,
                score: playerToExpel.score || 0,
                rejoinToken: playerToExpel.rejoinToken
              },
              roomId,
              timer: expelledTimer,
              expelledAt: Date.now()
            });
            console.log(`${player.name} added to expelled players cache (${EXPELLED_REJOIN_WINDOW_MS / 60000} min to rejoin)`);
          }

          // Check if there are still connected players
          const connectedPlayers = currentRoom.players.filter(p => p.connected !== false);

          // If room is empty (no players left at all), delete it
          if (currentRoom.players.length === 0) {
            // Clean up any active game timers
            if (currentRoom.game && currentRoom.game.questionTimer) {
              clearTimeout(currentRoom.game.questionTimer);
            }
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
