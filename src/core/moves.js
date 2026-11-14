/**
 * Core delle mosse legali
 * 
 * @module core/moves
 */

import { SIZE, TYPE, opposite } from "./board";
import { createPiece } from "./piece";

export function pseudoLegalMoves(board, pos, history){
  const piece = board[pos.r][pos.c];
  if (!piece) return [];
  return piece.pseudoLegalMoves(board, pos, history);   // polimorfismo: chiama il metodo della sottoclasse giusta
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

function findKing(board, color){
  for (let r = 0; r < SIZE; r++){
    for (let c = 0; c < SIZE; c++){
      const piece = board[r][c];
      if (piece && piece.type === TYPE.KING && piece.color === color) return { r,c };
    }
  }
}

export function isSquareAttacked(board, pos, byColor){
  for (let r = 0; r < SIZE; r++){
    for (let c = 0; c < SIZE; c++){
      const piece = board[r][c];
      if (!piece || piece.color !== byColor) continue;
      const moves = pseudoLegalMoves(board, { r,c });   // no history: niente arrocco/en passant in attack-check
      if (moves.some(m => m.r === pos.r && m.c === pos.c)) return true;
    }
  }
  return false;
}

export function isInCheck(board, color){
  const kingPos = findKing(board, color);
  return isSquareAttacked(board, kingPos, color === "white" ? "black" : "white");
}

/**
 * Esegue una mossa sulla board (la muta) e ritorna il record
 * da inserire nello storico.
 *
 * Gestisce: cattura normale, en passant (rimozione del pedone
 * nemico dalla casella laterale), arrocco (anche la torre),
 * promozione automatica a regina (sostituisce l'istanza).
 */
export function makeMove(board, from, to, chosenMove){
  const movingPiece = board[from.r][from.c];
  const originalType = movingPiece.type;
  const castle = chosenMove?.castle;

  const isEnPassant = chosenMove?.enPassant === true;
  let capturedPiece;
  if (isEnPassant){
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

  // promozione: sostituiamo l'istanza perché ora i pezzi sono classi
  let promotion = null;
  const lastRow = movingPiece.color === "white" ? 0 : 7;
  if (originalType === "pawn" && to.r === lastRow){
    board[to.r][to.c] = createPiece("queen", movingPiece.color);
    promotion = "queen";
  }

  return {
    from,
    to,
    piece: { type: originalType, color: movingPiece.color },
    captured: capturedPiece ? { type: capturedPiece.type, color: capturedPiece.color } : null,
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
export function computeGameOver(board, color){
  if (hasAnyLegalMoves(board, color)) return null;
  return isInCheck(board, color)
    ? { result: "checkmate", winner: opposite(color) }
    : { result: "stalemate" };
}