/**
 * Core delle mosse legali
 * 
 * @module core/moves
 */

import { SIZE, TYPE, opposite } from "./board";

const MOVE_GENERATORS = {
    knight: knightMoves,
    rook:   rookMoves,
    bishop: bishopMoves,
    queen:  queenMoves,
    king:   kingMoves,
    pawn:   pawnMoves,
}

const KNIGHT_OFFSETS = [
  [-2, -1], [-2,  1],
  [-1, -2], [-1,  2],
  [ 1, -2], [ 1,  2],
  [ 2, -1], [ 2,  1],
];

const ROOK_DIRECTIONS = [
  [-1,  0],  
  [ 1,  0],   
  [ 0, -1],   
  [ 0,  1],   
];

const BISHOP_DIRECTIONS = [
  [-1, -1], [-1,  1],
  [ 1, -1], [ 1,  1],
];

const KING_OFFSETS = [
  [-1, -1], [-1,  0], [-1,  1],
  [ 0, -1],           [ 0,  1],
  [ 1, -1], [ 1,  0], [ 1,  1],
];

export function pseudoLegalMoves(board, pos, history) {
  const piece = board[pos.r][pos.c];
  if (!piece) return [];
  const gen = MOVE_GENERATORS[piece.type];
  return gen ? gen(board, pos, history) : [];          // gen ? gen(..) : [], per non far crashare (pawn non implementato al momento)
}

function applyMove(board, from, to){
  const newBoard = board.map(row => [...row]);
  newBoard[to.r][to.c] = newBoard[from.r][from.c];
  newBoard[from.r][from.c] = null;
  return newBoard;
}

export function legalMoves(board, pos, history){
  const piece = board[pos.r][pos.c];
  if (!piece) return [];
  return pseudoLegalMoves(board, pos, history).filter(move => {
    const newBoard = applyMove(board, pos, move);
    return !isInCheck(newBoard, piece.color);
  });
}

export function hasAnyLegalMoves(board, color){
  for (let r = 0; r < SIZE; r++){
    for (let c = 0; c < SIZE; c++){
      const piece = board[r][c];
      if (!piece || piece.color !== color) continue;
      if (legalMoves(board, { r,c }).length > 0) return true;
    }
  }
  return false;
}

function jumpMoves(board, pos, offsets) {
  const { r, c } = pos;
  const piece = board[r][c];
  return offsets
    .map(([dr, dc]) => ({ r: r + dr, c: c + dc }))
    .filter((d) => d.r >= 0 && d.r < SIZE && d.c >= 0 && d.c < SIZE)
    .filter((d) => {
      const target = board[d.r][d.c];
      return !target || target.color !== piece.color;
    });
}

// ray casting/ sliding
function slideInDirection(board, pos, dr, dc){
    const moves = [];
    const piece = board[pos.r][pos.c];
    let r = pos.r + dr;
    let c = pos.c + dc;

    while (r >= 0 && r < SIZE && c >= 0 && c < SIZE){
        const target = board[r][c];
        if (!target){
            moves.push({ r,c });
        } else {
            if (target.color !== piece.color) moves.push({ r,c });
            break;
        }
        r += dr;
        c += dc;
    }
    return moves;
}

