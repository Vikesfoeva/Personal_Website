// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon
// ideas to improve
// prettier board, computer AI, play vs human on local, play vs human elsewhere
// Undo feature, choosing builder a or builder b aka not being locked in
// seems to be a bug where victory is not always properly checked
// Feature Requests
// Highlight the most recent move
function squareClick(row_pick, column_pick) {
    var div = document.getElementById("piece_".concat(String(row_pick), String(column_pick)));
    var divBox = document.getElementById("box_".concat(String(row_pick), String(column_pick)));
    if (game.turnPhase === 0) {
        game.initialPlacement(row_pick, column_pick, div);
    }
    else if (game.turnPhase === 1) {
        from_row = row_pick;
        from_column = column_pick;
        game.turnPhaseOne(row_pick, column_pick, divBox);
    }
    else if (game.turnPhase === 2) {
        // If the player selects their other builder, re-route the logic to that builder
        if (game.x_turn) {
            if (row_pick === game.x_b1.row && column_pick === game.x_b1.column) {
                game.changePhaseOne(row_pick, column_pick, divBox);
                return;
            }
            else if (row_pick === game.x_b2.row && column_pick === game.x_b2.column) {
                game.changePhaseOne(row_pick, column_pick, divBox);
                return;
            }
        }
        else {
            if (row_pick === game.o_b1.row && column_pick === game.o_b1.column) {
                game.changePhaseOne(row_pick, column_pick, divBox);
                return;
            }
            else if (row_pick === game.o_b2.row && column_pick === game.o_b2.column) {
                game.changePhaseOne(row_pick, column_pick, divBox);
                return;
            }
        }
        // Attempt to proceed with phase 2
        if (game.moveBuilder(row_pick, column_pick)) {
            var divFrom = document.getElementById("piece_".concat(String(from_row), String(from_column)));
            var divTo = document.getElementById("piece_".concat(String(row_pick), String(column_pick)));
            divTo.innerHTML = divFrom.innerHTML;
            divFrom.innerHTML = "";
            to_row = row_pick;
            to_column = column_pick;
            game.turnPhase = 3;
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[4];
            }
            else {
                document.getElementById('step').innerHTML = step[7];
            }
            // Sets the cells back to their old color
            document.getElementById("box_".concat(String(from_row), String(from_column))).className = from_class;
            validMoves.forEach(function (element) {
                document.getElementById("box_".concat(String(element[0]), String(element[1]))).className = element[2];
            });
            // Highlight valid build cells
            validBuilds.length = 0;
            var validBuildsList = game.validBuildsAvail(row_pick, column_pick, true);
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (validBuildsList[i][j]) {
                        var row_ref = row_pick + i - 1;
                        var col_ref = column_pick + j - 1;
                        var divBuilds = document.getElementById("box_".concat(String(row_ref), String(col_ref)));
                        validBuilds.push([row_ref, col_ref, divBuilds.className]);
                        divBuilds.className = "highlightedBuild";
                    }
                }
            }
            clearError();
            if (game.x_turn) {
                if (from_row === game.x_b1.row && from_column === game.x_b1.column) {
                    game.x_b1.row = to_row;
                    game.x_b1.column = to_column;
                    game.x_b1.height = game.board[to_row][to_column];
                }
                else if (from_row === game.x_b2.row && from_column === game.x_b2.column) {
                    game.x_b2.row = to_row;
                    game.x_b2.column = to_column;
                    game.x_b2.height = game.board[to_row][to_column];
                }
                else {
                    printFalse("printFalse");
                }
            }
            else if (!game.x_turn) {
                if (from_row === game.o_b1.row && from_column === game.o_b1.column) {
                    game.o_b1.row = to_row;
                    game.o_b1.column = to_column;
                    game.o_b1.height = game.board[to_row][to_column];
                }
                else if (from_row === game.o_b2.row && from_column === game.o_b2.column) {
                    game.o_b2.row = to_row;
                    game.o_b2.column = to_column;
                    game.o_b2.height = game.board[to_row][to_column];
                }
                else {
                    printFalse("printFalse");
                }
            }
            else {
                printFalse("printFalse");
            }
        }
        else {
            document.getElementById('error').innerHTML = "Please select a valid space to move to";
        }
    }
    else if (game.turnPhase === 3) {
        if (game.buildSquare(row_pick, column_pick)) {
            game.board[row_pick][column_pick] += 1;
            var buildDiv = document.getElementById("height_".concat(String(row_pick), String(column_pick)));
            var boxDiv = document.getElementById("box_".concat(String(row_pick), String(column_pick)));
            buildDiv.innerHTML = String(game.board[row_pick][column_pick]);
            if (game.board[row_pick][column_pick] === 4) {
                boxDiv.style = "background-color: black; color: white;";
            }
            validBuilds.forEach(function (element) {
                document.getElementById("box_".concat(String(element[0]), String(element[1]))).className = element[2];
            });
            clearError();
            // Check for victory by condition builder on height 3
            if (game.x_b1.height === 3 || game.x_b2.height === 3) {
                document.getElementById('step').innerHTML = step[8];
                game.turnPhase = 99;
                return true;
            }
            else if (game.o_b1.height === 3 || game.o_b2.height === 3) {
                document.getElementById('step').innerHTML = step[9];
                game.turnPhase = 99;
                return true;
            }
            // Check for victory by opponent having no valid moves
            var b1 = void 0;
            var b2 = void 0;
            b1 = game.checkValidMoves(game.o_b1.row, game.o_b1.column);
            b2 = game.checkValidMoves(game.o_b2.row, game.o_b2.column);
            if ((!b1 && !b2)) {
                document.getElementById('step').innerHTML = step[8];
                game.turnPhase = 99;
                return true;
            }
            b1 = game.checkValidMoves(game.x_b1.row, game.x_b1.column);
            b2 = game.checkValidMoves(game.x_b2.row, game.x_b2.column);
            if ((!b1 && !b2)) {
                document.getElementById('step').innerHTML = step[9];
                game.turnPhase = 99;
                return true;
            }
            var divMoveFrom = document.getElementById("box_".concat(String(from_row), String(from_column)));
            var divMoveTo = document.getElementById("box_".concat(String(to_row), String(to_column)));
            var divBuild = document.getElementById("box_".concat(String(row_pick), String(column_pick)));
            var divMoveFromClass = void 0;
            var divMoveToClass = void 0;
            var divBuildClass = void 0;
            if ((from_row + from_column) % 2 === 0) {
                divMoveFromClass = 'boxA';
            }
            else {
                divMoveFromClass = 'boxB';
            }
            if ((to_row + to_column) % 2 === 0) {
                divMoveToClass = 'boxA';
            }
            else {
                divMoveToClass = 'boxB';
            }
            if ((row_pick + column_pick) % 2 === 0) {
                divBuildClass = 'boxA';
            }
            else {
                divBuildClass = 'boxB';
            }
            game.record.push([from_row, from_column, to_row, to_column, row_pick, column_pick, game.x_turn, divMoveFromClass, divMoveToClass, divBuildClass]);
            // Reset the last one
            var lastMove = game.record.length - 2;
            var moveArray = game.record[lastMove];
            if (lastMove > -1) {
                document.getElementById('box_'.concat(String(moveArray[0]), String(moveArray[1]))).className = moveArray[7];
                document.getElementById('box_'.concat(String(moveArray[2]), String(moveArray[3]))).className = moveArray[8];
                document.getElementById('box_'.concat(String(moveArray[4]), String(moveArray[5]))).className = moveArray[9];
            }
            divMoveFrom.className = 'recentMove';
            divMoveTo.className = 'recentMove';
            divBuild.className = 'recentBuild';
            game.changeTurn();
            game.turnPhase = 1;
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[2];
            }
            else {
                document.getElementById('step').innerHTML = step[5];
            }
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
        this.record = [];
    }
    GameBoard.prototype.changePhaseOne = function (row_pick, column_pick, divBox) {
        from_row = row_pick;
        from_column = column_pick;
        document.getElementById("box_".concat(String(from_row), String(from_column))).className = from_class;
        validMoves.forEach(function (element) {
            document.getElementById("box_".concat(String(element[0]), String(element[1]))).className = element[2];
        });
        game.turnPhaseOne(row_pick, column_pick, divBox);
    };
    GameBoard.prototype.turnPhaseOne = function (row_pick, column_pick, divBox) {
        if (game.clickMove(row_pick, column_pick)) {
            if (game.x_turn) {
                document.getElementById('step').innerHTML = step[3];
            }
            else {
                document.getElementById('step').innerHTML = step[6];
            }
            clearError();
            game.turnPhase = 2;
            from_class = divBox.className;
            divBox.className = "fromCell";
            // Add logic for highlighting cells
            var validMovesList = game.checkValidMoves(row_pick, column_pick, true);
            validMoves.length = 0;
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (validMovesList[i][j]) {
                        var row_ref = row_pick + i - 1;
                        var col_ref = column_pick + j - 1;
                        var divMoves = document.getElementById("box_".concat(String(row_ref), String(col_ref)));
                        validMoves.push([row_ref, col_ref, divMoves.className]);
                        divMoves.className = "highlightedMove";
                    }
                }
            }
        }
        else {
            document.getElementById('error').innerHTML = "Please choose a builder";
        }
        ;
    };
    GameBoard.prototype.initialPlacement = function (row, col, div) {
        // , row_b2: number, col_b2: number, player: String
        if (this.isOccupied(row, col)) {
            printFalse("That space is occupied");
            document.getElementById('error').innerHTML = "That space is occupied already";
            return false;
        }
        if (this.x_turn) {
            if (this.x_b1.height === 99) {
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
            if (this.o_b1.height === 99) {
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
            printError("Invalid placement");
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
        // returns false if space is free (not occupied)
        if (row === this.x_b1.row && column === this.x_b1.column) {
            return true;
        }
        else if (row === this.x_b2.row && column === this.x_b2.column) {
            return true;
        }
        else if (row === this.o_b1.row && column === this.o_b1.column) {
            return true;
        }
        else if (row === this.o_b2.row && column === this.o_b2.column) {
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
            printError("Not adjacent");
            return false;
        }
        return true;
    };
    GameBoard.prototype.clickMove = function (row, col) {
        // Returns true if the user successfully selects a builder who has moves
        if (game.x_turn) {
            if (row === game.x_b1.row && col === game.x_b1.column) {
                // 
            }
            else if (row === game.x_b2.row && col === game.x_b2.column) {
                //
            }
            else {
                return false;
            }
        }
        else if (!game.x_turn) {
            if (row === game.o_b1.row && col === game.o_b1.column) {
                //
            }
            else if (row === game.o_b2.row && col === game.o_b2.column) {
                //
            }
            else {
                return false;
            }
        }
        else {
            printFalse("printFalse");
        }
        if (game.checkValidMoves(row, col, false)) {
            return true;
        }
    };
    GameBoard.prototype.checkValidMoves = function (row, col, moveSet) {
        if (moveSet === void 0) { moveSet = false; }
        // Check if the builder they chose has valid moves
        // Still need to check if builder can build after moving
        var validMoves = [[false, false, false], [false, false, false], [false, false, false]];
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var row_check = row + i;
                var col_check = col + j;
                if (row_check < 0 || row_check > 4) {
                    continue;
                }
                if (col_check < 0 || col_check > 4) {
                    continue;
                }
                if (game.isOccupied(row_check, col_check)) {
                    continue;
                }
                if ((game.board[row_check][col_check] - game.board[row][col]) > 1) {
                    continue;
                }
                var validBuilds_1 = game.validBuildsAvail(row_check, col_check, true);
                // exited valid build check
                for (var x = 0; x < 3; x++) {
                    for (var y = 0; y < 3; y++) {
                        if (validBuilds_1[x][y]) {
                            validMoves[i + 1][j + 1] = true;
                        }
                    }
                }
            }
        }
        // Exited valid move check
        var tally = 0;
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                if (validMoves[x][y]) {
                    tally += 1;
                }
            }
        }
        if (moveSet) {
            return validMoves;
        }
        if (tally > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    GameBoard.prototype.validBuildsAvail = function (row, col, buildSet) {
        if (buildSet === void 0) { buildSet = false; }
        var validBuilds = [[false, false, false], [false, false, false], [false, false, false]];
        for (var k = -1; k < 2; k++) {
            for (var m = -1; m < 2; m++) {
                var build_row_check = row + k;
                var build_col_check = col + m;
                if (k === 0 && m === 0) {
                    continue;
                }
                if (build_row_check === from_row && build_col_check === from_column) {
                    validBuilds[k + 1][m + 1] = true;
                    continue;
                }
                if (build_row_check < 0 || build_row_check > 4) {
                    continue;
                }
                if (build_col_check < 0 || build_col_check > 4) {
                    continue;
                }
                if (game.isOccupied(build_row_check, build_col_check)) {
                    if (build_row_check != row || build_col_check != col) {
                        continue;
                    }
                }
                if (game.board[build_row_check][build_col_check] === 4) {
                    continue;
                }
                validBuilds[k + 1][m + 1] = true;
            }
        }
        return validBuilds;
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
            printError("Someone is there!");
            return false;
        }
        ;
        if (!this.isAdjacent(to_row, to_column, row, col)) {
            printFalse("You need to move to an adjacent square");
            printError("That is not adjacent!");
            return false;
        }
        if (game.board[row][col] === 4) {
            printFalse("Cannot build higher than 4");
            printError("Cannot build higher than 4");
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
var from_class;
var validMoves = [];
var to_row;
var to_column;
var validBuilds = [];
var build_row;
var build_column;
// Legacy method that should be able to be removed
// makeMove(fromRow: number, fromColumn: number, toRow: number, toColumn: number, buildRow: number, buildColumn: number){
//     // This is the function for making a move from console
//     if (!this.onBoard(fromRow, fromColumn) || !this.onBoard(toRow, toColumn) || !this.onBoard(buildRow, buildColumn)) {
//         printFalse(`Not on board`);
//         return false;
//     }
//     if (this.state != `In Progress`) {
//         printFalse(`Game is no longer going on`);
//         return false;
//     }
//     if (this.isOccupied(toRow, toColumn)) {
//         printFalse(`Someone is already there!`);
//         return false;
//     }
//     // test this, the logic feels off
//     if (this.isOccupied(buildRow, buildColumn)) {
//         // it's ok to build where you just left
//         if (fromRow != buildRow && fromColumn != buildColumn){
//             printFalse(`Someone is there, no building!`)
//             return false;
//         }
//     }
//     if (toRow === buildRow && toColumn === buildColumn) {
//         printFalse(`You are about to move there!`);
//         return false;
//     }
//     if ((this.board[toRow][toColumn] - this.board[fromRow][fromColumn]) > 1){
//         printFalse(`Can't jump that high!`);
//         return false;
//     }
//     if (!this.isAdjacent(fromRow, fromColumn, toRow, toColumn)){
//         printFalse(`You need to move to an adjacent square`);
//         return false;
//     }
//     if (!this.isAdjacent(toRow, toColumn, buildRow, buildColumn)){
//         printFalse(`You need to move to an adjacent square`);
//         return false;
//     }
//     if (this.board[buildRow][buildColumn] > 4) {
//         printFalse(`Can't build that high`);
//         return false;
//     }
//     if (this.x_turn) {
//         if (fromRow === this.x_b1.row && fromColumn === this.x_b1.column) {
//             this.x_b1.row = toRow;
//             this.x_b1.column = toColumn;
//             this.x_b1.height = this.board[toRow][toColumn];
//         } else if(fromRow === this.x_b2.row && fromColumn === this.x_b2.column) {
//             this.x_b2.row = toRow;
//             this.x_b2.column = toColumn;
//             this.x_b2.height = this.board[toRow][toColumn];
//         } else {
//             printFalse(`It was x's turn but a builder was not properly referenced`);
//             return false;
//         }
//     } else if(!this.x_turn){
//         if (fromRow === this.o_b1.row && fromColumn === this.o_b1.column) {
//             this.o_b1.row = toRow;
//             this.o_b1.column = toColumn;
//             this.o_b1.height = this.board[toRow][toColumn];
//         } else if(fromRow === this.o_b2.row && fromColumn === this.o_b2.column) {
//             this.o_b2.row = toRow;
//             this.o_b2.column = toColumn;
//             this.o_b2.height = this.board[toRow][toColumn];
//         } else {
//             printFalse(`It was x's turn but a builder was not properly referenced`);
//             return false;
//         }
//     } else {
//         printFalse(`Somehow you made something else go wrong`)
//         return false;
//     }
//     this.board[buildRow][buildColumn] += 1;
//     this.changeTurn();
// }
