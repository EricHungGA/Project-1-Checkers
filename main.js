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
const boardEl = document.getElementById("board"); // this is the board parent with the tile-child divs
const type1 = document.querySelectorAll('.type-1'); // this is the pink tile aka piece tiles

/*----- event listeners -----*/
// setup event listeners for board spots that the players select to move their pieces
// to, but only for the movable board spots. Can also use a guard for this if easier

/*----- functions -----*/
// init function that sets up all the state variables, then calls render
function init() {
    board = [
        [1,-1,0,1,0,0,0,0], // column 0 (on far left side of board)
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
    startingPieces();
    render();
}


// This is function for generating a piece on a tile for either player depending on turn
// function generatePiece(colIdx, rowIdx, turn) {
//     const newPiece = document.createElement(`game-piece-${turn}`);
//     const position = document.getElementById(`c${colIdx}r${rowIdx}`);
//     position.appendChild(newPiece);
// }

// This is a function to create the starting position for all pieces when a game starts
function startingPieces() {

}

// render function that calls multiple sub types of render functions that are
// more modular, this will include things like render board, render message,
// render controls, and more. Will also need to setup the piece logic and 
// win conditions in here

function render() {
    renderBoard();
    // renderMessage();
    // renderControls();

}

// This function will render the pieces on the board every turn and on initialize
function renderBoard() {
    board.forEach(function(colArr, colIdx){
        //Iterating over the cells in the colArray to get row
        colArr.forEach(function(cellVal, rowIdx){
            if (!cellVal) {
                return
            }
            const newPiece = document.createElement(`game-piece${cellVal}`);
            const position = document.getElementById(`c${colIdx}r${rowIdx}`);
            if (position.hasChildNodes()) {
                console.log('there is already child')
                return
            }
            position.appendChild(newPiece);
            console.log('you added child')
        });
    });
}




init();