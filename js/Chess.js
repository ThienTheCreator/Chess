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
		this.vChange = 0;
		this.hChange = 0;

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

// load chess board to standard position
function loadBoard(){
	createBoard();
	loadPieces();
	updateDisplayBoard();
}

let notationTable = new Object();
function loadPieces(){
	let backRow = ["R", "N", "B", "Q", "K", "B", "N", "R"];
	let uniqueId = 1;
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

function movePiece(fromPosition, toPosition){
	document.getElementById(toPosition).innerHTML = document.getElementById(fromPosition).innerHTML;
}

// Global var to check current and previous turn
var currPosOld;
var currPosNew;
var prevPosOld;
var prevPosNew;

// vertical and horizontal change in position
var vChange;
var hChange;

var currPiece;
var prevPiece;
var pieceOnMove;
var playerTurn = "w";

// For cattling
var BR1 = true;
var BR2 = true;
var WR1 = true;
var WR2 = true;
var BK = true;
var WK = true;

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

	prevPosOld = currPosOld;
	prevPosNew = currPosNew;
	prevPiece = currPiece;

	console.log(currPosOld);
	console.log(currPosNew);
	currPiece = chessBoard.board[currPosNew[0]][currPosNew[1]];
	chessBoard.board[currPosNew[0]][currPosNew[1]] = chessBoard.board[currPosOld[0]][currPosOld[1]];
	chessBoard.board[currPosOld[0]][currPosOld[1]] = "";

	updateDisplayBoard();
	console.log(chessBoard.board)

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
	
	hChange = currPosNew[0] - currPosOld[0];
	vChange = currPosNew[1] - currPosOld[1];

	console.log(hChange)
	console.log(vChange)
	
	switch(currPiece.notation){
		case "B":
			legal = checkBishop();
			break;
		case "K":
			legal = checkBKing();
			break;
		case "N":
			legal = checkKnight();
			break;
		case "P":
			legal = checkBPawn();
			break;
		case "Q":
			legal = checkQueen();
			break;
		case "R":
			legal = checkRook();
			break;
	}

	console.log(legal);
	
	return legal;
}

// check Black Bishop for legal move
function checkBishop(){
	let vAbsChange = Math.abs(vChange);
	let hAbsChange = Math.abs(hChange);


	// check diagonal move
	if(vAbsChange !== hAbsChange)
		return false;

	let pos = currPosOld;
	
	let addPosZero = 0;
	let addPosOne = 0;
	if(hChange>0){
		addPosZero = 1;
	}else{
		addPosZero = -1;
	}

	if(vChange > 0){
		addPosOne = 1;
	}else{
		addPosOne = -1;
	}
	
	// check diagonal if a piece is in the way
	let row = pos[0];
	let col = pos[1];
	// check diagonal if a piece is in the way
	console.log(pos)
	console.log(addPosZero, addPosOne)
	for(let i = 1; i < vAbsChange;i++){
		console.log(chessBoard.board[row + i * addPosZero][col + i * addPosOne])
		if(chessBoard.board[row + i * addPosZero][col + i * addPosOne] != "") 
			return false;
	}

	return true;
}



// check Knight for legal move
function checkKnight(){
	let vAbsChange = Math.abs(vChange);
	let hAbsChange = Math.abs(hChange);
	
	// check to see if knight move in an L
	if((vAbsChange == 1 && hAbsChange == 2) || (vAbsChange == 2 && hAbsChange == 1)){
		return true;
	}
	
	return false;
}


// check Queen for legal move
function checkQueen(){
	return checkBishop() || checkRook();
}

// check Rook for legal move
function checkRook(){
	
	// check if rook moved horizontal or vertical 
	if(vChange == 0 || hChange == 0){
		let pos = currPosOld;
		
		let addPosZero = 0;
		let addPosOne = 0;
		if(hChange > 0){
			addPosZero = 1;
		}else if(hChange < 0){
			addPosZero = -1;
		}

		if(vChange > 0){
			addPosOne = 1;
		}else if(vChange < 0){
			addPosOne = -1;
		}
		
		let squaresMoved = Math.abs(vChange) + Math.abs(hChange);		

		// check if no pieces are in the way
		for(var i = 0; i < squaresMoved-1;i++){
			pos = String.fromCharCode(pos.charCodeAt(0)+addPosZero) + (pos[1]-'0'+addPosOne);
			console.log(pos);
			if(document.getElementById(pos).innerHTML!="")
				return false;
		}
		return true;
	}
	return false
}


