// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon
function squareClick(x_coord, y_coord) {
    var div = document.getElementById(String(x_coord).concat(String(y_coord)));
    if (game.turnPhase == 0) {
        game.initialPlacement(x_coord, y_coord, div);
    }
    else if (game.turnPhase == 1) {
        // play rest of game
    }
}
function printFalse(input) {
    console.log("False - " + input);
}
var GameBoard = /** @class */ (function () {
    function GameBoard() {
        // Creates the board
        this.board = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.state = "In Progress";
        this.x_turn = true;
        this.turnPhase = 0;
        this.x_b1 = new Builder();
        this.x_b2 = new Builder();
        this.o_b1 = new Builder();
        this.o_b2 = new Builder();
    }
    GameBoard.prototype.initialPlacement = function (row, col, div) {
        // , row_b2: number, col_b2: number, player: String
        if (this.isOccupied(row, col)) {
            printFalse("That space is occupied");
            return false;
        }
        if (this.x_turn) {
            if (this.x_b1.height == 99) {
                this.x_b1.row = row;
                this.x_b1.column = col;
                this.x_b1.height = 0;
                div.innerHTML += "<img src=\"./game_files/images/blackPawn.png\" height=\"50px\" />";
            }
            else {
                this.x_b2.row = row;
                this.x_b2.column = col;
                this.x_b2.height = 0;
                div.innerHTML += "<img src=\"./game_files/images/blackPawn.png\" height=\"50px\" />";
                this.changeTurn();
            }
        }
        else if (!this.x_turn) {
            if (this.o_b1.height == 99) {
                this.o_b1.row = row;
                this.o_b1.column = col;
                this.o_b1.height = 0;
                div.innerHTML += "<img src=\"./game_files/whitePawn.png\" height=\"50px\" />";
            }
            else {
                this.o_b2.row = row;
                this.o_b2.column = col;
                this.o_b2.height = 0;
                this.changeTurn();
                this.turnPhase += 1;
                div.innerHTML += "<img src=\"./game_files/whitePawn.png\" height=\"50px\" />";
            }
        }
        else {
            printFalse("Inital Placement");
        }
    };
    GameBoard.prototype.onBoard = function (row, column) {
        if (row < 0 || row > 4) {
            return false;
        }
        if (column < 0 || column > 4) {
            return false;
        }
        return true;
    };
    GameBoard.prototype.isOccupied = function (row, column) {
        // returns false space is free (not occupied)
        if (row == this.x_b1.row && column == this.x_b1.column) {
            return true;
        }
        else if (row == this.x_b2.row && column == this.x_b2.column) {
            return true;
        }
        else if (row == this.o_b1.row && column == this.o_b1.column) {
            return true;
        }
        else if (row == this.o_b2.row && column == this.o_b2.column) {
            return true;
        }
        return false;
    };
    GameBoard.prototype.changeTurn = function () {
        this.x_turn = !this.x_turn;
    };
    GameBoard.prototype.printBoard = function () {
        for (var i = 0; i < 5; i++) {
            console.log(this.board[i]);
        }
    };
    GameBoard.prototype.printBuilders = function () {
        console.log("x builders:");
        console.log(this.x_b1);
        console.log(this.x_b2);
        console.log();
        console.log("o builders");
        console.log(this.o_b1);
        console.log(this.o_b2);
    };
    GameBoard.prototype.isAdjacent = function (row1, column1, row2, column2) {
        if (Math.abs(row1 - row2) > 1 || Math.abs(column1 - column2) > 1) {
            printFalse("Not adjacent");
            return false;
        }
        return true;
    };
    GameBoard.prototype.makeMove = function (fromRow, fromColumn, toRow, toColumn, buildRow, buildColumn) {
        if (!this.onBoard(fromRow, fromColumn) || !this.onBoard(toRow, toColumn) || !this.onBoard(buildRow, buildColumn)) {
            printFalse("Not on board");
            return false;
        }
        if (this.state != "In Progress") {
            printFalse("Game is no longer going on");
            return false;
        }
        if (this.isOccupied(toRow, toColumn)) {
            printFalse("Someone is already there!");
            return false;
        }
        // test this, the logic feels off
        if (this.isOccupied(buildRow, buildColumn)) {
            // it's ok to build where you just left
            if (fromRow != buildRow && fromColumn != buildColumn) {
                printFalse("Someone is there, no building!");
                return false;
            }
        }
        if (toRow == buildRow && toColumn == buildColumn) {
            printFalse("You are about to move there!");
            return false;
        }
        if ((this.board[toRow][toColumn] - this.board[fromRow][fromColumn]) > 1) {
            printFalse("Can't jump that high!");
            return false;
        }
        if (!this.isAdjacent(fromRow, fromColumn, toRow, toColumn)) {
            printFalse("You need to move to an adjacent square");
            return false;
        }
        if (!this.isAdjacent(toRow, toColumn, buildRow, buildColumn)) {
            printFalse("You need to move to an adjacent square");
            return false;
        }
        if (this.board[buildRow][buildColumn] > 4) {
            printFalse("Can't build that high");
            return false;
        }
        if (this.x_turn) {
            if (fromRow == this.x_b1.row && fromColumn == this.x_b1.column) {
                this.x_b1.row = toRow;
                this.x_b1.column = toColumn;
                this.x_b1.height = this.board[toRow][toColumn];
            }
            else if (fromRow == this.x_b2.row && fromColumn == this.x_b2.column) {
                this.x_b2.row = toRow;
                this.x_b2.column = toColumn;
                this.x_b2.height = this.board[toRow][toColumn];
            }
            else {
                printFalse("It was x's turn but a builder was not properly referenced");
                return false;
            }
        }
        else if (!this.x_turn) {
            if (fromRow == this.o_b1.row && fromColumn == this.o_b1.column) {
                this.o_b1.row = toRow;
                this.o_b1.column = toColumn;
                this.o_b1.height = this.board[toRow][toColumn];
            }
            else if (fromRow == this.o_b2.row && fromColumn == this.o_b2.column) {
                this.o_b2.row = toRow;
                this.o_b2.column = toColumn;
                this.o_b2.height = this.board[toRow][toColumn];
            }
            else {
                printFalse("It was x's turn but a builder was not properly referenced");
                return false;
            }
        }
        else {
            printFalse("Somehow you made something else go wrong");
            return false;
        }
        this.board[buildRow][buildColumn] += 1;
        this.changeTurn();
    };
    return GameBoard;
}());
var Builder = /** @class */ (function () {
    function Builder() {
        this.row = 99;
        this.column = 99;
        this.height = 99;
    }
    return Builder;
}());
var game = new GameBoard();
