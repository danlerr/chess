/**
 * Core della scacchiera: struttura dati, costanti, inizializzazione.
 * 
 * @module core/board
 */


// la board possiamo vederela come una matrice B 8x8, quindi come un array di array 
// quindi B[0][0] è l'elemento in alto a sinistra quindi a8, B[4][4] è e4. 

/**@readonly */
export const SIZE = 8;
export const TYPE = Object.freeze({      // object.freeze rende l'oggetto immutabile
  KING:    "king",
  QUEEN:   "queen",
  ROOK:    "rook",
  BISHOP:  "bishop",
  KNIGHT:  "knight",
  PAWN:    "pawn",
});
const COLOR = Object.freeze({
  WHITE: "white",
  BLACK: "black",
});


/**
 * Crea una scacchiera vuota 8x8 con tutte le celle vuote (null).
 * @returns {Array<Array<null>>} matrice 8x8
 */
function createEmptyBoard(){
  return Array.from({length : SIZE}, () => Array(SIZE).fill(null))
}

/**
 * Crea un pezzo degli scacchi. 
 * 
 * @param {string} type - unno dei valori di TYPE
 * @param {string} color - "white" o "black"
 * @returns {{type: string, color: string}}
 */
function createPiece(type, color){
  return { type, color };
}

/**
 * Popola la scacchiera con i pezzi
 * 
 * @returns {Array<Array<Piece|null>>}
 */
export function createInitialBoard(){
  const board = createEmptyBoard();

  const order = [TYPE.ROOK, TYPE.KNIGHT, TYPE.BISHOP, TYPE.QUEEN, TYPE.KING, TYPE.BISHOP, TYPE.KNIGHT, TYPE.ROOK];
  for (let c = 0; c < SIZE; c++){
    board[0][c] = createPiece(order[c], COLOR.BLACK);
    board[1][c] = createPiece(TYPE.PAWN, COLOR.BLACK);

    board[7][c] = createPiece(order[c], COLOR.WHITE);
    board[6][c] = createPiece(TYPE.PAWN, COLOR.WHITE);
  }
  return board;
}

export function opposite(color){
  return color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
}