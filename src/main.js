import { renderBoard,attachBoardListener, renderState, renderClocks, animateMove } from "./ui";
import { createInitialBoard, opposite } from "./core/board";
import { makeMove, isInCheck, legalMoves, computeGameOver } from "./core/moves.js";
import "./style.css";


const board = createInitialBoard();
const container = document.querySelector("#board");

const state = {
  selected: null,
  moves: [],
  turn: "white",
  gameOver: null,
  history: [],
  clocks: { white: 600, black: 600},
  busy: false,
};

renderBoard(board, container, state);

function render() {
  renderBoard(board, container, state);
  renderState(state);
  renderClocks(state);
}

setInterval(() => {
  if (state.gameOver) return;
  state.clocks[state.turn]--;
  if (state.clocks[state.turn] <= 0){
    state.gameOver = { result: "timeout", winner: opposite(state.turn) };
  }
  render();
}, 1000);

attachBoardListener(container, async (r, c) => {
  if (state.busy || state.gameOver) return;

  const piece = board[r][c];
  const to = { r, c };

  // 1) niente selezionato
  if (!state.selected) {
    if (piece && piece.color === state.turn) {
      state.selected = to;
      state.moves = legalMoves(board, to, state.history);
    }
    render();
    return;
  }

  // 2) qualcosa selezionato
  const from = state.selected;
  const sameCell = from.r === r && from.c === c;
  const chosenMove = state.moves.find(m => m.r === r && m.c === c);

  if (sameCell) {
    state.selected = null;
    state.moves = [];
  } else if (chosenMove) {

    state.busy = true;
    await animateMove(from, to);
    const record = makeMove(board, from, to, chosenMove);

    state.history.push(record);
    state.selected = null;
    state.moves = [];
    state.turn = opposite(state.turn);
    state.checkedColor = isInCheck(board, state.turn) ? state.turn : null;
    state.gameOver = computeGameOver(board, state.turn);

    state.busy = false;

  } else if (piece && piece.color === state.turn) {
    state.selected = to;
    state.moves = legalMoves(board, to, state.history);
  } else {
    state.selected = null;
    state.moves = [];
  }
  render();
});

