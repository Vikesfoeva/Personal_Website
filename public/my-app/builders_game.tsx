// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon

// need to check for valid spots to build after moving
// meed tp fix the logic for checking if a player no longer has any valid moves

function squareClick(row_pick: number, column_pick: number){
    const div: any = document.getElementById(`piece_`.concat(String(row_pick),String(column_pick)));
    if (game.turnPhase == 0) {
        game.initialPlacement(row_pick, column_pick, div);
    } else if (game.turnPhase == 1) {
        if (game.clickMove(row_pick, column_pick)) {
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[3];
            } else {
                document.getElementById('step').innerHTML = step[6];
            }
            clearError()
            from_row = row_pick;
            from_column = column_pick;
            game.turnPhase += 1;
        } else {
            document.getElementById('error').innerHTML = `Please choose a builder`;
        };
    } else if (game.turnPhase == 2) {
        if (game.moveBuilder(row_pick, column_pick)) {
            let divFrom: any = document.getElementById(`piece_`.concat(String(from_row), String(from_column)));
            let divTo: any = document.getElementById(`piece_`.concat(String(row_pick), String(column_pick)));
            divTo.innerHTML = divFrom.innerHTML;
            divFrom.innerHTML = ``;
            to_row = row_pick;
            to_column = column_pick;
            game.turnPhase += 1;

            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[4];
            } else {
                document.getElementById('step').innerHTML = step[7];
            }
            clearError()
            if (game.x_turn) {
                if (from_row == game.x_b1.row && from_column == game.x_b1.column) {
                    game.x_b1.row = to_row;
                    game.x_b1.column = to_column;
                    game.x_b1.height = game.board[to_row][to_column];
                } else if(from_row == game.x_b2.row && from_column == game.x_b2.column) {
                    game.x_b2.row = to_row;
                    game.x_b2.column = to_column;
                    game.x_b2.height = game.board[to_row][to_column];
                } else {
                    printFalse(`printFalse`);
                }
            } else if(!game.x_turn) {
                if (from_row == game.o_b1.row && from_column == game.o_b1.column) {
                    game.o_b1.row = to_row;
                    game.o_b1.column = to_column;
                    game.o_b1.height = game.board[to_row][to_column];
                } else if(from_row == game.o_b2.row && from_column == game.o_b2.column) {
                    game.o_b2.row = to_row;
                    game.o_b2.column = to_column;
                    game.o_b2.height = game.board[to_row][to_column];
                } else {
                    printFalse(`printFalse`);
                }
            } else {
                printFalse(`printFalse`);
            }

        } else {
            document.getElementById('error').innerHTML = `Please select a valid space to move to`;
        }
    } else if (game.turnPhase == 3) {
        if (game.buildSquare(row_pick, column_pick)) {
            game.board[row_pick][column_pick] += 1;
            const buildDiv: any = document.getElementById(`height_`.concat(String(row_pick), String(column_pick)));
            const boxDiv: any = document.getElementById(`box_`.concat(String(row_pick), String(column_pick)));
            buildDiv.innerHTML = String(game.board[row_pick][column_pick]);
            if (game.board[row_pick][column_pick] == 4) {
                boxDiv.style = "background-color: black; color: white;";
            }

            clearError()

            let b1: boolean;
            let b2: boolean;
            // Victory Check
            if (game.x_turn) {
                b1 = game.checkValidMoves(game.o_b1.row, game.o_b1.column);
                b2 = game.checkValidMoves(game.o_b2.row, game.o_b2.column);
                if ((!b1 && !b2) || game.board[to_row][to_column] == 3) {
                    document.getElementById('step').innerHTML = step[8];
                }
            } else {
                b1 = game.checkValidMoves(game.x_b1.row, game.x_b1.column);
                b2 = game.checkValidMoves(game.x_b2.row, game.x_b2.column);
                if ((!b1 && !b2) || game.board[to_row][to_column] == 3) {
                    document.getElementById('step').innerHTML = step[9];
                }
            }

            game.changeTurn();
            game.turnPhase = 1;
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[2];
            } else {
                document.getElementById('step').innerHTML = step[5];
            }
        }
    }

}

function printFalse(input: string){
    console.log(`False - ${input}`);
}

function printError(input: string){
    document.getElementById('error').innerHTML = input;
}

function clearError(){
    document.getElementById('error').innerHTML = ``;
}

class GameBoard {

    board: number[][];
    state: String;   // Used to describe whether the game is still ongoing or not
    x_turn: Boolean;
    turnPhase: number; // 0 == Placement phase, 1 == choose builder to move, 2 == choose destiantion, 3 == choose build square 
    x_b1: Builder;
    x_b2: Builder;
    o_b1: Builder;
    o_b2: Builder;

    constructor(){
        // Creates the board
        this.board = [[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0],[0, 0, 0, 0, 0]];
        this.state = `In Progress`;
        this.x_turn = true;
        this.turnPhase = 0;
        this.x_b1 = new Builder();
        this.x_b2 = new Builder();
        this.o_b1 = new Builder();
        this.o_b2 = new Builder();
    }

