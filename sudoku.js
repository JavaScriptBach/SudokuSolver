(function(){
	var grid = null;
	$(function(){
		setUpPage();
		$("#solvebtn").click(solve);
		$("#resetbtn").click(reset);
		$("input[type=text]").bind("change", function(){
			$(this).removeClass("solved");
		});
	});

	function solve(){
		$(this).attr("disabled", true);
		if (getGrid()){
			if (explore(0, 0)){
				print();
				$("#usermessage").html("Puzzle solved!");
			} else {
				$("#usermessage").html("There is no solution to this puzzle. Trust me. Go blame whoever gave you this puzzle to solve!");
			}
		} else {
			$("#usermessage").html("You did not enter a valid grid puzzle.");
		}
		$(this).attr("disabled", false);
	};
		
	function reset(){
		$("input[type=text]").val("").removeClass("solved");
		$("#usermessage").html("");
	};
	
	function setUpPage(){
		grid = new Array(9);
		for (var i = 0; i < 9; i++) {
			grid[i] = new Array(9);
		}
		var table = $("<table>");
		for (var i = 0; i < 3; i++){
			var row = $("<tr>");
			for (var j = 0; j < 3; j++){
				var col = $("<td>");
				for (var k = 0; k < 3; k++){
					//add 3 textboxes followed by a <br>
					for (var l = 0; l < 3; l++){
						var textbox = $("<input>").attr({
							"type" : "text",
							"size" : "1",
							"maxlength" : "1",
							"id" : "" + (3*i + k) + (3*j + l)
						});
						col.append(textbox);
					}
					col.append($("<br>"));
				}
				row.append(col);
			}
			table.append(row);
		}
		$("#puzzlearea").append(table);
	};
	
	//reads grid from DOM and stores it into an array
	//returns true if and only if the user entered valid input.
	function getGrid(){
		for (var i = 0; i < 9; i++){
			for (var j = 0; j < 9; j++){
				grid[i][j] = 0;
			}
		}
		var textboxes = $("input[type=text]");
		for (var i = 0; i < textboxes.length; i++){
			var row = parseInt(textboxes[i].id.charAt(0));
			var col = parseInt(textboxes[i].id.charAt(1));
			if (textboxes[i].value != ""){
				var next = parseInt(textboxes[i].value);
				if (isNaN(next) || next < 1 || next > 9)
					return false;
				if (next != 0 && !safe(next, row, col))
					return false;
				grid[row][col] = next;
			}
		}
		return true;
	}
	
	//explores the row and column
	//returns true if and only if there is a valid path
	//starting from that row and column
	function explore(row, col){
		if (row == 9)
			return true;
		if (col == 9)
			return explore(row+1, 0);
		if (grid[row][col] == 0){
			for (var i = 1; i <= 9; i++){
				if (safe(i, row, col)){
					place(i, row, col);
					if (explore(row, col+1))
						return true;
					remove(row, col);
				}
			}
			return false;
		}
		return explore(row, col+1);
	}
	
	//pre: grid is in a valid state
	//post: returns true if and only if it is safe to place num at (row, col)
	function safe(num, row, col){
		for (var i = 0 ; i < 9; i++){
			if (grid[row][i] == num)
				return false;
			if (grid[i][col] == num)
				return false;
		}
		if (row >= 0 && row <= 2){
			if (col >= 0 && col <= 2){
				for (var i = 0 ; i <= 2; i++){
					for (var j = 0; j <= 2; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			
			if (col >= 3 && col <= 5){
				for (var i = 0 ; i <= 2; i++){
					for (var j = 3; j <= 5; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			
			if (col >= 6 && col <= 8){
				for (var i = 0 ; i <= 2; i++){
					for (var j = 6; j <= 8; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			
		}
		
		if (row >= 3 && row <= 5){
			if (col >= 0 && col <= 2){
				for (var i = 3 ; i <= 5; i++){
					for (var j = 0; j <= 2; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			if (col >= 3 && col <= 5){
				for (var i = 3 ; i <= 5; i++){
					for (var j = 3; j <= 5; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			if (col >= 6 && col <= 8){
				for (var i = 3 ; i <= 5; i++){
					for (var j = 6; j <= 8; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
		}
		
		if (row >= 6 && row <= 8){
			if (col >= 0 && col <= 2){
				for (var i = 6; i <= 8; i++){
					for (var j = 0; j <= 2; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			if (col >= 3 && col <= 5){
				for (var i = 6; i <= 8; i++){
					for (var j = 3; j <= 5; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
			if (col >= 6 && col <= 8){
				for (var i = 6; i <= 8; i++){
					for (var j = 6; j <= 8; j++){
						if (grid[i][j] == num)
							return false;
					}
				}
			}
		}
		return true;
	}
	
	//pre: safe to place num at (row, col)
	//post: num is placed at (row, col)
	function place(num, row, col){
		grid[row][col] = num;
	}
	
	//removes the number at (row, col)
	function remove(row, col){
		grid[row][col] = 0;
	}
	
	//pre: puzzle is solved
	//post: prints the puzzle back to the DOM
	function print(){
		for (var i = 0; i < 9; i++){
			for (var j = 0; j < 9; j++){
				var box = $("#" + i + j);
				if (box.val() == "")
					$("#" + i + j).val(grid[i][j]).addClass("solved");
			}
		}
	}
})();