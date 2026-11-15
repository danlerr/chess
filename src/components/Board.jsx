import Square from './Square'

function Board({ board }){
    return (
        <div className='board'>
            {board.map((row, r) =>
                row.map((piece, c) =>
                    <Square key={`${r}-${c}`} piece={piece} r={r} c={c} />
                )
            )}
        </div>
    )
}

export default Board