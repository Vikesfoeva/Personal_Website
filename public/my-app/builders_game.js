// Author: Brandon Lenz
// Adapted from final project in CS 161 with permision from Professor Tim Alcon
// ideas to improve
// computer AI, play vs human on local, play vs human elsewhere
// Only highlight valid clicks
function squareClick(row_pick, column_pick) {
    var divBox = document.getElementById("box_".concat(String(row_pick), String(column_pick)));
    if (game.turnPhase === 0) {
        game.initialPlacement(row_pick, column_pick);
    }
    else if (game.turnPhase === 1) {
        from_row = row_pick;
        from_column = column_pick;
        game.turnPhaseOne(row_pick, column_pick, divBox);
    }
    else if (game.turnPhase === 2) {
        // If the player selects their other builder, re-route the logic to that builder
        if (game.black_turn) {
            if ((row_pick === game.black_1.row && column_pick === game.black_1.column) || (row_pick === game.black_2.row && column_pick === game.black_2.column)) {
                game.changePhaseOne(row_pick, column_pick, divBox);
                return;
            }
        }
        else {
            if ((row_pick === game.white_1.row && column_pick === game.white_1.column) || (row_pick === game.white_2.row && column_pick === game.white_2.column)) {
                game.changePhaseOne(row_pick, column_pick, divBox);
                return;
            }
        }
        // Attempt to proceed with phase 2
        if (game.moveBuilder(row_pick, column_pick)) {
            var divFrom = document.getElementById("piece_".concat(String(from_row), String(from_column)));
            var divTo = document.getElementById("piece_".concat(String(row_pick), String(column_pick)));
            divTo.innerHTML = divFrom.innerHTML;
            divFrom.innerHTML = '';
            to_row = row_pick;
            to_column = column_pick;
            game.turnPhase = 3;
            if (game.black_turn) {
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
            if (game.black_turn) {
                if (from_row === game.black_1.row && from_column === game.black_1.column) {
                    game.black_1.row = to_row;
                    game.black_1.column = to_column;
                    game.black_1.height = game.board[to_row][to_column];
                    if (game.checkAOrB(game.black_2.row, game.black_2.column)) {
                        document.getElementById("box_".concat(String(game.black_2.row), String(game.black_2.column))).className = "boxAInvalid";
                    }
                    else {
                        document.getElementById("box_".concat(String(game.black_2.row), String(game.black_2.column))).className = "boxBInvalid";
                    }
                }
                else if (from_row === game.black_2.row && from_column === game.black_2.column) {
                    game.black_2.row = to_row;
                    game.black_2.column = to_column;
                    game.black_2.height = game.board[to_row][to_column];
                    if (game.checkAOrB(game.black_1.row, game.black_1.column)) {
                        document.getElementById("box_".concat(String(game.black_1.row), String(game.black_1.column))).className = "boxAInvalid";
                    }
                    else {
                        document.getElementById("box_".concat(String(game.black_1.row), String(game.black_1.column))).className = "boxBInvalid";
                    }
                }
                else {
                    printError("Something else went wrong");
                }
            }
            else if (!game.black_turn) {
                if (from_row === game.white_1.row && from_column === game.white_1.column) {
                    game.white_1.row = to_row;
                    game.white_1.column = to_column;
                    game.white_1.height = game.board[to_row][to_column];
                    if (game.checkAOrB(game.white_2.row, game.white_2.column)) {
                        document.getElementById("box_".concat(String(game.white_2.row), String(game.white_2.column))).className = "boxAInvalid";
                    }
                    else {
                        document.getElementById("box_".concat(String(game.white_2.row), String(game.white_2.column))).className = "boxBInvalid";
                    }
                }
                else if (from_row === game.white_2.row && from_column === game.white_2.column) {
                    game.white_2.row = to_row;
                    game.white_2.column = to_column;
                    game.white_2.height = game.board[to_row][to_column];
                    if (game.checkAOrB(game.white_1.row, game.white_1.column)) {
                        document.getElementById("box_".concat(String(game.white_1.row), String(game.white_1.column))).className = "boxAInvalid";
                    }
                    else {
                        document.getElementById("box_".concat(String(game.white_1.row), String(game.white_1.column))).className = "boxBInvalid";
                    }
                }
                else {
                    printError("Something else went wrong");
                }
            }
            else {
                printError("Something else went wrong");
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
            validBuilds.forEach(function (element) {
                document.getElementById("box_".concat(String(element[0]), String(element[1]))).className = element[2];
            });
            clearError();
            // Check for victory by condition builder on height 3
            if (game.black_1.height === 3 || game.black_2.height === 3) {
                document.getElementById('step').innerHTML = step[8];
                game.turnPhase = 99;
                return true;
            }
            else if (game.white_1.height === 3 || game.white_2.height === 3) {
                document.getElementById('step').innerHTML = step[9];
                game.turnPhase = 99;
                return true;
            }
            // Check for victory by opponent having no valid moves
            var b1 = void 0;
            var b2 = void 0;
            b1 = game.checkValidMoves(game.white_1.row, game.white_1.column);
            b2 = game.checkValidMoves(game.white_2.row, game.white_2.column);
            if ((!b1 && !b2)) {
                document.getElementById('step').innerHTML = step[8];
                game.turnPhase = 99;
                return true;
            }
            b1 = game.checkValidMoves(game.black_1.row, game.black_1.column);
            b2 = game.checkValidMoves(game.black_2.row, game.black_2.column);
            if ((!b1 && !b2)) {
                document.getElementById('step').innerHTML = step[9];
                game.turnPhase = 99;
                return true;
            }
            // Grid indexing lets you use this logic to determine if a box is A or B
            var divMoveFromClass = ((from_row + from_column) % 2 === 0) ? 'boxA' : 'boxB';
            var divMoveToClass = ((to_row + to_column) % 2 === 0) ? 'boxA' : 'boxB';
            var divBuildClass = ((row_pick + column_pick) % 2 === 0) ? 'boxA' : 'boxB';
            game.record.push([from_row, from_column, to_row, to_column, row_pick, column_pick, game.black_turn, divMoveFromClass, divMoveToClass, divBuildClass]);
            // Reset the last one
            var lastMove = game.record.length - 2;
            var moveArray = game.record[lastMove];
            if (lastMove > -1) {
                document.getElementById('box_'.concat(String(moveArray[0]), String(moveArray[1]))).className = moveArray[7];
                document.getElementById('box_'.concat(String(moveArray[2]), String(moveArray[3]))).className = moveArray[8];
                if (game.board[moveArray[4]][moveArray[5]] !== 4) {
                    document.getElementById('box_'.concat(String(moveArray[4]), String(moveArray[5]))).className = moveArray[9];
                }
            }
            // Mark the recent move
            document.getElementById("box_".concat(String(from_row), String(from_column))).className = 'recentMove';
            document.getElementById("box_".concat(String(to_row), String(to_column))).className = 'recentMove';
            document.getElementById("box_".concat(String(row_pick), String(column_pick))).className = 'recentBuild';
            if (game.board[row_pick][column_pick] === 4) {
                boxDiv.className = "maxHeight";
                boxDiv.innerHTML = '';
                boxDiv.innerHTML = '4';
            }
            game.changeTurn();
            game.turnPhase = 1;
            game.setupPlayerMove();
            if (game.black_turn) {
                document.getElementById('step').innerHTML = step[2];
            }
            else {
                document.getElementById('step').innerHTML = step[5];
            }
        }
    }
}
function printError(input) {
    console.log("False - " + input);
    document.getElementById('error').innerHTML = input;
}
function clearError() {
    document.getElementById('error').innerHTML = "";
}
var GameBoard = /** @class */ (function () {
    function GameBoard() {
        // Creates the board
        this.board = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.black_turn = true;
        this.turnPhase = 0;
        this.black_1 = new Builder();
        this.black_2 = new Builder();
        this.white_1 = new Builder();
        this.white_2 = new Builder();
        this.record = [];
    }
    GameBoard.prototype.changePhaseOne = function (row_pick, column_pick, divBox) {
        var divMoveFromClass = (this.checkAOrB(from_row, from_column)) ? 'boxA' : 'boxB';
        document.getElementById("box_".concat(String(from_row), String(from_column))).className = divMoveFromClass;
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
            if (game.black_turn) {
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
    GameBoard.prototype.initialPlacement = function (row, col) {
        // , row_b2: number, col_b2: number, player: String
        var divPiece = document.getElementById("piece_".concat(String(row), String(col)));
        var divBox = document.getElementById("box_".concat(String(row), String(col)));
        if (this.isOccupied(row, col)) {
            document.getElementById('error').innerHTML = "That space is occupied already";
            return false;
        }
        if (this.black_turn) {
            if (this.black_1.height === 99) {
                this.black_1.row = row;
                this.black_1.column = col;
                this.black_1.height = 0;
                divPiece.innerHTML += "<img src=\"./my-app/blackPawn.png\" height=50px />";
                clearError();
            }
            else {
                this.black_2.row = row;
                this.black_2.column = col;
                this.black_2.height = 0;
                divPiece.innerHTML += "<img src=\"./my-app/blackPawn.png\" height=50px />";
                this.changeTurn();
                document.getElementById("step").innerHTML = step[1];
                clearError();
            }
        }
        else if (!this.black_turn) {
            if (this.white_1.height === 99) {
                this.white_1.row = row;
                this.white_1.column = col;
                this.white_1.height = 0;
                divPiece.innerHTML += "<img src=\"./my-app/whitePawn.png\" height=50px />";
                clearError();
            }
            else {
                this.white_2.row = row;
                this.white_2.column = col;
                this.white_2.height = 0;
                this.changeTurn();
                this.turnPhase += 1;
                divPiece.innerHTML += "<img src=\"./my-app/whitePawn.png\" height=50px />";
                document.getElementById("step").innerHTML = step[2];
                clearError();
                // This is the second placement for white, so now we must prep the board for black.
                game.setupPlayerMove();
            }
        }
        else {
            printError("Invalid placement");
        }
        if ((row + col) % 2 === 0) {
            divBox.className = "boxAInvalid";
        }
        else {
            divBox.className = "boxBInvalid";
        }
    };
    GameBoard.prototype.setupPlayerMove = function () {
        var divBox;
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                divBox = document.getElementById("box_".concat(String(i), String(j)));
                if (game.checkAOrB(i, j) && divBox.className === "boxA") {
                    divBox.className = "boxAInvalid";
                }
                else if (!game.checkAOrB(i, j) && divBox.className === "boxB") {
                    divBox.className = "boxBInvalid";
                }
            }
        }
        console.log(game.black_turn);
        if (game.black_turn) {
            console.log('Black turn');
            if (game.checkAOrB(game.black_1.row, game.black_1.column)) {
                document.getElementById("box_".concat(String(game.black_1.row), String(game.black_1.column))).className = "boxA";
            }
            else {
                document.getElementById("box_".concat(String(game.black_1.row), String(game.black_1.column))).className = "boxB";
            }
            if (game.checkAOrB(game.black_2.row, game.black_2.column)) {
                document.getElementById("box_".concat(String(game.black_2.row), String(game.black_2.column))).className = "boxA";
            }
            else {
                document.getElementById("box_".concat(String(game.black_2.row), String(game.black_2.column))).className = "boxB";
            }
        }
        else if (!game.black_turn) {
            console.log('White turn');
            if (game.checkAOrB(game.white_1.row, game.white_1.column)) {
                document.getElementById("box_".concat(String(game.white_1.row), String(game.white_1.column))).className = "boxA";
            }
            else {
                document.getElementById("box_".concat(String(game.white_1.row), String(game.white_1.column))).className = "boxB";
            }
            if (game.checkAOrB(game.white_2.row, game.white_2.column)) {
                document.getElementById("box_".concat(String(game.white_2.row), String(game.white_2.column))).className = "boxA";
            }
            else {
                document.getElementById("box_".concat(String(game.white_2.row), String(game.white_2.column))).className = "boxB";
            }
        }
    };
    GameBoard.prototype.checkAOrB = function (row, column) {
        // A === true, B === false
        if ((row + column) % 2 === 0) {
            return true;
        }
        return false;
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
        if (row === this.black_1.row && column === this.black_1.column) {
            return true;
        }
        else if (row === this.black_2.row && column === this.black_2.column) {
            return true;
        }
        else if (row === this.white_1.row && column === this.white_1.column) {
            return true;
        }
        else if (row === this.white_2.row && column === this.white_2.column) {
            return true;
        }
        return false;
    };
    GameBoard.prototype.changeTurn = function () {
        this.black_turn = !this.black_turn;
    };
    GameBoard.prototype.printBoard = function () {
        for (var i = 0; i < 5; i++) {
            console.log(this.board[i]);
        }
    };
    GameBoard.prototype.printBuilders = function () {
        console.log("x builders:");
        console.log(this.black_1);
        console.log(this.black_2);
        console.log();
        console.log("o builders");
        console.log(this.white_1);
        console.log(this.white_2);
    };
    GameBoard.prototype.isAdjacent = function (row1, column1, row2, column2) {
        if (Math.abs(row1 - row2) > 1 || Math.abs(column1 - column2) > 1) {
            printError("Not adjacent");
            return false;
        }
        return true;
    };
    GameBoard.prototype.clickMove = function (row, col) {
        // Returns true if the user successfully selects a builder who has moves
        if (game.black_turn) {
            if (row === game.black_1.row && col === game.black_1.column) {
                // 
            }
            else if (row === game.black_2.row && col === game.black_2.column) {
                //
            }
            else {
                return false;
            }
        }
        else if (!game.black_turn) {
            if (row === game.white_1.row && col === game.white_1.column) {
                //
            }
            else if (row === game.white_2.row && col === game.white_2.column) {
                //
            }
            else {
                return false;
            }
        }
        else {
            printError("Something else went wrong");
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
                    if (build_row_check !== row || build_col_check !== col) {
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
            printError("You can't jump that high!");
            return false;
        }
        if (!this.isAdjacent(row, col, from_row, from_column)) {
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
            printError("That is not adjacent!");
            return false;
        }
        if (game.board[row][col] === 4) {
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
function undoMostRecentMove() {
    var answer = window.confirm("Do you want to undo the most recent move?  Note that if the current player has not yet finished their build, it will undo their entire turn as well.");
    if (answer) {
        if (game.record.length === 0) {
            return true;
        }
        var lastMove = game.record.pop();
        var divFromPiece = document.getElementById("piece_".concat(String(lastMove[0]), String(lastMove[1])));
        var divToPiece = document.getElementById("piece_".concat(String(lastMove[2]), String(lastMove[3])));
        var divBuild = document.getElementById("box_".concat(String(lastMove[4]), String(lastMove[5])));
        var divBuildHeight = document.getElementById("height_".concat(String(lastMove[4]), String(lastMove[5])));
        divFromPiece.innerHTML = divToPiece.innerHTML;
        divToPiece.innerHTML = '';
        if (lastMove[2] === game.black_1.row && lastMove[3] === game.black_1.column) {
            game.black_1.row = lastMove[0];
            game.black_1.column = lastMove[1];
            game.black_1.height = game.board[lastMove[0]][lastMove[1]];
        }
        else if (lastMove[2] === game.black_2.row && lastMove[3] === game.black_2.column) {
            game.black_2.row = lastMove[0];
            game.black_2.column = lastMove[1];
            game.black_2.height = game.board[lastMove[0]][lastMove[1]];
        }
        else if (lastMove[2] === game.white_1.row && lastMove[3] === game.white_1.column) {
            game.white_1.row = lastMove[0];
            game.white_1.column = lastMove[1];
            game.white_1.height = game.board[lastMove[0]][lastMove[1]];
        }
        else if (lastMove[2] === game.white_2.row && lastMove[3] === game.white_2.column) {
            game.white_2.row = lastMove[0];
            game.white_2.column = lastMove[1];
            game.white_2.height = game.board[lastMove[0]][lastMove[1]];
        }
        if (game.board[lastMove[4]][lastMove[5]] === 4) {
            divBuild.innerHTML = "<div id=\"piece_" + lastMove[4] + lastMove[5] + "\" class=\"piece\"></div><div id=\"height_" + lastMove[4] + lastMove[5] + "\" class=\"height\">3</div>";
            game.board[lastMove[4]][lastMove[5]] = 3;
        }
        else {
            game.board[lastMove[4]][lastMove[5]] -= 1;
            divBuildHeight.innerHTML = game.board[lastMove[4]][lastMove[5]];
        }
        var divFrom = document.getElementById("box_".concat(String(lastMove[0]), String(lastMove[1])));
        var divTo = document.getElementById("box_".concat(String(lastMove[2]), String(lastMove[3])));
        divFrom.className = lastMove[7];
        divTo.className = lastMove[8];
        divBuild.className = lastMove[9];
        game.changeTurn();
        game.turnPhase = 1;
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var divBox = document.getElementById("box_".concat(String(i), String(j)));
                if ((i + j) % 2 === 0) {
                    divBox.className = "boxA";
                }
                else {
                    divBox.className = "boxB";
                }
            }
        }
        if (game.record.length === 0) {
            return true;
        }
        var newLastMove = game.record[game.record.length - 1];
        var divOldFrom = document.getElementById("box_".concat(String(newLastMove[0]), String(newLastMove[1])));
        var divOldTo = document.getElementById("box_".concat(String(newLastMove[2]), String(newLastMove[3])));
        var divOldBuild = document.getElementById("box_".concat(String(newLastMove[4]), String(newLastMove[5])));
        from_row = newLastMove[0];
        from_column = newLastMove[1];
        to_row = newLastMove[2];
        to_column = newLastMove[3];
        divOldFrom.className = "recentMove";
        divOldTo.className = "recentMove";
        divOldBuild.className = "recentBuild";
        if (game.black_turn) {
            document.getElementById('step').innerHTML = step[2];
        }
        else {
            document.getElementById('step').innerHTML = step[5];
        }
    }
}
function reset() {
    var answer = window.confirm("Do you want to reset the game and start a new one?");
    if (answer) {
        game.black_1.row = 99;
        game.black_1.column = 99;
        game.black_1.height = 99;
        game.black_2.row = 99;
        game.black_2.column = 99;
        game.black_2.height = 99;
        game.white_1.row = 99;
        game.white_1.column = 99;
        game.white_1.height = 99;
        game.white_2.row = 99;
        game.white_2.column = 99;
        game.white_2.height = 99;
        game.black_turn = true;
        game.turnPhase = 0;
        document.getElementById("step").innerHTML = step[0];
        clearError();
        game.record.length = 0;
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var divBox = document.getElementById("box_".concat(String(i), String(j)));
                var divPiece = document.getElementById("piece_".concat(String(i), String(j)));
                var divHeight = document.getElementById("height_".concat(String(i), String(j)));
                if (divHeight === null) {
                    divBox.innerHTML = "<div id=\"piece_" + i + j + "\" class=\"piece\"></div><div id=\"height_" + i + j + "\" class=\"height\">0</div>";
                }
                else {
                    divHeight.innerHTML = '0';
                    divPiece.innerHTML = '';
                }
                game.board[i][j] = 0;
                if ((i + j) % 2 === 0) {
                    divBox.className = "boxA";
                }
                else {
                    divBox.className = "boxB";
                }
            }
        }
    }
}
function moveHistory() {
    window.alert("Lol I don't do anything yet");
}
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
