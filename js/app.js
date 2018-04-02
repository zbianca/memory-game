const cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
const deck = cards.concat(cards);
const deckUl = document.querySelector('.deck');
let deckUlLis = '';
let isOpen = [];
let moves = 0;
let stars = '★★★';
const movesDisplay = document.querySelector('.moves');
const starsDisplay = document.querySelector('.stars');
const restartButton = document.querySelector('.restart');
const timeDisplay = document.querySelector('.time');
let beginTime;
let gameOver;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
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

function createCardsHtml(icon) {
    const listItem = (`<li class="card" onclick="respondToClick(this)"><i class="fa ${icon}"></i></li>`);
    deckUlLis += listItem;
}

function openCard(li) {
    li.classList.add('open', 'show');
    isOpen.push(li);
}

function aMatch() {
    isOpen[0].classList.add('match');
    isOpen[1].classList.add('match');
    isOpen = [];
    if (document.getElementsByClassName('match').length === 16) {
        gameOver = true;
        endGame();
    }
}

function noMatch() {
    isOpen[0].classList.remove('open', 'show');
    isOpen[1].classList.remove('open', 'show');
    isOpen = [];
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

function endGame() {
        window.alert(`Congratulations, all pairs found!
                Moves: ${moves}
                Time: ${clockFace(getElapsedTime())}
                Stars: ${stars}`);
    restart();
}

function restart() {
    window.location.reload();
}

function respondToClick(li) {

    if ((!isOpen.includes(li)) && (isOpen.length < 2)) {
        if (!beginTime) {
            beginTime = new Date().getTime();
        }
        openCard(li);
        countMoves();
    }

    if (isOpen.length === 2) {
        (isOpen[0].innerHTML === isOpen[1].innerHTML) ? aMatch() : window.setTimeout(noMatch, 900);
    }

}

function clockFace(elapsedTime) {
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
    return res;
}

shuffle(deck);

deck.forEach(createCardsHtml);
deckUl.innerHTML = deckUlLis;

restartButton.addEventListener('click', restart);

setInterval(function () {
    if (beginTime || gameOver) {
        timeDisplay.innerHTML = clockFace(getElapsedTime());
    }
}, 1000);
