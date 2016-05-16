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

// Triples of coordinates in the board that can contain three in a row
R1 = new triple(0,1,2);
R2 = new triple(3,4,5);
R3 = new triple(6,7,8);

C1 = new triple(0,3,6);
C2 = new triple(1,4,7);
C3 = new triple(2,5,8);

D1 = new triple(0,4,8);
D2 = new triple(2,4,6);

// Mapping of winning combinations to cells in the board
map = [[R1,C1,D1],
           [R1,C2],
           [R1,C3,D2],
           [R2,C1],
           [R2,C2,D1,D2],
           [R2,C3],
           [R3,C1,D2],
           [R3,C2],
           [R3,C3,D1]	           
           ];

function bigBoard(){
	// Grid holds the cells of the board
	this.grid = [];
	
	// Initialize the grid
	for (var i = 0; i<9; i++){
		this.grid[this.grid.length] = new smallBoard();
	}
	
	// Current player
	var startPlayer = Math.floor((Math.random() * 2));
	if(startPlayer == 0){
		this.player = mark.X;
	} else {
		this.player = mark.O;
	}
	
	// Winner of the board
	this.winner = mark.BLANK;
	
	// Number of cells marked
	this.cellsMarked = 0;
	
	this.drawBoard = function(){
		var board = "<tbody>";
		for(var i = 0; i<3; i++){
			board += "<tr>";
			for (var j = 0; j<3; j++){
				var index1 = i*3+j;
				board += "<td class='bigcell'>";
				
				board += "<table class='smallboard' id='" + index1 + "'>";
				
				
				for(var k = 0; k<3; k++){
					board += "<tr>";
					for (var l = 0; l<3; l++){
						var index2 = k*3+l;
						board += "<td class='smallcell' id='" + index1 + index2 + "'>";
//						board += "<td id='" + index1 + "' class='" + index 2 + "'>";
						board += this.grid[i*3+j].grid[k*3+l];
//						board += index1 + " " + index2;
						board += "</td>";
					}
					board += "</tr>";
				}
				
				board += "</table>";

				board += "</td>";
			}
			board += "</tr>";
		}
		board += "</tbody>";
		$("#bigboard").html(board);
		
		var curr = "<p> The current player is : " + this.player + "</p>";
		$("#player").html(curr);
	};
	
	this.drawBoard();
	
	var thing = this;
	var startCell = Math.floor((Math.random() * 9));
	alert("Starting cell is " + startCell + ".");
	$("#"+startCell).find("td").on("click", function(){
			var id = $(this).attr("id");
			thing.select(id);
		}
	);

	this.checkThreeInARow = function (triple, mrk){
		if(this.grid[triple.x].winner == mrk && this.grid[triple.y].winner == mrk && this.grid[triple.z].winner == mrk){
			return true;
		}
		else {
			return false;
		}
	};
	
	this.checkForWin = function (i, mrk){
		for (var j = 0; j<map[i].length; j++){
			if (this.checkThreeInARow(map[i][j],mrk)){
				this.winner = this.player;
				this.cellsMarked++;
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
		var quotient = Math.floor(index/10);
		var reminder = index%10;
		
		if(this.grid[quotient].select(index, this.player)){
			this.checkForWin(quotient, this.player);
			this.nextTurn();
			
			$("#"+quotient).find("td").off();
			
			// CHANGED check for winner
			if(this.winner != mark.BLANK){
				alert(this.winner + " WON the game! :D");
				return;
			}
			
			// CHANGED tie on big board
			if(this.cellsMarked == 9){
				alert("TIE on the game " + quotient + "! :(");
				return;
			}
			
			var newreminder = reminder;
			while(this.grid[newreminder].winner != mark.BLANK || this.grid[newreminder].cellsMarked == 9){ // CHANGED added "|| this.grid[newreminder].cellsMarked == 9"
				newreminder = (newreminder+1)%9; // CHANGED 10 by 9
			}
			
			if(newreminder != reminder){	
				alert("Sorry, but board " + reminder + " was already won. You can play now board " + newreminder + ".");
			}
			
			$("#"+newreminder).find("td").on("click", function(){ // CHANGED reminder by newreminder
				var id = $(this).attr("id");
				thing.select(id);
			});
		}
	};
};

function smallBoard(){
	// Grid holds the cells of the board
	this.grid = [];
	
	// Initialize the grid
	for (var i = 0; i<9; i++){
		this.grid[this.grid.length] = mark.BLANK;
	}
	
	// Winner of the board
	this.winner = mark.BLANK;
	
	// Number of cells marked
	this.cellsMarked = 0;			// CHANGED it this wasn't before, so I put it back
	
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
		for (var j = 0; j<map[i].length; j++){
			if (this.checkThreeInARow(map[i][j],mrk)){
				this.winner = mrk;
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
	
	this.select = function (index, player){
		var quotient = Math.floor(index/10);
		var reminder = index%10;
		
		if(this.grid[reminder] == mark.BLANK){
			this.grid[reminder] = player;
			this.cellsMarked++;
			
			this.checkForWin(reminder, player);
		
			$("#" + index).html(player);
			this.nextTurn();
			
			if(this.winner != mark.BLANK){
				$("#"+quotient).html("<tr><td class='woncell'>" + this.winner + "</td></tr>");
				alert(this.winner + " WON board " + quotient + "! :D");
			} else if(this.cellsMarked == 9){// CHANGED tie on small board
				$("#"+quotient).html("<tr><td class='woncell'>" + this.winner + "</td></tr>");
				alert("TIE on board " + quotient + "! :(");
			}
			return true;
		}
		else{
			alert("The selected cell is already marked. Please, choose a non-marked cell.");
			return false;
		}
	};
};


$(document).ready(function(){
	var board = new bigBoard();
});