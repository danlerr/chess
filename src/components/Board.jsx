import Square from './Square'

function Board({ board, selected, onCellClick }){
    return (
        <div className="board">
            {board.map((row, r) =>
                row.map((piece, c) => {
                    const isSelected = selected && selected.r === r && selected.c === c
                    return (
                        <Square 
                        key={`${r}-${c}`} 
                        piece={piece} 
                        r={r} 
                        c={c}
                        isSelected={isSelected}
                        onClick={() => onCellClick(r, c)} />
                    )
                })
            )}
        </div>
    )
}

export default Board