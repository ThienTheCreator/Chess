class Piece{
	constructor(color, notation, id){
		this.color = color;
		this.notation = notation;
		this.id = id;
	}
}

class ChessBoard{
	constructor(board){
		this.board = board;

		// Global var to check current and previous turn
		this.currPosOld = "";
		this.currPosNew = "";
		this.prevPosOld = "";
		this.prevPosNew = "";

		// vertical and horizontal change in position
		this.rowChange = 0;
		this.colChange = 0;

		// Track piece movement
		this.currPiece = "";
		this.prevPiece = "";
		this.pieceOnMove = "";
		this.playerTurn = "w";

		// For cattling. Check if piece has not move. 
		this.BR1 = true;
		this.BR2 = true;
		this.WR1 = true;
		this.WR2 = true;
		this.BK = true;
		this.WK = true;
		
		// Default value if board is not given
		if(this.board === undefined){
			this.board = new Array(8);

			for (let i = 0; i < 8; ++i) {
  				this.board[i] = new Array(8);
				for(let j = 0; j < 8; ++j){
					this.board[i][j] = "";
				}
			}
		}
	}
}


let chessBoard;
function createBoard(){
	chessBoard = new ChessBoard();

	let board = document.getElementsByClassName("board")[0];

	for(let i = 8; i >= 1; --i){
		let row = document.createElement("div");
		row.className = "boardRow";
		row.id = "row" + i;
		
		for(let j = 1; j <= 8; ++j){
			let square = document.createElement("div");

			square.className = (i + j) % 2 == 0 ? "black" : "white";
			square.id = String.fromCharCode('a'.charCodeAt(0) + j - 1) + i;
			square.ondrop = drop;
			square.ondragover = allowDrop;
			row.appendChild(square);
		}

		board.appendChild(row);
	}
}

let notationTable = new Object();
function loadPieces(){
	let backRow = ["R", "N", "B", "Q", "K", "B", "N", "R"];
	for(let i = 0; i < 8; ++i){
		chessBoard.board[0][i] = new Piece("w", backRow[i], i + 1);
		chessBoard.board[1][i] = new Piece("w", "P", i + 9);
		chessBoard.board[6][i] = new Piece("b", "P", i + 17);
		chessBoard.board[7][i] = new Piece("b", backRow[i], i + 25);
	}	
}

function notationToIndex(notation){
	col = notation[0].charCodeAt(0) - 'a'.charCodeAt(0);
	row = notation[1].charCodeAt(0) - '1'.charCodeAt(0);

	return [row, col];
}

function indexToNotation(row, col){
	let notation =  String.fromCharCode('a'.charCodeAt(0) + col);
	notation += String.fromCharCode('1'.charCodeAt(0) + row);

	return notation;
}

function updateDisplayBoard(){
	let square;
	for(let row = 0; row < 8; ++row){
		for(let col = 0; col < 8; ++col){
			square = chessBoard.board[row][col];

			if(square === undefined)
				continue;

			let piece = square.color;
			piece += square.notation;
			let location = indexToNotation(row, col);
			let id = square.id;

			setPiece(piece, location, id);
		}
	}
}

