
const SYMBOL = {
  king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟",
};

function Square( {piece, r, c} ){

    const color = (r + c) % 2 === 0 ? "light" : "dark"
    return(
        <div className= {`cell ${color}`}>
            {piece && (
                <span className={`piece ${piece.color}`}>
                    {SYMBOL[piece.type]}
                </span>
                )}
        </div>
    )
}

export default Square
