import { createInitialBoard } from './core/board'
import Board from './components/Board'
import { useState } from 'react'

function App(){

  const[selected, setSelected] = useState(null)
  const[board, setBoard] = useState(() => createInitialBoard())


  function handleCellClick(r, c){
    if (selected && selected.r === r && selected.c === c){
      setSelected(null)
      return
    }
    setSelected({ r,c })
  }

  return(
    <div>
      <h1>Chess</h1>
      <Board board={board} selected={selected} onCellClick={handleCellClick}/>
    </div>
  )
}

export default App