var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    },
    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    },
    clearAll: function () {
        var cells = document.querySelectorAll('#board table tr td');
        cells.forEach((cell) => {
            cell.setAttribute('class', '');
        });
        var messageArea = document.getElementById('messageArea');
        messageArea.innerText = '';
    },
    playFireSound: function () {
        var fireSound = document.getElementById('fire-sound');
        var soundBtn = document.querySelector('.sound-effect');
        if (soundBtn.classList.contains('disabled')) {
            fireSound.volume = 0;
        } else {
            fireSound.volume = 0.5;
        }
        fireSound.load();
        fireSound.play();
    },
    playMusic: function () {
        var backgroundMusic = document.getElementById('background-music');
        backgroundMusic.play();
    },
    muteMusic: function () {
        var backgroundMusic = document.getElementById('background-music');
        backgroundMusic.pause();
    },
    toggleMusic: function () {
        var musicBtn = document.querySelector('.background-music');
        musicBtn.classList.toggle('disabled');
        return musicBtn.classList.contains('disabled');
    },
    toggleSound: function () {
        var soundBtn = document.querySelector('.sound-effect');
        soundBtn.classList.toggle('disabled');
        return soundBtn.classList.contains('disabled');
    },
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
        { locations: [0, 0, 0], hits: ['', '', ''] },
    ],
    fire: function (guess) {
        view.playFireSound();
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = 'hit';
                view.displayHit(guess);
                view.displayMessage('HIT!');
                if (this.isSunk(ship)) {
                    view.displayMessage('You sank my battleship!');
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage('You missed.');
        return false;
    },

    reset: function () {
        this.shipsSunk = 0;
        this.ships = [
            { locations: [0, 0, 0], hits: ['', '', ''] },
            { locations: [0, 0, 0], hits: ['', '', ''] },
            { locations: [0, 0, 0], hits: ['', '', ''] },
        ];
        this.generateShipLocations();
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== 'hit') {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
        } else {
            row = Math.floor(
                Math.random() * (this.boardSize - this.shipLength)
            );
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + '' + (col + i));
            } else {
                newShipLocations.push(row + i + '' + col);
            }
        }
        return newShipLocations;
    },
    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    },
};

var controller = {
    guesses: 0,

    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    'You sank all my battleships, in ' +
                        this.guesses +
                        ' guesses'
                );
                showReplay();
            }
        }
    },

    processClick: function (guess) {
        if (guess) {
            this.guesses++;
            var hit = model.fire(guess);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage(
                    'You sank all my battleships, in ' +
                        this.guesses +
                        ' guesses'
                );
                showReplay();
            }
        }
    },
};

function parseGuess(guess) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a lettter and a number on the board.');
    } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (
            row < 0 ||
            row > model.boardSize ||
            column < 0 ||
            column >= model.boardSizes
        ) {
            alert("Oops, that's off the board!");
        } else {
            return row + column;
        }
    }
    return null;
}

function showReplay() {
    var replayBtn = document.querySelector('.play-again');
    replayBtn.hidden = false;
}

function hideReplay() {
    var replayBtn = document.querySelector('.play-again');
    replayBtn.hidden = true;
}

function init() {
    hideReplay();
    var backgroundMusic = document.getElementById('background-music');
    backgroundMusic.volume = 0.3;
    var cells = document.querySelectorAll('#board table tr td');
    var musicBtn = document.querySelector('.background-music');
    musicBtn.addEventListener('click', () => {
        if (view.toggleMusic()) {
            view.muteMusic();
        } else {
            view.playMusic();
        }
    });
    var soundBtn = document.querySelector('.sound-effect');
    soundBtn.addEventListener('click', () => {
        view.toggleSound();
    });
    handleClick(cells);
    handleReplayBtn();
    var fireButton = document.getElementById('fireButton');
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById('guessInput');
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleClick(cells) {
    cells.forEach((cell) => {
        cell.addEventListener('click', (e) => {
            controller.processClick(e.target.id);
        });
    });
}

function handleFireButton() {
    var guessInput = document.getElementById('guessInput');
    var guess = guessInput.value;

    controller.processGuess(guess);
    guessInput.value = '';
}

function handleKeyPress(e) {
    var fireButton = document.getElementById('fireButton');
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleReplayBtn() {
    var replayBtn = document.querySelector('.play-again');
    replayBtn.addEventListener('click', replay);
}

function replay() {
    hideReplay();
    view.clearAll();
    controller.guesses = 0;
    model.reset();
}

window.onload = init;
