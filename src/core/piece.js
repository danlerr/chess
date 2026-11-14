/**
 * Gerarchia dei pezzi degli scacchi
 * 
 * @module core/pieces
 */

import { SIZE } from "./board";
import { isSquareAttacked } from "./moves";

// -----------------------------------------------------------
// Helper interni
// -----------------------------------------------------------

function inBoard(r, c){
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

function isEmpty(board, r, c){
  return inBoard(r, c) && board[r][c] === null;
}

function isEnemy(board, r, c, myColor){
  return inBoard(r, c) && board[r][c] !== null && board[r][c].color !== myColor;
}

function hasEverMoved(history, pos){
  return history.some(m => m.from.r === pos.r && m.from.c === pos.c);
}

function jumpMoves(board, pos, offsets){
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

// ray casting / sliding
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

// -----------------------------------------------------------
// Costanti di direzione
// -----------------------------------------------------------

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

// -----------------------------------------------------------
// Classe base
// -----------------------------------------------------------

export class Piece {
  constructor(color){
    this.color = color;
  }

  get type(){
    throw new Error("Piece.type deve essere definito dalla sottoclasse");
  }

  pseudoLegalMoves(board, pos, history){
    throw new Error("pseudoLegalMoves deve essere definito dalla sottoclasse");
  }
}

// -----------------------------------------------------------
// Sottoclassi
// -----------------------------------------------------------

export class Pawn extends Piece {
  get type(){ return "pawn"; }

  pseudoLegalMoves(board, pos, history){
    const { r,c } = pos;
    const dir = this.color === "white" ? -1 : +1;
    const startRow = this.color === "white" ? 6 : 1;
    const moves = [];

    if (isEmpty(board, r + dir, c))
      moves.push({ r: r + dir, c });
    if (r === startRow && isEmpty(board, r + dir, c) && isEmpty(board, r + dir*2, c))
      moves.push({ r: r + dir*2, c });
    if (isEnemy(board, r + dir, c - 1, this.color))
      moves.push({ r: r + dir, c: c - 1 });
    if (isEnemy(board, r + dir, c + 1, this.color))
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
}

export class Rook extends Piece {
  get type(){ return "rook"; }

  pseudoLegalMoves(board, pos){
    return ROOK_DIRECTIONS.flatMap(([dr, dc]) =>
      slideInDirection(board, pos, dr, dc)
    );
  }
}

export class Bishop extends Piece {
  get type(){ return "bishop"; }

  pseudoLegalMoves(board, pos){
    return BISHOP_DIRECTIONS.flatMap(([dr, dc]) =>
      slideInDirection(board, pos, dr, dc)
    );
  }
}

export class Queen extends Piece {
  get type(){ return "queen"; }

  pseudoLegalMoves(board, pos){
    return [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS].flatMap(([dr, dc]) =>
      slideInDirection(board, pos, dr, dc)
    );
  }
}

export class Knight extends Piece {
  get type(){ return "knight"; }

  pseudoLegalMoves(board, pos){
    return jumpMoves(board, pos, KNIGHT_OFFSETS);
  }
}

export class King extends Piece {
  get type(){ return "king"; }

  pseudoLegalMoves(board, pos, history){
    const moves = jumpMoves(board, pos, KING_OFFSETS);
    if (!history) return moves;

    const enemy = this.color === "white" ? "black" : "white";

    // arrocco: solo quando il re è sulla casa iniziale e non si è mai mosso
    const startRow = this.color === "white" ? 7 : 0;
    if (pos.r !== startRow || pos.c !== 4) return moves;
    if (hasEverMoved(history, pos)) return moves;
    if (isSquareAttacked(board, pos, enemy)) return moves;

    // ARROCCO CORTO
    const shortRook = board[startRow][7];
    if (shortRook
      && shortRook.type === "rook"
      && shortRook.color === this.color
      && !hasEverMoved(history, { r: startRow, c: 7 })
      && board[startRow][5] === null
      && board[startRow][6] === null
      && !isSquareAttacked(board, { r: startRow, c: 5 }, enemy)
      && !isSquareAttacked(board, { r: startRow, c: 6 }, enemy)){

        moves.push({ r: startRow, c: 6, castle: "short" });

      }

    // ARROCCO LUNGO (queenside)
    const longRook = board[startRow][0];
    if (longRook
      && longRook.type === "rook"
      && longRook.color === this.color
      && !hasEverMoved(history, { r: startRow, c: 0 })
      && board[startRow][1] === null
      && board[startRow][2] === null
      && board[startRow][3] === null
      && !isSquareAttacked(board, { r: startRow, c: 3 }, enemy)
      && !isSquareAttacked(board, { r: startRow, c: 2 }, enemy)
    ){

        moves.push({ r: startRow, c: 2, castle: "long" });

      }

    return moves;
  }
}

// -----------------------------------------------------------
// Factory
// -----------------------------------------------------------

const PIECE_CLASSES = {
  pawn:   Pawn,
  rook:   Rook,
  bishop: Bishop,
  knight: Knight,
  queen:  Queen,
  king:   King,
};

export function createPiece(type, color){
  const Cls = PIECE_CLASSES[type];
  if (!Cls) throw new Error(`Tipo pezzo sconosciuto: ${type}`);
  return new Cls(color);
}