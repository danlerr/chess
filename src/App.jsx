import Board from './components/Board'
import Clock from './components/Clock'
import TurnIndicator from './components/TurnIndicator'
import GameOverMessage from './components/GameOverMessage'
import SavedGamesList from './components/SavedGamesList'

import { createInitialBoard, opposite } from './core/board'
import { useState, useEffect } from 'react'
import { legalMoves, makeMove, isInCheck, computeGameOver } from './core/moves'
import SaveGameForm from './components/SaveGameForm'
import { listGames, createGame, updateGame, deleteGame } from './api/games'

const INITIAL_CLOCKS = { white: 600, black: 600}
const INITIAL_TURN = 'white'

function App(){

  //-STATE
  const [selected, setSelected] = useState(null)
  const [board, setBoard] = useState(() => createInitialBoard())
  const [history, setHistory] = useState([])
  const [turn, setTurn] = useState(INITIAL_TURN)
  const [gameOver, setGameOver] = useState(null)
  const [clocks, setClocks] = useState(INITIAL_CLOCKS)
  const [savedGames, setSavedGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  //-DERIVED
  const checkedColor = isInCheck(board, turn) ? turn : null

  //-EFFECTS

  // -- clocks
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

  //-- load games - read operation (cRud)
  useEffect(() => {
    async function load() {
      try {
        const gs = await listGames()
        setSavedGames(gs)
      } catch(err) {
        console.error(err)
        setError("Server non raggiungibile")
      } finally { setLoading(false) }
    }
    load()
  }, [])


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

  // CrUD handler 
  // create
  async function handleSaveGame(title){
    setError(null)
    const newGame = {
        title, 
        moves: history,
        result: gameOver?.result ?? "ongoing",
        winner: gameOver?.winner ?? null,
        created_at: new Date().toISOString(),
      }
    try {
      const saved = await createGame(newGame)
      setSavedGames( s => [...s, saved])
    } catch(err) {
      console.log(err)
      setError("Salvataggio non riuscito")
    }
  }

  // delete
  async function handleDeleteGame(id){
    setError(null)
    try {
      await deleteGame(id)
      setSavedGames(gs => gs.filter(g => g.id !== id))
    } catch (err) {
      console.log(err)
      setError("Eliminazione non riuscita")
    }
    
  }

  // update
  async function handleRenameGame(id, newTitle){
    setError(null)
    try {
      const updated = await updateGame(id, { title: newTitle })
      console.log("updated:", updated)
      setSavedGames( gs => gs.map(
      g => g.id === id ? updated : g ))
    } catch(err) {
      console.log(err)
      setError("Modifica non riuscita")
    }
  }

  //-RENDER
  return(
    <div className="app">
      <header className="app-header">
        <TurnIndicator turn={turn} />
        <div className="status">
          <GameOverMessage gameOver={gameOver} checkedColor={checkedColor} />
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <h2>Partite salvate</h2>
          {error && <p className="error-msg">{error}</p>}
          {loading ? (
            <p className="muted">Caricamento…</p>
          ) : (
            <>
              <SaveGameForm onSave={handleSaveGame} />
              <SavedGamesList games={savedGames} onDelete={handleDeleteGame} onRename={handleRenameGame} />
            </>
          )}
        </aside>

        <section className="game">
          <Clock color="black" seconds={clocks.black} active={turn === 'black' && !gameOver} />
          <Board board={board} selected={selected} onCellClick={handleCellClick} />
          <Clock color="white" seconds={clocks.white} active={turn === 'white' && !gameOver} />
        </section>
      </main>

      <footer className="app-footer">
        <button className="btn btn-primary" onClick={startNewGame}>Nuova partita</button>
      </footer>
    </div>
  )
}

export default App