// set pieces by passing piece and location 
function setPiece( piece, location,id){
	var imagePiece = document.createElement("img");
	switch(piece){
		case "bB":
			imagePiece.src = "img/chesspieces/wikipedia/bB.png";
			break;
		case "bK":
			imagePiece.src = "img/chesspieces/wikipedia/bK.png";
			break;
		case "bN":
			imagePiece.src = "img/chesspieces/wikipedia/bN.png";
			break;
		case "bP":
			imagePiece.src = "img/chesspieces/wikipedia/bP.png";
			break;
		case "bQ":
			imagePiece.src = "img/chesspieces/wikipedia/bQ.png";
			break;
		case "bR":
			imagePiece.src = "img/chesspieces/wikipedia/bR.png";
			break;
		case "wB":
			imagePiece.src = "img/chesspieces/wikipedia/wB.png";
			break;
		case "wK":
			imagePiece.src = "img/chesspieces/wikipedia/wK.png";
			break;
		case "wN":
			imagePiece.src = "img/chesspieces/wikipedia/wN.png";
			break;
		case "wP":
			imagePiece.src = "img/chesspieces/wikipedia/wP.png";
			break;
		case "wQ":
			imagePiece.src = "img/chesspieces/wikipedia/wQ.png";
			break;
		case "wR":
			imagePiece.src = "img/chesspieces/wikipedia/wR.png";
			break;
	}
	imagePiece.setAttribute("height","100");
	imagePiece.setAttribute("width","100");
	imagePiece.setAttribute("name",piece);
	imagePiece.setAttribute("id",id);
	imagePiece.setAttribute("ondragstart","drag(event)");

	let square = document.getElementById(location);
	if(square.innerHTML !== ""){
		document.getElementById(location).innerHTML = "";
	} 
	document.getElementById(location).appendChild(imagePiece);
}

// load chess board to standard position
function loadBoard(){
	createBoard();
	loadPieces();
	updateDisplayBoard();
}

function movePiece(oldRow, oldCol, newRow, newCol){
	chessBoard.board[newRow][newCol] = chessBoard.board[oldRow][oldCol];
	chessBoard.board[oldRow][oldCol] = "";
}

// Global var to check current and previous turn
let currPosOld;
let currPosNew;
let prevPosOld;
let prevPosNew;

// vertical and horizontal change in position
let rowChange;
let colChange;

let currPiece;
let prevPiece;
let pieceOnMove;
let playerTurn = "w";

let isEnPassant = false;

// For cattling
let hasNotMovedBR1 = true;
let hasNotMovedBR2 = true;
let hasNotMovedBK = true;
let hasNotMovedWR1 = true;
let hasNotMovedWR2 = true;
let hasNotMovedWK = true;
let isCastle = false;
let rookCastleMoved = [];

// function to allow drop
function allowDrop(event){
	event.preventDefault();
}

// drag pieces
function drag(event){
	currPosOld = notationToIndex(event.target.parentNode.id);
	currPiece = chessBoard.board[currPosOld[0]][currPosOld[1]];
}

// drop pieces
function drop(event){
	event.preventDefault();
	currPosNew = notationToIndex(event.currentTarget.id);
	
	if(!checkMove(event))
		return

	let tempBoard = JSON.parse(JSON.stringify(chessBoard.board));
	
	chessBoard.board[currPosNew[0]][currPosNew[1]] = chessBoard.board[currPosOld[0]][currPosOld[1]];
	chessBoard.board[currPosOld[0]][currPosOld[1]] = "";

	if(isEnPassant){
		let row = prevPosNew[0];
		let col = prevPosNew[1];
		chessBoard.board[row][col] = "";
		isEnPassant = false;
	}

	if(currPiece.notation == "P" && (currPosNew[0] == 0 || currPosNew[0] == 7)){
		chessBoard.board[currPosNew[0]][currPosNew[1]].notation = "Q";
	}

	if(isCastle){
		let oldRookRow = rookCastleMoved[0][0];
		let oldRookCol = rookCastleMoved[0][1];
		let newRookRow = rookCastleMoved[1][0];
		let newRockCol = rookCastleMoved[1][1];
		
		movePiece(oldRookRow, oldRookCol, newRookRow, newRockCol);
		
		isCastle = false;
	}

	if(isKingInCheck()){
		chessBoard.board = tempBoard;
		return;
	}

	prevPosOld = currPosOld;
	prevPosNew = currPosNew;
	prevPiece = currPiece;
	
	updateDisplayBoard();

	switch(prevPosOld){
		case "a1":
			WR1 = false;
			break;
		case "h1":
			WR2 = false;
			break;
		case "a8":
			BR1 = false;
			break;
		case "h8":
			BR2 = false;
			break;
		case "e1":
			WK = false;
			break;
		case "e8":
			BK = false;
			break;
		default:
			break;
	}

	if(playerTurn == "w"){
		playerTurn = "b";
		document.getElementById("turn").innerHTML="It's Black's Turn.";
	} else{
		playerTurn = "w";
		document.getElementById("turn").innerHTML="It's White's Turn.";
	}
}

