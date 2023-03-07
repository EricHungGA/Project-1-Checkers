// This will be a game of checkers based on the standard rules of play, kings included

/*----- constants -----*/
// there will be 4 main colors, one for each player, and two for the board layout of movable vs. non-movable spots
const COLORS = {
    '10': 'white',
    '20': 'pink',
    '1': 'orange',
    '-1': 'black'
};

/*----- state variables -----*/
//board variable, turn variable, winner variable, game pieces
let board; // 8 by 8 array for column + row
let turn; // 1 or -1 for each player
let winner; // null = no winner, 1 / -1 = winner, add in extra scenarios for deadlocks etc. afterwards

/*----- cached elements  -----*/
const boardEls = [...document.querySelectorAll("#board > div")]; // this is the board parent with the tile-child divs
const type1 = document.querySelectorAll('.type-1'); // this is the pink tile aka piece tiles

/*----- event listeners -----*/
// This main event listener is setup to be a function so that it can cache and target the game piece elements AFTER they are rendered/created
function eventlistenerInit() {
    const gamePiece1Els = [...document.querySelectorAll('game-piece1')];
    const gamePieceNegEls = [...document.querySelectorAll('game-piece-1')];
    // Have to turn these node lists into arrays and iterate through it to attach individual event listeners
    gamePiece1Els.forEach(function(gamePiece){
        gamePiece.addEventListener('click', controlPiece);
    })
    gamePieceNegEls.forEach(function(gamePiece){
        gamePiece.addEventListener('click', controlPiece);
    })
}

/*----- functions -----*/
// init function that sets up all the state variables, then calls render
function init() {
    board = [
        [1,0,1,0,0,0,-1,0], // column 0 (on far left side of board)
        [0,1,0,0,0,-1,0,-1], // column 1
        [1,0,1,0,0,0,-1,0], // column 2
        [0,1,0,0,0,-1,0,-1], // column 3
        [1,0,1,0,0,0,-1,0], // column 4
        [0,1,0,0,0,-1,0,-1], // column 5
        [1,0,1,0,0,0,-1,0], // column 6
        [0,1,0,0,0,-1,0,-1], // column 7 (on far right side of board)
    ];
    turn = 1;
    winner = null;
    render();
    eventlistenerInit();
}

//This is how the selected pieces move
function controlPiece(evt) {
    // have the piece highlighted or something
    // console.log(evt.target)
    diagonalCheck(evt);
}

// This checks for diagonal spaces from a specified game piece
function diagonalCheck(evt) {
    // First I need to get the index of the parent div aka the column and row
    const indexEl = (evt.target.parentNode.id);
    // Connect this index to the board array
    const colIdx = indexEl[1];
    const rowIdx = indexEl[3];
    console.log('col = ', colIdx, 'row = ', rowIdx);
    const player = evt.target.localName[10]
    console.log(player);
}

// This is the main render function that calls the sub ones
function render() {
    renderBoard();
    // renderMessage();
    // renderControls();

}

// This function will render the pieces on the board, it should be called every turn and on initialize
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