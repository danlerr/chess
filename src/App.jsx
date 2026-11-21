import Board from './components/Board'
import Clock from './components/Clock'
import TurnIndicator from './components/TurnIndicator'
import GameOverMessage from './components/GameOverMessage'

import { createInitialBoard, opposite } from './core/board'
import { useState, useEffect } from 'react'
import { legalMoves, makeMove, isInCheck, computeGameOver } from './core/moves'

const INITIAL_CLOCKS = { white: 600, black: 600}
const INITIAL_TURN = 'white'

function App(){

  //-STATE
  const[selected, setSelected] = useState(null)
  const[board, setBoard] = useState(() => createInitialBoard())
  const[history, setHistory] = useState([])
  const[turn, setTurn] = useState(INITIAL_TURN)
  const[gameOver, setGameOver] = useState(null)
  const[clocks, setClocks] = useState(INITIAL_CLOCKS)

  //-DERIVED
  const checkedColor = isInCheck(board, turn) ? turn : null

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
      setTurn(nextTurn)
      setSelected(null)
      if (over) setGameOver(over)
      return
    }

    if (piece && piece.color === turn) setSelected(clicked)
    else setSelected(null)
  }

  function startNewGame(){
    setSelected(null)
    setBoard(createInitialBoard())
    setHistory([])
    setTurn(INITIAL_TURN)
    setGameOver(null)
    setClocks(INITIAL_CLOCKS)
  }

  //-RENDER
  return(
    <div>
      <TurnIndicator turn={turn} />
      <div className="clocks">
        <Clock color="black" seconds={clocks.black} active={turn === 'black' && !gameOver} />
        <Clock color="white" seconds={clocks.white} active={turn === 'white' && !gameOver} />
      </div>
      <GameOverMessage gameOver={gameOver} checkedColor={checkedColor} />
      <Board board={board} selected={selected} onCellClick={handleCellClick}/>
      <button onClick={startNewGame}>Nuova partita</button>
    </div>
  )
}

export default App