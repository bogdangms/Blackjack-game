const suits = ["♠", "♥", "♦", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;

const playerCardsDiv = document.getElementById("player-cards");
const dealerCardsDiv = document.getElementById("dealer-cards");
const playerScoreP = document.getElementById("player-score");
const dealerScoreP = document.getElementById("dealer-score");
const resultP = document.getElementById("result");
const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const restartBtn = document.getElementById("restart-btn");

const backgroundMusic = document.getElementById("background-music");

function playMusic() {
    backgroundMusic.volume = 0.3; 
    backgroundMusic.play().catch(error => console.log("Audio play failed:", error));
}

document.addEventListener("DOMContentLoaded", playMusic);

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck(deck);
}

function drawCard() {
    return deck.pop();
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    hand.forEach(card => {
        if (card.value === "A") {
            score += 11;
            aceCount++;
        } else if (["J", "Q", "K"].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    return score;
}

function displayHand(hand, container, hideFirstCard = false) {
    container.innerHTML = "";
    hand.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        if (hideFirstCard && index === 0) {
            cardDiv.textContent = "🂠"; // Hidden card
            cardDiv.classList.add("hidden");
        } else {
            cardDiv.textContent = card.value + card.suit;
            cardDiv.classList.add(card.suit === "♥" || card.suit === "♦" ? "red" : "black");
        }

        container.appendChild(cardDiv);
    });
}


function startGame() {
    gameOver = false;
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    displayHand(playerHand, playerCardsDiv);
    displayHand(dealerHand, dealerCardsDiv, true);
    playerScoreP.textContent = `Score: ${playerScore}`;
    dealerScoreP.textContent = `Score: ?`;

    resultP.textContent = "";
    hitBtn.disabled = false;
    standBtn.disabled = false;
}

function hit() {
    if (gameOver) return;
    playerHand.push(drawCard());
    playerScore = calculateScore(playerHand);
    displayHand(playerHand, playerCardsDiv);
    playerScoreP.textContent = `Score: ${playerScore}`;

    if (playerScore > 21) {
        endGame("You Busted! Dealer Wins.");
    }
}

function stand() {
    if (gameOver) return;
    hitBtn.disabled = true;
    standBtn.disabled = true;

    displayHand(dealerHand, dealerCardsDiv, false); // Reveal dealer's full hand
    dealerScoreP.textContent = `Score: ${dealerScore}`;

    while (dealerScore < 17) {
        dealerHand.push(drawCard());
        dealerScore = calculateScore(dealerHand);
        displayHand(dealerHand, dealerCardsDiv);
        dealerScoreP.textContent = `Score: ${dealerScore}`;
    }

    if (dealerScore > 21) {
        endGame("Dealer Busted! You Win!");
    } else if (playerScore > dealerScore) {
        endGame("You Win!");
    } else if (playerScore < dealerScore) {
        endGame("Dealer Wins.");
    } else {
        endGame("It's a Tie!");
    }
}

function endGame(message) {
    gameOver = true;
    resultP.textContent = message;
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

function restartGame() {
    gameOver = false;
    createDeck();
    startGame();
    hitBtn.disabled = false;
    standBtn.disabled = false;
}

hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);
restartBtn.addEventListener("click", restartGame);

createDeck();
startGame();
