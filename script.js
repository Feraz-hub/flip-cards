// script.js
const cardData = [
    'https://via.placeholder.com/100/FF0000/FFFFFF?text=1', // Placeholder images
    'https://via.placeholder.com/100/00FF00/FFFFFF?text=2',
    'https://via.placeholder.com/100/0000FF/FFFFFF?text=3',
    'https://via.placeholder.com/100/FFFF00/FFFFFF?text=4',
    'https://via.placeholder.com/100/FF00FF/FFFFFF?text=5',
    'https://via.placeholder.com/100/00FFFF/FFFFFF?text=6',
    'https://via.placeholder.com/100/FFFFFF/000000?text=7'
];

// Global variables
let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matchCount = 0;
let timer;
let timeLeft;

// Setup the game
function setupGame(mode) {
    if (mode === 'normal') {
        cards = [...cardData, ...cardData]; // Normal mode (7 pairs = 14 cards)
    } else {
        cards = [...cardData, ...cardData]; // Fast-paced mode (7 pairs = 14 cards)
    }
    shuffle(cards);
    createCards(cards);

    if (mode === 'fast') {
        showCardsForTwoSeconds();
    }
}

// Shuffle the cards
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Create cards on the board
function createCards(cards) {
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.innerHTML = '';

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-index', index);

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = 'Card'; // Placeholder text

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        const img = document.createElement('img');
        img.src = card; // Use placeholder image URLs
        img.alt = 'Memory Card';
        img.style.width = '100%';
        img.style.height = '100%';
        cardBack.appendChild(img);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);
        cardsContainer.appendChild(cardElement);

        cardElement.addEventListener('click', flipCard);
    });
}

// Handle card flip
function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// Check for a match
function checkForMatch() {
    const firstImage = firstCard.querySelector('img').src;
    const secondImage = secondCard.querySelector('img').src;

    if (firstImage === secondImage) {
        matchCount++;
        resetBoard();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    // Check if game is complete
    if (matchCount === cards.length / 2) {
        displayWinMessage(); // Show win message
    }
}

// Reset the board
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Reset the game
function resetGame() {
    matchCount = 0;
    clearInterval(timer);
    document.getElementById('cards-container').innerHTML = '';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';
    document.getElementById('game-board').style.display = 'none';
}

// Show cards for two seconds in fast mode
function showCardsForTwoSeconds() {
    const cardsContainer = document.getElementById('cards-container');
    const allCards = cardsContainer.children;

    for (const card of allCards) {
        card.classList.add('flipped');
    }

    setTimeout(() => {
        for (const card of allCards) {
            card.classList.remove('flipped');
        }
        startTimer(30); // Set a 30-second timer for the fast-paced mode
    }, 2000);
}

// Start the timer
function startTimer(duration) {
    timeLeft = duration;
    const timerDisplay = document.getElementById('time-left');
    const timerElement = document.getElementById('timer');
    timerElement.style.display = 'block';

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            displayFailMessage(); // Show fail message
            resetGame();
        }
    }, 1000);
}

// Display winning message
function displayWinMessage() {
    clearInterval(timer);
    const winMessage = document.createElement('div');
    winMessage.classList.add('modal');
    winMessage.innerHTML = `
        <h2>Congratulations!</h2>
        <p>You win! 🎉</p>
        <button id="close-win-modal">Close</button>
    `;
    document.body.appendChild(winMessage);

    document.getElementById('close-win-modal').addEventListener('click', () => {
        winMessage.remove();
        resetGame();
    });
}

// Display failing message
function displayFailMessage() {
    clearInterval(timer);
    const failMessage = document.createElement('div');
    failMessage.classList.add('modal');
    failMessage.innerHTML = `
        <h2>Time's Up!</h2>
        <p>You failed to finish in time! 💔</p>
        <button id="close-fail-modal">Close</button>
    `;
    document.body.appendChild(failMessage);

    document.getElementById('close-fail-modal').addEventListener('click', () => {
        failMessage.remove();
        resetGame();
    });
}

// Event listeners for mode selection
document.getElementById('normal-mode').addEventListener('click', () => {
    setupGame('normal');
    document.getElementById('game-board').style.display = 'grid';
    document.getElementById('mode-selection').style.display = 'none';
});

document.getElementById('fast-mode').addEventListener('click', () => {
    setupGame('fast');
    document.getElementById('game-board').style.display = 'grid';
    document.getElementById('mode-selection').style.display = 'none';
});
