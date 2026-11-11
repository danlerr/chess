import { renderBoard,attachBoardListener } from "./ui";
import { createInitialBoard } from "./core/board";
import "./style.css";


const board = createInitialBoard();
const container = document.querySelector("#board");

const state = {selected: null};

renderBoard(board, container, state);

function render() {
  renderBoard(board, container, state);
}

attachBoardListener(container, (r, c) => {
  const piece = board[r][c];
  if (!state.selected) {
    if (piece) { state.selected = {r, c}; }    // truthy se c'è un pezzo; flasy se non c'è 
  } else {
    const sameCell = state.selected.r === r && state.selected.c === c;
    if (sameCell) { state.selected = null; }   // deseleziona
    else if (piece) { state.selected = {r, c}; }  // seleziona un altro pezzo
    else {           // muovi 
      board[r][c] = board[state.selected.r][state.selected.c];
      board[state.selected.r][state.selected.c] = null;
      state.selected = null;
    }
  }
  render();
});