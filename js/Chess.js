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

// TODO: Later 
function movePiece(fromPosition, toPosition){
	document.getElementById(toPosition).innerHTML = document.getElementById(fromPosition).innerHTML;
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

// For cattling
let BR1 = true;
let BR2 = true;
let WR1 = true;
let WR2 = true;
let BK = true;
let WK = true;

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
		if(toSquare == "" || fromSquare.color == toSquare.color)	
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

	let pos;
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
		if(prevPiece.color != currPiece.color && prevPosNew[0] + rowDirection == pos[1] && prevPosNew[1] == pos[1] && rowAbsChange == 2 && rowChange == rowDirection){
			return true;
		}
	}
	
	return false;
}

// check Black King for legal move
function checkKing(){
	let rowAbsChange = Math.abs(rowChange);
	let colAbsChange = Math.abs(colChange);

	if(rowAbsChange <= 1 && colAbsChange <= 1){
		let row = currPosNew[0];
		let col = currPosNew[1];

		let tempPiece = chessBoard.board[row][col];
		if(tempPiece == "" || tempPiece.color != currPiece.color){
			return true;
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
		while(0 <= tempRow && tempRow < 8 && 0 <= tempCol && tempCol < 8){
			if(chessBoard.board[tempRow][tempCol] != ""){
				let pieceNotation = chessBoard.board[tempRow][tempCol].notation;

				for(let i = 0; i < notation.length; ++i){
					if(pieceNotation == notation[i])
						return true;
				}
				return false;
			}

			tempRow = tempRow + rowChange;
			tempCol = tempCol + colChange; 
		}

		return false;
	}
	
	let checkUpperLeftDiagonal  = checkLine(kingPos, 1, -1, ["B", "Q"]);
	let checkUpperRightDiagonal = checkLine(kingPos, 1, 1, ["B", "Q"]);
	let checkLowerLeftDiagonal  = checkLine(kingPos, -1, -1, ["B", "Q"]);
	let checkLowerRightDiagonal = checkLine(kingPos, -1, 1, ["B", "Q"]);

	if(checkUpperLeftDiagonal || checkUpperRightDiagonal || checkLowerLeftDiagonal || checkLowerRightDiagonal){
		return true;
	}

	return false;
}

function knightCheck(kingPos,team){
	let knight;
	if(team == "w")
		knight = "b" + "N";
	else{
		knight = "w" + "N"; 
	} 
	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + (tempPos[1]-'0'+2);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}
	
	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + (tempPos[1]-'0'+2);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}
	
	
	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-2) + (tempPos[1]-'0'+1);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}

	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+2) + (tempPos[1]-'0'+1);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}

	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + (tempPos[1]-'0'-2);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}
	
	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + (tempPos[1]-'0'-2);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}
	
	
	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-2) + (tempPos[1]-'0'-1);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}

	tempPos = kingPos;	
	try{
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+2) + (tempPos[1]-'0'-1);
		if(document.getElementById(tempPos).firstChild.name == knight)
			return true;
	}catch(e){}

	return false;
}

function isKingByKing(oppKing){
	// Check if an opponent king will be next to the king for the top and bottom 3 squares
		let tempPos1 = String.fromCharCode(currPosNew.charCodeAt(0)-2) + (currPosNew[1]-'0'+1);
		let tempPos2 = String.fromCharCode(currPosNew.charCodeAt(0)-2) + (currPosNew[1]-'0'-1);
		for(var i = 0; i < 3;i++){
			try{
				tempPos1 = String.fromCharCode(tempPos1.charCodeAt(0)+1) + (tempPos1[1]);
				console.log(tempPos1);
				if(document.getElementById(tempPos1).firstChild.name==oppKing)
					return true;
			}
			catch(e){}
			try{
				tempPos2 = String.fromCharCode(tempPos2.charCodeAt(0)+1) + (tempPos2[1]);
				console.log(tempPos2);
				if(document.getElementById(tempPos2).firstChild.name==oppKing)
					return true;
			}
			catch(e){}
		}
		
		//Check the left side for an opponent king	
		try{
			let tempPos = String.fromCharCode(currPosNew.charCodeAt(0)-1) + currPosNew[1];
			if(document.getElementById(tempPos).firstChild.name == oppKing)
				return true;
		}catch(e){}

		//Check the right side for an opponent king
		try{
			let tempPos = String.fromCharCode(currPosNew.charCodeAt(0)+1) + currPosNew[1];
			if(document.getElementById(tempPos).firstChild.name == oppKing)
				return true;
		}catch(e){}	
	return false;
}

function isPawnDiagonal(kingPos){
	let oppPawn;
	let tempPos1;
	let tempPos2;
	
	//Choose the position depending on whose turn it is
	if(playerTurn == "w"){
		oppPawn = "bP";
		tempPos1 = String.fromCharCode(kingPos.charCodeAt(0)-1) + (kingPos[1]-'0'+1);
		tempPos2 = String.fromCharCode(kingPos.charCodeAt(0)+1) + (kingPos[1]-'0'+1);
	}else{
		oppPawn = "wP";
		tempPos1 = String.fromCharCode(kingPos.charCodeAt(0)-1) + (kingPos[1]-'0'-1);
		tempPos2 = String.fromCharCode(kingPos.charCodeAt(0)+1) + (kingPos[1]-'0'-1);
	}
	
	// check left diagonal
	try{
		if(document.getElementById(tempPos1).firstChild.name==oppPawn)
			return true;
	}catch(e){}

	// check left diagonal
	try{
		if(document.getElementById(tempPos2).firstChild.name==oppPawn)
			return true;
	}catch(e){}

	return false;
}