//function to check movie
function checkMove(event){
	let legal = false;

	// check current player turn
	if(playerTurn != currPiece.color){
		return false;
	}

	// check if a piece is eaten not on the same team
	if(chessBoard.board[currPosNew[0]][currPosNew[1]] == currPiece.color){
		return false;
	}
	
	rowChange = currPosNew[0] - currPosOld[0];
	colChange = currPosNew[1] - currPosOld[1];
	
	switch(currPiece.notation){
		case "B":
			legal = checkBishop();
			break;
		case "K":
			legal = checkKing();
			break;
		case "N":
			legal = checkKnight();
			break;
		case "P":
			legal = checkPawn();
			break;
		case "Q":
			legal = checkQueen();
			break;
		case "R":
			legal = checkRook();
			break;
	}

	return legal;
}


// check Rook for legal move
function checkRook(){
	
	// check if rook moved horizontal or vertical 
	if(rowChange != 0 && colChange != 0){
		return false;
	}

	let pos = currPosOld;
	
	let addPosZero = 0;
	let addPosOne = 0;
	if(rowChange > 0){
		addPosZero = 1;
	}else if(rowChange < 0){
		addPosZero = -1;
	}

	if(colChange > 0){
		addPosOne = 1;
	}else if(colChange < 0){
		addPosOne = -1;
	}
	
	let squaresMoved = Math.abs(rowChange) + Math.abs(colChange);		

	// check if no pieces are in the way
	for(let i = 1; i < squaresMoved; ++i){
		if(chessBoard.board[pos[0] + i * addPosZero][pos[1] + i * addPosOne] != "")
			return false;
	}

	let row = currPosOld[0];
	let col = currPosOld[1];
	let fromSquare = chessBoard.board[row][col];
	row = currPosNew[0];
	col = currPosNew[1];
	let toSquare = chessBoard.board[row][col]; 
	if(toSquare == "" || fromSquare.color != toSquare.color){
		return true;
	}

	return false;
}

// check Knight for legal move
function checkKnight(){
	let rowAbsChange = Math.abs(rowChange);
	let colAbsChange = Math.abs(colChange);
	
	// check to see if knight move in an L
	if((rowAbsChange == 1 && colAbsChange == 2) || (rowAbsChange == 2 && colAbsChange == 1)){
		let row = currPosOld[0];
		let col = currPosOld[1];
		let fromSquare = chessBoard.board[row][col];

		row = currPosNew[0];
		col = currPosNew[1];
		let toSquare = chessBoard.board[row][col];
		if(toSquare == "" || fromSquare.color != toSquare.color)	
			return true;
	}
	
	return false;
}

// check Black Bishop for legal move
function checkBishop(){
	let rowAbsChange = Math.abs(rowChange);
	let colAbsChange = Math.abs(colChange);

	// check diagonal move
	if(rowAbsChange == colAbsChange && rowAbsChange != 0){

		let pos = currPosOld;
		
		let addPosZero = 0;
		let addPosOne = 0;
		if(rowChange>0){
			addPosZero = 1;
		}else{
			addPosZero = -1;
		}
	
		if(colChange > 0){
			addPosOne = 1;
		}else{
			addPosOne = -1;
		}
		
		// check diagonal if a piece is in the way
		let row = pos[0];
		let col = pos[1];
		// check diagonal if a piece is in the way
		for(let i = 1; i < rowAbsChange;i++){
			if(chessBoard.board[row + i * addPosZero][col + i * addPosOne] != ""){
				return false;
			}
		}
	
		let fromSquare = chessBoard.board[row][col];
		
		row = currPosNew[0];
		col = currPosNew[1];
		let toSquare = chessBoard.board[row][col];
		if(toSquare == "" || fromSquare.color != toSquare.color)	
			return true;
	}

	return false;
}

