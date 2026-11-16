import Board from './components/Board'
import Clock from './components/Clock'

import { createInitialBoard, opposite } from './core/board'
import { useState, useEffect } from 'react'
import { legalMoves, makeMove, isInCheck, computeGameOver } from './core/moves'

function App(){

  //-STATE
  const[selected, setSelected] = useState(null)
  const[board, setBoard] = useState(() => createInitialBoard())
  const[history, setHistory] = useState([])
  const[turn, setTurn] = useState('white')
  const[gameOver, setGameOver] = useState(null)
  const[clocks, setClocks] = useState({ white: 600, black: 600 })

  //-DERIVED
  const checkedColor = isInCheck(board, turn)

  //-EFFECTS
  useEffect(() => {
    if (gameOver) return
    const id = setInterval(() => {
      setClocks(prev => {
        const remaining = prev[turn] - 1
        return {...prev, [turn]: Math.max(remaining, 0)}
      })
    }, 1000)
    return () => clearInterval(id)
  }, [turn, gameOver])

  useEffect(() => {
    if (gameOver) return
    if (clocks.white <= 0) setGameOver({ result: 'timeout', winner: 'black'})
    else if (clocks.black <= 0) setGameOver({ result:'timeout', winner: 'white'})
  }, [clocks, gameOver])

  //-HANDLERS
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

  //-RENDER
  return(
    <div>

      <h1>Chess - tocca al {turn === 'white' ? 'bianco' : 'nero'}</h1>

      <div className="clocks">
        <Clock color="black" seconds={clocks.black} active={turn === 'black' && !gameOver} />
        <Clock color="white" seconds={clocks.white} active={turn === 'white' && !gameOver} />
      </div>

      {checkedColor && !gameOver && (
        <p className="check-banner">Scacco al {checkedColor === 'white' ? 'bianco' : 'nero'}</p>
      )}

      {gameOver && (
        <p className="gameover-banner">
          {gameOver.result === 'checkmate' 
          ? `Matto! Vince il ${gameOver.winner === 'white' ? 'bianco' : 'nero'}`
          : gameOver.result === 'timeout' 
          ? `Tempo scaduto! Vince il ${gameOver.winner === 'white' ? 'bianco' : 'nero'}`
          : 'Stallo (patta)'}
        </p>
      )}

      <Board board={board} selected={selected} onCellClick={handleCellClick}/>
    </div>
  )
}

export default App