    initialPlacement(row: number, col: number, div: any) {
        // , row_b2: number, col_b2: number, player: String
        if (this.isOccupied(row, col)){
            printFalse(`That space is occupied`);
            document.getElementById('error').innerHTML = `That space is occupied already`;
            return false;
        }

        if (this.x_turn) {
            if (this.x_b1.height == 99) {
                this.x_b1.row = row;
                this.x_b1.column = col;
                this.x_b1.height = 0;
                div.innerHTML += `<img src="./my-app/blackPawn.png" height=50px />`;
                clearError()
            } else{
                this.x_b2.row = row;
                this.x_b2.column = col;
                this.x_b2.height = 0;
                div.innerHTML += `<img src="./my-app/blackPawn.png" height=50px />`;
                this.changeTurn();
                document.getElementById(`step`).innerHTML = step[1];
                clearError()
            }
        } else if (!this.x_turn) {
            if (this.o_b1.height == 99) {
                this.o_b1.row = row;
                this.o_b1.column = col;
                this.o_b1.height = 0;
                div.innerHTML += `<img src="./my-app/whitePawn.png" height=50px />`;
                clearError()
            } else{
                this.o_b2.row = row;
                this.o_b2.column = col;
                this.o_b2.height = 0;
                this.changeTurn();
                this.turnPhase += 1;
                div.innerHTML += `<img src="./my-app/whitePawn.png" height=50px />`;
                document.getElementById(`step`).innerHTML = step[2];
                clearError()
            }
        } else {
            printFalse(`Inital Placement`);
            printError(`Invalid placement`);
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
        // returns false if space is free (not occupied)
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
            printError(`Not adjacent`);
            return false;
        }

        return true;
    }

    clickMove(row: number, col: number) {
        // Returns true if the user successfully selects a builder who has moves
        if (game.x_turn){
            if (row == game.x_b1.row && col == game.x_b1.column) {
                // 
            } else if (row == game.x_b2.row && col == game.x_b2.column) {
                //
            } else {
                return false;
            }
        } else if (!game.x_turn) {
            if (row == game.o_b1.row && col == game.o_b1.column) {
                //
            } else if (row == game.o_b2.row && col == game.o_b2.column) {
                //
            } else {
                return false;
            }
        } else {
            printFalse(`printFalse`);
        }
        if (this.checkValidMoves(row, col)) {
            return true;
        }
    }

    checkValidMoves(row: number, col: number){
        // Check if the builder they chose has valid moves
        let thisMove: boolean;
        for (let i = -1; i < 2 ; i++) {
            for (let j = -1; j < 2; j ++) {
                thisMove = false;
                let row_check: number = row + i;
                let col_check: number = col + j;
                if (row_check < 0 || row_check > 4) {
                    console.log(`row check fail`);
                    continue;
                }

                if (col_check < 0 || col_check > 4) {
                    console.log(`col check fail`);
                    continue;
                }

                if (game.isOccupied(row_check, col_check)) {
                    console.log(`occupied fail`);
                    continue;
                }

                if ((game.board[row_check][col_check] - game.board[row][col]) > 1) {
                    console.log(`height check fail;`)
                    continue;
                }

                thisMove = true;
                break;
            }
            console.log(thisMove)
            if (thisMove) {
                console.log('true should be returned')
                return true;
            }
        }
        console.log('ending fail')
        return false;
    }

    moveBuilder(row: number, col: number) {
        if (game.isOccupied(row, col)) {
            printError(`Somone is already there!`);
            return false;
        }
        
        if ((this.board[row][col] - this.board[from_row][from_column]) > 1){
            printFalse(`Can't jump that high!`);
            printError(`You can't jump that high!`);
            return false;
        }

        if (!this.isAdjacent(row, col, from_row, from_column)){
            printFalse(`You need to move to an adjacent square`);
            printError(`That is not adjacent!`);
            return false;
        }

        return true;
    }

    buildSquare(row: number, col: number) {
        if (game.isOccupied(row, col)){
            console.log(`Someone is there!`)
            printError(`Someone is there!`);
            return false;
        };

        if (!this.isAdjacent(to_row, to_column, row, col)){
            printFalse(`You need to move to an adjacent square`);
            printError(`That is not adjacent!`)
            return false;
        }        

        if (game.board[row][col] == 4) {
            printFalse(`Cannot build higher than 4`);
            printError(`Cannot build higher than 4`);
            return false;
        }

        return true;
    }

    makeMove(fromRow: number, fromColumn: number, toRow: number, toColumn: number, buildRow: number, buildColumn: number){
        // This is the function for making a move from console
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
        this.height = 99;
    }

}

let game = new GameBoard();
const step = [
    `Black, please place your builders`,  //0
    `White, please place your builders`,  //1
    `Black, choose a builder to move`,    //2
    `Black, choose where to move your builder`, //3
    `Black, choose where to build`,  // 4
    `White, choose a builder to move`,  //5
    `White, choose where to move your builder`, //6
    `White, choose where to build`,  //7
    `Black Won`,
    `White Won`
];
let from_row: number;
let from_column: number;
let to_row: number;
let to_column: number;
let build_row: number;
let build_column: number;