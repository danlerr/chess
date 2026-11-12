import { renderBoard,attachBoardListener } from "./ui";
import { createInitialBoard } from "./core/board";
import { legalMoves } from "./core/moves.js";
import "./style.css";


const board = createInitialBoard();
const container = document.querySelector("#board");

const state = {
  selected: null,
  moves: [],
};

renderBoard(board, container, state);

function render() {
  renderBoard(board, container, state);
}

attachBoardListener(container, (r, c) => {
  const piece = board[r][c];

  if (!state.selected) {
    if (piece) {
      state.selected = { r, c };
      state.moves = legalMoves(board, { r, c });
    }
  } else {
    const sameCell = state.selected.r === r && state.selected.c === c;
    const isLegalMove = state.moves.some(m => m.r === r && m.c === c);

    if (sameCell) {           // deseleziona 
      state.selected = null;
      state.moves = [];
    } else if (isLegalMove) {       // mossa legale per quel pezzo
      board[r][c] = board[state.selected.r][state.selected.c];  // "sposta" il pezzo 
      board[state.selected.r][state.selected.c] = null;         // "mangia" il pezzo che si trova in quella cella in cui si "sposta"
      state.selected = null;
      state.moves = [];
    } else if (piece) {     // se nella cella c'è un altro pezzo -> cambio selezione e mosse legali
      state.selected = { r, c };
      state.moves = legalMoves(board, { r, c });
    } else {
      state.selected = null;
      state.moves = [];
    }
  }

  render();
});


