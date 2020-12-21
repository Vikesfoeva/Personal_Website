// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon


function squareClick(x_coord: number, y_coord: number){
    console.log(`The x coordinate is ${x_coord} and the y coordinate is ${y_coord}.`);
    console.log(document.getElementById(String(x_coord).concat(String(y_coord))));
}

function printFalse(input: String){
    console.log(`False - ${input}`);
}

class GameBoard {

    board: number[][];
    state: String;
    x_turn: Boolean;
    x_b1: Builder;
    x_b2: Builder;
    o_b1: Builder;
    o_b2: Builder;

    constructor(){
        // Creates the board
        this.board = [[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]];
        this.state = `In Progress`;
        this.x_turn = true;
        this.x_b1 = new Builder();
        this.x_b2 = new Builder();
        this.o_b1 = new Builder();
        this.o_b2 = new Builder();
    }

    initialPlacement(row_b1: number, col_b1: number, row_b2: number, col_b2: number, player: String) {

        if (!this.onBoard(row_b1, col_b1)){
            printFalse(`Not on Board`);
            return false;
        }

        if (!this.onBoard(row_b2, col_b2)){
            printFalse(`Not on Board`);
            return false;
        }

        if (row_b1 == row_b2 && col_b1 == col_b2){
            printFalse(`Builders on the same spot!`);
            return false;
        }

        if (this.isOccupied(row_b1, col_b1)){
            printFalse(`That space is occupied`);
            return false;
        }

        if (this.isOccupied(row_b2, col_b2)){
            printFalse(`That space is occupied`);
            return false;
        }
        console.log(player);
        if (this.x_turn && player === 'x') {
            this.x_b1.row = row_b1;
            this.x_b1.column = col_b1;
            this.x_b2.row = row_b2;
            this.x_b2.column = col_b2;
            this.changeTurn();
        } else if (!this.x_turn && player === 'o') {
            this.o_b1.row = row_b1;
            this.o_b1.column = col_b1;
            this.o_b2.row = row_b2;
            this.o_b2.column = col_b2;
            this.changeTurn();
        } else {
            printFalse(`Inital Placement`);
        }
    }

    onBoard(row: number, column: number){
        if (row < 0 || row > 4){
            return false;
        }
        if (column < 0 || column > 4){
            return false;
        }
        return true;
    }

    isOccupied(row: number, column: number){
        // returns false space is free (not occupied)
        if (row == this.x_b1.row && column == this.x_b1.column){
            return true;
        } else if(row == this.x_b2.row && column == this.x_b2.column){
            return true;
        } else if(row == this.o_b1.row && column == this.o_b1.column){
            return true;
        } else if(row == this.o_b2.row && column == this.o_b2.column){
            return true;
        }

        return false;
    }

    changeTurn(){
        this.x_turn = !this.x_turn;
    }

    printBoard(){
        for (let i= 0; i < 5; i++){
            console.log(this.board[i]);
        }
    }

    printBuilders(){
        console.log(`x builders:`);
        console.log(this.x_b1);
        console.log(this.x_b2);
        console.log();
        console.log(`o builders`);
        console.log(this.o_b1);
        console.log(this.o_b2);
    }

    isAdjacent(row1: number, column1: number, row2: number, column2: number){

        if (Math.abs(row1 - row2) > 1 || Math.abs(column1 - column2) > 1) {
            printFalse(`Not adjacent`);
            return false;
        }

        return true;
    }

    makeMove(fromRow: number, fromColumn: number, toRow: number, toColumn: number, buildRow: number, buildColumn: number){

        if (!this.onBoard(fromRow, fromColumn) || !this.onBoard(toRow, toColumn) || !this.onBoard(buildRow, buildColumn)) {
            printFalse(`Not on board`);
            return false;
        }

        if (this.state != `In Progress`) {
            printFalse(`Game is no longer going on`);
            return false;
        }

        if (this.isOccupied(toRow, toColumn)) {
            printFalse(`Someone is already there!`);
            return false;
        }


        // test this, the logic feels off
        if (this.isOccupied(buildRow, buildColumn)) {
            // it's ok to build where you just left
            if (fromRow != buildRow && fromColumn != buildColumn){
                printFalse(`Someone is there, no building!`)
                return false;
            }
        }

        if (toRow == buildRow && toColumn == buildColumn) {
            printFalse(`You are about to move there!`);
            return false;
        }

        if ((this.board[toRow][toColumn] - this.board[fromRow][fromColumn]) > 1){
            printFalse(`Can't jump that high!`);
            return false;
        }

        if (!this.isAdjacent(fromRow, fromColumn, toRow, toColumn)){
            printFalse(`You need to move to an adjacent square`);
            return false;
        }

        if (!this.isAdjacent(toRow, toColumn, buildRow, buildColumn)){
            printFalse(`You need to move to an adjacent square`);
            return false;
        }

        if (this.board[buildRow][buildColumn] > 4) {
            printFalse(`Can't build that high`);
            return false;
        }

        if (this.x_turn) {
            if (fromRow == this.x_b1.row && fromColumn == this.x_b1.column) {
                this.x_b1.row = toRow;
                this.x_b1.column = toColumn;
                this.x_b1.height = this.board[toRow][toColumn];
            } else if(fromRow == this.x_b2.row && fromColumn == this.x_b2.column) {
                this.x_b2.row = toRow;
                this.x_b2.column = toColumn;
                this.x_b2.height = this.board[toRow][toColumn];
            } else {
                printFalse(`It was x's turn but a builder was not properly referenced`);
                return false;
            }
        } else if(!this.x_turn){
            if (fromRow == this.o_b1.row && fromColumn == this.o_b1.column) {
                this.o_b1.row = toRow;
                this.o_b1.column = toColumn;
                this.o_b1.height = this.board[toRow][toColumn];
            } else if(fromRow == this.o_b2.row && fromColumn == this.o_b2.column) {
                this.o_b2.row = toRow;
                this.o_b2.column = toColumn;
                this.o_b2.height = this.board[toRow][toColumn];
            } else {
                printFalse(`It was x's turn but a builder was not properly referenced`);
                return false;
            }
        } else {
            printFalse(`Somehow you made something else go wrong`)
            return false;
        }

        this.board[buildRow][buildColumn] += 1;
        this.changeTurn();
    }
}

class Builder{

    row: number;
    column: number;
    height: number;

    constructor(){
        this.row = 99;
        this.column = 99;
        this.height = 0;
    }

}

let game = new GameBoard();
console.log(`x places`);
game.initialPlacement(1, 1, 2, 2, 'x');
console.log(`o places`);
game.initialPlacement(3, 3, 2, 3, 'o');
game.printBoard();
game.printBuilders();