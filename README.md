# Project-1-Checkers

This game was selected as a personal challenge for myself being the first project I attempt two weeks into learning about Javascript, HTML, and CSS. This is a straightforward game of checkers with no additional rules or logic implemented as of now.

</br>

### **Original Project Proposal**
I will be creating a game of checkers with the basic game rules functioning smoothly without errors. The interactable elements will include selecting and moving pieces, winning/losing, and clicking on the play again button to restart the game. The user will be able to select and move pieces for both player 1 and player 2. The game should end when one side has no pieces left to move.

</br>

### **Design & Direction**
My design choice was inspired by pixel-art and pixelated games, particularly those with attention to aesthetic detail. I selected a pastel palette for the purpose of creating a cute-esque and relaxing game version of checkers.

</br>

# Overview of the Game Rules
1. Game start is initialized with each player having 12 pieces on their respective side of the board, each piece one space away from another.

</br>

2. Player 1 having their pieces on the bottom half of the board starts first.

</br>

3. Each turn the player can move one piece, capturing an opponents piece if they are diagonal in opposition and have an open space one further diagonal tile behind.

</br>

4. When a piece is captured it is removed from the board and no longer usable.

</br>

5. The game ends when one side has all its pieces captured and cannot make a move.

</br>
</br>

# Live Demo & Game Visuals

You can access the live demo [right here](https://erichungga.github.io/Project-1-Checkers/).

Instructions for the game can be referenced in the game rules excerpt above.

</br>

### **Early Development Stage**
---
Functional Game state before stylization

![click here](https://i.imgur.com/i8QczUh.png)

</br>

## Basic Components of the Game

```
board = [
        [1,0,1,0,0,0,-1,0], // column 0 (on far left side of board)
        [0,1,0,0,0,-1,0,-1], // column 1
        [1,0,1,0,0,0,-1,0], // column 2
        [0,1,0,0,0,-1,0,-1], // column 3
        [1,0,1,0,0,0,-1,0], // column 4
        [0,1,0,0,0,-1,0,-1], // column 5
        [1,0,1,0,0,0,-1,0], // column 6
        [0,1,0,0,0,-1,0,-1], // column 7 (on far right side of board)
    ]

function renderBoard() {
    board.forEach(function(colArr, colIdx){
        colArr.forEach(function(cellVal, rowIdx){
            const newPiece = document.createElement(`game-piece${cellVal}`);
            const position = document.getElementById(`c${colIdx}r${rowIdx}`);
            if (cellVal === 1 && !position.hasChildNodes()) {
                position.appendChild(newPiece);
            }
            if (cellVal === -1 && !position.hasChildNodes()) { 
                position.appendChild(newPiece);
            }
            if (cellVal === 0) {
                while (position.hasChildNodes()) {
                    position.removeChild(position.firstChild);
                }
            };
    })
})
winner = getWinner();
turn *= -1;
}
```
The render board function is checking for the child nodes in addition to the cell values due to the game pieces being appeneded as child elements within the game-tile divs.

</br></br>

This is an example of how the game checks for a diagonal space to move to and / or capture:
```
let diaLeftCol = board[colIdx - 1];
        let diaLeft;
        if (diaLeftCol !== undefined) {
            diaLeft = diaLeftCol[rowIdx + 1]
        }
        let doubleDiaLeftCol = board[colIdx - 2];
        let doubleDiaLeft;
        if (doubleDiaLeftCol !== undefined) {
            doubleDiaLeft = doubleDiaLeftCol[rowIdx + 2]
        }
        if (diaLeft !== undefined && diaLeft === -1 && doubleDiaLeft !== undefined && doubleDiaLeft === 0) {
            const captureMove = `c${colIdx - 2}r${rowIdx + 2}`;
            if (colIdx - 2 >= 0){
                captureMoveList.push(captureMove);
                const eatenPiece = document.getElementById(`c${colIdx - 1}r${rowIdx + 1}`)
                eatenPiece.className += ' to-be-eaten'
            }
        }

```
The code will reference the index of the selected game piece and use that as a reference point to check for surrounding specified diagonals. When one of those spots meets the conditions, it will assign a class to the capturable spot. There is another function for regular moveable spots.

</br>


### **Current Development Stage**
---
Game with Design & New UI Added

![Imgur](https://i.imgur.com/HqnyNZr.png)

### Game State when a piece is selected

![Imgur](https://i.imgur.com/MJMcNS8.png)

### Game State when the game is over

![Imgur](https://i.imgur.com/CkvaGZz.png)

</br>

# Technology

![](https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white)
![](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)
![](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

</br>

# Future Development
These are items shelved for future development that require additional code and time.

</br>

a. Multi-Jump Capture Logic -- If a piece made a successful capture, their turn is prolonged ONLY if there is another capture move available from the new position, and so on with no limit to the amount of captures.

b. Disabling other piece selection if there is a capture move available on one / any of the pieces. On the user interface they will be unable to select any piece besides the one that must capture, and be left with the only option to capture in order to move forward in the game.

c. King-piece logic and rules. When a piece reaches the end of the opposing side of the board, it will transform into a king piece granting it new capture properties unique to kings.