let deck, playerHand, dealerHand;
let gameOver = false;

document.addEventListener("DOMContentLoaded", function() {
    initGame();
});

function initGame() {
    deck = createDeck();
    playerHand = [];
    dealerHand = [];
    gameOver = false;
    
    document.getElementById("game-message").textContent = "";
    document.getElementById("restart").style.display = "none";
    
    // Mische das Deck und ziehe 2 Karten für beide
    shuffleDeck(deck);
    playerHand.push(drawCardFromDeck(), drawCardFromDeck());
    dealerHand.push(drawCardFromDeck(), drawCardFromDeck());
    
    // Anzeigen der Karten (nur eine Karte des Hauses wird zu Beginn gezeigt)
    updateHandDisplay(true); // Anfangsanzeige mit verdeckter Hauskarte
    checkBlackjack();
}

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: value, suit: suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCardFromDeck() {
    return deck.pop();
}

function updateHandDisplay(isInitial = false) {
    let playerCards = document.getElementById("player-cards");
    let dealerCards = document.getElementById("dealer-cards");
    
    // Zeige alle Karten des Spielers
    playerCards.innerHTML = playerHand.map(card => `${card.value}${card.suit}`).join(" ");
    
    // Zeige nur die erste Karte des Hauses zu Beginn
    if (isInitial) {
        dealerCards.innerHTML = `${dealerHand[0].value}${dealerHand[0].suit} [Karte verdeckt]`;
    } else {
        // Zeige die Karten des Hauses nur wenn der Spieler bleibt
        dealerCards.innerHTML = `${dealerHand[0].value}${dealerHand[0].suit} ${dealerHand[1].value}${dealerHand[1].suit}`;
    }
    
    document.getElementById("player-score").textContent = `Punkte: ${calculateScore(playerHand)}`;
    
    // Berechne den Punktestand des Hauses nur, wenn die Karte aufgedeckt ist
    let dealerScore = calculateScore(dealerHand, isInitial);
    document.getElementById("dealer-score").textContent = `Punkte: ${dealerScore}`;
}

function calculateScore(hand, isInitial = false) {
    let score = 0;
    let aceCount = 0;
    
    for (let card of hand) {
        // Berechne Punkte nur für Karten, die sichtbar sind
        if (isInitial && hand.indexOf(card) === 1) {
            // Ignoriere die zweite Karte des Hauses, wenn sie noch verdeckt ist
            continue;
        }
        
        if (card.value === 'A') {
            aceCount++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    
    return score;
}

function checkBlackjack() {
    if (calculateScore(dealerHand) === 21) {
        document.getElementById("game-message").textContent = "Das Haus hat Blackjack! Du hast verloren!";
        endGame();
    } else if (calculateScore(playerHand) === 21) {
        document.getElementById("game-message").textContent = "Du hast Blackjack! Du hast gewonnen!";
        endGame();
    }
}

function drawCard() {
    if (gameOver) return;
    playerHand.push(drawCardFromDeck());
    updateHandDisplay(false);  // Die zweite Karte des Hauses bleibt verdeckt, wenn der Spieler zieht
    
    if (calculateScore(playerHand) > 21) {
        document.getElementById("game-message").textContent = "Du hast über 21! Du hast verloren!";
        endGame();
    }
}

function stay() {
    if (gameOver) return;
    
    // Das Haus zieht, bis es 17 oder mehr Punkte hat
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(drawCardFromDeck());
    }
    
    // Jetzt zeigen wir alle Karten des Hauses
    updateHandDisplay(false); // Zeigt alle Karten des Hauses auf
    determineWinner();
}

function determineWinner() {
    let playerScore = calculateScore(playerHand);
    let dealerScore = calculateScore(dealerHand, false); // Keine verdeckten Karten mehr bei der Auswertung
    
    if (dealerScore > 21 || playerScore > dealerScore) {
        document.getElementById("game-message").textContent = "Du hast gewonnen!";
    } else if (playerScore < dealerScore) {
        document.getElementById("game-message").textContent = "Du hast verloren!";
    } else {
        document.getElementById("game-message").textContent = "Unentschieden!";
    }
    
    endGame();
}

function endGame() {
    gameOver = true;
    document.getElementById("restart").style.display = "block";
}
