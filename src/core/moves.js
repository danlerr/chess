/**
 * Core delle mosse legali
 * 
 * @module core/moves
 */

import { SIZE,TYPE } from "./board";

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

export function pseudoLegalMoves(board, pos) {
  const piece = board[pos.r][pos.c];
  if (!piece) return [];
  const gen = MOVE_GENERATORS[piece.type];
  return gen ? gen(board, pos) : [];          // gen ? gen(..) : [], per non far crashare (pawn non implementato al momento)
}

function applyMove(board, from, to){
  const newBoard = board.map(row => [...row]);
  newBoard[to.r][to.c] = newBoard[from.r][from.c];
  newBoard[from.r][from.c] = null;
  return newBoard;
}

export function legalMoves(board, pos){
  const piece = board[pos.r][pos.c];
  if (!piece) return [];
  return pseudoLegalMoves(board, pos).filter(move => {
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

export function kingMoves(board, pos) {
  return jumpMoves(board, pos, KING_OFFSETS);
}

export function pawnMoves(board, pos){
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