// check Queen for legal move
function checkQueen(){
	return checkBishop() || checkRook();
}

// check Black Pawn for legal move
function checkPawn(){
	let rowDirection = currPiece.color == "w" ? 1 : -1; 

	let row;
	let col;
	//pawn can move up if no piece is there
	if(rowChange == rowDirection && colChange == 0){
		row = currPosNew[0];
		col = currPosNew[1];
		if(chessBoard.board[row][col] != ""){
			return false;
		}
		return true;
	}

	// check to see double move on the first jump only
	let pawnRow = currPiece.color == "w" ? 1 : 6;
	if(rowChange == rowDirection * 2 && colChange == 0 && currPosOld[0] == pawnRow){
		col = currPosOld[1];
		for(let i = 1; i <= 2; ++i){
			if(chessBoard.board[pawnRow + i*rowDirection][col] != ""){
				return false;
			}
		}
		return true;
	}

	//check to see if piece can eat one diagonal
	if(rowChange == rowDirection && (colChange == -1 || colChange == 1)){
		row = currPosNew[0];
		col = currPosNew[1];
		let tempPiece = chessBoard.board[row][col];

		if(tempPiece != "" && tempPiece.color != currPiece.color)
			return true;

		// check En Passant
		if(tempPiece != "" || prevPiece.notation != "P")
			return false;
		
		tempPiece = prevPiece; 

		pawnRow = tempPiece.color == "w" ? 1 : 6;
		let rowAbsChange = Math.abs(prevPosOld[0] - prevPosNew[0]);
		if( prevPiece.color != currPiece.color && prevPosNew[0] + rowDirection == row && 
			prevPosNew[1] == col && rowAbsChange == 2 && rowChange == rowDirection){
		
			isEnPassant = true;
			return true;
		}
	}
	
	return false;
}

// check King for legal move
function checkKing(){
	let rowAbsChange = Math.abs(rowChange);
	let colAbsChange = Math.abs(colChange);

	let row;
	let col;
	if(rowAbsChange <= 1 && colAbsChange <= 1){
		row = currPosNew[0];
		col = currPosNew[1];

		let tempPiece = chessBoard.board[row][col];
		if(tempPiece == "" || tempPiece.color != currPiece.color){
			return true;
		}
	}

	if(rowAbsChange == 0 && colAbsChange == 2){
		let colChangeDirection = colChange < 0 ? -1 : 1;
		let kingHasNotMoved;
		let rookHasNotMoved;
		if(playerTurn == "w"){
			kingHasNotMoved = hasNotMovedWK;
			rookHasNotMoved = colChange == -2 ? hasNotMovedWR1 : hasNotMovedWR2;
		} else {
			kingHasNotMoved = hasNotMovedBK;
			rookHasNotMoved = colChange == -2 ? hasNotMovedBR1 : hasNotMovedBR2;
		}


		row = currPosOld[0];
		col = currPosOld[1];
		if(kingHasNotMoved && rookHasNotMoved){
			for(let i = 1; i <= 2; ++i){
				if(chessBoard.board[row][col + i * colChangeDirection] != ""){
					return false;
				}
			}

			isCastle = true;
			let rookCol = colChangeDirection == -1 ? 0 : 7;
			rookCastleMoved = [[row, rookCol], [row, col + colChangeDirection]];

			return isCastle;
		}
	}

	return false;	
}

