// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon
function squareClick(row_pick, column_pick) {
    var div = document.getElementById("piece_".concat(String(row_pick), String(column_pick)));
    if (game.turnPhase == 0) {
        game.initialPlacement(row_pick, column_pick, div);
    }
    else if (game.turnPhase == 1) {
        if (game.clickMove(row_pick, column_pick)) {
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[3];
            }
            else {
                document.getElementById('step').innerHTML = step[6];
            }
            clearError();
            from_row = row_pick;
            from_column = column_pick;
            game.turnPhase += 1;
        }
        else {
            document.getElementById('error').innerHTML = "Please choose a builder";
        }
        ;
    }
    else if (game.turnPhase == 2) {
        if (game.moveBuilder(row_pick, column_pick)) {
            var divFrom = document.getElementById("piece_".concat(String(from_row), String(from_column)));
            var divTo = document.getElementById("piece_".concat(String(row_pick), String(column_pick)));
            console.log(divFrom.innerHTML);
            console.log(divTo.innerHTML);
            divTo.innerHTML = divFrom.innerHTML;
            divFrom.innerHTML = "";
            to_row = row_pick;
            to_column = column_pick;
            game.turnPhase += 1;
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[4];
            }
            else {
                document.getElementById('step').innerHTML = step[7];
            }
            clearError();
            if (game.x_turn) {
                if (from_row == game.x_b1.row && from_column == game.x_b1.column) {
                    game.x_b1.row = to_row;
                    game.x_b1.column = to_column;
                    game.x_b1.height = game.board[to_row][to_column];
                }
                else if (from_row == game.x_b2.row && from_column == game.x_b2.column) {
                    game.x_b2.row = to_row;
                    game.x_b2.column = to_column;
                    game.x_b2.height = game.board[to_row][to_column];
                }
                else {
                    console.log("Something went wrong");
                }
            }
            else if (!game.x_turn) {
                if (from_row == game.o_b1.row && from_column == game.o_b1.column) {
                    game.o_b1.row = to_row;
                    game.o_b1.column = to_column;
                    game.o_b1.height = game.board[to_row][to_column];
                }
                else if (from_row == game.o_b2.row && from_column == game.o_b2.column) {
                    game.o_b2.row = to_row;
                    game.o_b2.column = to_column;
                    game.o_b2.height = game.board[to_row][to_column];
                }
                else {
                    console.log("Something went wrong");
                }
            }
            else {
                console.log("Something went wrong");
            }
        }
        else {
            document.getElementById('error').innerHTML = "Please select a valid space to move to";
        }
    }
    else if (game.turnPhase == 3) {
        if (game.buildSquare(row_pick, column_pick)) {
            game.changeTurn();
            game.turnPhase = 1;
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[2];
            }
            else {
                document.getElementById('step').innerHTML = step[5];
            }
            clearError();
        }
    }
}
function printFalse(input) {
    console.log("False - " + input);
}
function printError(input) {
    document.getElementById('error').innerHTML = input;
}
function clearError() {
    document.getElementById('error').innerHTML = "";
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
            document.getElementById('error').innerHTML = "That space is occupied already";
            return false;
        }
        if (this.x_turn) {
            if (this.x_b1.height == 99) {
                this.x_b1.row = row;
                this.x_b1.column = col;
                this.x_b1.height = 0;
                div.innerHTML += "<img src=\"./my-app/blackPawn.png\" height=50px />";
                clearError();
            }
            else {
                this.x_b2.row = row;
                this.x_b2.column = col;
                this.x_b2.height = 0;
                div.innerHTML += "<img src=\"./my-app/blackPawn.png\" height=50px />";
                this.changeTurn();
                document.getElementById("step").innerHTML = step[1];
                clearError();
            }
        }
        else if (!this.x_turn) {
            if (this.o_b1.height == 99) {
                this.o_b1.row = row;
                this.o_b1.column = col;
                this.o_b1.height = 0;
                div.innerHTML += "<img src=\"./my-app/whitePawn.png\" height=50px />";
                clearError();
            }
            else {
                this.o_b2.row = row;
                this.o_b2.column = col;
                this.o_b2.height = 0;
                this.changeTurn();
                this.turnPhase += 1;
                div.innerHTML += "<img src=\"./my-app/whitePawn.png\" height=50px />";
                document.getElementById("step").innerHTML = step[2];
                clearError();
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
    GameBoard.prototype.clickMove = function (row, col) {
        if (game.x_turn) {
            if (row == game.x_b1.row && col == game.x_b1.column) {
                return true;
            }
            else if (row == game.x_b2.row && col == game.x_b2.column) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (!game.x_turn) {
            if (row == game.o_b1.row && col == game.o_b1.column) {
                return true;
            }
            else if (row == game.o_b2.row && col == game.o_b2.column) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            console.log("Something broke");
        }
    };
    GameBoard.prototype.moveBuilder = function (row, col) {
        if (game.isOccupied(row, col)) {
            printError("Somone is already there!");
            return false;
        }
        if ((this.board[row][col] - this.board[from_row][from_column]) > 1) {
            printFalse("Can't jump that high!");
            printError("You can't jump that high!");
            return false;
        }
        if (!this.isAdjacent(row, col, from_row, from_column)) {
            printFalse("You need to move to an adjacent square");
            printError("That is not adjacent!");
            return false;
        }
        return true;
    };
    GameBoard.prototype.buildSquare = function (row, col) {
        if (game.isOccupied(row, col)) {
            console.log("Someone is there!");
            return false;
        }
        ;
        return true;
    };
    GameBoard.prototype.makeMove = function (fromRow, fromColumn, toRow, toColumn, buildRow, buildColumn) {
        // This is the function for making a move from console
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
var step = [
    "Black, please place your builders",
    "White, please place your builders",
    "Black, choose a builder to move",
    "Black, choose where to move your builder",
    "Black, choose where to build",
    "White, choose a builder to move",
    "White, choose where to move your builder",
    "White, choose where to build",
    "Black Won",
    "White Won"
];
var from_row;
var from_column;
var to_row;
var to_column;
var build_row;
var build_column;