// check Black King for legal move
function checkBKing(){
	let vAbsChange = Math.abs(vChange);
	let hAbsChange = Math.abs(hChange);
	
	if(vAbsChange <= 1 && hAbsChange <= 1){
		// Check if a white pawn will check king
		try{	
			let tempPos = currPosNew;
			tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + (tempPos[1]-'0'-1);
			if(document.getElementById(tempPos).firstChild.name=="wP")
				return false;
		}catch(e){}
		
		// Check if a white pawn will check king
		try{	
			let tempPos = currPosNew;
			tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + (tempPos[1]-'0'-1);
			if(document.getElementById(tempPos).firstChild.name=="wP")
				return false;
		}catch(e){}

		// Check is a king next to a king by pass opp king
		if(isKingByKing("wK"))
			return false;

		return true;
	}

	// Castling black queen side
	if( BK && BR1 && currPosNew == "c8"){
		// Check if there are no piece preventing castling
		for(var i = 0; i < 3;i++){
			let tempPos = String.fromCharCode(98+i)+'8';
			if(document.getElementById(tempPos).innerHTML!="" || isKingCheck(tempPos,playerTurn))
				return false;
		}
		document.getElementById("d8").innerHTML = document.getElementById("a8").innerHTML;
		document.getElementById("a8").innerHTML = "";
		WK = false;
		WR1 = false;
		return true;
	}
	
	// Castling black king side
	if( BK && BR2 && currPosNew == "g8"){
		// Check if there are no piece preventing castling
		for(var i = 0; i < 2;i++){
			let tempPos = String.fromCharCode(102+i)+'8';
			if(document.getElementById(tempPos).innerHTML!="" || isKingCheck(tempPos,playerTurn))
				return false;
		}
		document.getElementById("f8").innerHTML = document.getElementById("h8").innerHTML;
		document.getElementById("h8").innerHTML = "";
		BK = false;
		BR2 = false;
		return true;
	}	
	return false;	
}

// check Black Pawn for legal move
function checkBPawn(){
	//pawn can move up if no piece is there
	if(vChange == -1 && hChange == 0){
		if(pieceOnMove=="")
			return true;
	}

	//check to see if piece can eat one diagonal
	if(vChange == -1 && (hChange == -1 || hChange == 1)){
		if(pieceOnMove !="" && pieceOnMove[0]=="w"){
			return true;
		}else{ // check En Passant
			try{
				let checkPos = prevPosOld[0] + (prevPosOld[1]-'0'+2);
				if(prevPosOld[1] == '2' && checkPos == prevPosNew && currPosNew == prevPosOld[0] + '3' && prevPiece == "wP"){
					document.getElementById(prevPosNew).innerHTML="";
					return true;
				}
			}catch(e){ // ignore if cant find
			}
		}
	}

	// check to see double move on the first jump only
	if(vChange == -2 && hChange == 0 && currPosOld[1] == 7){
		let pos = currPosOld;
		pos = pos[0] + (pos[1]-'0'-1);
		if(document.getElementById(pos).innerHTML!="")
			return false;
		pos = pos[0] + (pos[1]-'0'-1);
		if(document.getElementById(pos).innerHTML!="")
			return false;
		return true;
	}
	
	return false;
}

// check White King for legal move
function checkWKing(){
	let vAbsChange = Math.abs(vChange);
	let hAbsChange = Math.abs(hChange);
	
	if(vAbsChange <= 1 && hAbsChange <= 1){
		// Check if a black pawn will check king
		try{	
			let tempPos = currPosNew;
			tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + (tempPos[1]-'0'+1);
			if(document.getElementById(tempPos).firstChild.name=="bP")
				return false;
		}catch(e){}
		
		// Check if a black pawn will check king
		try{	
			let tempPos = currPosNew;
			tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + (tempPos[1]-'0'+1);
			if(document.getElementById(tempPos).firstChild.name=="bP")
				return false;
		}catch(e){}
		
		// Check is a king next to a king by pass opp king
		if(isKingByKing("bK"))
			return false;

		return true;
	}
	
	// Castling white queen side
	if( WK && WR1 && currPosNew == "c1"){
		//king is check return false
		if(isKingCheck(currPosOld,playerTurn))
			return false;
		
		// Check if there are no piece preventing castling
		for(var i = 0; i < 3;i++){
			let tempPos = String.fromCharCode(98+i)+'1';
			if(document.getElementById(tempPos).innerHTML!="" || isKingCheck(tempPos,playerTurn))
				return false;
		}

		document.getElementById("d1").innerHTML = document.getElementById("a1").innerHTML;
		document.getElementById("a1").innerHTML = "";
		WK = false;
		WR1 = false;
		return true;
	}
	
	// Castling white king side
	if( WK && WR2 && currPosNew == "g1"){
		//king is check return false;	
		if(isKingCheck(currPosOld,playerTurn))
			return false;

		// Check if there are no piece preventing castling
		for(var i = 0; i < 2;i++){
			let tempPos = String.fromCharCode(102+i)+'1';
			if(document.getElementById(tempPos).innerHTML="" || isKingCheck(tempPos,playerTurn))
				return false;
		}

		document.getElementById("f1").innerHTML = document.getElementById("h1").innerHTML;
		document.getElementById("h1").innerHTML = "";
		WK = false;
		WR2 = false;
		return true;
	}

	
	return false;
}


