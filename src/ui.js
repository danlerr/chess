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
            if (piece && piece.type === "king" && state.checkedColor === piece.color) {
                el.classList.add("check");
            }
            container.appendChild(el);
        }
    }
}

export function renderState(state){
    const indicator = document.querySelector("#status");
    if (state.gameOver?.result === "checkmate"){
        indicator.textContent = state.turn === "white" ? "Scacco matto! Vince il Nero" : "Scacco matto! Vince il Bianco";
    } 
    else if (state.gameOver?.result === "stalemate"){
        indicator.textContent = "Patta per stallo";
    } else if (state.gameOver?.result === "timeout"){
        const winner = state.gameOver.winner === "white" ? "Bianco" : "Nero";
        indicator.textContent = `Tempo scaduto! Vince il ${winner}`;
    }
    else{
        indicator.textContent = state.turn === "white" ? "Muove il bianco" : "Muove il nero";
    }
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

function formatTime(seconds){
    const m = Math.floor(seconds/60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function renderClocks(state){
  document.querySelector("#clock-white").textContent = `${formatTime(state.clocks.white)}`;
  document.querySelector("#clock-black").textContent = `${formatTime(state.clocks.black)}`;

  // highlight dell'orologio attivo
  document.querySelector("#clock-white").classList.toggle("active", state.turn === "white" && !state.gameOver);
  document.querySelector("#clock-black").classList.toggle("active", state.turn === "black" && !state.gameOver);
}

function waitForTransition(element, timeout = 500){
    return new Promise((resolve) => {
        let done = false;
        const finish = () => { 
            if (done) return;
            done = true;
            element.removeEventListener("transitionend", finish);
            resolve();
        }
        element.addEventListener("transitionend", finish);
        setTimeout(finish, timeout);
    });
}

export function animateMove(from, to){
    const fromCell = document.querySelector(`[data-row="${from.r}"][data-col="${from.c}"]`);
    const toCell = document.querySelector(`[data-row="${to.r}"][data-col="${to.c}"]`);

    if (!fromCell || !toCell) return Promise.resolve();
    const dx = toCell.offsetLeft - fromCell.offsetLeft;
    const dy = toCell.offsetTop - fromCell.offsetTop;
    fromCell.style.transform = `translate(${dx}px, ${dy}px)`;
    fromCell.style.zIndex = "10";

    return waitForTransition(fromCell);
}