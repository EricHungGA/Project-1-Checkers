// This will be a game of checkers based on the standard rules of play, kings included

/*----- constants -----*/
// there will be 4 main colors, one for each player, and two for the board layout of movable vs. non-movable spots
const COLORS = {
    '10': 'white',
    '20': 'pink',
    '1': 'yellow',
    '-1': 'black'

};

/*----- state variables -----*/
//board variable, turn variable, winner variable, game pieces
let board; // 8 by 8 array for column + row
let turn; // 1 or -1 for each player
let winner; // null = no winner, 1 / -1 = winner, add in extra scenarios for deadlocks etc. afterwards

/*----- cached elements  -----*/
// this will have the elements required from the dom to get the board setup
// will most likely include board div layout

/*----- event listeners -----*/
// setup event listeners for board spots that the players select to move their pieces
// to, but only for the movable board spots. Can also use a guard for this if easier

/*----- functions -----*/
// init function that sets up all the state variables, then calls render
function init() {
    board = [
        [0,0,0,0,0,0,0,0], // column 0 (on far left side of board)
        [0,0,0,0,0,0,0,0], // column 1
        [0,0,0,0,0,0,0,0], // column 2
        [0,0,0,0,0,0,0,0], // column 3
        [0,0,0,0,0,0,0,0], // column 4
        [0,0,0,0,0,0,0,0], // column 5
        [0,0,0,0,0,0,0,0], // column 6
        [0,0,0,0,0,0,0,0], // column 7 (on far right side of board)
    ];
    turn = 1;
    winner = null;
    render();
}

// render function that calls multiple sub types of render functions that are
// more modular, this will include things like render board, render message,
// render controls, and more. Will also need to setup the piece logic and 
// win conditions in here