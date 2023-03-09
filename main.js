// This will be a game of checkers based on the standard rules of play, kings included if possible

//scenarios to test for later

// if there are two capturable pieces / moves possible at once
// double jump logic where if you CAN then it stays your turn until the jumps end

/*----- constants -----*/
const gamePlayers = {
    '1': 'Player 1',
    '-1': 'Player 2'
};
/*----- state variables -----*/
let board; // 8 by 8 array for column + row
let turn; // 1 or -1 for each player
let winner; // null = no winner, 1 / -1 = winner, add in extra scenarios for deadlocks etc. afterwards
let possibleMoveList = []; // this stores my possible moveset for pieces after being run through diagonal check
let captureMoveList = []; // this stores the possible capture moveset for pieces BEFORE being run through diagonal check

/*----- cached elements  -----*/
const boardEls = [...document.querySelectorAll("#board > div")]; // this is the board parent with the tile-child divs
const type1 = document.querySelectorAll('.type-1'); // this is the pink tile aka piece tiles
const h1El = document.querySelector('h1'); // this is the h1 that says 'your turn' etc.
const newGameButton = document.querySelector('button'); // this is the new game button at bottom

/*----- event listeners -----*/
// New game button event listener
newGameButton.addEventListener('click', init);
// This main event listener is setup to be a function so that it can cache & target game piece elements AFTER they are rendered/created
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
    turn = -1;
    winner = null;
    render();
    eventlistenerInit();
}

// This is the check for winner function that happens every turn
function getWinner() {
    console.log('winner is being checked')
    let player1PieceCount = 0;
    let player2PieceCount = 0;
    board.forEach(function(colArr){
        colArr.forEach(function(cellVal){
            if (cellVal === 1) {
                player1PieceCount += 1;
            } else if (cellVal === -1) {
                player2PieceCount += 1;
            } else {
                return;
            }
        })
    })
    if (player1PieceCount === 0){
        return 'Player 2' // because player 2 wins if there are no player 1 pieces
    } else if (player2PieceCount === 0) {
        return 'Player 1'
    } else {
        return null
    }
}

//This has 2 parts, select a piece (highlight), then move it to a possible tile
function controlPiece(evt) {
    // reset all possible moves HERE
    possibleMoveList.length = 0;
    // remove all highlight classes (spot and self) HERE
    const allHighlights = [...document.querySelectorAll('a')]
    allHighlights.forEach(function(highlight){
        highlight.remove();
    })
    if (turn === 1) {
        captureCheckNorth(evt); // this is for player 1 logic only
    } else { // insert player 2 logic here
        captureCheckSouth(evt);
    }
}

// This is same thing as below, just changed for direction
function captureCheckSouth(evt) {
    if (evt.target.classList.contains('highlight-self')) {return}; // same guard as diagonal check
    const indexEl = (evt.target.parentNode.id);
    const colIdx = indexEl[1];
    const rowIdx = indexEl[3];
    const player = evt.target.localName[10] // player will equal "-"
    enemyDiaSouthCheck(colIdx, rowIdx, player, evt);
}

// This is south equivalent
function enemyDiaSouthCheck(colIdx, rowIdx, player, evt) {
    if(player === '-') {
        colIdx = parseInt(colIdx);
        rowIdx = parseInt(rowIdx);
        let diaLeftCol = board[colIdx - 1]; // set it separately to not get an error in the case its undefined and I try to row index it
        let diaLeft;
        if (diaLeftCol !== undefined) {
            diaLeft = diaLeftCol[rowIdx - 1]
        }
        let doubleDiaLeftCol = board[colIdx - 2];
        let doubleDiaLeft;
        if (doubleDiaLeftCol !== undefined) {
            doubleDiaLeft = doubleDiaLeftCol[rowIdx - 2]
        }
        if (diaLeft !== undefined && diaLeft === 1 && doubleDiaLeft !== undefined && doubleDiaLeft === 0) { // check for enemy pieces and doubledialeft 0
            const captureMove = `c${colIdx - 2}r${rowIdx - 2}`;
            if (colIdx - 2 >= 0){
                captureMoveList.push(captureMove); // adding capture moves into array // with guard for out of bounds
                const eatenPiece = document.getElementById(`c${colIdx - 1}r${rowIdx - 1}`)
                eatenPiece.className += ' to-be-eaten'
            }
        }
        //now check for diagonal right
        let diaRightCol = board[colIdx + 1];
        let diaRight;
        if (diaRightCol !== undefined) {
            diaRight = diaRightCol[rowIdx - 1];
        }
        let doubleDiaRightCol = board[colIdx + 2];
        let doubleDiaRight;
        if (doubleDiaRightCol !== undefined) {
            doubleDiaRight = doubleDiaRightCol[rowIdx - 2]
        }
        if (diaRightCol !== undefined && diaRight === 1 && doubleDiaRight !== undefined && doubleDiaRight === 0) {
            const captureMove = `c${colIdx + 2}r${rowIdx - 2}`;
            if (colIdx + 2 <= 7) {
                captureMoveList.push(captureMove); // adding dia right capture move into array // with guard for out of bounds
                const eatenPiece = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
                eatenPiece.className += ' to-be-eaten'
            }
        }
        if (captureMoveList.length > 0) {
            highlight(colIdx, rowIdx); // basically just highlights self and checks...
        } else {
            diagonalCheckSouthInit(evt); // CHECKING HERE NOW
        }
    }
}

