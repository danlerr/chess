import { SIZE } from "./core/board";

const SYMBOL = {
  white: { king:"♔", queen:"♕", rook:"♖", bishop:"♗", knight:"♘", pawn:"♙" },
  black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" },
}

export function renderBoard(board, container, state){
    container.innerHTML = "";
    for (let r = 0; r < SIZE; r++){
        for (let c = 0; c < SIZE; c++){
            const el = document.createElement("div");
            el.classList.add("cell", (r + c) % 2 === 0 ? "light" : "dark");
            el.dataset.row = r;
            el.dataset.col = c;

            const piece = board[r][c];
            if (piece) { el.textContent = SYMBOL[piece.color][piece.type];}

            if (state.selected?.r === r && state.selected?.c === c) {
                el.classList.add("selected");
            }
            if (state.moves.some(m => m.r === r && m.c === c)) {
                el.classList.add("move");
            }
            container.appendChild(el);
        }
    }
}

export function renderTurn(state){
    document.querySelector("#turn-indicator")
    .textContent = state.turn === "white" ? "Muove il bianco" : "Muove il nero";
}

// event bubbling per le celle della board 
export function attachBoardListener(container, onCellClick){
    container.addEventListener("click", (event) => {
                const cell = event.target;
                if (!cell.classList.contains("cell")) return;

                const r = Number(cell.dataset.row);
                const c = Number(cell.dataset.col);
                // attachBoardListener non sa cosa fare al click della cella 
                // logica di gioco nascosta a ui
                // --> inversion of control 
                onCellClick(r, c);    // <- closure: ricorda la variabile onCellClick
            })
}