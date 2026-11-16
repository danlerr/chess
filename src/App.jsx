import { createInitialBoard, opposite } from './core/board'
import Board from './components/Board'
import { useState } from 'react'
import { legalMoves, makeMove, isInCheck, computeGameOver } from './core/moves'

function App(){

  const[selected, setSelected] = useState(null)
  const[board, setBoard] = useState(() => createInitialBoard())
  const[history, setHistory] = useState([])
  const[turn, setTurn] = useState('white')
  const[gameOver, setGameOver] = useState(null)
  
  const checkedColor = isInCheck(board, turn)

  function handleCellClick(r, c){
    if (gameOver) return

    const clicked = { r, c }
    const piece = board[r][c]

    if (!selected){
      if (piece && piece.color === turn) setSelected(clicked)
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
      const nextTurn = opposite(turn)
      const over = computeGameOver(nextBoard, nextTurn)
      setBoard(nextBoard)
      setHistory(h => [...h, record])
      setTurn(opposite(turn))
      setSelected(null)
      if (over) setGameOver(over)
      return
    }

    if (piece && piece.color === turn) setSelected(clicked)
    else setSelected(null)
  }

  return(
    <div>
      <h1>Chess - tocca al {turn === 'white' ? 'bianco' : 'nero'}</h1>
      {checkedColor && !gameOver && (
        <p className="check-banner">Scacco al {checkedColor === 'white' ? 'bianco' : 'nero'}</p>
      )}
      {gameOver && (
        <p className="gameover-banner">
          {gameOver.result === 'checkmate' ? `Matto! Vince il ${gameOver.winner === 'white' ? 'bianco' : 'nero'}` : 'Stallo (patta)'}
        </p>
      )}
      <Board board={board} selected={selected} onCellClick={handleCellClick}/>
    </div>
  )
}

export default App