function inBoard(r, c){
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function isEmpty(board, r, c){
  return inBoard(r,c) && board[r][c] === null;
}

function isEnemy(board, r, c, myColor){
  return inBoard(r, c) && board[r][c] !== null && board[r][c].color !== myColor;
}

function findKing(board, color){
  for (let r = 0; r < SIZE; r++){
    for (let c = 0; c < SIZE; c++){
      const piece = board[r][c];
      if (piece && piece.type === TYPE.KING && piece.color === color) return { r,c };
    }
  }
}

export function knightMoves(board, pos) {
  return jumpMoves(board, pos, KNIGHT_OFFSETS);
}

export function rookMoves(board, pos){        // flatmap = map + "un livello" (da un array di array fa un unico array)
    return ROOK_DIRECTIONS.flatMap(([dr,dc]) => 
    slideInDirection(board, pos, dr, dc)
    );
}

export function bishopMoves(board, pos) {
  return BISHOP_DIRECTIONS.flatMap(([dr, dc]) =>
    slideInDirection(board, pos, dr, dc)
  );
}

export function queenMoves(board, pos) {
  return [...rookMoves(board, pos), ...bishopMoves(board, pos)];
}

export function kingMoves(board, pos, history) {
  const moves = jumpMoves(board, pos, KING_OFFSETS);
  if (!history) return moves;
  const piece = board[pos.r][pos.c];
  const enemy = opposite(piece.color);

  // arrocco: solo quando il re è sulla casa iniziale e non si è mai mosso 
  const startRow = piece.color === "white" ? 7 : 0;
  if (pos.r !== startRow || pos.c !== 4) return moves;
  if (hasEverMoved(history, pos)) return moves;
  if (isSquareAttacked(board, pos, enemy)) return moves;

  // ARROCCO COTRO 
  const shortRook = board[startRow][7];
  if (shortRook
    && shortRook.type === "rook"
    && shortRook.color === piece.color
    && !hasEverMoved(history, { r:startRow, c:7 })
    && board[startRow][5] === null
    && board[startRow][6] === null
    && !isSquareAttacked(board, { r: startRow, c: 5 }, enemy)
    && !isSquareAttacked(board, { r: startRow, c: 6 }, enemy)){

      moves.push({ r:startRow, c: 6, castle: "short" });

    }
  // ARROCCO LUNGO (queenside)
  const longRook = board[startRow][0];
  if (longRook
    && longRook.type === "rook"
    && longRook.color === piece.color
    && !hasEverMoved(history, { r:startRow, c:0 })
    && board[startRow][1] === null
    && board[startRow][2] === null
    && board[startRow][3] === null
    && !isSquareAttacked(board, { r: startRow, c: 3 }, enemy)
    && !isSquareAttacked(board, { r: startRow, c: 2 }, enemy)
  ){

      moves.push({ r:startRow, c: 2, castle: "long" });

    }
    return moves;
}

export function pawnMoves(board, pos, history){
  const { r,c } = pos;
  const piece = board[r][c];
  const dir = piece.color === "white" ? -1 : +1;
  const startRow = piece.color === "white" ? 6 : 1;
  const moves = [];
 

  if (isEmpty(board, r + dir, c)) 
    moves.push({r: r + dir, c});
  if (r === startRow && isEmpty(board, r + dir, c) && isEmpty(board, r + dir*2, c))
    moves.push({ r: r + dir*2, c });
  if (isEnemy(board, r + dir, c - 1, piece.color)) 
    moves.push({ r: r + dir, c: c - 1 });
  if (isEnemy(board, r + dir, c + 1, piece.color))
    moves.push({ r: r + dir, c: c + 1 });

  // En passant
  if (history){
  const lastMove = history[history.length - 1];
    if (lastMove 
      && lastMove.piece.type === "pawn" 
      && Math.abs(lastMove.from.r - lastMove.to.r) === 2 
      && lastMove.to.r === r
      && Math.abs(lastMove.to.c - c) === 1){
        moves.push({
          r: r + dir,
          c: lastMove.to.c,
          enPassant: true,
        })
      }
    }
  return moves;
}

export function isSquareAttacked(board, pos, byColor){
  for (let r = 0; r < SIZE; r++){
    for (let c = 0; c < SIZE; c++){
      const piece = board[r][c];
      if (!piece || piece.color !== byColor) continue;
      const moves = pseudoLegalMoves(board, { r,c });
      if (moves.some(m => m.r === pos.r && m.c === pos.c)) return true;
    }
  }
  return false;
}

export function isInCheck(board, color){
  const kingPos = findKing(board, color);
  return isSquareAttacked(board, kingPos, color === "white" ? "black" : "white");
}

function hasEverMoved(history, pos){
  return history.some(m => m.from.r === pos.r && m.from.c === pos.c);
}

/**
 * Esegue una mossa sulla board (la muta) e ritorna il record
 * da inserire nello storico.
 *
 * Gestisce: cattura normale, en passant (rimozione del pedone
 * nemico dalla casella laterale), promozione automatica a regina.
 *
 * @param {Array<Array>} board
 * @param {{r:number, c:number}} from
 * @param {{r:number, c:number}} to
 * @param {{r:number, c:number, enPassant?:boolean}} chosenMove
 */
export function makeMove(board, from, to, chosenMove) {
  const movingPiece = board[from.r][from.c];
  const originalType = movingPiece.type;
  const castle = chosenMove?.castle;

  const isEnPassant = chosenMove?.enPassant === true;
  let capturedPiece;
  if (isEnPassant) {
    capturedPiece = board[from.r][to.c];
    board[from.r][to.c] = null;
  } else {
    capturedPiece = board[to.r][to.c];
  }

  board[to.r][to.c] = movingPiece;
  board[from.r][from.c] = null;

  // arrocco
  if (castle === "short"){
    board[to.r][5] = board[to.r][7];
    board[to.r][7] = null;
  } else if (castle === "long"){
    board[to.r][3] = board[to.r][0];
    board[to.r][0] = null;
  }

  // promozione
  let promotion = null;
  const lastRow = movingPiece.color === "white" ? 0 : 7;
  if (originalType === "pawn" && to.r === lastRow) {
    movingPiece.type = "queen";
    promotion = "queen";
  }

  return {
    from,
    to,
    piece: { type: originalType, color: movingPiece.color },
    captured: capturedPiece ? { ...capturedPiece } : null,
    promotion,
    enPassant: isEnPassant,
    castle: castle ?? null,
  };
}

/**
 * Ritorna lo stato di fine partita per il giocatore di `color`:
 * - null se può muovere
 * - { result: "checkmate", winner } se è sotto scacco senza mosse
 * - { result: "stalemate" } se non è sotto scacco ma non può muovere
 */
export function computeGameOver(board, color) {
  if (hasAnyLegalMoves(board, color)) return null;
  return isInCheck(board, color)
    ? { result: "checkmate", winner: opposite(color) }
    : { result: "stalemate" };
}