// check White Pawn for legal move
function checkWPawn(){
	//pawn can move up if no piece is there
	if(vChange == 1 && hChange == 0){
		if(pieceOnMove=="")
			return true;
	}

	//check to see if piece can eat one diagonal
	if(vChange == 1 && (hChange == -1 || hChange == 1)){
		if(pieceOnMove !="" && pieceOnMove[0]=="b"){
			return true;
		}else{ // check En Passant
			try{
				let checkPos = prevPosOld[0] + (prevPosOld[1]-'2');
				if(prevPosOld[1] == '7' && checkPos == prevPosNew && currPosNew == prevPosOld[0] + '6' && prevPiece=="bP"){
					document.getElementById(prevPosNew).innerHTML="";
					return true;
				}
			}catch(e){} // ignore if cant find
		}
	}

	// check to see double move on the first jump only
	if(vChange == 2 && hChange == 0 && currPosOld[1] == 2){
		let pos = currPosOld;
		pos = pos[0] + (pos[1]-'0'+1);
		if(document.getElementById(pos).innerHTML!="")
			return false;
		pos = pos[0] + (pos[1]-'0'+1);
		if(document.getElementById(pos).innerHTML!="")
			return false;
		return true;
	}
	
	return false;
}

function isKingCheck(kingPos, team){
	let tempPos = kingPos;
	let oppTeam;
	
	if(team == "b"){
		oppTeam = "w";
	}else{
		oppTeam = "b";
	}
	
	let pawn = oppTeam + "P";
	let bishop = oppTeam + "B";
	let rook = oppTeam + "R";
	let queen = oppTeam + "Q";
	
	// Check upper left diagonal for check
	while(0 < tempPos.charCodeAt(0)-'a'.charCodeAt(0) && (tempPos[1]-'0') < 8){
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + (tempPos[1]-'0'+1); 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != bishop){
				break;
			}else{
				return true;
			}
		}
	}
	
	tempPos = kingPos;
	// Check upper right diagonal for check
	while(0 > tempPos.charCodeAt(0)-'h'.charCodeAt(0) && (tempPos[1]-'0') < 8){
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + (tempPos[1]-'0'+1); 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != bishop){
				break;
			}else{
				return true;
			}
		}
	}

	tempPos = kingPos;
	// Check lower right diagonal for check
	while(0 > tempPos.charCodeAt(0)-'h'.charCodeAt(0) && (tempPos[1]-'0') > 1){
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + (tempPos[1]-'0'-1); 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != bishop){
				break;
			}else{
				return true;
			}
		}
	}

	tempPos = kingPos;

	// Check lower left diagonal for check
	while(0 < tempPos.charCodeAt(0)-'a'.charCodeAt(0) && (tempPos[1]-'0') > 1){
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + (tempPos[1]-'0'-1); 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != bishop){
				break;
			}else{
				return true;
			}
		}
	}

	tempPos = kingPos;

	// Check upper straight line for check
	while( (tempPos[1]-'0') < 8 ){
		tempPos = tempPos[0] + (tempPos[1]-'0'+1); 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != rook){
				break;
			}else{
				return true;
			}
		}
	}

	tempPos = kingPos;

	// Check right straight line for check
	while( 0 > tempPos.charCodeAt(0)-'h'.charCodeAt(0)){
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)+1) + tempPos[1];
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != rook){
				break;
			}else{
				return true;
			}
		}
	}
	
	tempPos = kingPos;
	
	// Check lower straight line for check
	while( (tempPos[1]-'0') > 1 ){
		tempPos = tempPos[0] + (tempPos[1]-'0'-1); 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != rook){
				break;
			}else{
				return true;
			}
		}
	}

	tempPos = kingPos;
	
	// Check left straight line for check
	while(0 < tempPos.charCodeAt(0)-'a'.charCodeAt(0)){
		tempPos = String.fromCharCode(tempPos.charCodeAt(0)-1) + tempPos[1]; 
		if(document.getElementById(tempPos).innerHTML!=""){
			let tempPiece = document.getElementById(tempPos).firstChild.name;
			if(tempPiece != queen && tempPiece != rook){
				break;
			}else{
				return true;
			}
		}
	}
	
	//Check knights for check 
	if(knightCheck(kingPos,team))
		return true;

	//Check if a pawn is checking the king
	if(isPawnDiagonal(kingPos))
		return true;

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
