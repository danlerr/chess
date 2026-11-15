
const SYMBOL = {
  king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟",
};

function Square( {piece, r, c, isSelected, onClick} ){

    const color = (r + c) % 2 === 0 ? "light" : "dark"
    const cls = `cell ${color}${isSelected ? " selected" : ""}`
    return(
        <div className= {cls} onClick={onClick}>
            {piece && <span className={`piece ${piece.color}`}>{SYMBOL[piece.type]}</span>}
        </div>
    )
}

export default Square
