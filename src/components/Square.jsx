const LETTER = {
  king: "K", queen: "Q", rook: "R", bishop: "B", knight: "N", pawn: "P",
};

function Square({ piece, r, c, isSelected, onClick }) {
  const color = (r + c) % 2 === 0 ? "light" : "dark";
  const cls = `cell ${color}${isSelected ? " selected" : ""}`;

  return (
    <div className={cls} onClick={onClick}>
      {piece && (
        <img
          className="piece"
          src={`/pieces/${piece.color[0]}${LETTER[piece.type]}.svg`}
          alt={`${piece.type} ${piece.color}`}
          draggable={false}
        />
      )}
    </div>
  );
}

export default Square;