const cardIcons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const deck = cardIcons.concat(cardIcons);
let isOpen = [];
let moves = 0;
let stars = '★★★';
let beginTime;

// DOM selectors
const deckUl = document.querySelector('.deck');
const movesDisplay = document.querySelector('.moves');
const starsDisplay = document.querySelector('.stars');
const restartButton = document.querySelector('.restart');
const timeDisplay = document.querySelector('.time');


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function createLi(icon) {
    return `<li class="card" onclick="validateClick(this)"><i class="fa ${icon}"></i></li>`;
}

function openCard(li) {
    li.classList.add('open', 'show');
    isOpen.push(li);
    countMoves();
}

function countMoves() {
    moves += 0.5;
    movesDisplay.innerHTML = Math.floor(moves);
    removeStars(moves);
}

function removeStars(moves) {
    if (moves <= 13) {
        stars = '★★★';
    } else if (moves <= 17) {
        stars = '★★';
    } else {
        stars = '★';
    }
    starsDisplay.innerHTML = stars;
}

/**
 * Close cards that don't match.
 */
function noMatch() {
    isOpen[0].classList.remove('open', 'show');
    isOpen[1].classList.remove('open', 'show');
    isOpen = [];
}

/**
 * Mark matched cards until the last pairing.
 */
function aMatch() {
    isOpen[0].classList.add('match');
    isOpen[1].classList.add('match');
    isOpen = [];
    // at the last pairing the game is over
    if (document.getElementsByClassName('match').length === 16) {
        endGame(getTimeString(getElapsedTime()));
    }
}

/**
 * Display game stats and call restart function.
 */
function endGame(time) {
    window.alert(`Congratulations, all pairs found!
                Moves: ${moves}
                Time: ${time}
                Stars: ${stars}`);
    restart();
}

function restart() {
    window.location.reload();
}

function getTimeString(elapsedTime) {
    let elapsedSec = Math.floor((elapsedTime / 1000) % 60);
    let elapsedMin = Math.round(((elapsedTime / 1000) - 30) / 60);
    return elapsedMin + ':' + zeroFill(elapsedSec, 2);
}

function getElapsedTime() {
    let currentTime = new Date().getTime();
    return currentTime - beginTime;
}

function zeroFill(number, width) {
    let res = number.toString();
    while (res.length < width) {
        res = '0' + res;
    }
    return res; // as a String
}

/**
 * Checks if the card (li element) is already open and doesn't allow for more than 2 cards to be opened at a time.
 */
function validateClick(li) {

    if ((!isOpen.includes(li)) && (isOpen.length < 2)) {
        // Register time after first valid click.
        if (!beginTime) {
            beginTime = new Date().getTime();
        }
        openCard(li);
    }

    if (isOpen.length === 2) {
        // Determine how to proceed after 2nd valid click.
        (isOpen[0].innerHTML === isOpen[1].innerHTML) ? aMatch() : window.setTimeout(noMatch, 900);
    }

}

shuffle(deck);

deckUl.innerHTML = deck.map(createLi).join('');

restartButton.addEventListener('click', restart);

setInterval(function () {
    if (beginTime) {
        timeDisplay.innerHTML = getTimeString(getElapsedTime());
    }
}, 1000);