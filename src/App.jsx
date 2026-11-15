import { createInitialBoard } from './core/board'
import Board from './components/Board'
import { useState } from 'react'


function App(){

  const[board, setBoard] = useState(() => createInitialBoard())

  return(
    <div>
      <h1>Chess</h1>
      <Board board={board} />
    </div>
  )
}

export default App