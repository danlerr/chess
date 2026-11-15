import { createInitialBoard } from './core/board'
import Board from './components/Board'
import { useState } from 'react'
import { legalMoves, makeMove } from './core/moves'

function App(){

  const[selected, setSelected] = useState(null)
  const[board, setBoard] = useState(() => createInitialBoard())
  const[history, setHistory] = useState([])

  function handleCellClick(r, c){
    const clicked = { r, c }

    if (!selected){
      if (board[r][c]) setSelected(clicked)
      return
    }

    if (selected.r === r && selected.c === c){
      setSelected(null)
      return
    }
    
    const moves = legalMoves(board, selected, history)
    const chosen = moves.find(m => m.r === r && m.c === c)

    if (chosen){
      const { board: nextBoard, record} = makeMove(board, selected, clicked, chosen)
      setBoard(nextBoard)
      setHistory(h => [...h, record])
      setSelected(null)
      return
    }

    if (board[r][c]) setSelected(clicked)
    else setSelected(null)
  }

  return(
    <div>
      <h1>Chess</h1>
      <Board board={board} selected={selected} onCellClick={handleCellClick}/>
    </div>
  )
}

export default App