// This is south ver.
function diagonalCheckSouthInit(evt) {
    // Guard for if they click on a highlighted piece (selected) to not return type error for not having parent id
    if (evt.target.classList.contains('highlight-self')) {return};
    // First I need to get the index of the parent div aka the column and row
    const indexEl = (evt.target.parentNode.id);
    // Connect this index to the board array
    const colIdx = indexEl[1];
    const rowIdx = indexEl[3];
    const player = evt.target.localName[10] // Reminder this will equal "-"
    diagonalCheckSouth(colIdx, rowIdx, player); // this checks for south within it
}

// This is the diag south check LOGIC
function diagonalCheckSouth(colIdx, rowIdx, player) {
    if (player === '-') {
        //check for the diagonal left first
        colIdx = parseInt(colIdx);
        rowIdx = parseInt(rowIdx);
        let diaLeftCol = board[colIdx - 1]; // set it separately to not get an error in the case its undefined and I try to row index it
        let diaLeft;
        if (diaLeftCol !== undefined) {
            diaLeft = diaLeftCol[rowIdx - 1]
        }
        if (diaLeft !== undefined && diaLeft === 0) { // this brings us to the correct forward row and guards for outside of the board
            const possibleMove = `c${colIdx - 1}r${rowIdx - 1}`;
            possibleMoveList.push(possibleMove); // adding the potential moves into the possibleMoveList array
        }
        //now check for diagonal right
        let diaRightCol = board[colIdx + 1];
        let diaRight;
        if (diaRightCol !== undefined) {
            diaRight = diaRightCol[rowIdx - 1];
        }
        if (diaRightCol !== undefined && diaRight === 0) {
            const possibleMove = `c${colIdx + 1}r${rowIdx - 1}`;
            possibleMoveList.push(possibleMove); // adding dia right possible move into array
        }
        highlight(colIdx, rowIdx); // run highlight on selected piece and potential ones, I am passing in the index of the selected piece
    }
}


// This checks for capture move options and forces them to only show it if present - for player 1 north facing
function captureCheckNorth(evt) {
    if (evt.target.classList.contains('highlight-self')) {return}; // same guard as diagonal check
    const indexEl = (evt.target.parentNode.id);
    const colIdx = indexEl[1];
    const rowIdx = indexEl[3];
    const player = evt.target.localName[10]
    enemyDiaNorthCheck(colIdx, rowIdx, player, evt);
}

