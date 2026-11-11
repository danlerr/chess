import { renderBoard,attachBoardListener } from "./ui";
import { createInitialBoard } from "./core/board";
import "./style.css";


const board = createInitialBoard();
const container = document.querySelector("#board");
renderBoard(board, container);

attachBoardListener(container, (r, c) => {
  console.log("cliccato", r, c);
  const piece = board[r][c];
  if (piece) console.log("c'è", piece);
  else       console.log("vuoto");
});