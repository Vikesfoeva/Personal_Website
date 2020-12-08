"use strict";
// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon
function button() {
    console.log("I clicked");
    window.alert("For feature requests, please cross your fingers");
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
        this.x_b1 = new Builder();
        this.x_b2 = new Builder();
        this.o_b1 = new Builder();
        this.o_b2 = new Builder();
    }
    GameBoard.prototype.initialPlacement = function (row_b1, col_b1, row_b2, col_b2, player) {
        if (!this.onBoard(row_b1, col_b1)) {
            printFalse("Not on Board");
            return false;
        }
        if (!this.onBoard(row_b2, col_b2)) {
            printFalse("Not on Board");
            return false;
        }
        if (row_b1 == row_b2 && col_b1 == col_b2) {
            printFalse("Builders on the same spot!");
            return false;
        }
        if (this.x_turn && player === 'x') {
            this.x_b1.row = row_b1;
            this.x_b1.column = col_b1;
            this.x_b2.row = row_b2;
            this.x_b2.column = col_b2;
        }
        else if (!this.x_turn && player === 'o') {
            this.o_b1.row = row_b1;
            this.o_b1.column = col_b1;
            this.o_b2.row = row_b2;
            this.o_b2.column = col_b2;
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
    return GameBoard;
}());
var Builder = /** @class */ (function () {
    function Builder() {
        this.row = 99;
        this.column = 99;
        this.height = 99;
    }
    Builder.prototype.vert = function () {
        return this.height;
    };
    return Builder;
}());
var game = new GameBoard();
game.initialPlacement(1, 1, 2, 2, 'x');
console.log(game.x_b1.row);