// This checks for enemy pieces in the diagonal north left and right spots
function enemyDiaNorthCheck(colIdx, rowIdx, player, evt) {
    if(player === '1') {
        colIdx = parseInt(colIdx);
        rowIdx = parseInt(rowIdx);
        let diaLeftCol = board[colIdx - 1]; // set it separately to not get an error in the case its undefined and I try to row index it
        let diaLeft;
        if (diaLeftCol !== undefined) {
            diaLeft = diaLeftCol[rowIdx + 1]
        }
        let doubleDiaLeftCol = board[colIdx - 2];
        let doubleDiaLeft;
        if (doubleDiaLeftCol !== undefined) {
            doubleDiaLeft = doubleDiaLeftCol[rowIdx + 2]
        }
        if (diaLeft !== undefined && diaLeft === -1 && doubleDiaLeft !== undefined && doubleDiaLeft === 0) { // check for enemy pieces and doubledialeft 0
            const captureMove = `c${colIdx - 2}r${rowIdx + 2}`;
            if (colIdx - 2 >= 0){
                captureMoveList.push(captureMove); // adding capture moves into array // with guard for out of bounds
                const eatenPiece = document.getElementById(`c${colIdx - 1}r${rowIdx + 1}`)
                eatenPiece.className += ' to-be-eaten'
            }
        }
        //now check for diagonal right
        let diaRightCol = board[colIdx + 1];
        let diaRight;
        if (diaRightCol !== undefined) {
            diaRight = diaRightCol[rowIdx + 1];
        }
        let doubleDiaRightCol = board[colIdx + 2];
        let doubleDiaRight;
        if (doubleDiaRightCol !== undefined) {
            doubleDiaRight = doubleDiaRightCol[rowIdx + 2]
        }
        if (diaRightCol !== undefined && diaRight === -1 && doubleDiaRight !== undefined && doubleDiaRight === 0) {
            const captureMove = `c${colIdx + 2}r${rowIdx + 2}`;
            if (colIdx + 2 <= 7) {
                captureMoveList.push(captureMove); // adding dia right capture move into array // with guard for out of bounds
                const eatenPiece = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
                eatenPiece.className += ' to-be-eaten'
            }
        }
        if (captureMoveList.length > 0) {
            highlight(colIdx, rowIdx);
        } else {
            diagonalCheck(evt);
        }
    }
}

// This checks for diagonal spaces from a specified game piece
function diagonalCheck(evt) {
    // Guard for if they click on a highlighted piece (selected) to not return type error for not having parent id
    if (evt.target.classList.contains('highlight-self')) {return};
    // First I need to get the index of the parent div aka the column and row
    const indexEl = (evt.target.parentNode.id);
    // Connect this index to the board array
    const colIdx = indexEl[1];
    const rowIdx = indexEl[3];
    const player = evt.target.localName[10] // If 1 then it is player 1, otherwise player 2(black) // This is a string value
    diagonalCheckNorth(colIdx, rowIdx, player); // this checks for north and south within it
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
    }
}

// This function highlights the select pieces and the potential move spots for it
function highlight(colIdx, rowIdx) {
    // first select the clicked on piece and create a new highlight child inside of it, make it inside of game piece for flex properties
    const selectedPieceTile = document.getElementById(`c${colIdx}r${rowIdx}`)
    const selectedGamePiece = selectedPieceTile.firstChild;
    const highlightChild = document.createElement('a');
    selectedGamePiece.appendChild(highlightChild);
    highlightChild.setAttribute('class', 'highlight-self') // set class of highlight-self to these selected pieces
    // Check the capture array first and then stop the function if its length > 0  so that we don't allow other moves
    if (captureMoveList.length > 0){
        captureMoveList.forEach(function(move){
            const tile = document.getElementById(move);
            const spot = document.createElement('a');
            if (!tile.hasChildNodes()) {
                tile.appendChild(spot);
                spot.setAttribute('class','highlight-spot');
            }
        })
    }
    possibleMoveList.forEach(function(move){ // adds a highlight-spot to each possible move
        // First I need to connect them to the dom element
        const tile = document.getElementById(move);
        const spot = document.createElement('a');
        tile.appendChild(spot);
        spot.setAttribute('class','highlight-spot');
    })

        const highlightSpotEls = [...document.querySelectorAll('.highlight-spot')];
    highlightSpotEls.forEach(function(spot){
        spot.addEventListener('click', movePiece) // move piece function called here
    })
}

