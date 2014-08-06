/* Game settings. */
var settings = {
	size : 3, // number of rows/columns game will have.
	board: [],
	currentMove: (Math.random()<.5)?'o':'x' // choose first player to start at random
};
 
/* schema - empty slots will have null primitive value.
   [[x, o, x],
	[o, x, o],
	[o, o, x]]
*/

function createNewBoard(){ // creates a new array based off the schema above and the size setting - all slots start as null. 
	var ticTacHolder = [];
	for(var i = 0; i<settings.size; i++){
		ticTacHolder[i] = [];
		for(var t = 0; t<settings.size; t++){
			ticTacHolder[i][t] = null;
		}
	}
	return ticTacHolder;
}

function addPostion(yPos, xPos, checkGame){
	if(settings.board[yPos][xPos] === null){
		settings.board[yPos][xPos] = settings.currentMove;
		var result = checkGame.call(winningCombinations, settings.currentMove);
		settings.currentMove = (settings.currentMove == 'o') ? 'x':'o';
		return result;
	}
	return false;
}

/* Determine winning combinations for current players move (x or o) */
var winningCombinations = {	
	horizontal : function(move){ // check every row horizontally - if any row returns true that means that we have a winner.
		return settings.board.some(function(row){
			return row.every(function(entry){
				return move === entry;
			});
		});
	},

	vertical : function(move){ // check every column vertically for matches
		var verticalMatch = false; 
		for(var i = 0; i<settings.size; i++){  // loop through column
			columnMatch = true;
			for(var t = 0; t<settings.size; t++){ 	// check every cell of column and if any matches are false start the next column loop
				if(settings.board[t][i] !== move){ columnMatch = false; break; }
			}
			if (columnMatch){ verticalMatch = true; break;}
		}
		return verticalMatch;
	},
	
	diagonal : function(move){
		var direction = function(direction){
			var number = (direction == 'decline') ? 0 : settings.size-1;
			var diagonalMatch = true; // unless proven otherwise below [settings.size-i]
			for (var i = 0; i<settings.size; i++){
				if(settings.board[i][Math.abs(number - i)] !== move) {diagonalMatch = false; break;}
			}
			return diagonalMatch;
		};

		return direction('decline') || direction('incline'); // checks for both directions of diagonal. 
	},

	tie : function(){ // check to see if the game is finished and if there was a tie
		return !settings.board.some(function(row){
			return row.some(function(entry){
				return null === entry;
			});
		});
	},

	checkForWinnerOrTie : function(move){
		var obj = {
			gameover: false,
			winner: null
		};

		if(this.diagonal(move) || this.vertical(move) || this.diagonal(move)){
			obj.gameover = true;
			obj.winner = move;
		} else if (this.tie()) {
			obj.gameover = true;
			obj.winner = 'tie';
		}
		return obj;
	}
};



settings.board = createNewBoard();

function submitEvent(yPos, xPos){       
	var result = addPostion(yPos, xPos, winningCombinations.checkForWinnerOrTie);
	if(result){
		if(result.gameover){
			console.log(result.winner == 'tie'? 'It was a tie!!' : 'Player: '+result.winner+' won!');
			settings.board = createNewBoard();
		} else {
			console.log('yolo');
			console.log(JSON.stringify(settings.board));
		}
	}
}