function isKingInCheck(){
	let notTurnPlayer = playerTurn != "w" ? "w" : "b";
	let kingPos;

	for(let row = 0; row < 8; ++row){
		for(let col = 0; col < 8; ++col){
			if( chessBoard.board[row][col] != "" && 
				chessBoard.board[row][col].color == playerTurn && 
				chessBoard.board[row][col].notation == "K"){
				
				kingPos = [row, col];
			}	
		}
	}

	const checkLine = (kingPos, rowChange, colChange, notation) => {
		let tempRow = kingPos[0] + rowChange;
		let tempCol = kingPos[1] + colChange;
		while(0 <= tempRow && tempRow <= 7 && 0 <= tempCol && tempCol <= 7){
			if(chessBoard.board[tempRow][tempCol] != ""){
				let tempPiece = chessBoard.board[tempRow][tempCol];

				for(let i = 0; i < notation.length; ++i){
					if(tempPiece.notation == notation[i] && tempPiece.color == notTurnPlayer)
						return true;
				}
				return false;
			}

			tempRow = tempRow + rowChange;
			tempCol = tempCol + colChange; 
		}

		return false;
	}
	
	// Check if king is check by bishop or queen
	let checkTopLeftLine  = checkLine(kingPos,  1, -1, ["B", "Q"]);
	let checkTopRightLine = checkLine(kingPos,  1,  1, ["B", "Q"]);
	let checkBotLeftLine  = checkLine(kingPos, -1, -1, ["B", "Q"]);
	let checkBotRightLine = checkLine(kingPos, -1,  1, ["B", "Q"]);

	if( checkTopLeftLine || checkTopRightLine || checkBotLeftLine || checkBotRightLine ){
		return true;
	}

	// Check if king is check by rook or queen
	let checkLeftLine  = checkLine(kingPos,  0, -1, ["R", "Q"]);
	let checkTopLine   = checkLine(kingPos,  1,  0, ["R", "Q"]);
	let checkRightLine = checkLine(kingPos,  0,  1, ["R", "Q"]);
	let checkBotLine   = checkLine(kingPos, -1,  0, ["R", "Q"]);

	if( checkLeftLine || checkRightLine || checkTopLine || checkBotLine ){
		return true;
	}

	// Check if king is check by knight
	let addValue = [1,2,-1,-2,-1,2,1,-2,1];
	for(let i = 0; i < addValue.length - 1; ++i){
		let addRow = addValue[i];
		let addCol = addValue[i + 1];

		let row = kingPos[0] + addRow;
		let col = kingPos[1] + addCol;
		if(0 <= row && row <= 7 && 0 <= col && col <= 7){
			let tempPiece = chessBoard.board[row][col];
			if(tempPiece != "" && tempPiece.notation == "N" && tempPiece.color == notTurnPlayer)
				return true;
		}
	}

	// Check if king is by king
	addValue = [-1,-1,0,-1,1,0,1,1,-1];
	for(let i = 0; i < addValue.length - 1; ++i){
		let addRow = addValue[i];
		let addCol = addValue[i + 1];

		let row = kingPos[0] + addRow;
		let col = kingPos[1] + addCol;
		if(0 <= row && row <= 7 && 0 <= col && col <= 7){
			let tempPiece = chessBoard.board[row][col];
			if(tempPiece != "" && tempPiece.notation == "K" && tempPiece.color == notTurnPlayer)
				return true;
		}
	}

	// Check if king is check by pawn
	let rowChange = playerTurn == "w" ? 1 : -1;
	let row = kingPos[0] + rowChange;
	let col = kingPos[1] - 1;
	if(0 <= row && row <= 7 && 0 <= col && col <= 7){
		let tempPiece = chessBoard.board[row][col];
		if(tempPiece != "" && tempPiece.notation == "P" && tempPiece.color == notTurnPlayer)
			return true;
	}

	col = kingPos[1] + 1;
	if(0 <= row && row <= 7 && 0 <= col && col <= 7){
		let tempPiece = chessBoard.board[row][col];
		if(tempPiece != "" && tempPiece.notation == "P" && tempPiece.color == notTurnPlayer)
			return true;
	}

	return false;
}