// This function makes a piece appear in highlight-spot pieces and deletes the highlight-self pieces
function movePiece(evt){
    let player = document.querySelector('.highlight-self');
    player = player.parentNode.localName;
    player = player[10] // getting just the 1 value if its a player 1 piece, or '-' if its player 2
    if (player === '1') {
        let targetId = evt.target.parentNode.id;
        let colIdx = targetId[1];
        let rowIdx = targetId[3];
        let highlightSpots = [...document.querySelectorAll('.highlight-spot')]; // selecting the highlight spots and putting into array
        highlightSpots.forEach(function(items){
            const tileId = items.parentNode.id;
            const tileColIdx = tileId[1];
            const tileRowIdx = tileId[3];
            board[tileColIdx][tileRowIdx] = 0;
            items.remove();
        })
        board[colIdx][rowIdx] = 1; // change its value to 1 to have piece appear
        // Target highlight-self pieces and then delete them, get the ID and then change board num to 0, if i remove it directly it will still have board val
        const highlightSelfEl = document.querySelector('.highlight-self');
        const highlightSelfId = highlightSelfEl.parentNode.parentNode.id;
        const highlightSelfColIdx = highlightSelfId[1];
        const highlightSelfRowIdx = highlightSelfId[3];
        board[highlightSelfColIdx][highlightSelfRowIdx] = 0;
        // Target to-be-eaten pieces and then first remove the child (game piece) by setting it to 0, then remove the class
        const toBeEatenEl = document.querySelector('.to-be-eaten');
        if (toBeEatenEl) {
            eatenColIdx = (toBeEatenEl.id)[1];
            eatenRowIdx = (toBeEatenEl.id)[3];
            board[eatenColIdx][eatenRowIdx] = 0;
            // now remove all the to be eaten classes
            const toBeEatenEls = [...document.querySelectorAll('.to-be-eaten')];
            toBeEatenEls.forEach(function(element){
                element.classList.remove('to-be-eaten');
            })
        }}
        //create same logic but for player 2
    if (player === '-') {
        let targetId = evt.target.parentNode.id;
        let colIdx = targetId[1];
        let rowIdx = targetId[3];
        let highlightSpots = [...document.querySelectorAll('.highlight-spot')]; // selecting the highlight spots and putting into array
        highlightSpots.forEach(function(items){
            const tileId = items.parentNode.id;
            const tileColIdx = tileId[1];
            const tileRowIdx = tileId[3];
            board[tileColIdx][tileRowIdx] = 0;
            items.remove();
        })
        board[colIdx][rowIdx] = -1; // change its value to -1 to have player 2 piece appear
        // Target highlight-self pieces and then delete them, get the ID and then change board num to 0, if i remove it directly it will still have board val
        const highlightSelfEl = document.querySelector('.highlight-self');
        const highlightSelfId = highlightSelfEl.parentNode.parentNode.id;
        const highlightSelfColIdx = highlightSelfId[1];
        const highlightSelfRowIdx = highlightSelfId[3];
        board[highlightSelfColIdx][highlightSelfRowIdx] = 0;
        // Target to-be-eaten pieces and then first remove the child (game piece) by setting it to 0, then remove the class
        const toBeEatenEl = document.querySelector('.to-be-eaten');
        if (toBeEatenEl) {
            eatenColIdx = (toBeEatenEl.id)[1];
            eatenRowIdx = (toBeEatenEl.id)[3];
            board[eatenColIdx][eatenRowIdx] = 0;
            // now remove all the to be eaten classes
            const toBeEatenEls = [...document.querySelectorAll('.to-be-eaten')];
            toBeEatenEls.forEach(function(element){
                element.classList.remove('to-be-eaten');
            })
        }}
        captureMoveList.length = 0;
        render();
        eventlistenerInit();
    
}

// This is the main render function that calls the sub ones
function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

// This is the render for the button to active / dissapear
function renderControls() {
    newGameButton.style.visibility = winner ? 'visible': 'hidden';
}

// This function displays who's turn it is
function renderMessage() {
    if (winner) {
        h1El.innerHTML = `${winner} wins!`
    } else {
        //game is still going
        h1El.innerHTML = `${gamePlayers[turn]}'s Turn`
    };
}

// This function will render the pieces on the board, it should be called every turn and on initialize
function renderBoard() {
    board.forEach(function(colArr, colIdx){
        //Iterating over the cells in the colArray to get row
        colArr.forEach(function(cellVal, rowIdx){
            const newPiece = document.createElement(`game-piece${cellVal}`);
            const position = document.getElementById(`c${colIdx}r${rowIdx}`);
            if (cellVal === 1 && !position.hasChildNodes()) { // checking for 1 and if it doesn't already have a piece or child node
                position.appendChild(newPiece);
            }
            if (cellVal === -1 && !position.hasChildNodes()) { // checking for -1 same logic
                position.appendChild(newPiece);
            }
            if (!position.hasChildNodes() && cellVal === 1) { // checking if it doesn't have children but has a 1 or -1 value, and if so turning it into 0
                    cellVal = 0;
            }
            if (!position.hasChildNodes() && cellVal === -1) { // checking -1 same logic as above
                    cellVal = 0;
            }
            if (cellVal === 0) { // checking for 0 values and removing their childs
                while (position.hasChildNodes()) {
                    position.removeChild(position.firstChild);
                }
            };
    })
})
winner = getWinner();
turn *= -1;
}


init();