// Represents a triple of indexes in the board
function triple(a, b, c){
	this.x = a;
	this.y = b;
	this.z = c;
};

// Possible values for the cells in the board
var mark = {
	BLANK: "_",
	X: "X",
	O: "O"
};

function start(){
	var board = new smallBoard();
	board.run();
	

}


function smallBoard(){
	// Grid holds the cells of the board
	this.grid = [];
	
	// Initialize the grid
	for (var i = 0; i<9; i++){
		this.grid[this.grid.length] = mark.BLANK;
	}
	
	// Current player
	this.player = mark.X;
	
	// Winner of the board
	this.winner = mark.BLANK;
	
	// Number of cells marked
	this.cellsMarked = 0;
	
	// Triples of coordinates in the board that can contain three in a row
	this.R1 = new triple(0,1,2);
	this.R2 = new triple(3,4,5);
	this.R3 = new triple(6,7,8);
	
	this.C1 = new triple(0,3,6);
	this.C2 = new triple(1,4,7);
	this.C3 = new triple(2,5,8);
	
	this.D1 = new triple(0,4,8);
	this.D2 = new triple(2,4,6);
	
	// Mapping of winning combinations to cells in the board
	this.map = [[this.R1,this.C1,this.D1],
	           [this.R1,this.C2],
	           [this.R1,this.C3,this.D2],
	           [this.R2,this.C1],
	           [this.R2,this.C2,this.D1,this.D2],
	           [this.R2,this.C3],
	           [this.R3,this.C1,this.D2],
	           [this.R3,this.C2],
	           [this.R3,this.C3,this.D1]	           
	           ];
	
	
	
	this.drawBoard = function(){
		var board = "<tbody>";
		for(var i = 0; i<3; i++){
			board += "<tr>";
			for (var j = 0; j<3; j++){
				var index = i*3+j;
				board += "<td class='cell' id='" + index + "'>";
				board += this.grid[i*3+j];
				board += "</td>";
			}
			board += "</tr>";
		}
		board += "</tbody>";
		$("#board").html(board);
		
		var curr = "<p> The current player is : " + this.player + "</p>";
		$("#player").html(curr);
	};
	
	this.drawBoard();

	this.checkThreeInARow = function (triple, mrk){
		if(this.grid[triple.x] == mrk && this.grid[triple.y] == mrk && this.grid[triple.z] == mrk){
			return true;
		}
		else {
			return false;
		}
	};
	
	this.checkForWin = function (i, mrk){
		for (var j = 0; j<this.map[i].length; j++){
			if (this.checkThreeInARow(this.map[i][j],mrk)){
				this.winner = this.player;
			};
		}
	};
	
	// Updates the current player
	this.nextTurn = function(){
		if(this.player == mark.X){
			this.player = mark.O;
		} else {
			this.player = mark.X;
		}
		var curr = "<p> The current player is : " + this.player + "</p>";
		$("#player").html(curr);
	};
	
	this.select = function (index){
		if(this.grid[index] == mark.BLANK){
			this.grid[index] = this.player;
			this.cellsMarked++;
			
			this.checkForWin(index, this.player);
		
			$("#" + index).html(this.player);
			this.nextTurn();
		}
		else{
			alert("The selected cell is already marked. Please, choose a non-marked cell.");
		}
		
		if(this.winner != mark.BLANK){
			$("td").off();
			alert(this.winner + " WON! :D");
		} else if(this.cellsMarked >= 9){
			$("td").off();
			alert("GAME OVER. There is a TIE.");
		}
	};
};


$(document).ready(function(){
	var board = new smallBoard();

	$("td").on("click", function(){
			var id = $(this).attr("id");
			board.select(id);
		}
	);
});