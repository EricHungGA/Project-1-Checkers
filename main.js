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
let possibleMoveList = []; // this stores my possible moveset for pieces after being run through diagonal check

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
    const player = evt.target.localName[10] // If 1 then it is player 1, if "-" then it is player 2 (black) // This is a string value
    diagonalCheckNorth(colIdx, rowIdx, player);
}

// This function diagonal checks for player 1, checking northwards / upwards
function diagonalCheckNorth(colIdx, rowIdx, player) {
    if(player === '1') {
        //check for the diagonal left first
        colIdx = parseInt(colIdx);
        rowIdx = parseInt(rowIdx);
        let diaLeftCol = board[colIdx - 1]; // set it separately to not get an error in the case its undefined and I try to row index it
        let diaLeft;
        if (diaLeftCol !== undefined) {
            diaLeft = diaLeftCol[rowIdx + 1]
        }

        if (diaLeft !== undefined && diaLeft === 0) { // this brings us to the correct forward row and guards for outside of the board
            const possibleMove = `c${colIdx - 1}r${rowIdx + 1}`;
            possibleMoveList.push(possibleMove); // adding the potential moves into the possibleMoveList array
        }

        //now check for diagonal right
        let diaRightCol = board[colIdx + 1];
        let diaRight;
        if (diaRightCol !== undefined) {
            diaRight = diaRightCol[rowIdx + 1];
        }

        if (diaRightCol !== undefined && diaRight === 0) {
            const possibleMove = `c${colIdx + 1}r${rowIdx + 1}`;
            possibleMoveList.push(possibleMove); // adding dia right possible move into array
        }

        highlight(colIdx, rowIdx); // run highlight on selected piece and potential ones, I am passing in the index of the selected piece      

    } else {
        diagonalCheckSouth();
    }
}

// This function diagonal checks south for player 2, same logic as function 1 but reversed directionality
function diagonalCheckSouth() {

}

// This function highlights the select pieces and the potential move spots for it
function highlight(colIdx, rowIdx) {
    // first select the clicked on piece and create a new highlight child inside of it, make it inside of game piece for flex properties
    const selectedPieceTile = document.getElementById(`c${colIdx}r${rowIdx}`)
    const selectedGamePiece = selectedPieceTile.firstChild;
    const highlightChild = document.createElement('a');
    selectedGamePiece.appendChild(highlightChild);
    highlightChild.setAttribute('class', 'highlight-self') // set class of highlight-self to these selected pieces
    // Now take the possible moveset array and iterate through it for each one to add a highlight item to it
    possibleMoveList.forEach(function(move){
        // First I need to connect them to the dom element
        const tile = document.getElementById(move);
        const spot = document.createElement('a');
        tile.appendChild(spot);
        spot.setAttribute('class','highlight-spot');
    })
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