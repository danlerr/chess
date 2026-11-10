import { renderBoard } from "./ui";
import "./style.css";
// strutturiamo la board e i pezzi 

// la board possiamo vederela come una matrice B 8x8, quindi come un array di array 

// quindi B[0][0] è l'elemento in alto a sinistra quindi a8, B[4][4] è e4. 

// TODO: spostare il core della board in una cartella core e qui orchestrare solamente

export const SIZE = 8;
const TYPE = Object.freeze({      // object.freeze rende l'oggetto immutabile
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

// funzione che crea una board vuota (tutti null)
function createEmptyBoard(){
  return Array.from({length : SIZE}, () => Array(SIZE).fill(null))
}

// funzione che crea un pezzo con un tipo e un colore
function createPiece(type, color){
  return { type, color };
}

// funzione che popola la board vuota 
function createInitialBoard(){
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

const board = createInitialBoard();
const container = document.querySelector("#board");
renderBoard(board, container);

