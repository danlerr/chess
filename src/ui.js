import { SIZE } from "./main";

const SYMBOL = {
  white: { king:"♔", queen:"♕", rook:"♖", bishop:"♗", knight:"♘", pawn:"♙" },
  black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" },
}

export function renderBoard(board, container){
    container.innerHTML = "";
    for (let r = 0; r < SIZE; r++){
        for (let c = 0; c < SIZE; c++){
            const el = document.createElement("div");
            el.classList.add("cell", (r + c) % 2 === 0 ? "light" : "dark");
            const piece = board[r][c];
            if (piece) { el.textContent = SYMBOL[piece.color][piece.type];}
            container.appendChild(el);
        }

    }
}