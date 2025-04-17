// Array of words to choose from
const words = ['javascript', 'programming', 'hangman', 'computer', 'keyboard', 'developer', 'coding', 'algorithm', 'software', 'application', 'frontend', 'backend', 'database'];
// Array of hangman part IDs, used to show parts of the drawing
const hangmanParts = ['rope', 'head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
// Get HTML elements for interaction
const keyboardContainer = document.getElementById('keyboard');  // The container for the keyboard buttons
const wordDisplay = document.getElementById('word-display');        // The area to display the word with blanks
const guessesRemainingDisplay = document.getElementById('guesses-remaining');  // The area to display guesses remaining
const guessedLettersDisplay = document.getElementById('guessed-letters');    // The area to display the letters already guessed
const gameMessage = document.getElementById('game-message');      // The area to display win/lose messages
const resetButton = document.getElementById('reset-button');        // The button to reset the game

// Game state variables
let wordToGuess;       // The word the player is trying to guess
let guessedLetters;    // A Set to store the letters the player has guessed
let incorrectGuesses;  // The number of incorrect guesses the player has made
let gameWon;           // Boolean to track if the game has been won
let gameLost;          // Boolean to track if the game has been lost

// Function to initialize (or reset) the game state
function initializeGame() {
    // Select a random word from the words array and convert it to uppercase
    wordToGuess = words[Math.floor(Math.random() * words.length)].toUpperCase();
    guessedLetters = new Set();         // Initialize the guessed letters set
    incorrectGuesses = 0;               // Reset incorrect guesses
    gameWon = false;                   // Reset gameWon state
    gameLost = false;                  // Reset gameLost state
    gameMessage.textContent = '';         // Clear any previous message
    gameMessage.classList.remove('win-message', 'lose-message'); // Remove any win/lose styling


    // Reset hangman drawing - hide all parts
    hangmanParts.forEach(partId => {
        document.getElementById(partId).setAttribute('visibility', 'hidden');
    });

    // Clear and Create Keyboard
    keyboardContainer.innerHTML = ''; // Clear existing keyboard buttons
    createKeyboard();                  // Create the keyboard buttons
    updateDisplay();                   // Update the display with the initial game state
}

// Function to create the on-screen keyboard
function createKeyboard() {
    // Keyboard layout in rows
    const keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    // Iterate through each row of letters
    keyboardRows.forEach(rowLetters => {
        rowLetters.forEach(letter => {
            // Create a button element for each letter
            const button = document.createElement('button');
            button.textContent = letter;             // Set the button text to the letter
            button.addEventListener('click', () => handleGuess(letter)); // Add click handler
            keyboardContainer.appendChild(button); // Append the button to the keyboard container
        });
    });
}

// Function to handle a letter guess
function handleGuess(letter) {
    // If the game is already over (won or lost), or the letter has already been guessed, do nothing
    if (gameWon || gameLost || guessedLetters.has(letter)) {
        return;
    }

    guessedLetters.add(letter); // Add the guessed letter to the set of guessed letters

    if (wordToGuess.includes(letter)) {
        // If the guessed letter is in the word
        updateDisplay();           // Update the display to show the correctly guessed letter
        if (checkWin()) {        // Check if the player has won
            gameWon = true;        // Set gameWon to true
            gameMessage.textContent = 'You win!';  // Display win message
            gameMessage.classList.add('win-message'); // Add win styling
            disableKeyboard();     // Disable the keyboard
        }
    } else {
        // If the guessed letter is not in the word (incorrect guess)
        incorrectGuesses++;                                                                // Increment incorrect guesses
        document.getElementById(hangmanParts[incorrectGuesses - 1]).setAttribute('visibility', 'visible'); // Show the next hangman part
        updateDisplay();                                                                // Update the display
        if (incorrectGuesses >= hangmanParts.length) {                                     // Check if the player has lost
            gameLost = true;                                                           // Set gameLost to true
            gameMessage.textContent = `You lose! The word was ${wordToGuess}`; // Display lose message with the word
            gameMessage.classList.add('lose-message');                               // Add lose styling
            disableKeyboard();                                                        // Disable the keyboard
        }
    }
    disableButton(letter); // Disable the button for the guessed letter
}

// Function to disable a specific letter button
function disableButton(letter) {
    const buttons = keyboardContainer.querySelectorAll('button'); // Get all buttons in the keyboard container
    buttons.forEach(button => {
        if (button.textContent === letter) { // Find the button with the matching letter
            button.disabled = true;       // Disable that button
        }
    });
}

// Function to disable the entire keyboard
function disableKeyboard() {
    const buttons = keyboardContainer.querySelectorAll('button'); // Get all keyboard buttons
    buttons.forEach(button => {
        button.disabled = true; // Disable each button
    });
}

// Function to update the display
function updateDisplay() {
    let displayWord = '';
    // Build the word display string, showing blanks for unguessed letters
    for (const char of wordToGuess) {
        if (guessedLetters.has(char)) {
            displayWord += char + ' '; // Show the letter if it has been guessed
        } else {
            displayWord += '_ ';    // Otherwise, show a blank
        }
    }
    wordDisplay.textContent = displayWord.trim(); // Set the text content of the word display

    guessesRemainingDisplay.textContent = `Guesses remaining: ${hangmanParts.length - incorrectGuesses}`; // Update guesses remaining

    guessedLettersDisplay.innerHTML = ''; // Clear the guessed letters display
    guessedLetters.forEach(letter => {  // Loop through the guessed letters
        const span = document.createElement('span'); // Create a span for each letter
        span.textContent = letter;             // Set the text of the span
        guessedLettersDisplay.appendChild(span); // Append the span to the display
    });
}

// Function to check if the player has won
function checkWin() {
    for (const char of wordToGuess) { // Loop through each character in the word to guess
        if (!guessedLetters.has(char)) { // If any letter has not been guessed
            return false;             // The player has not won
        }
    }
    return true; // All letters have been guessed, the player has won
}

// Event listener for the reset button to start a new game
resetButton.addEventListener('click', initializeGame);

// Start the game when the page loads
initializeGame();
