// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
    const grid = new Array(8);
    for (let i = 0; i < grid.length; i++){
        grid[i] = new Array(8);
    }
    grid[3][4] = new Piece("black");
    grid[4][3] = new Piece("black");
    grid[3][3] = new Piece("white");
    grid[4][4] = new Piece("white");
    return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
    if (pos[0] < 0 || pos[1] < 0 || pos[0] > 7 || pos[1] > 7) {
        return false;
    }
    return true;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
    if (!this.isValidPos(pos)) {
        throw new Error("Not valid pos!")
    } else {
        return this.grid[pos[0]][pos[1]];
    }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
    if (this.getPiece(pos) && this.getPiece(pos).color === color) {
        return true;
    } else {
        return false;
    }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
    if (this.getPiece(pos)){
        return true;
    } else {
        return false;
    }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
    debugger

    // let output_arr = [];
    if (piecesToFlip === undefined) {

        piecesToFlip = []
        let new_position = [pos[0] + dir[0],pos[1] + dir[1]];
        return this._positionsToFlip(new_position, color, dir, piecesToFlip)
    }
    if (!this.isValidPos(pos)) {
        return [];
    }else if(!this.isOccupied(pos)){
        return [];
    }else if(this.isMine(pos, color)){
        return piecesToFlip;
    }else{
        let new_position = [pos[0] + dir[0],pos[1] + dir[1]];
        piecesToFlip.push(pos);
        return this._positionsToFlip(new_position, color, dir, piecesToFlip)
    }

    // return output_arr;
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
    if (this.isOccupied(pos)){
        return false;
    } else {
        let piecesFlipped = [];
        let that = this;
        Board.DIRS.forEach((dir) => {
            piecesFlipped = piecesFlipped.concat(that._positionsToFlip(pos, color, dir));
            // debugger
        });
        if (piecesFlipped.length !== 0) {
            return true;
        } else {

            return false;
        }
    }
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
    if (this.validMove(pos,color)) {
        let piecesFlipped = [];
        let that = this;
        Board.DIRS.forEach((dir) => {
            piecesFlipped = piecesFlipped.concat(that._positionsToFlip(pos, color, dir));
        });
        this.grid[pos[0]][pos[1]] = new Piece(color);

        piecesFlipped.forEach((piecePos) => {
            this.getPiece(piecePos).flip();
        })
    } else {
        throw new Error("Invalid move!")
    }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
    let valid = [];
    for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid.length; j++) {
            if(this.validMove([i,j],color)){
                valid.push([i,j]);
            };            
        }        
    }
    return valid
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
    if (this.validMoves(color).length !== 0) {
        return true;
    }else{
        return false;
    }
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
    if (!this.hasMove("white") && !this.hasMove("black")) {
        return true;
    }else{
        return false;
    }
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
    for (let i = 0; i < this.grid.length; i++) {
        let array = [];
        for (let j = 0; j < this.grid.length; j++) {
            let piece = this.grid[i][j];
            if (piece) {
                array.push(piece.toString())
            }else{
                array.push("_")
            }
        }        
        console.log(array.join(" "))
    }
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE
